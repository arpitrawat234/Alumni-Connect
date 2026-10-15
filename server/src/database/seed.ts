import { PrismaClient, UserRole, VerificationStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const prisma = new PrismaClient();

const seedAlumniData = [
  {
    name: 'Aman Sharma',
    email: 'aman.sharma@microsoft.com',
    role: UserRole.ALUMNI,
    verificationStatus: VerificationStatus.VERIFIED,
    profile: {
      college: 'Maharaja Agrasen Institute of Technology (MAIT)',
      graduationYear: 2022,
      currentCompany: 'Microsoft',
      currentRole: 'Software Engineer',
      industry: 'Technology',
      location: 'Bengaluru, India',
      skills: ['React', 'Node.js', 'MongoDB', 'Azure', 'TypeScript', 'DSA'],
      bio: 'Full-stack software engineer building scalable cloud collaboration tools in Microsoft Teams. Passionate about mentoring junior developers.',
      experience: '3+ years at Microsoft. Converted internship to SDE II in 2024.',
      helpTopics: [
        'Placement Preparation',
        'DSA',
        'Technical Interviews',
        'Resume Review',
        'Mock Interviews',
      ],
      servicesOffered: ['1-on-1 Sessions', 'Q&A', 'Resume Reviews'],
    },
  },
  {
    name: 'Priya Verma',
    email: 'priya.verma@amazon.com',
    role: UserRole.ALUMNI,
    verificationStatus: VerificationStatus.VERIFIED,
    profile: {
      college: 'Delhi Technological University (DTU)',
      graduationYear: 2021,
      currentCompany: 'Amazon',
      currentRole: 'Backend Engineer',
      industry: 'Technology',
      location: 'Hyderabad, India',
      skills: ['Java', 'Spring Boot', 'AWS', 'DynamoDB', 'Distributed Systems', 'Kafka'],
      bio: 'Backend specialist architecting high-throughput inventory management microservices handling millions of daily transactions at AWS.',
      experience: '4 years experience in distributed backend architectures.',
      helpTopics: ['Technical Interviews', 'System Design Basics', 'Resume Review', 'Placement Preparation'],
      servicesOffered: ['1-on-1 Sessions', 'Q&A', 'Group Sessions'],
    },
  },
  {
    name: 'Rohan Kulkarni',
    email: 'rohan.k@google.com',
    role: UserRole.ALUMNI,
    verificationStatus: VerificationStatus.VERIFIED,
    profile: {
      college: 'BITS Pilani',
      graduationYear: 2020,
      currentCompany: 'Google',
      currentRole: 'Frontend Developer',
      industry: 'Technology',
      location: 'Bengaluru, India',
      skills: ['React', 'Next.js', 'Web Performance', 'TypeScript', 'GraphQL'],
      bio: 'UI architect obsessing over sub-millisecond web rendering, interactive graphics, accessibility, and modern React ecosystems.',
      experience: '5 years crafting high-performance user interfaces at scale.',
      helpTopics: ['Frontend Engineering', 'Mock Interviews', 'Resume Review', 'Career Guidance'],
      servicesOffered: ['1-on-1 Sessions', 'Resume Reviews'],
    },
  },
  {
    name: 'Sneha Patel',
    email: 'sneha.patel@goldmansachs.com',
    role: UserRole.ALUMNI,
    verificationStatus: VerificationStatus.VERIFIED,
    profile: {
      college: 'IIT Roorkee',
      graduationYear: 2022,
      currentCompany: 'Goldman Sachs',
      currentRole: 'Data Scientist',
      industry: 'Finance',
      location: 'Bengaluru, India',
      skills: ['Python', 'Machine Learning', 'PyTorch', 'SQL', 'Quantitative Modeling'],
      bio: 'Building quantitative trading models, algorithmic risk mitigation systems, and automated financial forecasting pipelines.',
      experience: '3 years in Quantitative Analytics and Financial Machine Learning.',
      helpTopics: ['Higher Studies', 'Technical Interviews', 'Career Guidance', 'Resume Review'],
      servicesOffered: ['1-on-1 Sessions', 'Q&A'],
    },
  },
  {
    name: 'Vikram Malhotra',
    email: 'vikram.m@atlassian.com',
    role: UserRole.ALUMNI,
    verificationStatus: VerificationStatus.VERIFIED,
    profile: {
      college: 'Netaji Subhas University of Technology (NSUT)',
      graduationYear: 2023,
      currentCompany: 'Atlassian',
      currentRole: 'Software Engineer',
      industry: 'Technology',
      location: 'Bengaluru, India',
      skills: ['React', 'GraphQL', 'Java', 'Docker', 'Kubernetes', 'Microservices'],
      bio: 'Contributing to Jira Cloud Core team. Enthusiastic about CI/CD, developer tooling, and modern distributed systems.',
      experience: '2 years working on Jira real-time collaborative editors.',
      helpTopics: ['Placement Preparation', 'DSA', 'HR Interviews', 'Mock Interviews'],
      servicesOffered: ['1-on-1 Sessions', 'Resume Reviews', 'Q&A'],
    },
  },
  {
    name: 'Ananya Iyer',
    email: 'ananya.iyer@mckinsey.com',
    role: UserRole.ALUMNI,
    verificationStatus: VerificationStatus.VERIFIED,
    profile: {
      college: 'IIM Ahmedabad / NIT Trichy',
      graduationYear: 2019,
      currentCompany: 'McKinsey',
      currentRole: 'Product Manager',
      industry: 'Consulting',
      location: 'Mumbai, India',
      skills: ['Product Strategy', 'User Research', 'Agile', 'Roadmapping', 'Data Analytics'],
      bio: 'Helping Fortune 500 enterprises navigate digital transformation and user-centric product growth loops.',
      experience: '6 years in Technology Strategy and Digital Product Leadership.',
      helpTopics: ['Career Guidance', 'HR Interviews', 'Higher Studies', 'Resume Review'],
      servicesOffered: ['1-on-1 Sessions', 'Group Sessions', 'Q&A'],
    },
  },
  {
    name: 'Devansh Nair',
    email: 'devansh.n@uber.com',
    role: UserRole.ALUMNI,
    verificationStatus: VerificationStatus.VERIFIED,
    profile: {
      college: 'IIIT Hyderabad',
      graduationYear: 2021,
      currentCompany: 'Uber',
      currentRole: 'Backend Engineer',
      industry: 'Technology',
      location: 'Hyderabad, India',
      skills: ['Go', 'Kafka', 'Redis', 'gRPC', 'Kubernetes', 'Distributed Systems'],
      bio: 'Engineering high-frequency geospatial dispatch matching engines and surge pricing algorithms handling peak city traffic.',
      experience: '4 years building high concurrency Golang backend microservices.',
      helpTopics: ['DSA', 'Technical Interviews', 'Placement Preparation', 'Mock Interviews'],
      servicesOffered: ['1-on-1 Sessions', 'Resume Reviews'],
    },
  },
  {
    name: 'Tanvi Deshmukh',
    email: 'tanvi.d@google.com',
    role: UserRole.ALUMNI,
    verificationStatus: VerificationStatus.VERIFIED,
    profile: {
      college: 'IIT Delhi',
      graduationYear: 2022,
      currentCompany: 'Google',
      currentRole: 'Software Engineer',
      industry: 'Technology',
      location: 'Bengaluru, India',
      skills: ['C++', 'Python', 'LLMs', 'Information Retrieval', 'DSA'],
      bio: 'Working on Google Search ranking and natural language semantic retrieval pipelines. AI researcher and competitive programmer.',
      experience: '3 years in Google Core Search ranking algorithms.',
      helpTopics: ['DSA', 'Competitive Programming', 'Technical Interviews', 'Mock Interviews'],
      servicesOffered: ['1-on-1 Sessions', 'Q&A'],
    },
  },
];

async function seed() {
  console.log('🌱 Starting AlumniConnect Database Seeder...');

  for (const entry of seedAlumniData) {
    const existingUser = await prisma.user.findUnique({ where: { email: entry.email } });
    if (existingUser) {
      continue;
    }

    const user = await prisma.user.create({
      data: {
        name: entry.name,
        email: entry.email,
        passwordHash: await bcrypt.hash('Password123!', 10),
        role: entry.role,
        verificationStatus: entry.verificationStatus,
      },
    });

    await prisma.alumniProfile.create({
      data: {
        userId: user.id,
        college: entry.profile.college,
        graduationYear: entry.profile.graduationYear,
        currentCompany: entry.profile.currentCompany,
        currentRole: entry.profile.currentRole,
        industry: entry.profile.industry,
        location: entry.profile.location,
        skills: entry.profile.skills,
        bio: entry.profile.bio,
        experience: entry.profile.experience,
        helpTopics: entry.profile.helpTopics,
        servicesOffered: entry.profile.servicesOffered,
      },
    });
  }

  const studentUser = await prisma.user.upsert({
    where: { email: 'student@alumniconnect.com' },
    update: {},
    create: {
      name: 'Arpit Rawat',
      email: 'student@alumniconnect.com',
      passwordHash: await bcrypt.hash('Password123!', 10),
      role: UserRole.STUDENT,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  await prisma.studentProfile.upsert({
    where: { userId: studentUser.id },
    update: {
      college: 'Maharaja Agrasen Institute of Technology (MAIT)',
      branch: 'Computer Science',
      graduationYear: 2026,
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      careerInterests: ['Full Stack Development', 'Product Engineering'],
      bio: 'Final-year student building career-ready software and learning from alumni mentors.',
    },
    create: {
      userId: studentUser.id,
      college: 'Maharaja Agrasen Institute of Technology (MAIT)',
      branch: 'Computer Science',
      graduationYear: 2026,
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      careerInterests: ['Full Stack Development', 'Product Engineering'],
      bio: 'Final-year student building career-ready software and learning from alumni mentors.',
    },
  });

  const aman = await prisma.user.findUnique({
    where: { email: 'aman.sharma@microsoft.com' },
  });

  const demoQuestion = aman
    ? await prisma.question.findFirst({
        where: {
          title: 'How should I structure my preparation for software placement interviews?',
          authorId: studentUser.id,
        },
        select: { id: true },
      })
    : null;

  if (aman && !demoQuestion) {
    await prisma.question.create({
      data: {
        title: 'How should I structure my preparation for software placement interviews?',
        body: 'I am balancing coursework and projects. What is a practical weekly plan for DSA, project preparation, and mock interviews?',
        tags: ['Placements', 'DSA', 'Interview preparation'],
        author: { connect: { id: studentUser.id } },
        targetAlumni: { connect: { id: aman.id } },
        mentions: {
          create: [{ user: { connect: { id: aman.id } } }],
        },
        answers: {
          create: [{
            body: 'Set a steady schedule: practice a few focused DSA problems each week, revise patterns, and reserve time to explain one project clearly. Add mock interviews once your fundamentals feel consistent.',
            author: { connect: { id: aman.id } },
          }],
        },
        comments: {
          create: [{
            body: 'A weekly review of mistakes helped me adjust the plan without overloading my semester.',
            author: { connect: { id: studentUser.id } },
          }],
        },
      },
    });
  }

  console.log('✅ AlumniConnect seeded successfully');
}

seed()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
