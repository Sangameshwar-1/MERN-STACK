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
      <div className="h-10 w-48 bg-zinc-800 rounded-md mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1,2,3].map(i => <div key={i} className="h-28 bg-zinc-800 rounded-xl"></div>)}
      </div>
      <div className="h-64 bg-zinc-800 rounded-xl"></div>
    </div>
  );

  const columns = [
    { header: 'Event Name', render: (ev) => <span className="font-semibold">{ev.eventName}</span> },
    { header: 'Date', render: (ev) => <span className="text-zinc-400">{new Date(ev.eventStartDate).toLocaleDateString()}</span> },
    { header: 'Registrations', render: (ev) => `${ev.currentRegistrations} / ${ev.registrationLimit}` },
    { header: 'Status', render: (ev) => {
        const isOpen = new Date(ev.registrationDeadline) > new Date() && ev.currentRegistrations < ev.registrationLimit;
        return isOpen ? <Badge variant="success">Open</Badge> : <Badge variant="destructive">Closed</Badge>;
    }},
    { header: 'Action', render: (ev) => (
      <Link to={`/organizer/events/${ev._id}`}>
        <Button variant="ghost" size="sm">Manage</Button>
      </Link>
    )}
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <PageHeader 
        title="Organizer Dashboard"
        description="Manage your events and view analytics."
        actions={
          <Link to="/organizer/events/new">
            <Button>
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

      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentEvents?.length > 0 ? (
            <DataTable 
              data={data.recentEvents} 
              columns={columns} 
            />
          ) : (
            <EmptyState 
              icon={SearchX}
              title="No events yet"
              description="Get started by creating your first event."
              action={
                <Link to="/organizer/events/new">
                  <Button variant="outline">Create Event</Button>
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