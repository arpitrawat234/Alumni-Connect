import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MessageSquare, PlusCircle, Send } from 'lucide-react';
import { AuthContext } from '../AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function parseTags(value) {
  return [...new Set(value.split(',').map((tag) => tag.trim().replace(/^#+/, '')).filter(Boolean))];
}

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function QuestionsPage() {
  const { token, user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [people, setPeople] = useState([]);
  const [showAskForm, setShowAskForm] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [mentionedUserIds, setMentionedUserIds] = useState([]);
  const [peopleSearch, setPeopleSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [unansweredOnly, setUnansweredOnly] = useState(false);
  const [answerDrafts, setAnswerDrafts] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadBoard = useCallback(async () => {
    const [questionsResponse, peopleResponse] = await Promise.all([
      fetch(`${API_BASE}/questions`),
      token
        ? fetch(`${API_BASE}/people`, { headers: { Authorization: `Bearer ${token}` } })
        : Promise.resolve(null),
    ]);
    const [questionData, peopleData] = await Promise.all([
      questionsResponse.json(),
      peopleResponse ? peopleResponse.json() : Promise.resolve([]),
    ]);
    if (!questionsResponse.ok) {
      throw new Error(questionData.message || 'Could not load the Q&A board.');
    }
    if (peopleResponse && !peopleResponse.ok) {
      throw new Error(peopleData.message || 'Could not load people to tag.');
    }

    setQuestions(questionData);
    setPeople(peopleData);
  }, [token]);

  useEffect(() => {
    loadBoard()
      .catch((loadError) => setError(loadError.message))
      .finally(() => setLoading(false));
  }, [loadBoard]);

  useEffect(() => {
    const mentionedId = searchParams.get('mention');
    if (mentionedId) {
      setMentionedUserIds([mentionedId]);
      setShowAskForm(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && window.location.hash) {
      document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [loading, questions]);

  const filteredQuestions = useMemo(() => {
    const normalizedTag = tagFilter.trim().replace(/^#+/, '').toLocaleLowerCase();
    return questions.filter((question) => {
      const hasTag = !normalizedTag
        || question.tags.some((tag) => tag.toLocaleLowerCase() === normalizedTag);
      return hasTag && (!unansweredOnly || question.answers.length === 0);
    });
  }, [questions, tagFilter, unansweredOnly]);
  const filteredPeople = useMemo(() => {
    const term = peopleSearch.toLocaleLowerCase().trim();
    return people.filter((person) =>
      `${person.name} ${person.role} ${person.company || ''} ${person.currentRole || ''}`
        .toLocaleLowerCase()
        .includes(term),
    );
  }, [people, peopleSearch]);

  const submitQuestion = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          body,
          tags: parseTags(tagsText),
          mentionedUserIds,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        const message = Array.isArray(data.message) ? data.message.join(', ') : data.message;
        throw new Error(message || 'Could not post the question.');
      }

      setQuestions((current) => [data, ...current]);
      setTitle('');
      setBody('');
      setTagsText('');
      setMentionedUserIds([]);
      setPeopleSearch('');
      setShowAskForm(false);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const submitReply = async (event, questionId, replyType) => {
    event.preventDefault();
    const drafts = replyType === 'answer' ? answerDrafts : commentDrafts;
    const reply = (drafts[questionId] || '').trim();
    if (!reply) return;

    setError('');
    try {
      const endpoint = replyType === 'answer' ? 'answers' : 'comments';
      const response = await fetch(`${API_BASE}/questions/${questionId}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body: reply }),
      });
      const data = await response.json();
      if (!response.ok) {
        const message = Array.isArray(data.message) ? data.message.join(', ') : data.message;
        throw new Error(message || `Could not post your ${replyType}.`);
      }

      const key = replyType === 'answer' ? 'answers' : 'comments';
      setQuestions((current) => current.map((question) => (
        question.id === questionId
          ? { ...question, [key]: [...question[key], data] }
          : question
      )));
      const setDrafts = replyType === 'answer' ? setAnswerDrafts : setCommentDrafts;
      setDrafts((current) => ({ ...current, [questionId]: '' }));
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  return (
    <div className="container page-wrapper animate-fade-in" style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Career Q&amp;A Board</h1>
          <p>Questions, mentions, answers, and comments are shared with the community.</p>
        </div>
        {user ? (
          <button onClick={() => setShowAskForm((current) => !current)} className="btn btn-primary">
            <PlusCircle size={18} />
            <span>{showAskForm ? 'Close Form' : 'Ask Question'}</span>
          </button>
        ) : <Link to="/login" className="btn btn-primary">Sign in to join the discussion</Link>}
      </div>

      {error && <div className="card" role="alert" style={{ marginBottom: '1rem' }}>{error}</div>}

      {showAskForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Post a question</h3>
          <form onSubmit={submitQuestion}>
            <div className="form-group">
              <label className="form-label" htmlFor="question-title">Title</label>
              <input id="question-title" required minLength={5} maxLength={180} className="form-input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What would you like to know?" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="question-body">Details</label>
              <textarea id="question-body" required minLength={10} rows={4} className="form-input" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Add context so the community can give a useful answer." />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="question-tags">Topic tags</label>
              <input id="question-tags" required className="form-input" value={tagsText} onChange={(event) => setTagsText(event.target.value)} placeholder="Separate topics with commas, e.g. DSA, interviews, React" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="question-mentions-search">Tag students or alumni (optional)</label>
              <input
                id="question-mentions-search"
                className="form-input"
                value={peopleSearch}
                onChange={(event) => setPeopleSearch(event.target.value)}
                placeholder="Search people by name or role"
              />
              <div className="question-mention-list">
                {filteredPeople.slice(0, 20).map((person) => (
                  <label className="question-mention-option" key={person.id}>
                    <input
                      type="checkbox"
                      checked={mentionedUserIds.includes(person.id)}
                      onChange={(event) => setMentionedUserIds((current) => (
                        event.target.checked
                          ? [...current, person.id]
                          : current.filter((id) => id !== person.id)
                      ))}
                    />
                    <span>{person.name} — {person.role}{person.company ? ` · ${person.company}` : ''}</span>
                  </label>
                ))}
                {filteredPeople.length === 0 && <small>No matching people found.</small>}
              </div>
              <small>Mentions identify the people you want to reach, but the discussion stays open to everyone.</small>
            </div>
            <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
              {submitting ? 'Posting...' : 'Post question'}
            </button>
          </form>
        </div>
      )}

      <div className="filter-bar-card" style={{ marginBottom: '1.5rem' }}>
        <div className="form-group" style={{ marginBottom: '0.75rem' }}>
          <label className="form-label" htmlFor="qna-tag-filter">Filter by topic tag</label>
          <input id="qna-tag-filter" className="form-input" value={tagFilter} onChange={(event) => setTagFilter(event.target.value)} placeholder="e.g. DSA" />
        </div>
        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input type="checkbox" checked={unansweredOnly} onChange={(event) => setUnansweredOnly(event.target.checked)} />
          Show unanswered only
        </label>
      </div>

      {loading ? (
        <div>Loading questions...</div>
      ) : filteredQuestions.length === 0 ? (
        <div className="card">No matching questions. Ask the first one or change the filters.</div>
      ) : (
        <div className="questions-list">
          {filteredQuestions.map((question) => (
            <article id={`question-${question.id}`} key={question.id} className="question-card" style={{ scrollMarginTop: '6rem' }}>
              <h3 className="question-title">{question.title}</h3>
              <div className="question-meta">
                Asked by <strong>{question.author.name}</strong> ({question.author.role}) · {formatDate(question.createdAt)}
              </div>
              <p style={{ whiteSpace: 'pre-wrap' }}>{question.body}</p>

              {(question.mentions?.length > 0 || question.targetAlumni) && (
                <div className="question-meta">
                  Mentioned:{' '}
                  {(question.mentions || []).map((mention) => `${mention.user.name} (${mention.user.role})`).join(', ')
                    || question.targetAlumni?.name}
                </div>
              )}
              <div className="skills-badge-list" style={{ marginBottom: '1rem' }}>
                {question.tags.map((tag) => <span key={tag} className="badge">#{tag}</span>)}
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MessageSquare size={16} /> Answers ({question.answers.length}) · Discussion ({question.comments.length})
                </h4>
                {question.answers.map((answer) => (
                  <div key={answer.id} className="question-answer-box" style={{ marginTop: '0.75rem' }}>
                    <div style={{ fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                      <strong>{answer.author.name}</strong> ({answer.author.role}) · {formatDate(answer.createdAt)}
                    </div>
                    <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{answer.body}</p>
                  </div>
                ))}
                {question.comments.map((comment) => (
                  <div key={comment.id} className="card" style={{ marginTop: '0.6rem', padding: '0.75rem 1rem' }}>
                    <div className="question-meta"><strong>{comment.author.name}</strong> ({comment.author.role}) · {formatDate(comment.createdAt)}</div>
                    <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{comment.body}</p>
                  </div>
                ))}

                {user ? (
                  <>
                <form onSubmit={(event) => submitReply(event, question.id, 'answer')} style={{ marginTop: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor={`answer-${question.id}`}>Your answer</label>
                    <textarea id={`answer-${question.id}`} rows={2} minLength={2} className="form-input" value={answerDrafts[question.id] || ''} onChange={(event) => setAnswerDrafts((current) => ({ ...current, [question.id]: event.target.value }))} placeholder={`Reply as ${user?.name || 'you'}...`} required />
                  </div>
                  <button type="submit" className="btn btn-secondary btn-sm"><Send size={14} /> Answer</button>
                </form>
                <form onSubmit={(event) => submitReply(event, question.id, 'comment')} style={{ marginTop: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor={`comment-${question.id}`}>Add to the discussion</label>
                    <textarea id={`comment-${question.id}`} rows={2} minLength={2} maxLength={5000} className="form-input" value={commentDrafts[question.id] || ''} onChange={(event) => setCommentDrafts((current) => ({ ...current, [question.id]: event.target.value }))} placeholder="Share a follow-up or clarification..." required />
                  </div>
                  <button type="submit" className="btn btn-outline btn-sm">Comment</button>
                </form>
                  </>
                ) : (
                  <p style={{ marginTop: '1rem' }}><Link to="/login">Sign in</Link> to answer or comment.</p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
