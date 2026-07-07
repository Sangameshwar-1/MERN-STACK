import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatsCard } from '../../components/ui/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Ticket, Calendar, CheckCircle, SearchX } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/participants/dashboard').then(res => {
      setData(res.data);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load dashboard:', err);
      setData({ stats: { totalRegistrations: 0, upcomingEvents: 0, attendedEvents: 0 }, recentRegistrations: [] });
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
        title="Participant Dashboard"
        description="View your upcoming events and manage registrations."
        actions={
          <Link to="/participant/events">
            <Button className="rounded-xl">Browse Events</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Total Registrations" value={data.stats.totalRegistrations} icon={Ticket} />
        <StatsCard title="Upcoming Events" value={data.stats.upcomingEvents} icon={Calendar} />
        <StatsCard title="Events Attended" value={data.stats.attendedEvents} icon={CheckCircle} />
      </div>

      <Card className="rounded-2xl border border-white/10 bg-[#09090b]">
        <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
          <CardTitle className="text-lg font-semibold text-white">Recent Registrations</CardTitle>
          {data.recentRegistrations?.length > 0 && (
            <Link to="/participant/events" className="text-xs text-slate-400 hover:text-white transition-colors">
              View all
            </Link>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          {data.recentRegistrations?.length > 0 ? (
            <div className="space-y-4">
              {data.recentRegistrations.map(reg => {
                const isAttended = reg.isCheckedIn;
                return (
                  <div 
                    key={reg._id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white/[0.01] border border-white/5 rounded-xl hover:bg-white/[0.03] transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-white text-base">{reg.event?.eventName}</h3>
                        <span className={`text-[10px] py-0.5 px-2 rounded-full uppercase border font-medium ${
                          isAttended 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        }`}>
                          {isAttended ? 'Attended' : 'Registered'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                        <span>{new Date(reg.event?.eventStartDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center w-full sm:w-auto">
                      <Link 
                        to={`/ticket/${reg.ticket?.ticketId}`} 
                        className="w-full sm:w-auto text-center bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-all"
                      >
                        View Ticket
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState 
              icon={SearchX}
              title="No registrations found"
              description="You haven't registered for any upcoming events yet."
              action={
                <Link to="/participant/events">
                  <Button variant="outline" className="rounded-xl">Explore Events</Button>
                </Link>
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;