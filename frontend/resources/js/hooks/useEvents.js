import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Custom hook untuk fetch events dari API Laravel
 * @param {string} endpoint - API endpoint (default: /api/events)
 * @returns {Object} - { events, loading, error }
 */
export function useEvents(endpoint = '/api/events') {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(endpoint);
        setEvents(response.data.data || response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [endpoint]);

  return { events, loading, error };
}

/**
 * Custom hook untuk fetch single event
 * @param {number} eventId - Event ID
 * @returns {Object} - { event, loading, error }
 */
export function useEvent(eventId) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/events/${eventId}`);
        setEvent(response.data.data || response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  return { event, loading, error };
}
