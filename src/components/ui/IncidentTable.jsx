import React from 'react';
import StatusBadge from './StatusBadge';
import { formatDateTime } from '../../utils/helpers';

/**
 * Reusable Incident Table Component
 * @param {Object} props
 * @param {Array} props.incidents
 * @param {Function} props.onViewDetails
 * @param {boolean} [props.showCamera=false]
 */
export default function IncidentTable({ incidents, onViewDetails, showCamera = false }) {
  if (!incidents || incidents.length === 0) return null;

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col">Case ID</th>
            <th scope="col">Date / Time</th>
            <th scope="col">Location</th>
            {showCamera && <th scope="col">Camera</th>}
            <th scope="col">Severity</th>
            <th scope="col">Status</th>
            <th scope="col" style={{ textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.id}>
              <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)' }}>
                {incident.caseId}
              </td>
              <td style={{ fontSize: 'var(--text-xs)', whiteSpace: 'nowrap' }}>
                {formatDateTime(incident.date)}
              </td>
              <td style={{ fontSize: 'var(--text-sm)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }} title={incident.location}>
                {incident.location}
              </td>
              {showCamera && (
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  {incident.cameraId}
                </td>
              )}
              <td>
                <StatusBadge type="severity" value={incident.severity} />
              </td>
              <td>
                <StatusBadge type="status" value={incident.status} />
              </td>
              <td style={{ textAlign: 'right' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onViewDetails(incident.id)}
                  aria-label={`View details for case ${incident.caseId}`}
                >
                  View →
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
