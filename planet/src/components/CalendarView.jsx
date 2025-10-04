import React, { useState, useEffect } from 'react';
import { CalendarAPI, parseCalendarEvent, formatEventTime } from '../services/calendarAPI';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function CalendarView({ accessToken, onEventSelect, selectedDate, onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calendarAPI = new CalendarAPI(accessToken);

  // Load events when month changes
  useEffect(() => {
    loadEvents();
  }, [currentDate, accessToken]);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      const response = await calendarAPI.getMonthEvents(year, month);
      const parsedEvents = response.items.map(parseCalendarEvent);
      setEvents(parsedEvents);
    } catch (err) {
      console.error('Failed to load calendar events:', err);
      setError('Failed to load calendar events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    onDateSelect?.(today);
  };

  const handleDateClick = (date) => {
    onDateSelect?.(date);
  };

  const handleEventClick = (event, e) => {
    e.stopPropagation();
    onEventSelect?.(event);
  };

  // Generate calendar grid
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Start calendar from the first Sunday that shows
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    // End calendar at the last Saturday that shows
    const endDate = new Date(lastDay);
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
    
    const days = [];
    const currentDay = new Date(startDate);
    
    while (currentDay <= endDate) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = event.start;
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isSelected = (date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="calendar-view">
      {/* Calendar Header */}
      <div className="calendar-header">
        <div className="calendar-nav">
          <button 
            className="nav-button"
            onClick={() => navigateMonth(-1)}
            aria-label="Previous month"
          >
            ‹
          </button>
          <h2 className="calendar-title">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button 
            className="nav-button"
            onClick={() => navigateMonth(1)}
            aria-label="Next month"
          >
            ›
          </button>
        </div>
        <button className="today-button" onClick={goToToday}>
          Today
        </button>
      </div>

      {/* Loading/Error States */}
      {loading && <div className="calendar-loading">Loading events...</div>}
      {error && <div className="calendar-error">{error}</div>}

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {/* Day headers */}
        <div className="calendar-weekdays">
          {DAYS_OF_WEEK.map(day => (
            <div key={day} className="weekday-header">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="calendar-days">
          {calendarDays.map(date => {
            const dayEvents = getEventsForDate(date);
            
            return (
              <div
                key={date.toISOString()}
                className={`calendar-day ${
                  isCurrentMonth(date) ? 'current-month' : 'other-month'
                } ${isToday(date) ? 'today' : ''} ${
                  isSelected(date) ? 'selected' : ''
                }`}
                onClick={() => handleDateClick(date)}
              >
                <div className="day-number">{date.getDate()}</div>
                
                {/* Events for this day */}
                <div className="day-events">
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      className={`event-bar ${event.isAllDay ? 'all-day' : ''}`}
                      onClick={(e) => handleEventClick(event, e)}
                      title={`${event.title} ${!event.isAllDay ? formatEventTime(event) : ''}`}
                    >
                      <span className="event-title">{event.title}</span>
                      {!event.isAllDay && (
                        <span className="event-time">{formatEventTime(event)}</span>
                      )}
                    </div>
                  ))}
                  
                  {/* Show "+X more" if there are more events */}
                  {dayEvents.length > 3 && (
                    <div className="event-overflow">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}