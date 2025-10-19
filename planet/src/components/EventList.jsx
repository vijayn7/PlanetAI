import React, { useState, useEffect } from 'react';
import { CalendarAPI, parseCalendarEvent, formatEventTime, formatEventDate, isEventToday } from '../services/calendarAPI';

export function EventList({ accessToken, selectedDate, onEventSelect, onCreateEvent, refreshKey }) {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calendarAPI = new CalendarAPI(accessToken);

  // Load upcoming events
  useEffect(() => {
    loadUpcomingEvents();
  }, [accessToken, refreshKey]);

  // Load events for selected date
  useEffect(() => {
    if (selectedDate) {
      loadEventsForDate(selectedDate);
    }
  }, [selectedDate, accessToken, refreshKey]);

  const loadUpcomingEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await calendarAPI.getUpcomingEvents();
      const parsedEvents = response.items.map(parseCalendarEvent);
      setUpcomingEvents(parsedEvents);
    } catch (err) {
      console.error('Failed to load upcoming events:', err);
      setError('Failed to load upcoming events');
    } finally {
      setLoading(false);
    }
  };

  const loadEventsForDate = async (date) => {
    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      const response = await calendarAPI.getEvents(startDate, endDate);
      const parsedEvents = response.items.map(parseCalendarEvent);
      setSelectedDateEvents(parsedEvents);
    } catch (err) {
      console.error('Failed to load events for date:', err);
    }
  };

  const handleEventClick = (event) => {
    onEventSelect?.(event);
  };

  const handleCreateEvent = () => {
    onCreateEvent?.(selectedDate);
  };

  const groupEventsByDate = (events) => {
    const groups = {};
    
    events.forEach(event => {
      const dateKey = event.start.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
    });
    
    return groups;
  };

  const renderEventItem = (event) => (
    <div
      key={event.id}
      className="event-item"
      onClick={() => handleEventClick(event)}
    >
      <div className="event-time">
        {formatEventTime(event)}
      </div>
      <div className="event-details">
        <div className="event-title">{event.title}</div>
        {event.location && (
          <div className="event-location">📍 {event.location}</div>
        )}
        {event.description && (
          <div className="event-description">{event.description}</div>
        )}
      </div>
      {event.attendees && event.attendees.length > 0 && (
        <div className="event-attendees">
          👥 {event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );

  return (
    <div className="event-list">
      {/* Selected Date Events */}
      {selectedDate && (
        <div className="selected-date-section">
          <div className="section-header">
            <h3>{formatEventDate({ start: selectedDate })}</h3>
            <button className="create-event-button" onClick={handleCreateEvent}>
              + Add Event
            </button>
          </div>
          
          {selectedDateEvents.length > 0 ? (
            <div className="events-container">
              {selectedDateEvents.map(renderEventItem)}
            </div>
          ) : (
            <div className="no-events">
              No events scheduled for this day
            </div>
          )}
        </div>
      )}

      {/* Upcoming Events */}
      <div className="upcoming-section">
        <h3>Upcoming Events</h3>
        
        {loading && <div className="loading">Loading events...</div>}
        {error && <div className="error">{error}</div>}
        
        {upcomingEvents.length > 0 ? (
          <div className="events-container">
            {Object.entries(groupEventsByDate(upcomingEvents)).map(([dateString, dayEvents]) => (
              <div key={dateString} className="day-group">
                <div className="day-header">
                  <span className={`day-label ${isEventToday(dayEvents[0]) ? 'today' : ''}`}>
                    {isEventToday(dayEvents[0]) ? 'Today' : formatEventDate(dayEvents[0])}
                  </span>
                </div>
                {dayEvents.map(renderEventItem)}
              </div>
            ))}
          </div>
        ) : !loading && (
          <div className="no-events">
            No upcoming events in the next 7 days
          </div>
        )}
      </div>

      {/* Calendar Legend */}
      <div className="calendar-legend">
        <h4>Legend</h4>
        <div className="legend-item">
          <div className="legend-color all-day"></div>
          <span>All-day events</span>
        </div>
        <div className="legend-item">
          <div className="legend-color timed"></div>
          <span>Timed events</span>
        </div>
      </div>
    </div>
  );
}