import React, { useState, useEffect, useCallback } from 'react';
import { GoogleCalendarAuth } from './components/GoogleCalendarAuth';
import { CalendarView } from './components/CalendarView';
import { EventList } from './components/EventList';
import EventCreateModal from './components/EventCreateModal';
import './App.css';

const AUTH_STORAGE_KEY = 'planet-calendar-auth';

function loadStoredAuth() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored);
    if (parsed?.accessToken && parsed?.profile?.sub) {
      // Check if token is still valid
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        return null;
      }
      return parsed;
    }
  } catch (error) {
    console.warn('Failed to parse stored auth state', error);
  }

  return null;
}

function App() {
  const [authState, setAuthState] = useState(() => loadStoredAuth());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const user = authState?.profile ?? null;
  const accessToken = authState?.accessToken ?? null;
  const hasGoogleClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  // Persist auth state in localStorage
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (authState) {
      try {
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
      } catch (error) {
        console.error('Failed to persist auth state', error);
      }
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [authState]);

  const handleAuthSuccess = useCallback((authData) => {
    setAuthState(authData);
    setAuthError(null);
  }, []);

  const handleAuthError = useCallback((error) => {
    console.error('Authentication error:', error);
    setAuthError(typeof error === 'string' ? error : 'Authentication failed. Please try again.');
    setAuthState(null);
  }, []);

  const handleLogout = useCallback(() => {
    setAuthState(null);
    setSelectedDate(new Date());
    setSelectedEvent(null);
    setAuthError(null);

    // Clear any Google auth state
    try {
      const googleAuth = window.gapi?.auth2?.getAuthInstance();
      if (googleAuth) {
        googleAuth.signOut();
      }
    } catch (error) {
      console.warn('Failed to sign out from Google', error);
    }
  }, []);

  const handleDateSelect = useCallback((date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
  }, []);

  const handleEventSelect = useCallback((event) => {
    setSelectedEvent(event);
  }, []);

  const handleCreateEvent = useCallback((date) => {
    // Open event creation modal
    console.log('Create event for date:', date);
    setShowCreateModal(true);
  }, []);

  const handleEventCreated = useCallback((createdEvent) => {
    // After creating an event, we can optionally refresh UI or show feedback
    console.log('Event created:', createdEvent);
    // Close modal handled by modal itself via onClose
    // Could refresh lists by forcing a state change; simplest is to reload the page
    // but instead we'll rely on EventList to refresh via callback.
    // Trigger data refresh for lists and calendar views
    setRefreshKey(k => k + 1);
  }, []);

  if (!user) {
    return (
      <div className="app login-screen">
        <div className="login-card">
          <h1>🗓️ Planet AI Calendar</h1>
          <p className="login-subtitle">
            Connect your Google Calendar to view and manage your events.
          </p>
          {authError && <p className="login-error">{authError}</p>}
          {hasGoogleClientId ? (
            <GoogleCalendarAuth 
              onAuthSuccess={handleAuthSuccess}
              onAuthError={handleAuthError}
            />
          ) : (
            <p className="login-error">
              Add <code>VITE_GOOGLE_CLIENT_ID</code> to your environment to enable Google Calendar access.
            </p>
          )}
          <p className="login-note">
            We need access to your Google Calendar to display and manage your events.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🗓️ Planet AI Calendar</h1>
        <div className="user-profile">
          {user?.picture && (
            <img src={user.picture} alt="User avatar" className="user-avatar" />
          )}
          <div className="user-details">
            <span className="user-name">{user?.name}</span>
            <span className="user-email">{user?.email}</span>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="app-sidebar">
          <EventList
            accessToken={accessToken}
            selectedDate={selectedDate}
            onEventSelect={handleEventSelect}
            onCreateEvent={handleCreateEvent}
            refreshKey={refreshKey}
          />
        </div>

        <div className="app-content">
          <CalendarView
            accessToken={accessToken}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onEventSelect={handleEventSelect}
            refreshKey={refreshKey}
          />
        </div>
      </main>

      {/* Event Details Modal (if event selected) */}
      {selectedEvent && (
        <div className="event-modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedEvent.title}</h3>
              <button className="close-button" onClick={() => setSelectedEvent(null)}>
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="event-detail">
                <strong>Time:</strong> {selectedEvent.isAllDay ? 'All day' : 
                  `${selectedEvent.start.toLocaleString()} - ${selectedEvent.end.toLocaleString()}`}
              </div>
              {selectedEvent.location && (
                <div className="event-detail">
                  <strong>Location:</strong> {selectedEvent.location}
                </div>
              )}
              {selectedEvent.description && (
                <div className="event-detail">
                  <strong>Description:</strong> {selectedEvent.description}
                </div>
              )}
              {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                <div className="event-detail">
                  <strong>Attendees:</strong>
                  <ul>
                    {selectedEvent.attendees.map((attendee, index) => (
                      <li key={index}>{attendee.email}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="modal-actions">
                <button onClick={() => window.open(selectedEvent.htmlLink, '_blank')}>
                  Open in Google Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <EventCreateModal
          accessToken={accessToken}
          initialDate={selectedDate}
          onClose={() => setShowCreateModal(false)}
          onCreated={(ev) => { handleEventCreated(ev); /* trigger UI updates if needed */ }}
        />
      )}
    </div>
  );
}

export default App;
