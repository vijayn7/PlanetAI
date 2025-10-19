/**
 * Google Calendar API service using gapi.client
 */

export class CalendarAPI {
  constructor(accessToken) {
    this.accessToken = accessToken;
    // Set the token for gapi.client if available
    if (window.gapi?.client?.setToken) {
      window.gapi.client.setToken({ access_token: accessToken });
    }
  }

  async request(endpoint, options = {}) {
    // Try to use gapi.client first (more reliable)
    if (window.gapi?.client?.calendar) {
      return this.requestWithGapi(endpoint, options);
    }
    
    // Fallback to direct HTTP requests
    return this.requestWithFetch(endpoint, options);
  }

  async requestWithGapi(endpoint, options = {}) {
    try {
      // Parse the endpoint to determine the API call
      if (endpoint === '/users/me/calendarList') {
        const response = await window.gapi.client.calendar.calendarList.list();
        return response.result;
      } else if (endpoint.includes('/calendars/') && endpoint.includes('/events')) {
        // Extract calendar ID and parameters
        const match = endpoint.match(/\/calendars\/([^\/]+)\/events/);
        const calendarId = match ? decodeURIComponent(match[1]) : 'primary';
        
        // Parse query parameters
        const url = new URL('http://example.com' + endpoint);
        const params = {};
        url.searchParams.forEach((value, key) => {
          params[key] = value;
        });

        const response = await window.gapi.client.calendar.events.list({
          calendarId,
          ...params,
        });
        return response.result;
      }
    } catch (error) {
      console.warn('GAPI request failed, falling back to fetch:', error);
      return this.requestWithFetch(endpoint, options);
    }
  }

  async requestWithFetch(endpoint, options = {}) {
    const baseUrl = 'https://www.googleapis.com/calendar/v3';
    const url = `${baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Calendar API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get list of user's calendars
   */
  async getCalendars() {
    return this.request('/users/me/calendarList');
  }

  /**
   * Get events for a specific date range
   */
  async getEvents(startDate, endDate, calendarId = 'primary') {
    const params = new URLSearchParams({
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '250',
    });

    return this.request(`/calendars/${encodeURIComponent(calendarId)}/events?${params}`);
  }

  /**
   * Get events for current month
   */
  async getMonthEvents(year, month, calendarId = 'primary') {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59);
    
    return this.getEvents(startDate, endDate, calendarId);
  }

  /**
   * Get upcoming events (next 7 days)
   */
  async getUpcomingEvents(calendarId = 'primary') {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    
    return this.getEvents(startDate, endDate, calendarId);
  }

  /**
   * Create a new event (requires write permissions)
   */
  async createEvent(eventData, calendarId = 'primary') {
    if (window.gapi?.client?.calendar) {
      try {
        const response = await window.gapi.client.calendar.events.insert({
          calendarId,
          resource: eventData,
        });
        return response.result;
      } catch (error) {
        console.warn('GAPI create failed, falling back to fetch:', error);
      }
    }

    return this.requestWithFetch(`/calendars/${encodeURIComponent(calendarId)}/events`, {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  /**
   * Update an existing event
   */
  async updateEvent(eventId, eventData, calendarId = 'primary') {
    if (window.gapi?.client?.calendar) {
      try {
        const response = await window.gapi.client.calendar.events.update({
          calendarId,
          eventId,
          resource: eventData,
        });
        return response.result;
      } catch (error) {
        console.warn('GAPI update failed, falling back to fetch:', error);
      }
    }

    return this.requestWithFetch(`/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  /**
   * Delete an event
   */
  async deleteEvent(eventId, calendarId = 'primary') {
    if (window.gapi?.client?.calendar) {
      try {
        const response = await window.gapi.client.calendar.events.delete({
          calendarId,
          eventId,
        });
        return response.result;
      } catch (error) {
        console.warn('GAPI delete failed, falling back to fetch:', error);
      }
    }

    return this.requestWithFetch(`/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`, {
      method: 'DELETE',
    });
  }
}

/**
 * Utility functions for calendar data
 */

export function parseCalendarEvent(event) {
  const start = event.start?.dateTime || event.start?.date;
  const end = event.end?.dateTime || event.end?.date;
  
  return {
    id: event.id,
    title: event.summary || 'Untitled Event',
    description: event.description || '',
    start: new Date(start),
    end: new Date(end),
    isAllDay: Boolean(event.start?.date), // All-day events use 'date' instead of 'dateTime'
    location: event.location || '',
    attendees: event.attendees || [],
    creator: event.creator,
    organizer: event.organizer,
    htmlLink: event.htmlLink,
    status: event.status,
    visibility: event.visibility,
    recurrence: event.recurrence,
  };
}

export function formatEventTime(event) {
  if (event.isAllDay) {
    return 'All day';
  }
  
  const timeFormat = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  
  const startTime = event.start.toLocaleTimeString([], timeFormat);
  const endTime = event.end.toLocaleTimeString([], timeFormat);
  
  return `${startTime} - ${endTime}`;
}

export function formatEventDate(event) {
  const dateFormat = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  
  return event.start.toLocaleDateString([], dateFormat);
}

export function isEventToday(event) {
  const today = new Date();
  const eventDate = event.start;
  
  return (
    eventDate.getDate() === today.getDate() &&
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getFullYear() === today.getFullYear()
  );
}

export function isEventThisWeek(event) {
  const today = new Date();
  const eventDate = event.start;
  
  // Get start of this week (Sunday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  // Get end of this week (Saturday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return eventDate >= startOfWeek && eventDate <= endOfWeek;
}
