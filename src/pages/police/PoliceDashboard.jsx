import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import StatCard from '../../components/ui/StatCard';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import IncidentTable from '../../components/ui/IncidentTable';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import { reportService } from '../../services/reportService';
import { ROUTES } from '../../constants/routes';

export default function PoliceDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        setError('');
        // Fetch only within officer's jurisdiction (e.g. Mumbai)
        const reports = await reportService.getReports({ jurisdiction: user.jurisdiction });
        const aggregatedStats = await reportService.getPoliceStats(user.jurisdiction);
        
        setIncidents(reports);
        setStats(aggregatedStats);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data.');
        toast('Error loading dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user.jurisdiction, toast]);

  if (loading) {
    return (
      <>
        <Header title="Operations Overview" />
        <div style={{ display: 'flex', flex: 1, minHeight: '60vh', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner size="lg" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header title="Operations Overview" />
        <div className="page-content">
          <div 
            style={{ 
              padding: 'var(--space-4)', 
              background: 'var(--color-accent-red-muted)', 
              border: '1px solid var(--color-accent-red)', 
              color: 'var(--color-accent-red)', 
              borderRadius: 'var(--radius-md)', 
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--weight-medium)',
              textAlign: 'center'
            }}
          >
            {error}
          </div>
        </div>
      </>
    );
  }

  const activeCasesCount = incidents.filter(i => i.status !== 'Closed').length;
  const criticalCasesCount = incidents.filter(i => i.severity === 'Critical').length;

  return (
    <>
      <Header title="Operations Overview" />
      <div className="page-content">
        <div className="page-header">
          <h1>Sentry Dispatch Command</h1>
          <p>Real-time telemetry and dispatch feed for Bandra PS, Mumbai.</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid-4">
            <StatCard 
              label="Total Accidents" 
              value={stats.totalIncidents} 
              icon="🚨" 
              iconBg="var(--color-accent-amber-muted)" 
              iconColor="var(--color-accent-amber)" 
            />
            <StatCard 
              label="Active Investigations" 
              value={activeCasesCount} 
              icon="🔍" 
              iconBg="var(--color-accent-blue-muted)" 
              iconColor="var(--color-accent-blue)" 
              change={`${incidents.filter(i => i.status === 'Open').length} unassigned`}
            />
            <StatCard 
              label="Critical (This Month)" 
              value={criticalCasesCount} 
              icon="⚠️" 
              iconBg="var(--color-accent-red-muted)" 
              iconColor="var(--color-accent-red)" 
              change="Requires priority dispatch"
              changeDir="down"
            />
            <StatCard 
              label="Average Response Time" 
              value={stats.avgResponseTime} 
              icon="⏱️" 
              iconBg="rgba(90, 154, 107, 0.12)" 
              iconColor="var(--color-accent-green)" 
              change="Detection to scene arrival"
            />
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
          {/* Main Feed */}
          <div className="card" style={{ minWidth: 0 }}>
            <div className="card-header">
              <h3>Recent Incidents ({incidents.length})</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate(ROUTES.police.REPORTS)}>
                View Directory →
              </button>
            </div>

            {incidents.length === 0 ? (
              <EmptyState title="No active incidents" message="No accidents detected within this jurisdiction." />
            ) : (
              <IncidentTable 
                incidents={incidents.slice(0, 5)} 
                onViewDetails={(id) => navigate(ROUTES.police.REPORT_DETAIL(id))} 
              />
            )}
          </div>

          {/* Sidebar Telemetry */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* System Performance */}
            <div className="card">
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>
                System Status
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {[
                  { label: 'Camera Network', val: `${stats?.camerasActive} Online`, status: 'green' },
                  { label: 'Network Outages', val: `${stats?.camerasOffline} Cameras`, status: stats?.camerasOffline > 0 ? 'red' : 'green' },
                  { label: 'YOLOv8 ML Engine', val: 'Operational', status: 'green' },
                  { label: 'False Positives', val: '2.8%', status: 'green' }
                ].map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{item.label}</span>
                    <span style={{ fontWeight: '500', color: item.status === 'green' ? 'var(--color-accent-green)' : 'var(--color-accent-red)' }}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Dispatch Contacts */}
            <div className="card">
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>
                Bandra Dispatch
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
                <div style={{ padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>Bandra Traffic Police Division</div>
                  <div style={{ color: 'var(--color-text-muted)', marginTop: '2px' }}>022-2640-XXXX</div>
                </div>
                <div style={{ padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>Emergency Medical Helpline</div>
                  <div style={{ color: 'var(--color-text-muted)', marginTop: '2px' }}>108 / 112</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
