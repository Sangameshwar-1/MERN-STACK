import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatsCard } from '../../components/ui/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { CalendarDays, Users, Banknote, Plus, SearchX } from 'lucide-react';

const OrgDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events/organizer/dashboard').then(res => {
      setData(res.data);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load org dashboard:', err);
      setData({ stats: { totalEvents: 0, totalParticipants: 0, totalRevenue: 0 }, recentEvents: [] });
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-pulse">
      <div className="h-10 w-48 bg-white/[0.05] rounded-md mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1,2,3].map(i => <div key={i} className="h-28 bg-white/[0.05] rounded-xl"></div>)}
      </div>
      <div className="h-64 bg-white/[0.05] rounded-xl"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animated-fade">
      <PageHeader 
        title="Organizer Dashboard"
        description="Track metrics and configure your active club events."
        actions={
          <Link to="/organizer/events/new">
            <Button className="rounded-xl">
              <Plus className="mr-2 h-4 w-4" /> Create Event
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Total Events" value={data.stats.totalEvents} icon={CalendarDays} />
        <StatsCard title="Total Participants" value={data.stats.totalParticipants} icon={Users} />
        <StatsCard title="Total Revenue" value={`₹${data.stats.totalRevenue}`} icon={Banknote} />
      </div>

      <Card className="rounded-2xl border border-white/10 bg-[#09090b]">
        <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
          <CardTitle className="text-lg font-semibold text-white">Recent Events</CardTitle>
          {data.recentEvents?.length > 0 && (
            <Link to="/organizer/events" className="text-xs text-slate-400 hover:text-white transition-colors">
              View all
            </Link>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          {data.recentEvents?.length > 0 ? (
            <div className="space-y-4">
              {data.recentEvents.map(event => {
                const isOpen = new Date(event.registrationDeadline) > new Date() && event.currentRegistrations < event.registrationLimit;
                return (
                  <div 
                    key={event._id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white/[0.01] border border-white/5 rounded-xl hover:bg-white/[0.03] transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-white text-base">{event.eventName}</h3>
                        <span className={`text-[10px] py-0.5 px-2 rounded-full uppercase border font-medium ${
                          isOpen 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {isOpen ? 'Open' : 'Closed'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                        <span>{new Date(event.eventStartDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                        <span className="hidden sm:inline h-3 w-px bg-white/10"></span>
                        <span>{event.currentRegistrations} / {event.registrationLimit || '∞'} registrations</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center w-full sm:w-auto">
                      <Link 
                        to={`/organizer/events/${event._id}`} 
                        className="w-full sm:w-auto text-center bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-all"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState 
              icon={SearchX}
              title="No events yet"
              description="Get started by creating your first event."
              action={
                <Link to="/organizer/events/new">
                  <Button variant="outline" className="rounded-xl">Create Event</Button>
                </Link>
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrgDashboard;