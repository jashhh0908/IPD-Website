import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import StatusBadge from '../../components/ui/StatusBadge';
import Spinner from '../../components/common/Spinner';
import Timeline from '../../components/ui/Timeline';
import MockVideoPlayer from '../../components/ui/MockVideoPlayer';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import { reportService } from '../../services/reportService';
import { formatDateTime } from '../../utils/helpers';
import { ROUTES } from '../../constants/routes';

export default function PoliceReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [report, setReport] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const reportRef = useRef();

  useEffect(() => {
    async function loadReport() {
      try {
        setLoading(true);
        setError('');
        const data = await reportService.getReportById(id, user.jurisdiction);
        setReport(data);
      } catch (err) {
        setError(err.message || 'Failed to load report details.');
        toast('Error loading report', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [id, user.jurisdiction, toast]);

  const handlePrint = () => {
    setShowReport(true);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  if (loading) {
    return (
      <>
        <Header title="Case Details" breadcrumb="Police / Reports" />
        <div style={{ display: 'flex', flex: 1, minHeight: '60vh', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner size="lg" />
        </div>
      </>
    );
  }

  if (error || !report) {
    return (
      <>
        <Header title="Case Details" breadcrumb="Police / Reports" />
        <div className="page-content">
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
            <h3 style={{ color: 'var(--color-accent-red)', marginBottom: 'var(--space-3)' }}>Error</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>{error || 'Unable to find report.'}</p>
            <button className="btn btn-secondary" onClick={() => navigate(ROUTES.police.REPORTS)}>
              Back to Reports
            </button>
          </div>
        </div>
      </>
    );
  }

  const timelineSteps = [
    { label: 'Incident Detected', time: report.timestamps?.detected },
    { label: 'Alert Dispatched', time: report.timestamps?.alertSent },
    { label: 'Police Notified', time: report.timestamps?.policeNotified },
    { label: 'Police Arrived on Scene', time: report.timestamps?.policeArrived },
    { label: 'FIR Filed', time: report.timestamps?.reportFiled },
  ];

  return (
    <>
      <Header title={report.caseId} breadcrumb="Police / Incident Reports" />
      <div className="page-content">
        
        {/* Back and Print buttons */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
          <button className="btn btn-secondary" onClick={() => navigate(ROUTES.police.REPORTS)}>
            ← Back to Directory
          </button>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                setShowReport(prev => !prev);
                toast(showReport ? 'FIR view closed' : 'FIR view loaded below', 'info');
              }}
            >
              📄 {showReport ? 'Hide FIR Draft' : 'Draft FIR'}
            </button>
            <button className="btn btn-primary" onClick={handlePrint}>
              ⎙ Print Report
            </button>
          </div>
        </div>

        {/* Layout grid */}
        <div className="no-print" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-6)' }}>
          {/* Main Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', minWidth: 0 }}>
            {/* Camera Footage */}
            <div className="card">
              <div className="card-header" style={{ marginBottom: 'var(--space-4)' }}>
                <h3>Sentry Camera Recording</h3>
                <StatusBadge type="severity" value={report.severity} />
              </div>
              <MockVideoPlayer cameraId={report.cameraId} />
              <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                <span>GPS: {report.lat}, {report.lng}</span>
                <span>Camera ID: {report.cameraId}</span>
                <span>Detected via: {report.detectedBy}</span>
              </div>
            </div>

            {/* Description */}
            <div className="card">
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>
                Telemetry Log &amp; Description
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
                {report.description}
              </p>
            </div>

            {/* Vehicles Involved */}
            <div className="card">
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>
                Vehicles Involved ({report.vehicles.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {report.vehicles.map((v, idx) => (
                  <div key={idx} style={{ padding: 'var(--space-3)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                      <span style={{ fontWeight: '600', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)' }}>
                        {v.type} — {v.make}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', background: 'var(--color-bg-primary)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--color-border-light)' }}>
                        {v.plate}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 'var(--space-1) var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                      <span>Color:</span>
                      <span style={{ color: 'var(--color-text-primary)' }}>{v.color}</span>
                      <span>Assessed Damage:</span>
                      <span style={{ color: 'var(--color-accent-red)', fontWeight: '500' }}>{v.damage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Timeline & Info) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Meta Card */}
            <div className="card">
              <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 'var(--space-3)' }}>
                Incident Details
              </h3>
              <div className="detail-field">
                <span className="detail-field-label">Case ID / FIR</span>
                <span className="detail-field-value" style={{ fontFamily: 'var(--font-mono)' }}>{report.caseId}</span>
              </div>
              <div className="detail-field">
                <span className="detail-field-label">Location</span>
                <span className="detail-field-value">{report.location}</span>
              </div>
              <div className="detail-field">
                <span className="detail-field-label">Date &amp; Time</span>
                <span className="detail-field-value">{formatDateTime(report.date)}</span>
              </div>
              <div className="detail-field">
                <span className="detail-field-label">Status</span>
                <span className="detail-field-value">
                  <StatusBadge type="status" value={report.status} />
                </span>
              </div>
              <div className="detail-field">
                <span className="detail-field-label">Casualties</span>
                <span className="detail-field-value" style={{ color: report.casualties.fatal > 0 ? 'var(--color-accent-red)' : 'var(--color-text-primary)' }}>
                  {report.casualties.fatal} Fatal, {report.casualties.injured} Injured
                </span>
              </div>
            </div>

            {/* Response Timeline */}
            <div className="card">
              <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 'var(--space-3)' }}>
                Sentry Dispatch Log
              </h3>
              <Timeline steps={timelineSteps} />
            </div>
          </div>
        </div>

        {/* Printable FIR Section */}
        {showReport && (
          <div 
            className="card report-printable" 
            ref={reportRef}
            style={{ 
              marginTop: 'var(--space-6)', 
              background: '#fff', 
              color: '#111', 
              padding: 'var(--space-8)',
              border: '2px solid #222',
              borderRadius: '0',
              boxShadow: 'none'
            }}
          >
            {/* Styles scoped only for printing this component */}
            <style>{`
              @media print {
                body * { visibility: hidden; }
                .report-printable, .report-printable * { visibility: visible; }
                .report-printable {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  border: none !important;
                  padding: 0 !important;
                }
              }
            `}</style>

            <div style={{ textAlign: 'center', borderBottom: '2px double #111', paddingBottom: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
              <h1 style={{ color: '#111', fontSize: '1.8rem', letterSpacing: '0.04em' }}>FIRST INFORMATION REPORT (F.I.R)</h1>
              <p style={{ fontSize: 'var(--text-sm)', color: '#333', marginTop: '2px', fontWeight: 'bold' }}>Sentry Automated Incident Telemetry Report</p>
              <p style={{ fontSize: 'var(--text-xs)', color: '#555', fontFamily: 'var(--font-mono)' }}>System Signature: SENTRY-SECURE-SHA256-TELEMETRY</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
              <div>
                <p style={{ margin: '4px 0' }}><strong>FIR Number:</strong> {report.caseId}</p>
                <p style={{ margin: '4px 0' }}><strong>Incident ID:</strong> {report.id}</p>
                <p style={{ margin: '4px 0' }}><strong>Jurisdiction Station:</strong> Bandra PS, Mumbai</p>
                <p style={{ margin: '4px 0' }}><strong>Investigating Officer:</strong> {report.officerAssigned}</p>
              </div>
              <div>
                <p style={{ margin: '4px 0' }}><strong>Date / Time of Incident:</strong> {formatDateTime(report.date)}</p>
                <p style={{ margin: '4px 0' }}><strong>Location:</strong> {report.location}</p>
                <p style={{ margin: '4px 0' }}><strong>GPS Coordinates:</strong> {report.lat}, {report.lng}</p>
                <p style={{ margin: '4px 0' }}><strong>Severity Level:</strong> {report.severity.toUpperCase()}</p>
              </div>
            </div>

            <div style={{ border: '1px solid #111', padding: 'var(--space-4)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)', background: '#fcfcfc' }}>
              <h3 style={{ color: '#111', fontSize: 'var(--text-md)', marginBottom: 'var(--space-2)', borderBottom: '1px solid #111', paddingBottom: '4px' }}>Incident Narration</h3>
              <p style={{ lineHeight: '1.5', color: '#222' }}>{report.description}</p>
            </div>

            <div style={{ marginBottom: 'var(--space-6)' }}>
              <h3 style={{ color: '#111', fontSize: 'var(--text-md)', marginBottom: 'var(--space-3)', borderBottom: '1px solid #111', paddingBottom: '4px' }}>Vehicles Involved</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th style={{ border: '1px solid #111', padding: '6px', textAlign: 'left' }}>No.</th>
                    <th style={{ border: '1px solid #111', padding: '6px', textAlign: 'left' }}>Make &amp; Type</th>
                    <th style={{ border: '1px solid #111', padding: '6px', textAlign: 'left' }}>License Plate</th>
                    <th style={{ border: '1px solid #111', padding: '6px', textAlign: 'left' }}>Color</th>
                    <th style={{ border: '1px solid #111', padding: '6px', textAlign: 'left' }}>Damage Assessment</th>
                  </tr>
                </thead>
                <tbody>
                  {report.vehicles.map((v, idx) => (
                    <tr key={idx}>
                      <td style={{ border: '1px solid #111', padding: '6px' }}>{idx + 1}</td>
                      <td style={{ border: '1px solid #111', padding: '6px' }}>{v.make} ({v.type})</td>
                      <td style={{ border: '1px solid #111', padding: '6px', fontFamily: 'var(--font-mono)' }}>{v.plate}</td>
                      <td style={{ border: '1px solid #111', padding: '6px' }}>{v.color}</td>
                      <td style={{ border: '1px solid #111', padding: '6px', fontWeight: 'bold' }}>{v.damage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
              <div>
                <h3 style={{ color: '#111', fontSize: 'var(--text-md)', marginBottom: 'var(--space-2)', borderBottom: '1px solid #111', paddingBottom: '4px' }}>Casualty Summary</h3>
                <p>Fatalities: {report.casualties.fatal}</p>
                <p>Injured: {report.casualties.injured}</p>
                <p>Unharmed: {report.casualties.unharmed}</p>
              </div>
              <div>
                <h3 style={{ color: '#111', fontSize: 'var(--text-md)', marginBottom: 'var(--space-2)', borderBottom: '1px solid #111', paddingBottom: '4px' }}>ML Confidence Detections</h3>
                <p>Detection Confidence: {(report.mlConfidence * 100).toFixed(0)}%</p>
                <p>Victim Pose Detected: {report.poseDetected ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-12)', fontSize: 'var(--text-sm)' }}>
              <div style={{ textAlign: 'center', width: '200px' }}>
                <div style={{ height: '50px' }}></div>
                <div style={{ borderTop: '1px solid #111', paddingTop: '4px' }}>Reporting Officer Signature</div>
              </div>
              <div style={{ textAlign: 'center', width: '200px' }}>
                <div style={{ height: '50px' }}></div>
                <div style={{ borderTop: '1px solid #111', paddingTop: '4px' }}>Command Signature Stamp</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
