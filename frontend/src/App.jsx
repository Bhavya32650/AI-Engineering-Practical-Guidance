import { useEffect, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import './App.css';
const API_BASE = 'https://ai-engineering-practical-guidance.onrender.com';

const initialHistoryEntries = [
  {
    id: 1,
    title: 'Order tracking',
    question: 'Where is my order?',
    answer: 'Your shipment has left the warehouse and is currently in transit. It is expected to arrive within the next 2 days.',
    time: '2 min ago',
  },
  {
    id: 2,
    title: 'Refund issue',
    question: 'I need help with a refund.',
    answer: 'I have started a refund review for your latest payment. Please share the order ID and email used at checkout so I can confirm the status.',
    time: '45 min ago',
  },
  {
    id: 3,
    title: 'Account support',
    question: 'I need help with my account.',
    answer: 'Your account is active and there are no lockouts detected. I can help you update your profile, password, or billing details next.',
    time: '1 day ago',
  },
  {
    id: 4,
    title: 'Payment failed',
    question: 'My payment was deducted twice.',
    answer: 'This looks like a duplicate charge issue. I can help you prepare a refund request and check whether the payment was processed twice on the same order.',
    time: '2 days ago',
  },
];

const suggestedPrompts = [
  'Where is my order?',
  'I have a payment issue.',
  'My payment was deducted twice.',
  'I need help with my account.',
  'Can you check my refund status?',
  'Why is my invoice pending?',
];

const defaultSettings = {
  tone: 'Professional and concise',
  autoRouting: 'Enabled',
  indexing: 'Semantic search on',
  privacyMode: 'Masked',
};

const defaultProfile = {
  name: 'Jane Smith',
  email: 'jane@supportflow.ai',
  role: 'Support Team Lead',
  team: 'Customer Success',
};

function LandingPage({ onStart }) {
  return (
    <div className="landing-shell">
      <header className="landing-header">
        <div className="brand-row">
          <div className="brand-icon">AI</div>
          <span>SupportFlow AI</span>
        </div>

        <nav className="landing-nav">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <button className="primary-btn" type="button" onClick={onStart}>Get Started</button>
      </header>

      <main className="landing-main">
        <section className="hero-section" id="home">
          <div className="hero-copy">
            <span className="eyebrow">INTELLIGENT SUPPORT PLATFORM</span>
            <h1>AI support that feels fast, helpful, and human.</h1>
            <p>
              SupportFlow AI helps teams resolve customer questions faster with smart automation,
              contextual understanding, and a modern support experience built for real-world service.
            </p>

            <div className="hero-actions">
              <button className="primary-btn" type="button" onClick={onStart}>Get Started</button>
              <button className="secondary-btn" type="button">Learn More</button>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <strong>24/7</strong>
                <span>Support coverage</span>
              </div>
              <div className="stat-card">
                <strong>4 min</strong>
                <span>Avg. response time</span>
              </div>
              <div className="stat-card">
                <strong>96%</strong>
                <span>Customer satisfaction</span>
              </div>
              <div className="stat-card">
                <strong>82%</strong>
                <span>Resolution rate</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="dashboard-preview">
              <div className="preview-topbar">
                <span className="dot purple" />
                <span className="dot blue" />
                <span className="dot green" />
              </div>

              <div className="preview-body">
                <div className="preview-sidebar">
                  <div className="mini-card active">Live Chat</div>
                  <div className="mini-card">History</div>
                  <div className="mini-card">Settings</div>
                </div>

                <div className="preview-chat">
                  <div className="preview-message user">Where is my order?</div>
                  <div className="preview-message ai">I can help check your shipment and provide the latest status.</div>
                  <div className="preview-input">Type your message...</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="feature-section" id="features">
          <div className="section-head">
            <span className="eyebrow">WHY TEAMS CHOOSE US</span>
            <h2>Everything support teams need in one place</h2>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Resolution</h3>
              <p>Resolve routine support issues automatically using AI-powered guidance and relevant FAQs.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Secure Workflow</h3>
              <p>Protect customer information with safe, policy-aware actions and human escalation when needed.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Smart Insights</h3>
              <p>Track recurring issues, customer intent, and operational trends in one place.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Human + AI Support</h3>
              <p>Give your team the confidence to handle more complex conversations with better context.</p>
            </div>
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="about-copy">
            <span className="eyebrow">ABOUT THE PROJECT</span>
            <h2>Built to make customer support smoother, faster, and more intelligent.</h2>
            <p>
              This project brings together a modern customer support assistant with a clean chat workflow,
              quick actions, and useful insights for support teams. It helps customers get the help they need
              without waiting and gives businesses a better way to organize support conversations.
            </p>
          </div>

          <div className="points-panel">
            <ul>
              <li>AI-powered customer support for quick and reliable responses.</li>
              <li>Smart intent detection to understand customer issues before action is taken.</li>
              <li>Workflow automation for order updates, refunds, invoices, and account help.</li>
              <li>A cleaner support dashboard that combines chat, history, and quick actions.</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="landing-footer" id="contact">
        <div className="footer-brand">
          <div className="brand-icon">AI</div>
          <span>SupportFlow AI</span>
        </div>
        <p>Modern customer support with AI help and human support workflows.</p>
      </footer>
    </div>
  );
}

function ChatbotApp({
  onHome,
  onHistory,
  onSettings,
  onProfile,
  messages,
  input,
  setInput,
  onSend,
  loading,
  historyEntries,
  selectedHistoryId,
  setSelectedHistoryId,
  settings,
  setSettings,
  profile,
  setProfile,
  activeView,
  onNewChat,
  saveSettings,
  saveProfile,
  settingsSaved,
  profileSaved,
  copiedId,
  setSettingsSaved,
  setProfileSaved,
  setCopiedId,
  expandedIntentIndex,
  setExpandedIntentIndex,
}) {
  const promptList = useMemo(() => suggestedPrompts, []);

  const stripMarkdown = (value = '') => String(value)
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/[#*_~`>]/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const selectedHistory = historyEntries.find((item) => item.id === selectedHistoryId) ?? historyEntries[0];

  const getPreviewText = (value = '') => {
    const plain = stripMarkdown(value);
    if (plain.length <= 150) return plain;
    return `${plain.slice(0, 147).trim()}...`;
  };

  const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const renderMessageHTML = (text = '') => {
    try {
      const raw = typeof text === 'string' ? text : String(text ?? '');
      const parsed = marked.parse(raw, { breaks: true, gfm: true });
      const html = typeof parsed === 'string' ? parsed : String(parsed ?? '');
      return DOMPurify.sanitize(html);
    } catch (error) {
      console.error('Markdown render failed', error);
      return DOMPurify.sanitize(`<p>${escapeHtml(String(text ?? ''))}</p>`);
    }
  };

  const handleCopy = async () => {
    if (!selectedHistory) return;
    try {
      await navigator.clipboard.writeText(`${selectedHistory.question}\n\n${selectedHistory.answer}`);
      setCopiedId(selectedHistory.id);
    } catch (error) {
      console.error('copy failed', error);
    }
  };

  return (
    <div className="chat-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">AI</div>
          <h2>Support AI</h2>
        </div>

        <button className="new-chat" type="button" onClick={onNewChat}>+ New Chat</button>

        {activeView === 'home' && (
          <div className="sidebar-section">
            <h3>Suggested Prompts</h3>
            {promptList.map((prompt) => (
              <button key={prompt} className="prompt-item" type="button" onClick={() => setInput(prompt)}>
                {prompt}
              </button>
            ))}
          </div>
        )}

        {activeView !== 'home' && <div className="sidebar-space" aria-hidden="true" />}

        <div className="sidebar-footer">
          <div className="ready-status"><span className="status-dot"></span>AI Assistant Ready</div>
          <p className="powered-by">Powered by FastAPI + Groq</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <h1>AI Customer Support</h1>
            <p>Your intelligent support assistant</p>
          </div>

          <div className="topbar-actions">
            <button className={`top-link ${activeView === 'home' ? 'active' : ''}`} type="button" onClick={onHome}>Home</button>
            <button className={`top-link ${activeView === 'history' ? 'active' : ''}`} type="button" onClick={onHistory}>History</button>
            <button className={`top-link ${activeView === 'settings' ? 'active' : ''}`} type="button" onClick={onSettings}>Settings</button>
            <button className={`top-link profile ${activeView === 'profile' ? 'active' : ''}`} type="button" onClick={onProfile}>Profile</button>
          </div>
        </header>

        <section className="chat-area">
          {activeView === 'home' && (
            <>
              <div className="welcome-screen">
                <div className="welcome-icon">✦</div>
                <h2>Hello! How can I help you?</h2>
                <p>
                  Enter your question below. I can help you understand your issue and suggest the best next steps.
                </p>

                <div className="suggestions">
                  {promptList.slice(0, 3).map((suggestion) => (
                    <button key={suggestion} className="suggestion" type="button" onClick={() => setInput(suggestion)}>
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="message-list">
                {messages.length > 0 ? (
                  messages.map((message, index) => {
                    const isAssistant = message.role === 'assistant';
                    const analysis = message.intent ? message : null;

                    return (
                      <div key={`${message.role}-${index}`} className={`message-row ${message.role}`}>
                        <div className="avatar">{message.role === 'user' ? 'You' : 'AI'}</div>
                        {isAssistant ? (
                          <div className="message-bubble-wrap">
                            <div
                              className="message-bubble markdown-content"
                              dangerouslySetInnerHTML={{ __html: renderMessageHTML(message.text) }}
                            />
                            {analysis && (
                              <div className="intent-panel">
                                <button
                                  type="button"
                                  className="intent-toggle"
                                  onClick={() => setExpandedIntentIndex((current) => current === index ? null : index)}
                                >
                                  {expandedIntentIndex === index ? 'Hide intent' : 'View intent'}
                                </button>
                                {expandedIntentIndex === index && (
                                  <div className="intent-details">
                                    <div className="intent-row"><span>Intent</span><strong>{analysis.intent}</strong></div>
                                    <div className="intent-row"><span>Risk</span><strong>{analysis.risk_profile}</strong></div>
                                    <div className="intent-row"><span>Priority</span><strong>{analysis.priority}</strong></div>
                                    <div className="intent-row"><span>Requires action</span><strong>{analysis.requires_action ? 'Yes' : 'No'}</strong></div>
                                    <div className="intent-summary"><span>Summary</span><p>{analysis.summary}</p></div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="message-bubble">{message.text}</div>
                        )}
                      </div>
                    );
                  })
                ) : null}
              </div>
            </>
          )}

          {activeView === 'history' && (
            <div className="panel-content">
              <div className="panel-header">Chat History</div>
              <div className="history-layout">
                <div className="history-list">
                  {historyEntries.map((item) => (
                    <button
                      key={item.id}
                      className={`history-item ${selectedHistoryId === item.id ? 'selected' : ''}`}
                      type="button"
                      onClick={() => setSelectedHistoryId(item.id)}
                    >
                      <div className="history-qa">
                        <div className="history-question">{item.question}</div>
                        <div className="history-answer">{getPreviewText(item.answer)}</div>
                      </div>
                      <div className="history-time">{item.time}</div>
                    </button>
                  ))}
                </div>

                <div className="history-detail">
                  {selectedHistory && (
                    <>
                      <div className="detail-tag">Selected conversation</div>
                      <h3>{selectedHistory.title}</h3>
                      <div className="detail-block">
                        <span>Question</span>
                        <p>{selectedHistory.question}</p>
                      </div>
                      <div className="detail-block">
                        <span>Response</span>
                        <p>{stripMarkdown(selectedHistory.answer)}</p>
                      </div>
                      <button
                        type="button"
                        className={`copy-btn ${copiedId === selectedHistory.id ? 'history-copied' : ''}`}
                        onClick={handleCopy}
                      >
                        {copiedId === selectedHistory.id ? 'Copied!' : 'Copy response'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeView === 'settings' && (
            <div className="panel-content">
              <div className="panel-header">Settings</div>
              <div className="settings-form">
                {Object.entries(settings).map(([key, value]) => (
                  <label key={key} className="input-field">
                    <span>{key}</span>
                    <input
                      value={value}
                      onChange={(event) => {
                        setSettings((current) => ({ ...current, [key]: event.target.value }));
                        setSettingsSaved(false);
                      }}
                    />
                  </label>
                ))}
                <button
                  type="button"
                  className={`save-btn ${settingsSaved ? 'settings-saved' : ''}`}
                  onClick={saveSettings}
                >
                  {settingsSaved ? 'Saved' : 'Save settings'}
                </button>
              </div>
            </div>
          )}

          {activeView === 'profile' && (
            <div className="panel-content">
              <div className="panel-header">Profile</div>
              <div className="profile-form">
                {Object.entries(profile).map(([key, value]) => (
                  <label key={key} className="input-field">
                    <span>{key}</span>
                    <input
                      value={value}
                      onChange={(event) => {
                        setProfile((current) => ({ ...current, [key]: event.target.value }));
                        setProfileSaved(false);
                      }}
                    />
                  </label>
                ))}
                <button
                  type="button"
                  className={`save-btn ${profileSaved ? 'profile-saved' : ''}`}
                  onClick={saveProfile}
                >
                  {profileSaved ? 'Saved' : 'Save profile'}
                </button>
              </div>
            </div>
          )}
        </section>

        <footer className="input-area">
          {activeView === 'home' && (
            <>
              <form
                className="input-box"
                onSubmit={(event) => {
                  event.preventDefault();
                  onSend();
                }}
              >
                <textarea
                  className="chat-textarea"
                  rows="4"
                  maxLength="5000"
                  placeholder="Message your AI assistant..."
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                />
                <button type="submit" className="send-button" aria-label="Send message" disabled={loading}>
                  {loading ? '…' : '↑'}
                </button>
              </form>

              <p className="input-hint">AI can make mistakes. Do not share passwords, OTPs or full card numbers.</p>
            </>
          )}
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('landing');
  const [activeView, setActiveView] = useState('home');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyEntries, setHistoryEntries] = useState(initialHistoryEntries);
  const [selectedHistoryId, setSelectedHistoryId] = useState(initialHistoryEntries[0].id);
  const [sessionId, setSessionId] = useState(null);
  const [settings, setSettings] = useState(defaultSettings);
  const [profile, setProfile] = useState(defaultProfile);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [expandedIntentIndex, setExpandedIntentIndex] = useState(null);

  useEffect(() => {
    if (!settingsSaved) return undefined;

    const timer = setTimeout(() => setSettingsSaved(false), 2000);
    return () => clearTimeout(timer);
  }, [settingsSaved]);

  useEffect(() => {
    if (!profileSaved) return undefined;

    const timer = setTimeout(() => setProfileSaved(false), 2000);
    return () => clearTimeout(timer);
  }, [profileSaved]);

  useEffect(() => {
    if (copiedId === null) return undefined;

    const timer = setTimeout(() => setCopiedId(null), 2000);
    return () => clearTimeout(timer);
  }, [copiedId]);

  const loadHistoryEntries = async (items = []) => {
    const hydrated = await Promise.all(items.slice(0, 8).map(async (item, index) => {
      let answer = 'This conversation was retrieved from the backend. Open it to review the assistant response.';
      let question = item.preview || 'User question';

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/conversations/${item.session_id}/messages`);
        if (response.ok) {
          const data = await response.json();
          const assistantEntry = [...(data.items || [])].reverse().find((entry) => entry.role === 'assistant');
          if (assistantEntry?.content) {
            answer = assistantEntry.content;
          }
          const userEntry = [...(data.items || [])].reverse().find((entry) => entry.role === 'user');
          if (userEntry?.content) {
            question = userEntry.content;
          }
        }
      } catch (error) {
        console.log('Message details unavailable:', error);
      }

      return {
        id: item.session_id || `history-${index}-${Date.now()}`,
        title: item.title || question || 'Conversation',
        question,
        answer,
        time: item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'Today',
      };
    }));

    return hydrated;
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/conversations');
        if (!response.ok) return;

        const data = await response.json();
        if (Array.isArray(data?.items) && data.items.length > 0) {
          const hydrated = await loadHistoryEntries(data.items);
          setHistoryEntries(hydrated);
          setSelectedHistoryId(hydrated[0].id);
        }
      } catch (error) {
        console.log('History unavailable:', error);
      }
    };

    fetchHistory();
  }, []);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: 'user', text: trimmed };
    setMessages((current) => [...current, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
          session_id: sessionId || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const detail = typeof data?.detail === 'string' ? data.detail : 'Unable to process your request.';
        throw new Error(detail);
      }

      const botText = data.response_markdown || data.summary || 'I am here to help.';
      const newHistoryItem = {
        id: Date.now(),
        title: trimmed.length > 24 ? `${trimmed.slice(0, 24)}...` : trimmed,
        question: trimmed,
        answer: botText,
        time: 'just now',
      };

      setMessages((current) => [...current, {
        role: 'assistant',
        text: botText,
        intent: data.intent || null,
        risk_profile: data.risk_profile || null,
        priority: data.priority || null,
        summary: data.summary || null,
        requires_action: typeof data.requires_action === 'boolean' ? data.requires_action : null,
      }]);

      setHistoryEntries((current) => [newHistoryItem, ...current.filter((item) => item.question !== trimmed)].slice(0, 8));
      setSelectedHistoryId(newHistoryItem.id);

      if (!sessionId && data.session_id) {
        setSessionId(data.session_id);
      }

      const refreshed = await fetch('http://127.0.0.1:8000/api/conversations');
      const refreshedData = await refreshed.json();
      if (Array.isArray(refreshedData?.items) && refreshedData.items.length > 0) {
        const hydrated = await loadHistoryEntries(refreshedData.items);
        setHistoryEntries(hydrated);
        setSelectedHistoryId(hydrated[0].id);
      }
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: `Sorry, I couldn't process your request. ${error.message}`,
          intent: null,
          risk_profile: null,
          priority: null,
          summary: null,
          requires_action: null,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setSessionId(null);
    setActiveView('home');
  };

  const saveSettings = () => {
    setSettingsSaved(true);
  };

  const saveProfile = () => {
    setProfileSaved(true);
  };

  if (page === 'landing') {
    return <LandingPage onStart={() => setPage('chat')} />;
  }

  return (
    <ChatbotApp
      onHome={() => setActiveView('home')}
      onHistory={() => setActiveView('history')}
      onSettings={() => setActiveView('settings')}
      onProfile={() => setActiveView('profile')}
      messages={messages}
      input={input}
      setInput={setInput}
      onSend={handleSend}
      loading={loading}
      historyEntries={historyEntries}
      selectedHistoryId={selectedHistoryId}
      setSelectedHistoryId={setSelectedHistoryId}
      settings={settings}
      setSettings={setSettings}
      profile={profile}
      setProfile={setProfile}
      activeView={activeView}
      onNewChat={handleNewChat}
      saveSettings={saveSettings}
      saveProfile={saveProfile}
      settingsSaved={settingsSaved}
      profileSaved={profileSaved}
      copiedId={copiedId}
      setSettingsSaved={setSettingsSaved}
      setProfileSaved={setProfileSaved}
      setCopiedId={setCopiedId}
      expandedIntentIndex={expandedIntentIndex}
      setExpandedIntentIndex={setExpandedIntentIndex}
    />
  );
}
