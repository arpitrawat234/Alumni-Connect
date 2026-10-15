export function buildActivityFeed(questions) {
  return questions
    .flatMap((question) => [
      {
        id: `question-${question.id}`,
        type: 'question',
        actor: question.author,
        createdAt: question.createdAt,
        questionId: question.id,
        questionTitle: question.title,
        body: question.body,
        tags: question.tags,
      },
      ...question.answers.map((answer) => ({
        id: `answer-${answer.id}`,
        type: 'answer',
        actor: answer.author,
        createdAt: answer.createdAt,
        questionId: question.id,
        questionTitle: question.title,
        body: answer.body,
        tags: question.tags,
      })),
      ...(question.comments || []).map((comment) => ({
        id: `comment-${comment.id}`,
        type: 'comment',
        actor: comment.author,
        createdAt: comment.createdAt,
        questionId: question.id,
        questionTitle: question.title,
        body: comment.body,
        tags: question.tags,
      })),
    ])
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
}
