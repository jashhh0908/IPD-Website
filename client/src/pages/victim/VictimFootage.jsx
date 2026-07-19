import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Spinner from '../../components/common/Spinner';
import MockVideoPlayer from '../../components/ui/MockVideoPlayer';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import { victimService } from '../../services/victimService';
import { formatDateTime } from '../../utils/helpers';

export default function VictimFootage() {
  const { user } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accident, setAccident] = useState(null);

  useEffect(() => {
    async function loadAccident() {
      try {
        setLoading(true);
        setError('');
        const data = await victimService.getVictimAccident(user.id);
        setAccident(data);
      } catch (err) {
        setError(err.message || 'Failed to retrieve incident logs.');
        toast('Error loading footage records', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadAccident();
  }, [user.id, toast]);

  const handleDownload = () => {
    toast('Snapshot download started.', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <>
        <Header title="Camera Playback" />
        <div style={{ display: 'flex', flex: 1, minHeight: '60vh', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner size="lg" />
        </div>
      </>
    );
  }

  if (error || !accident) {
    return (
      <>
        <Header title="Camera Playback" />
        <div className="page-content">
          <div style={{ textAlign: 'center', color: 'var(--color-accent-red)', padding: 'var(--space-6)' }}>{error || 'Unable to retrieve case footage.'}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Incident Recording" breadcrumb="Citizen / Video Footage" />
      <div className="page-content">
        <div className="page-header">
          <h1>Sentry Traffic Recording</h1>
          <p>Recorded video footage from the camera that logged your incident.</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Camera Stream Playback — {accident.cameraId}</h3>
          </div>

          <MockVideoPlayer cameraId={accident.cameraId} />

          <div style={{ marginTop: 'var(--space-6)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
            {[
              ['Camera ID', accident.cameraId],
              ['Recording Timestamp', formatDateTime(accident.date)],
              ['Location Landmark', accident.location],
              ['Detection Model', accident.detectedBy],
              ['Telemetry Confidence', `${(accident.mlConfidence * 100).toFixed(0)}%`],
              ['Pose Presence Status', accident.poseDetected ? 'Person detected in scene' : 'No person detected'],
            ].map(([lbl, val], idx) => (
              <div key={idx} className="detail-field">
                <span className="detail-field-label">{lbl}</span>
                <span className="detail-field-value">{val}</span>
              </div>
            ))}
          </div>

          <div className="no-print" style={{ marginTop: 'var(--space-5)', display: 'flex', gap: 'var(--space-3)' }}>
            <button className="btn btn-secondary" onClick={handleDownload}>
              ⤓ Download Snapshot
            </button>
            <button className="btn btn-secondary" onClick={handlePrint}>
              ⎙ Print Details
            </button>
          </div>
        </div>

        <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', background: 'var(--color-bg-card)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-normal)' }}>
          <strong>Legal Retention Policy Notice:</strong> Traffic camera recordings are preserved for 90 days from the timestamp of detection under Bandra PS regulation policy. If you require long-term archivals for courts or insurer proceedings, please download a signed copy or request it through your investigating officer.
        </div>
      </div>
    </>
  );
}
