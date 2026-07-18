import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import StatusBadge from '../../components/ui/StatusBadge';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import { victimService } from '../../services/victimService';
import { formatDateTime } from '../../utils/helpers';

const APPEAL_REASONS = [
  'Incorrect Severity Classification',
  'Missing Information in Report',
  'Dispute Investigation Findings',
  'Insurance Claim Dispute',
  'Other'
];

export default function VictimAppeal() {
  const { user } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [accident, setAccident] = useState(null);
  const [appealsList, setAppealsList] = useState([]);

  // Form states
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError('');
        
        const accidentData = await victimService.getVictimAccident(user.id);
        setAccident(accidentData);

        const appealsData = await victimService.getVictimAppeals(user.id);
        setAppealsList(appealsData);

      } catch (err) {
        setError(err.message || 'Failed to retrieve appeals history.');
        toast('Error loading appeals history', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user.id, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!reason) {
      setFormError('Please select a reason for the appeal.');
      return;
    }
    if (!description.trim() || description.trim().length < 20) {
      setFormError('Please provide a detailed description (at least 20 characters) explaining your appeal.');
      return;
    }

    setSubmitting(true);
    try {
      const newAppeal = await victimService.submitAppeal(user.id, accident.id, {
        reason,
        description: description.trim()
      });

      setAppealsList((prev) => [newAppeal, ...prev]);
      toast('Appeal has been successfully filed and queued for review.', 'success');
      
      // Reset form fields
      setReason('');
      setDescription('');
    } catch (err) {
      toast(err.message || 'Submission failed. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Case Appeals" />
        <div style={{ display: 'flex', flex: 1, minHeight: '60vh', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner size="lg" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Submit an Appeal" breadcrumb="Citizen / Appeals" />
      <div className="page-content">
        <div className="page-header">
          <h1>Submit an Appeal</h1>
          <p>File a dispute regarding investigation findings, severity classifications, or insurance audits.</p>
        </div>

        {error ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-accent-red)' }}>{error}</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-6)' }}>
            
            {/* Submit Appeal Form */}
            <div>
              <div className="card">
                <div className="card-header">
                  <h3>New Appeal Form</h3>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {formError && (
                    <div 
                      style={{ 
                        padding: 'var(--space-3) var(--space-4)', 
                        background: 'var(--color-accent-red-muted)', 
                        border: '1px solid var(--color-accent-red)', 
                        color: 'var(--color-accent-red)', 
                        borderRadius: 'var(--radius-md)', 
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--weight-medium)'
                      }}
                      role="alert"
                    >
                      {formError}
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="reason">Reason for Appeal *</label>
                    <select
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      disabled={submitting}
                      aria-required="true"
                    >
                      <option value="">Select a categorization reason...</option>
                      {APPEAL_REASONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Detailed Narrative Description *</label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Please present a detailed explanation of facts and references to support your appeal. Outline discrepancies between Sentry camera footage and findings."
                      disabled={submitting}
                      aria-required="true"
                      style={{ minHeight: '150px' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="documents">Upload Supporting Evidence (Optional)</label>
                    <input 
                      type="file" 
                      id="documents" 
                      multiple 
                      disabled={submitting}
                      style={{ padding: '6px' }}
                      aria-label="Upload supporting evidence"
                    />
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'block', marginTop: '4px' }}>
                      Accepted file types: PDF, PNG, JPG (Max 10MB per file).
                    </span>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={submitting}
                    style={{ width: 'fit-content' }}
                  >
                    {submitting ? (
                      <>
                        <Spinner size="sm" />
                        <span>Filing Appeal...</span>
                      </>
                    ) : (
                      <span>File Appeal</span>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Previous Appeals History */}
            <div>
              <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="card-header">
                  <h3>Appeals Registry</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', flex: 1, overflowY: 'auto' }}>
                  {appealsList.length === 0 ? (
                    <EmptyState 
                      title="No appeals filed" 
                      message="You have no current or previous appeals recorded in the Sentry system." 
                    />
                  ) : (
                    appealsList.map((appeal) => (
                      <div 
                        key={appeal.id} 
                        style={{ 
                          padding: 'var(--space-4)', 
                          background: 'var(--color-bg-secondary)', 
                          borderRadius: 'var(--radius-md)', 
                          border: '1px solid var(--color-border)' 
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: '500' }}>
                            {appeal.id}
                          </span>
                          <StatusBadge type="status" value={appeal.status} />
                        </div>
                        <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                          {appeal.reason}
                        </h4>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                          Submitted: {formatDateTime(appeal.dateSubmitted)}
                        </div>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)', lineHeight: '1.4' }}>
                          {appeal.description}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
}
