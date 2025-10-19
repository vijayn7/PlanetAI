import React, { useEffect, useState } from 'react';
import { CalendarAPI } from '../services/calendarAPI';

export function EventCreateModal({ accessToken, initialDate, onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [start, setStart] = useState(() => {
    const d = new Date(initialDate || new Date());
    d.setHours(9, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [end, setEnd] = useState(() => {
    const d = new Date(initialDate || new Date());
    d.setHours(10, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [attendeesText, setAttendeesText] = useState('');
  const [calendars, setCalendars] = useState([]);
  const [calendarId, setCalendarId] = useState('primary');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accessToken) return;
    const api = new CalendarAPI(accessToken);
    let mounted = true;
    (async () => {
      try {
        const res = await api.getCalendars();
        if (!mounted) return;
        const items = res.items || [];
        setCalendars(items);
        if (items.length > 0) setCalendarId(items[0].id || 'primary');
      } catch (err) {
        console.warn('Failed to fetch calendars', err);
      }
    })();

    return () => { mounted = false; };
  }, [accessToken]);

  const parseDateInput = (value) => {
    // value comes in 'YYYY-MM-DDTHH:MM' format
    return new Date(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accessToken) {
      setError('Missing Google access token. Please sign in again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const api = new CalendarAPI(accessToken);

      let event = {
        summary: title || 'Untitled Event',
        description: description || '',
        location: location || undefined,
      };

      if (allDay) {
        const s = parseDateInput(start);
        const eDate = new Date(s);
        // Google uses exclusive end date for all-day events
        eDate.setDate(eDate.getDate() + 1);
        event.start = { date: s.toISOString().slice(0, 10) };
        event.end = { date: eDate.toISOString().slice(0, 10) };
      } else {
        const s = parseDateInput(start);
        const e = parseDateInput(end);
        event.start = { dateTime: s.toISOString() };
        event.end = { dateTime: e.toISOString() };
      }

      const attendees = attendeesText
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .map(email => ({ email }));

      if (attendees.length > 0) event.attendees = attendees;

      const created = await api.createEvent(event, calendarId || 'primary');
      onCreated?.(created);
      onClose?.();
    } catch (err) {
      console.error('Failed to create event', err);
      setError(err.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create Event</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form className="modal-content" onSubmit={handleSubmit}>
          <label>
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>

          <label>
            Description
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>

          <label>
            Location
            <input value={location} onChange={(e) => setLocation(e.target.value)} />
          </label>

          <label>
            All day
            <input type="checkbox" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} />
          </label>

          <label>
            Start {allDay ? '(date)' : '(date & time)'}
            <input type={allDay ? 'date' : 'datetime-local'} value={start} onChange={(e) => setStart(e.target.value)} required />
          </label>

          {!allDay && (
            <label>
              End (date & time)
              <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} required />
            </label>
          )}

          <label>
            Attendees (comma-separated emails)
            <input value={attendeesText} onChange={(e) => setAttendeesText(e.target.value)} />
          </label>

          <label>
            Calendar
            <select value={calendarId} onChange={(e) => setCalendarId(e.target.value)}>
              <option value="primary">Primary</option>
              {calendars.map(cal => (
                <option key={cal.id} value={cal.id}>{cal.summary || cal.id}</option>
              ))}
            </select>
          </label>

          {error && <div className="error">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Event'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventCreateModal;
