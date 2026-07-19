import { insuranceClaims, insuranceStats } from '../data/insurance';

// Store claims in in-memory state so updates persist within the session
let localClaims = [...insuranceClaims];

export const claimService = {
  /**
   * Fetches claims with optional status filtering
   * @param {string} [statusFilter] 'all', 'pending', 'approved', 'denied'
   * @returns {Promise<Array>} List of claims
   */
  async getClaims(statusFilter = 'all') {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!statusFilter || statusFilter === 'all') {
      return localClaims;
    }
    
    return localClaims.filter(c => c.status.toLowerCase().includes(statusFilter.toLowerCase()));
  },

  /**
   * Fetches detailed claim by ID
   * @param {string} id 
   * @returns {Promise<Object>}
   */
  async getClaimById(id) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const claim = localClaims.find(c => c.id === id);
    if (!claim) throw new Error(`Claim ${id} not found.`);
    return claim;
  },

  /**
   * Submits a decision (Approve/Deny/Request Info) for a claim
   * @param {string} id 
   * @param {Object} update 
   * @param {string} update.decision 'approved' | 'denied' | 'info'
   * @param {string} update.reviewNotes 
   * @param {number} [update.damageEstimate] 
   * @param {number} [update.medicalExpenses] 
   * @param {string} [reviewerName]
   * @returns {Promise<Object>} Updated claim
   */
  async submitClaimDecision(id, { decision, reviewNotes, damageEstimate, medicalExpenses }, reviewerName = 'Ankit Mehta') {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = localClaims.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Claim ${id} not found.`);
    
    const originalClaim = localClaims[index];
    
    let status = 'Pending Review';
    let compensationAmount = 0;
    
    if (decision === 'approved') {
      status = 'Approved';
      // Calculate compensation: sum of estimates up to requested amount
      const damages = Number(damageEstimate || 0);
      const medical = Number(medicalExpenses || 0);
      compensationAmount = Math.min(originalClaim.amountRequested, damages + medical);
    } else if (decision === 'denied') {
      status = 'Denied';
      compensationAmount = 0;
    } else if (decision === 'info') {
      status = 'Pending Review (Info Requested)';
      compensationAmount = 0;
    }
    
    const updatedClaim = {
      ...originalClaim,
      status,
      decision,
      reviewNotes,
      damageEstimate: damageEstimate ? Number(damageEstimate) : null,
      medicalExpenses: medicalExpenses ? Number(medicalExpenses) : null,
      compensationAmount,
      reviewedBy: reviewerName
    };
    
    localClaims[index] = updatedClaim;
    return updatedClaim;
  },

  /**
   * Fetches insurance analytics statistics
   * @returns {Promise<Object>}
   */
  async getInsuranceStats() {
    await new Promise(resolve => setTimeout(resolve, 400));
    return insuranceStats;
  }
};
