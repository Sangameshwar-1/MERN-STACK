const fs = require('fs');
const path = require('path');

const writeComponent = (relativePath, content) => {
  const fullPath = path.join(__dirname, 'frontend/src', relativePath);
  fs.writeFileSync(fullPath, content.trim());
};

writeComponent('pages/participant/Dashboard.jsx', `
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
    api.get('/participant/dashboard').then(res => {
      setData(res.data);
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
    { header: 'Event Name', render: (reg) => <span className="font-semibold">{reg.event?.eventName}</span> },
    { header: 'Date', render: (reg) => <span className="text-zinc-400">{new Date(reg.event?.eventStartDate).toLocaleDateString()}</span> },
    { header: 'Status', render: (reg) => reg.isCheckedIn ? <Badge variant="success">Attended</Badge> : <Badge variant="secondary">Registered</Badge> },
    { header: 'Actions', render: (reg) => (
      <Link to={\`/ticket/\${reg.ticket?.ticketId}\`}>
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
          <Link to="/events">
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
                <Link to="/events">
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
`);

writeComponent('pages/admin/AdminDashboard.jsx', `
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
import { Users, CalendarDays, Building2, CheckCircle, Settings, FileSearch } from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await api.put(\`/admin/organizers/\${userId}/approve\`);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-pulse">
      <div className="h-10 w-48 bg-zinc-800 rounded-md mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1,2,3,4].map(i => <div key={i} className="h-28 bg-zinc-800 rounded-xl"></div>)}
      </div>
      <div className="h-64 bg-zinc-800 rounded-xl"></div>
    </div>
  );

  const columns = [
    { header: 'Club Name', render: (org) => <span className="font-semibold">{org.name}</span> },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Status', render: () => <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">Pending</Badge> },
    { header: 'Actions', render: (org) => (
      <Button variant="outline" size="sm" onClick={() => handleApprove(org._id)}>
        <CheckCircle className="h-4 w-4 mr-2" /> Approve
      </Button>
    )}
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <PageHeader 
        title="Admin Command Center"
        description="Platform overview and pending approvals."
        actions={
          <div className="flex gap-2">
            <Link to="/admin/organizers">
              <Button variant="outline">Manage Clubs</Button>
            </Link>
            <Link to="/admin/password-resets">
              <Button variant="outline">Security</Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Users" value={data.stats.totalUsers} icon={Users} />
        <StatsCard title="Total Organizers" value={data.stats.totalOrganizers} icon={Building2} />
        <StatsCard title="Total Events" value={data.stats.totalEvents} icon={CalendarDays} />
        <StatsCard title="Pending Approvals" value={data.stats.pendingApprovals} icon={FileSearch} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Organizer Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          {data.pendingOrganizers?.length > 0 ? (
            <DataTable 
              data={data.pendingOrganizers} 
              columns={columns} 
            />
          ) : (
            <EmptyState 
              icon={CheckCircle}
              title="All Caught Up!"
              description="There are no pending organizer applications to review."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
`);

writeComponent('pages/organizer/OrgDashboard.jsx', `
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
    api.get('/organizer/dashboard').then(res => {
      setData(res.data);
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
    { header: 'Registrations', render: (ev) => \`\${ev.currentRegistrations} / \${ev.registrationLimit}\` },
    { header: 'Status', render: (ev) => {
        const isOpen = new Date(ev.registrationDeadline) > new Date() && ev.currentRegistrations < ev.registrationLimit;
        return isOpen ? <Badge variant="success">Open</Badge> : <Badge variant="destructive">Closed</Badge>;
    }},
    { header: 'Action', render: (ev) => (
      <Link to={\`/organizer/events/\${ev._id}\`}>
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
        <StatsCard title="Total Revenue" value={\`₹\${data.stats.totalRevenue}\`} icon={Banknote} />
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
`);

console.log('Dashboards refactored.');
