import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import StatusBadge from '../../components/ui/StatusBadge';
import Spinner from '../../components/common/Spinner';
import MockVideoPlayer from '../../components/ui/MockVideoPlayer';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import { claimService } from '../../services/claimService';
import { reportService } from '../../services/reportService';
import { formatDateTime, formatINR } from '../../utils/helpers';
import { ROUTES } from '../../constants/routes';

export default function ClaimReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [claim, setClaim] = useState(null);
  const [accident, setAccident] = useState(null);

  // Form states
  const [damageEstimate, setDamageEstimate] = useState('');
  const [medicalExpenses, setMedicalExpenses] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    async function loadClaimData() {
      try {
        setLoading(true);
        setError('');
        const claimData = await claimService.getClaimById(id);
        setClaim(claimData);
        
        // Fetch corresponding Sentry incident details
        if (claimData.accidentId) {
          const accidentData = await reportService.getReportById(claimData.accidentId);
          setAccident(accidentData);
        }

        // Initialize form fields
        setDamageEstimate(claimData.damageEstimate || '');
        setMedicalExpenses(claimData.medicalExpenses || '');
        setReviewNotes(claimData.reviewNotes || '');

      } catch (err) {
        setError(err.message || 'Failed to load claim details.');
        toast('Error loading claim details', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadClaimData();
  }, [id, toast]);

  const handleDecision = async (decisionType) => {
    if (decisionType === 'approved' && (!damageEstimate || isNaN(damageEstimate))) {
      toast('Please enter a valid repair cost estimate.', 'warning');
      return;
    }
    if (!reviewNotes.trim()) {
      toast('Review comments are required for audit trail.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const updated = await claimService.submitClaimDecision(claim.id, {
        decision: decisionType,
        reviewNotes: reviewNotes.trim(),
        damageEstimate: damageEstimate ? Number(damageEstimate) : null,
        medicalExpenses: medicalExpenses ? Number(medicalExpenses) : null
      }, user.name);

      setClaim(updated);
      toast(`Claim decision has been logged: ${updated.status}`, 'success');
      navigate(ROUTES.insurance.DASHBOARD);
    } catch (err) {
      toast(err.message || 'Failed to process decision.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Claim Audit" breadcrumb="Insurance / Claims" />
        <div style={{ display: 'flex', flex: 1, minHeight: '60vh', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner size="lg" />
        </div>
      </>
    );
  }

  if (error || !claim) {
    return (
      <>
        <Header title="Claim Audit" breadcrumb="Insurance / Claims" />
        <div className="page-content">
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
            <h3 style={{ color: 'var(--color-accent-red)', marginBottom: 'var(--space-3)' }}>Audit Error</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>{error || 'Unable to locate claim.'}</p>
            <button className="btn btn-secondary" onClick={() => navigate(ROUTES.insurance.DASHBOARD)}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  const isPending = claim.status.toLowerCase().includes('pending');

  return (
    <>
      <Header title={`Claim Audit — ${claim.id}`} breadcrumb="Insurance / Claims" />
      <div className="page-content">
        
        {/* Header toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <h1 style={{ fontSize: 'var(--text-xl)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              Claim ID: {claim.id}
              <StatusBadge type="status" value={claim.status} />
            </h1>
          </div>
          <button className="btn btn-secondary" onClick={() => navigate(ROUTES.insurance.DASHBOARD)}>
            ← Back to Queue
          </button>
        </div>

        {/* Claim Review layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-6)' }}>
          
          {/* Main audit inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', minWidth: 0 }}>
            {/* Sentry Camera Footage */}
            <div className="card">
              <div className="card-header" style={{ marginBottom: 'var(--space-4)' }}>
                <h3>Sentry Telemetry Detections</h3>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  Accident ID: {claim.accidentId}
                </span>
              </div>
              <MockVideoPlayer cameraId={accident?.cameraId || 'CAM-SENTRY'} />
              {accident && (
                <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                  <span>Location: {accident.location}</span>
                  <span>Date: {formatDateTime(accident.date)}</span>
                  <span>Detected by: {accident.detectedBy}</span>
                </div>
              )}
            </div>

            {/* Sentry Telemetry Log */}
            {accident && (
              <div className="card">
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>
                  Incident Description Log
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
                  {accident.description}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 var(--space-4)', marginTop: 'var(--space-3)' }}>
                  {[
                    ['Weather Conditions', accident.weather],
                    ['Road Conditions', accident.roadCondition],
                    ['Lighting Conditions', accident.lightCondition],
                    ['Police Dispatch Arrival', accident.responseTime],
                  ].map(([lbl, val], idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)', fontSize: 'var(--text-xs)' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>{lbl}</span>
                      <span style={{ color: 'var(--color-text-primary)', fontWeight: '500' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Adjuster Damage Assessment */}
            <div className="card">
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>
                Adjuster Assessment Form
              </h3>
              
              {isPending ? (
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="damageEstimate">Estimated Repair Cost (₹) *</label>
                      <input 
                        type="number" 
                        id="damageEstimate"
                        value={damageEstimate}
                        onChange={(e) => setDamageEstimate(e.target.value)}
                        placeholder="Enter repair workshop estimate"
                        min="0"
                        disabled={submitting}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="medicalExpenses">Estimated Medical Expenses (₹)</label>
                      <input 
                        type="number" 
                        id="medicalExpenses"
                        value={medicalExpenses}
                        onChange={(e) => setMedicalExpenses(e.target.value)}
                        placeholder="Enter verified medical bills"
                        min="0"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="reviewNotes">Auditor Review Notes *</label>
                    <textarea 
                      id="reviewNotes"
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Input policy details, damage assessments, and justification notes for approval or rejection."
                      disabled={submitting}
                    />
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 var(--space-4)' }}>
                    <div className="detail-field">
                      <span className="detail-field-label">Assessed Repair Cost</span>
                      <span className="detail-field-value">{formatINR(claim.damageEstimate)}</span>
                    </div>
                    <div className="detail-field">
                      <span className="detail-field-label">Assessed Medical Expenses</span>
                      <span className="detail-field-value">{formatINR(claim.medicalExpenses)}</span>
                    </div>
                  </div>
                  <div className="detail-field" style={{ borderBottom: 'none' }}>
                    <span className="detail-field-label">Auditor Review Notes</span>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', marginTop: '4px', fontStyle: 'italic', lineHeight: 'var(--leading-relaxed)' }}>
                      "{claim.reviewNotes || 'No notes provided.'}"
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            
            {/* Policy Details */}
            <div className="card">
              <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 'var(--space-3)' }}>
                Policy Details
              </h3>
              <div className="detail-field">
                <span className="detail-field-label">Policy Holder</span>
                <span className="detail-field-value">{claim.policyHolder}</span>
              </div>
              <div className="detail-field">
                <span className="detail-field-label">Policy Number</span>
                <span className="detail-field-value" style={{ fontFamily: 'var(--font-mono)' }}>{claim.policyNumber}</span>
              </div>
              <div className="detail-field">
                <span className="detail-field-label">Insured Vehicle</span>
                <span className="detail-field-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{claim.vehiclePlate}</span>
              </div>
              <div className="detail-field">
                <span className="detail-field-label">Compensation Requested</span>
                <span className="detail-field-value" style={{ color: 'var(--color-accent-amber)', fontWeight: '600' }}>
                  {formatINR(claim.amountRequested)}
                </span>
              </div>
            </div>

            {/* Sentry Assessment Telemetry */}
            {accident && (
              <div className="card">
                <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 'var(--space-3)' }}>
                  Sentry AI Assessment
                </h3>
                <div className="detail-field">
                  <span className="detail-field-label">Severity Class</span>
                  <span className="detail-field-value">
                    <StatusBadge type="severity" value={accident.severity} />
                  </span>
                </div>
                <div className="detail-field">
                  <span className="detail-field-label">Detection Confidence</span>
                  <span className="detail-field-value" style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>
                    {(accident.mlConfidence * 100).toFixed(0)}%
                  </span>
                </div>
                {/* Confidence Bar */}
                <div style={{ height: '6px', background: 'var(--color-bg-primary)', borderRadius: '3px', overflow: 'hidden', margin: '4px var(--space-3) var(--space-3) var(--space-3)' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${accident.mlConfidence * 100}%`, 
                      background: accident.mlConfidence > 0.85 ? 'var(--color-accent-green)' : 'var(--color-accent-amber)' 
                    }} 
                  />
                </div>
                <div className="detail-field" style={{ borderBottom: 'none' }}>
                  <span className="detail-field-label">Pose Telemetry Status</span>
                  <span className="detail-field-value">
                    {accident.poseDetected ? '👤 Victim presence identified' : '⚠️ No pedestrian detected'}
                  </span>
                </div>
              </div>
            )}

            {/* Auditor Decision panel */}
            <div className="card">
              <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 'var(--space-4)' }}>
                Auditor Resolution
              </h3>

              {isPending ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <button 
                    className="btn btn-success" 
                    onClick={() => handleDecision('approved')}
                    disabled={submitting}
                    style={{ width: '100%' }}
                  >
                    ✓ Approve Compensation
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDecision('denied')}
                    disabled={submitting}
                    style={{ width: '100%' }}
                  >
                    ✕ Deny Claim
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleDecision('info')}
                    disabled={submitting}
                    style={{ width: '100%' }}
                  >
                    ⟳ Request Clarification
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <div className="detail-field">
                    <span className="detail-field-label">Disbursement Paid</span>
                    <span className="detail-field-value" style={{ color: claim.compensationAmount > 0 ? 'var(--color-accent-green)' : 'var(--color-accent-red)', fontSize: 'var(--text-base)', fontWeight: '600' }}>
                      {formatINR(claim.compensationAmount)}
                    </span>
                  </div>
                  <div className="detail-field" style={{ borderBottom: 'none' }}>
                    <span className="detail-field-label">Reviewed By</span>
                    <span className="detail-field-value">{claim.reviewedBy}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
