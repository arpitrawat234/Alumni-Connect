const assert = require('node:assert/strict');
const test = require('node:test');
const { AuthService } = require('../dist/auth/auth.service');
const { ProfilesService } = require('../dist/profiles/profiles.service');
const { QuestionsService } = require('../dist/questions/questions.service');
const { UserRole, VerificationStatus } = require('../dist/users/user.schema');

test('signup creates a role-specific profile for students and alumni', async (t) => {
  for (const role of [UserRole.STUDENT, UserRole.ALUMNI]) {
    await t.test(role, async () => {
      const profileCalls = [];
      const user = {
        id: `user-${role}`,
        name: 'Example User',
        email: 'example@example.com',
        role,
        verificationStatus: role === UserRole.ALUMNI
          ? VerificationStatus.PENDING
          : VerificationStatus.VERIFIED,
      };
      const service = new AuthService(
        {
          findByEmail: async () => null,
          create: async () => user,
        },
        {
          updateProfile: async (...args) => {
            profileCalls.push(args);
            return { profile: { userId: user.id }, completionPercentage: 0 };
          },
        },
        { sign: () => 'test-token' },
      );

      const result = await service.register({
        name: user.name,
        email: user.email,
        password: 'password123',
        role,
      });

      assert.equal(result.user.role, role);
      assert.equal(profileCalls.length, 1);
      assert.equal(profileCalls[0][1], role);
      assert.equal(profileCalls[0][0], user.id);
    });
  }
});

test('profile edits persist identity and only fields for the selected role', async () => {
  const calls = {};
  const prisma = {
    user: {
      findUnique: async () => null,
      update: async (args) => {
        calls.userUpdate = args;
        return { id: 'student-1', name: args.data.name, email: args.data.email, role: UserRole.STUDENT };
      },
    },
    studentProfile: {
      upsert: async (args) => {
        calls.profileUpsert = args;
        return {
          userId: 'student-1',
          college: args.update.college,
          branch: args.update.branch,
          graduationYear: args.update.graduationYear,
          skills: args.update.skills,
          careerInterests: args.update.careerInterests,
          bio: args.update.bio,
        };
      },
    },
    $transaction: async (operations) => Promise.all(operations),
  };
  const result = await new ProfilesService(prisma).updateProfile('student-1', UserRole.STUDENT, {
    name: ' Updated Name ',
    email: ' NEW@example.com ',
    college: 'Example University',
    branch: 'Computer Science',
    graduationYear: 2027,
    skills: ['React'],
    careerInterests: ['Frontend'],
    currentCompany: 'must-not-be-written',
  });

  assert.deepEqual(calls.userUpdate.data, { name: 'Updated Name', email: 'new@example.com' });
  assert.equal(calls.profileUpsert.update.college, 'Example University');
  assert.equal(calls.profileUpsert.update.currentCompany, undefined);
  assert.equal(result.user.name, 'Updated Name');
});

test('recommendations rank verified alumni by shared normalized tags', async () => {
  const service = new ProfilesService({
    user: { findUnique: async () => ({ role: UserRole.STUDENT }) },
    studentProfile: {
      findUnique: async () => ({
        skills: [' React ', 'TypeScript'],
        careerInterests: ['Frontend'],
      }),
    },
    alumniProfile: {
      findMany: async () => [
        {
          id: 'alumni-profile',
          user: { id: 'alumni-user', name: 'A Verified Alum' },
          skills: ['react'],
          helpTopics: ['Frontend', 'Mentorship'],
        },
        {
          id: 'no-match',
          user: { id: 'other-user', name: 'No Match' },
          skills: ['Finance'],
          helpTopics: [],
        },
      ],
    },
  });

  const results = await service.getRecommendations('student-1');
  assert.equal(results.length, 1);
  assert.deepEqual(results[0].matchingTags, ['react', 'frontend']);
  assert.equal(results[0].matchScore, 67);
});

test('alumni directory only returns verified profiles without exposing email', async () => {
  let query;
  const service = new ProfilesService({
    alumniProfile: {
      findMany: async (args) => {
        query = args;
        return [{
          id: 'profile-1',
          user: { id: 'user-1', name: 'Alumni One', email: 'private@example.com', role: 'ALUMNI', verificationStatus: 'VERIFIED' },
          currentCompany: 'Example Inc',
          currentRole: 'Engineer',
          industry: 'Technology',
          skills: ['TypeScript'],
          helpTopics: [],
        }];
      },
    },
  });

  const results = await service.findAlumni({});
  assert.equal(query.where.user.is.verificationStatus, 'VERIFIED');
  assert.equal(results[0].userId.name, 'Alumni One');
  assert.equal(results[0].userId.email, undefined);
});

test('questions normalize topic tags, persist mentions, answers, and comments', async () => {
  const calls = {};
  const prisma = {
    user: {
      findMany: async ({ where }) => where.id.in.map((id) => ({ id })),
    },
    question: {
      create: async (args) => {
        calls.question = args;
        return { id: 'question-1', ...args.data, answers: [], comments: [] };
      },
      findUnique: async () => ({ id: 'question-1' }),
    },
    answer: {
      create: async (args) => {
        calls.answer = args;
        return { id: 'answer-1', ...args.data };
      },
    },
    questionComment: {
      create: async (args) => {
        calls.comment = args;
        return { id: 'comment-1', ...args.data };
      },
    },
  };
  const service = new QuestionsService(prisma);
  const question = await service.create('author-1', {
    title: '  Career question  ',
    body: '  Some useful context for the community. ',
    tags: [' #React ', 'react', 'Frontend'],
    mentionedUserIds: ['student-2', 'alumni-2'],
  });
  assert.deepEqual(question.tags, ['React', 'Frontend']);
  assert.deepEqual(calls.question.data.mentions.create, [
    { user: { connect: { id: 'student-2' } } },
    { user: { connect: { id: 'alumni-2' } } },
  ]);

  await service.addAnswer('question-1', 'alumni-2', { body: ' Helpful answer ' });
  await service.addComment('question-1', 'student-2', ' Follow-up comment ');
  assert.equal(calls.answer.data.body, 'Helpful answer');
  assert.equal(calls.comment.data.body, 'Follow-up comment');
});

test('question feed filters tags case-insensitively and asks database for unanswered items', async () => {
  let query;
  const service = new QuestionsService({
    question: {
      findMany: async (args) => {
        query = args;
        return [
          { id: 'one', tags: ['React'], answers: [] },
          { id: 'two', tags: ['DSA'], answers: [] },
        ];
      },
    },
  });
  const questions = await service.findAll('#react', true);
  assert.deepEqual(questions.map((question) => question.id), ['one']);
  assert.deepEqual(query.where.answers, { none: {} });
});
