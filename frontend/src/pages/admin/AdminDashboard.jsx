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
      const res = await api.get('/admin/stats');
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
      setData({ totalParticipants: 0, totalOrganizers: 0, totalEvents: 0, pendingResets: 0 });
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await api.put(`/admin/organizers/${userId}/approve`);
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
        <StatsCard title="Total Participants" value={data.totalParticipants} icon={Users} />
        <StatsCard title="Total Organizers" value={data.totalOrganizers} icon={Building2} />
        <StatsCard title="Total Events" value={data.totalEvents} icon={CalendarDays} />
        <StatsCard title="Pending Resets" value={data.pendingResets} icon={FileSearch} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState 
            icon={CheckCircle}
            title="System Operating Normally"
            description="Manage clubs and security requests from the navigation above."
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;