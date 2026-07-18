import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import StatusBadge from '../../components/ui/StatusBadge';
import Spinner from '../../components/common/Spinner';
import Timeline from '../../components/ui/Timeline';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import { victimService } from '../../services/victimService';
import { formatDateTime, formatINR } from '../../utils/helpers';

export default function VictimDashboard() {
  const { user } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [accident, setAccident] = useState(null);
  const [claim, setClaim] = useState(null);

  useEffect(() => {
    async function loadVictimData() {
      try {
        setLoading(true);
        setError('');
        
        // Fetch victim's specific accident record
        const accidentData = await victimService.getVictimAccident(user.id);
        setAccident(accidentData);

        // Fetch corresponding claim status
        if (accidentData.id) {
          const claimData = await victimService.getVictimClaim(accidentData.id);
          setClaim(claimData);
        }

      } catch (err) {
        setError(err.message || 'Failed to load case data.');
        toast('Error loading case data', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadVictimData();
  }, [user.id, toast]);

  if (loading) {
    return (
      <>
        <Header title="My Case Details" />
        <div style={{ display: 'flex', flex: 1, minHeight: '60vh', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner size="lg" />
        </div>
      </>
    );
  }

  if (error || !accident) {
    return (
      <>
        <Header title="My Case Details" />
        <div className="page-content">
          <div style={{ textAlign: 'center', color: 'var(--color-accent-red)', padding: 'var(--space-6)' }}>{error || 'Unable to retrieve case.'}</div>
        </div>
      </>
    );
  }

  // Define steps for the visual timeline
  const timelineSteps = [
    { label: 'Incident Detected', time: accident.timestamps?.detected, status: 'completed' },
    { label: 'Alert Dispatched', time: accident.timestamps?.alertSent, status: 'completed' },
    { label: 'Police Notified', time: accident.timestamps?.policeNotified, status: 'completed' },
    { label: 'Police Arrived on Scene', time: accident.timestamps?.policeArrived, status: 'completed' },
    { label: 'FIR Filed', time: accident.timestamps?.reportFiled, status: 'completed' },
    { 
      label: 'Under Investigation', 
      time: null, 
      status: accident.status.toLowerCase().includes('investigation') 
        ? 'active' 
        : accident.status.toLowerCase() === 'closed' 
          ? 'completed' 
          : 'pending' 
    },
    { 
      label: 'Case Resolution', 
      time: null, 
      status: accident.status.toLowerCase() === 'closed' ? 'completed' : 'pending' 
    },
  ];

  return (
    <>
      <Header title="Case Summary" breadcrumb="Citizen / Case Summary" />
      <div className="page-content">
        <div className="page-header">
          <h1>My Case Telemetry</h1>
          <p>Real-time status updates and details regarding your accident incident reports.</p>
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-6)' }}>
          
          {/* Main Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', minWidth: 0 }}>
            {/* Case details card */}
            <div className="card">
              <div className="card-header">
                <h3>Incident Information</h3>
                <StatusBadge type="severity" value={accident.severity} />
              </div>
              <div className="detail-description">{accident.description}</div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
                {[
                  ['Case ID', accident.caseId],
                  ['Accident ID', accident.id],
                  ['Date & Time', formatDateTime(accident.date)],
                  ['Location', accident.location],
                  ['Assigned Officer', accident.officerAssigned],
                  ['Investigation Status', accident.status],
                  ['Response Time', accident.responseTime],
                  ['Detected By', accident.detectedBy],
                ].map(([label, value], idx) => (
                  <div key={idx} className="detail-field">
                    <span className="detail-field-label">{label}</span>
                    <span className="detail-field-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Insurance details card */}
            {claim && (
              <div className="card">
                <div className="card-header">
                  <h3>Insurance Claim Status</h3>
                  <StatusBadge type="status" value={claim.status} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
                  {[
                    ['Claim ID', claim.id],
                    ['Policy Number', claim.policyNumber],
                    ['Requested Compensation', formatINR(claim.amountRequested)],
                    ['Disbursed Amount', claim.compensationAmount !== undefined ? formatINR(claim.compensationAmount) : 'N/A'],
                    ['Date Submitted', formatDateTime(claim.dateSubmitted)],
                    ['Audited By', claim.reviewedBy || 'Pending Adjuster Audit'],
                  ].map(([label, value], idx) => (
                    <div key={idx} className="detail-field">
                      <span className="detail-field-label">{label}</span>
                      <span className="detail-field-value">{value}</span>
                    </div>
                  ))}
                </div>
                
                {claim.reviewNotes && (
                  <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '2px', fontWeight: '500' }}>
                      Adjuster Review Notes
                    </div>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontStyle: 'italic', lineHeight: 'var(--leading-normal)' }}>
                      "{claim.reviewNotes}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right sidebar details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            
            {/* Case Progress Timeline */}
            <div className="card">
              <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 'var(--space-4)' }}>
                Case Progress Timeline
              </h3>
              <Timeline steps={timelineSteps} />
            </div>

            {/* Jurisdiction PS details */}
            <div className="card">
              <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 'var(--space-3)' }}>
                Contact Information
              </h3>
              <div className="detail-field">
                <span className="detail-field-label">Assigned Officer</span>
                <span className="detail-field-value">{accident.officerAssigned}</span>
              </div>
              <div className="detail-field">
                <span className="detail-field-label">Station Command</span>
                <span className="detail-field-value">Bandra PS</span>
              </div>
              <div className="detail-field" style={{ borderBottom: 'none' }}>
                <span className="detail-field-label">National Emergency Helpline</span>
                <span className="detail-field-value" style={{ color: 'var(--color-accent-red)', fontWeight: '600' }}>112</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
