import assert from 'node:assert/strict';
import test from 'node:test';
import { buildActivityFeed } from '../src/utils/activityFeed.js';

test('activity feed combines questions, answers, and comments newest first', () => {
  const feed = buildActivityFeed([
    {
      id: 'q1',
      title: 'How to prepare?',
      body: 'Question body',
      tags: ['DSA'],
      author: { name: 'Student', role: 'STUDENT' },
      createdAt: '2026-10-01T10:00:00Z',
      answers: [{
        id: 'a1',
        body: 'Answer body',
        author: { name: 'Alumni', role: 'ALUMNI' },
        createdAt: '2026-10-01T11:00:00Z',
      }],
      comments: [{
        id: 'c1',
        body: 'Comment body',
        author: { name: 'Other student', role: 'STUDENT' },
        createdAt: '2026-10-01T12:00:00Z',
      }],
    },
  ]);

  assert.deepEqual(feed.map((activity) => activity.type), ['comment', 'answer', 'question']);
  assert.ok(feed.every((activity) => activity.questionId === 'q1'));
  assert.equal(feed[0].body, 'Comment body');
});
