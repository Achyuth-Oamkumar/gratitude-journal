import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function App() {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [content, setContent] = useState('');
  const [currentEntryId, setCurrentEntryId] = useState(null);
  const [recentEntries, setRecentEntries] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchEntries = async () => {
    try {
      const res = await api.get('entries/');
      setRecentEntries(res.data);
    } catch (err) {
      console.error('Error fetching entries:', err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    const entry = recentEntries.find((e) => e.date === selectedDate);
    if (entry) {
      setContent(entry.content);
      setCurrentEntryId(entry.id);
    } else {
      setContent('');
      setCurrentEntryId(null);
    }
    setStatusMessage('');
  }, [selectedDate, recentEntries]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    try {
      if (currentEntryId) {
        await api.put(`entries/${currentEntryId}/`, {
          date: selectedDate,
          content: content,
        });
        setStatusMessage('Entry updated successfully! ✨');
      } else {
        const res = await api.post('entries/', {
          date: selectedDate,
          content: content,
        });
        setCurrentEntryId(res.data.id);
        setStatusMessage('Gratitude saved for today! 🌿');
      }
      fetchEntries();
    } catch (err) {
      setStatusMessage('Failed to save. Make sure you are logged in at http://localhost:8000/api-auth/login/');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>🌱 Daily Gratitude Journal</h1>
        <p style={{ color: '#666', margin: 0 }}>Capture one paragraph of gratitude each day.</p>
      </header>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          max={today}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
      </div>

      <form onSubmit={handleSave}>
        <textarea
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What made you smile or feel grateful today? Write one paragraph..."
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1rem',
            lineHeight: '1.5',
            boxSizing: 'border-box'
          }}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: '12px',
            padding: '10px 18px',
            backgroundColor: '#2e7d32',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Saving...' : currentEntryId ? 'Update Entry' : 'Save Gratitude'}
        </button>
      </form>

      {statusMessage && <p style={{ color: '#2e7d32', marginTop: '12px', fontWeight: '500' }}>{statusMessage}</p>}

      <hr style={{ margin: '32px 0', borderColor: '#eee' }} />

      <section>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Past Entries</h2>
        {recentEntries.length === 0 ? (
          <p style={{ color: '#888' }}>No entries found.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {recentEntries.map((entry) => (
              <li
                key={entry.id}
                onClick={() => setSelectedDate(entry.date)}
                style={{
                  padding: '12px',
                  marginBottom: '8px',
                  border: selectedDate === entry.date ? '2px solid #2e7d32' : '1px solid #e0e0e0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: selectedDate === entry.date ? '#f1f8e9' : '#fff'
                }}
              >
                <strong>{entry.date}</strong>
                <p style={{ margin: '4px 0 0', color: '#444', whiteSpace: 'pre-wrap' }}>{entry.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}