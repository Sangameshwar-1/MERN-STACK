import { useState, useEffect } from 'react';
import api from '../../utils/api';
import EventCard from '../../components/EventCard';
import { Search } from 'lucide-react';
import { Select } from '../../components/ui/Select';

const BrowseEvents = () => {
  const [events, setEvents] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({ eventType: '', eligibility: '', followedClubs: false });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let active = true;

    const loadEvents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: 1, limit: 12 });
        if (debouncedSearch) params.append('search', debouncedSearch);
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
  }, [debouncedSearch, filters]);

  const fetchEvents = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (debouncedSearch) params.append('search', debouncedSearch);
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
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animated-fade">
      {/* Header */}
      <div className="pb-6 mb-8 border-b border-white/10">
        <h1 className="text-3xl font-bold text-white tracking-tight">Browse Events</h1>
        <p className="text-sm text-slate-400 mt-1">Discover and register for active campus events and club programs</p>
      </div>

      {/* Trending Section */}
      {trending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Trending Now</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {trending.slice(0, 3).map((event, i) => (
              <div 
                key={event._id} 
                className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/10 rounded-xl hover:bg-white/[0.04] transition-all"
              >
                <span className="text-xl font-bold text-slate-500 font-mono">0{i + 1}</span>
                <div className="truncate">
                  <strong className="text-white font-medium text-sm block truncate">{event.eventName}</strong>
                  <span className="text-xs text-slate-400 block truncate">{event.organizer?.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shadow-xl">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search events, organizers, tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white outline-none text-sm placeholder-slate-500 focus:border-purple-500/50 focus:bg-black/35 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select 
            value={filters.eventType} 
            onChange={val => setFilters(f => ({ ...f, eventType: val }))}
            placeholder="All Types"
            className="w-36 text-xs"
            options={[
              { value: '', label: 'All Types' },
              { value: 'normal', label: 'Standard Event' },
              { value: 'merchandise', label: 'Merchandise' }
            ]}
          />

          <Select 
            value={filters.eligibility} 
            onChange={val => setFilters(f => ({ ...f, eligibility: val }))}
            placeholder="All Participants"
            className="w-40 text-xs"
            options={[
              { value: '', label: 'All Participants' },
              { value: 'iiit-only', label: 'IIIT Only' },
              { value: 'non-iiit-only', label: 'Non-IIIT Only' }
            ]}
          />

          <label className="flex items-center gap-2 text-slate-300 text-xs font-medium cursor-pointer select-none ml-2">
            <input
              type="checkbox"
              checked={filters.followedClubs}
              onChange={e => setFilters(f => ({ ...f, followedClubs: e.target.checked }))}
              className="w-4 h-4 rounded text-purple-600 bg-black/40 border-white/10"
            />
            Followed Clubs
          </label>
        </div>
      </div>

      <div className="text-xs text-slate-400 mb-6 font-mono">
        {!loading && <span>{pagination.total} events matching filters</span>}
      </div>

      {loading && events.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            {events.map(event => <EventCard key={event._id} event={event} />)}
          </div>
          
          {events.length === 0 && (
            <div className="text-center py-16 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
              <p className="text-slate-400 text-sm">No events found matching your filter options.</p>
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8 pt-4">
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i}
                  className={`w-9 h-9 rounded-lg border text-sm font-medium transition-all ${
                    pagination.page === i + 1 
                      ? 'bg-white text-black border-white' 
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                  onClick={() => fetchEvents(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BrowseEvents;
