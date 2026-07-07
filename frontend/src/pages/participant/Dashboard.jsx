import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatsCard } from '../../components/ui/StatsCard';
import { DataTable } from '../../components/ui/DataTable';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
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
      // Fallback empty state so the UI doesn't crash if the API fails
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

  const columns = [
    { header: 'Event Name', render: (reg) => <span className="font-semibold">{reg.event?.eventName}</span> },
    { header: 'Date', render: (reg) => <span className="text-slate-400">{new Date(reg.event?.eventStartDate).toLocaleDateString()}</span> },
    { header: 'Status', render: (reg) => reg.isCheckedIn ? <Badge variant="success">Attended</Badge> : <Badge variant="secondary">Registered</Badge> },
    { header: 'Actions', render: (reg) => (
      <Link to={`/ticket/${reg.ticket?.ticketId}`}>
        <Button variant="ghost" size="sm">View Ticket</Button>
      </Link>
    )}
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <PageHeader 
        title="Participant Dashboard"
        description="View your upcoming events and manage registrations."
        actions={
          <Link to="/participant/events">
            <Button>Browse Events</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Total Registrations" value={data.stats.totalRegistrations} icon={Ticket} />
        <StatsCard title="Upcoming Events" value={data.stats.upcomingEvents} icon={Calendar} />
        <StatsCard title="Events Attended" value={data.stats.attendedEvents} icon={CheckCircle} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentRegistrations?.length > 0 ? (
            <DataTable 
              data={data.recentRegistrations} 
              columns={columns} 
            />
          ) : (
            <EmptyState 
              icon={SearchX}
              title="No registrations found"
              description="You haven't registered for any upcoming events yet."
              action={
                <Link to="/participant/events">
                  <Button variant="outline">Explore Events</Button>
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