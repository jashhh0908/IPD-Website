import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import StatCard from '../../components/ui/StatCard';
import Spinner from '../../components/common/Spinner';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import { reportService } from '../../services/reportService';

export default function PoliceAnalytics() {
  const { user } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        setError('');
        const data = await reportService.getPoliceStats(user.jurisdiction);
        setStats(data);
      } catch (err) {
        setError(err.message || 'Failed to load statistical reports.');
        toast('Error loading analytics', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [user.jurisdiction, toast]);

  if (loading) {
    return (
      <>
        <Header title="Analytics &amp; Insights" />
        <div style={{ display: 'flex', flex: 1, minHeight: '60vh', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner size="lg" />
        </div>
      </>
    );
  }

  if (error || !stats) {
    return (
      <>
        <Header title="Analytics &amp; Insights" />
        <div className="page-content">
          <div style={{ textAlign: 'center', color: 'var(--color-accent-red)', padding: 'var(--space-6)' }}>{error || 'Stats unavailable.'}</div>
        </div>
      </>
    );
  }

  const maxCount = Math.max(...stats.monthlyTrend.map(m => m.count));
  const totalSeverity = Object.values(stats.severityBreakdown).reduce((a, b) => a + b, 0);

  return (
    <>
      <Header title="Analytics &amp; Insights" />
      <div className="page-content">
        <div className="page-header">
          <h1>Analytics &amp; Insights</h1>
          <p>Statistical telemetry for traffic incident analysis in the Mumbai jurisdiction.</p>
        </div>

        {/* Core Stats */}
        <div className="grid-4">
          <StatCard label="Total Detections" value={stats.totalIncidents} icon="📈" iconBg="var(--color-accent-blue-muted)" iconColor="var(--color-accent-blue)" />
          <StatCard label="Investigations Closed" value={stats.closedThisMonth} icon="✓" iconBg="var(--color-accent-green-muted)" iconColor="var(--color-accent-green)" change="Within 30 days" />
          <StatCard label="Conviction Rate" value={stats.convictionRate} icon="⚖" iconBg="var(--color-accent-amber-muted)" iconColor="var(--color-accent-amber)" />
          <StatCard label="Active Cameras" value={stats.camerasActive} icon="📹" iconBg="var(--color-accent-purple-muted)" iconColor="var(--color-accent-purple)" />
        </div>

        {/* Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
          
          {/* Monthly Trend Chart */}
          <div className="card">
            <div className="card-header">
              <h3>Monthly Detection Trend</h3>
            </div>
            <div className="bar-chart" style={{ height: '220px', display: 'flex', alignItems: 'flex-end' }}>
              {stats.monthlyTrend.map((m) => {
                const heightPercentage = maxCount > 0 ? (m.count / maxCount) * 100 : 0;
                return (
                  <div className="bar-chart-item" key={m.month}>
                    <span className="bar-chart-value">{m.count}</span>
                    <div 
                      className="bar-chart-bar" 
                      style={{ height: `${heightPercentage}%`, width: '28px' }} 
                      title={`${m.month}: ${m.count} incidents`}
                    />
                    <span className="bar-chart-label">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Severity Breakdown */}
          <div className="card">
            <div className="card-header">
              <h3>Severity Classifications</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
              {Object.entries(stats.severityBreakdown).map(([key, val]) => {
                const percentage = totalSeverity > 0 ? ((val / totalSeverity) * 100).toFixed(1) : 0;
                return (
                  <div key={key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: 'var(--text-sm)' }}>
                      <span style={{ fontWeight: 'var(--weight-medium)', textTransform: 'capitalize', color: 'var(--color-text-primary)' }}>
                        {key}
                      </span>
                      <span style={{ color: 'var(--color-text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                        {val} ({percentage}%)
                      </span>
                    </div>
                    {/* Reusable Progress bar */}
                    <div style={{ height: '8px', background: 'var(--color-bg-primary)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          width: `${percentage}%`, 
                          background: `var(--color-severity-${key})`, 
                          borderRadius: '4px',
                          transition: 'width 0.5s ease-out' 
                        }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hotspots & Contributing Factors */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
          {/* Top Accident Hotspots */}
          <div className="card">
            <div className="card-header">
              <h3>Accident Hotspots</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {stats.topLocations.map((loc, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--space-3)', 
                    padding: 'var(--space-2) 0', 
                    borderBottom: idx < stats.topLocations.length - 1 ? '1px solid var(--color-border)' : 'none', 
                    fontSize: 'var(--text-sm)' 
                  }}
                >
                  <span 
                    style={{ 
                      width: '20px', 
                      height: '20px', 
                      borderRadius: '50%', 
                      background: 'var(--color-bg-tertiary)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: 'var(--text-xs)', 
                      fontWeight: '600', 
                      color: 'var(--color-text-muted)',
                      flexShrink: 0 
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span style={{ flex: 1, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {loc.name}
                  </span>
                  <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--color-accent-amber)', fontWeight: '600' }}>
                    {loc.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Model Statistics */}
          <div className="card">
            <div className="card-header">
              <h3>YOLOv8 Detection Accuracy</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { label: 'Estimated Speeding', value: '45% of cases' },
                { label: 'Signal Violation', value: '28% of cases' },
                { label: 'Low Visibility/Night', value: '18% of cases' },
                { label: 'Wet/Damp Roads', value: '9% of cases' }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{item.label}</span>
                  <span style={{ color: 'var(--color-text-primary)', fontWeight: '500' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
