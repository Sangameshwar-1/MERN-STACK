import { useState, useEffect } from 'react';
import api from '../../utils/api';
import EventCard from '../../components/EventCard';

const BrowseEvents = () => {
  const [events, setEvents] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ eventType: '', eligibility: '', followedClubs: false });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  useEffect(() => {
    let active = true;

    const loadEvents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: 1, limit: 12 });
        if (search) params.append('search', search);
        if (filters.eventType) params.append('eventType', filters.eventType);
        if (filters.eligibility) params.append('eligibility', filters.eligibility);
        if (filters.followedClubs) params.append('followedClubs', 'true');

        const { data } = await api.get(`/events?${params}`);
        if (!active) return;

        setEvents(data.events);
        setPagination({ page: data.page, pages: data.pages, total: data.total });
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadEvents();

    return () => {
      active = false;
    };
  }, [search, filters]);

  const fetchEvents = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (search) params.append('search', search);
      if (filters.eventType) params.append('eventType', filters.eventType);
      if (filters.eligibility) params.append('eligibility', filters.eligibility);
      if (filters.followedClubs) params.append('followedClubs', 'true');

      const { data } = await api.get(`/events?${params}`);
      setEvents(data.events);
      setPagination({ page: data.page, pages: data.pages, total: data.total });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get('/events/trending').then(res => setTrending(res.data));
  }, []);

  return (
    <div className="browse-page">
      <div className="browse-header">
        <h1> Browse Events</h1>
        <p>Discover and register for exciting events at Felicity</p>
      </div>

      {trending.length > 0 && (
        <div className="trending-section">
          <h2> Trending Now</h2>
          <div className="trending-list">
            {trending.map((event, i) => (
              <div key={event._id} className="trending-item">
                <span className="trending-rank">#{i + 1}</span>
                <div>
                  <strong>{event.eventName}</strong>
                  <p>{event.organizer?.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="search-filter-bar">
        <div className="search-box">
          <span className="search-icon"></span>
          <input
            type="text"
            placeholder="Search events, organizers, tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="filters">
          <select value={filters.eventType} onChange={e => setFilters(f => ({ ...f, eventType: e.target.value }))}>
            <option value="">All Types</option>
            <option value="normal">Normal</option>
            <option value="merchandise">Merchandise</option>
          </select>

          <select value={filters.eligibility} onChange={e => setFilters(f => ({ ...f, eligibility: e.target.value }))}>
            <option value="">All Participants</option>
            <option value="iiit-only">IIIT Only</option>
            <option value="non-iiit-only">Non-IIIT Only</option>
          </select>

          <label className="checkbox-filter">
            <input
              type="checkbox"
              checked={filters.followedClubs}
              onChange={e => setFilters(f => ({ ...f, followedClubs: e.target.checked }))}
            />
            Followed Clubs
          </label>
        </div>
      </div>

      <div className="results-info">
        {!loading && <p>{pagination.total} events found</p>}
      </div>

      {loading ? (
        <div className="loading-grid">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
        </div>
      ) : (
        <>
          <div className="events-grid">
            {events.map(event => <EventCard key={event._id} event={event} />)}
          </div>
          {events.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/10 p-8 text-center animate-in fade-in-50">
              <span> No events found.</span>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
          {pagination.pages > 1 && (
            <div className="pagination">
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i}
                  className={`page-btn ${pagination.page === i + 1 ? 'active' : ''}`}
                  onClick={() => fetchEvents(i + 1)}
                >{i + 1}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BrowseEvents;
