import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Spinner from '../../components/common/Spinner';
import AccidentMap from '../../components/ui/AccidentMap';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import { reportService } from '../../services/reportService';

export default function PoliceMap() {
  const { user } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    async function loadMapData() {
      try {
        setLoading(true);
        setError('');
        // Fetch only within officer's jurisdiction (e.g. Mumbai)
        const reports = await reportService.getReports({ jurisdiction: user.jurisdiction });
        setIncidents(reports);
      } catch (err) {
        setError(err.message || 'Failed to load map incidents.');
        toast('Error loading map coordinates', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadMapData();
  }, [user.jurisdiction, toast]);

  return (
    <>
      <Header title="Live Accident Map" breadcrumb="Police / Live Map" />
      <div className="page-content">
        <div className="page-header">
          <h1>Interactive GIS Map</h1>
          <p>Real-time spatial visualization of traffic accidents in the Mumbai jurisdiction.</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', minHeight: '50vh', justifyContent: 'center', alignItems: 'center' }}>
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div 
            style={{ 
              padding: 'var(--space-4)', 
              background: 'var(--color-accent-red-muted)', 
              border: '1px solid var(--color-accent-red)', 
              color: 'var(--color-accent-red)', 
              borderRadius: 'var(--radius-md)', 
              textAlign: 'center' 
            }}
          >
            {error}
          </div>
        ) : (
          <AccidentMap accidents={incidents} />
        )}
      </div>
    </>
  );
}
