import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import IncidentTable from '../../components/ui/IncidentTable';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import { reportService } from '../../services/reportService';
import { ROUTES } from '../../constants/routes';

export default function PoliceReports() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reports, setReports] = useState([]);
  
  // Filters
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('all');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        setError('');
        const data = await reportService.getReports({
          jurisdiction: user.jurisdiction,
          search,
          severity,
          status
        });
        setReports(data);
      } catch (err) {
        setError(err.message || 'Failed to load incident reports.');
        toast('Error loading reports', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, [user.jurisdiction, search, severity, status, toast]);

  const handleClearFilters = () => {
    setSearch('');
    setSeverity('all');
    setStatus('all');
    toast('Filters cleared', 'info');
  };

  return (
    <>
      <Header title="Incident Directory" />
      <div className="page-content">
        <div className="page-header">
          <h1>Incident Directory</h1>
          <p>Search, filter, and review Sentry camera detections in the Mumbai jurisdiction.</p>
        </div>

        {/* Filter Controls Card */}
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 200px auto', gap: 'var(--space-4)', alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="search">Search Case / Location</label>
              <input 
                type="text" 
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Case ID, location keywords..."
                aria-label="Search reports"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="severity">Severity</label>
              <select 
                id="severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                aria-label="Filter by severity"
              >
                <option value="all">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Moderate">Moderate</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="status">Case Status</label>
              <select 
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                aria-label="Filter by status"
              >
                <option value="all">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Under Investigation">Under Investigation</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <button 
                className="btn btn-secondary" 
                onClick={handleClearFilters}
                style={{ width: '100%', height: '38px' }}
                disabled={!search && severity === 'all' && status === 'all'}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Reports Table Card */}
        <div className="card">
          {loading ? (
            <div style={{ display: 'flex', minHeight: '30vh', justifyContent: 'center', alignItems: 'center' }}>
              <Spinner size="md" />
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-accent-red)' }}>{error}</div>
          ) : reports.length === 0 ? (
            <EmptyState 
              title="No Detections Match Filters" 
              message="Try adjustments to search queries or filters to find incidents."
            >
              <button className="btn btn-primary btn-sm" onClick={handleClearFilters}>
                Reset Search
              </button>
            </EmptyState>
          ) : (
            <IncidentTable 
              incidents={reports} 
              onViewDetails={(id) => navigate(ROUTES.police.REPORT_DETAIL(id))} 
              showCamera={true}
            />
          )}
        </div>
      </div>
    </>
  );
}
