import React, { useState } from 'react';
import { sampleQuestions } from '../data/alumni';
import { MessageSquare, ThumbsUp, PlusCircle, HelpCircle } from 'lucide-react';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState(sampleQuestions);
  const [showAskForm, setShowAskForm] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionTag, setNewQuestionTag] = useState('');

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQuestionTitle.trim()) return;

    const newQ = {
      id: questions.length + 1,
      title: newQuestionTitle,
      author: 'You (Student)',
      date: 'Just now',
      tags: newQuestionTag ? [newQuestionTag] : ['Career'],
      answersCount: 0,
      upvotes: 0,
      topAnswerPreview: 'Awaiting answers from verified alumni in your network.'
    };

    setQuestions([newQ, ...questions]);
    setNewQuestionTitle('');
    setNewQuestionTag('');
    setShowAskForm(false);
  };

  return (
    <div className="container page-wrapper animate-fade-in" style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Career Q&A Board</h1>
          <p>Ask seniors and alumni about interview preparation, resume advice, and company culture.</p>
        </div>
        <button
          onClick={() => setShowAskForm(!showAskForm)}
          className="btn btn-primary"
        >
          <PlusCircle size={18} />
          <span>{showAskForm ? 'Close Form' : 'Ask Question'}</span>
        </button>
      </div>

      {showAskForm && (
        <div className="card" style={{ marginBottom: '2rem', border: '1px solid var(--primary-border)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Post a New Question</h3>
          <form onSubmit={handleAddQuestion}>
            <div className="form-group">
              <label className="form-label">Question Title</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. How is the work-life balance for SDE-1s at Amazon?"
                value={newQuestionTitle}
                onChange={(e) => setNewQuestionTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Topic / Tag</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Amazon, Work Culture, SDE"
                value={newQuestionTag}
                onChange={(e) => setNewQuestionTag(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Post Question
            </button>
          </form>
        </div>
      )}

      <div className="questions-list">
        {questions.map((q) => (
          <div key={q.id} className="question-card">
            <div className="question-card-header">
              <h3 className="question-title">{q.title}</h3>
            </div>

            <div className="question-meta">
              Asked by <strong>{q.author}</strong> • {q.date}
            </div>

            <div className="skills-badge-list" style={{ marginBottom: '0.75rem' }}>
              {q.tags.map((tag, idx) => (
                <span key={idx} className="badge">
                  #{tag}
                </span>
              ))}
            </div>

            {q.topAnswerPreview && (
              <div className="question-answer-box">
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.25rem' }}>
                  TOP ALUMNI INSIGHT
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  {q.topAnswerPreview}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ThumbsUp size={14} /> {q.upvotes} Upvotes
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MessageSquare size={14} /> {q.answersCount} Answers
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
