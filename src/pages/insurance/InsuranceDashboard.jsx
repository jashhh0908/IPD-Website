import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import useToast from '../../hooks/useToast';
import { claimService } from '../../services/claimService';
import { formatDate, formatINR } from '../../utils/helpers';
import { ROUTES } from '../../constants/routes';

export default function InsuranceDashboard() {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [claims, setClaims] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError('');
        const claimsData = await claimService.getClaims(filter);
        const statsData = await claimService.getInsuranceStats();
        
        setClaims(claimsData);
        setStats(statsData);
      } catch (err) {
        setError(err.message || 'Failed to load claims.');
        toast('Error loading insurance claims', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [filter, toast]);

  return (
    <>
      <Header title="Claims Review System" />
      <div className="page-content">
        <div className="page-header">
          <h1>Insurance Claims Queue</h1>
          <p>Assess, verify, and resolve claims generated automatically by Sentry camera incident logs.</p>
        </div>

        {/* Insurance Metrics */}
        {stats && (
          <div className="grid-4">
            <StatCard label="Total Claims Filed" value={stats.totalClaims} icon="📝" iconBg="var(--color-accent-blue-muted)" iconColor="var(--color-accent-blue)" />
            <StatCard label="Pending Audit" value={stats.pendingReview} icon="⏳" iconBg="var(--color-accent-amber-muted)" iconColor="var(--color-accent-amber)" change="Awaiting adjuster audit" />
            <StatCard label="Approved (Month)" value={stats.approvedThisMonth} icon="✓" iconBg="rgba(90, 154, 107, 0.12)" iconColor="var(--color-accent-green)" />
            <StatCard label="Total Claims Paid" value={formatINR(stats.totalDisbursed)} icon="₹" iconBg="var(--color-accent-purple-muted)" iconColor="var(--color-accent-purple)" />
          </div>
        )}

        {/* Claim Queue Table */}
        <div className="card" style={{ marginTop: 'var(--space-6)' }}>
          <div className="card-header" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ margin: 0 }}>Claims Assessment Queue</h3>
            
            {/* Reusable status tab bar filter */}
            <div style={{ display: 'flex', gap: '4px', background: 'var(--color-bg-primary)', padding: '2px', borderRadius: 'var(--radius-md)' }}>
              {['all', 'pending', 'approved', 'denied'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--text-xs)',
                    padding: '4px 10px',
                    textTransform: 'capitalize',
                    background: filter === f ? 'var(--color-accent-amber)' : 'transparent',
                    color: filter === f ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)'
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', minHeight: '30vh', justifyContent: 'center', alignItems: 'center' }}>
              <Spinner size="md" />
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', color: 'var(--color-accent-red)', padding: 'var(--space-6)' }}>{error}</div>
          ) : claims.length === 0 ? (
            <EmptyState 
              title="No Claims Found" 
              message="No insurance claims match the selected status filter." 
            />
          ) : (
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Claim ID</th>
                    <th scope="col">Policy Holder</th>
                    <th scope="col">Policy Number</th>
                    <th scope="col">Date Filed</th>
                    <th scope="col">Requested</th>
                    <th scope="col">Severity</th>
                    <th scope="col">Status</th>
                    <th scope="col" style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((claim) => (
                    <tr key={claim.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)' }}>
                        {claim.id}
                      </td>
                      <td style={{ fontSize: 'var(--text-sm)' }}>
                        {claim.policyHolder}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                        {claim.policyNumber}
                      </td>
                      <td style={{ fontSize: 'var(--text-xs)', whiteSpace: 'nowrap' }}>
                        {formatDate(claim.dateSubmitted)}
                      </td>
                      <td style={{ fontVariantNumeric: 'tabular-nums', fontWeight: '500' }}>
                        {formatINR(claim.amountRequested)}
                      </td>
                      <td>
                        <StatusBadge type="severity" value={claim.severity} />
                      </td>
                      <td>
                        <StatusBadge type="status" value={claim.status} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => navigate(ROUTES.insurance.CLAIM_REVIEW(claim.id))}
                          aria-label={`Audit claim ${claim.id}`}
                        >
                          {claim.status.toLowerCase().includes('pending') ? 'Audit →' : 'View →'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
