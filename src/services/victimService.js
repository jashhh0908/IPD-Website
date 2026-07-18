import { accidents } from '../data/police';
import { insuranceClaims } from '../data/insurance';
import { appeals } from '../data/victim';

// In-memory list of appeals
let localAppeals = [...appeals];

export const victimService = {
  /**
   * Fetches the case/accident detail for a specific victim user
   * @param {string} victimId 
   * @returns {Promise<Object>} The accident report
   */
  async getVictimAccident(victimId) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find the accident where victimId matches
    const accident = accidents.find(a => a.victimId === victimId);
    if (!accident) {
      // Fallback to the first accident if none matched (for demo continuity)
      return accidents[0];
    }
    return accident;
  },

  /**
   * Fetches corresponding claim for an accident
   * @param {string} accidentId 
   * @returns {Promise<Object|null>}
   */
  async getVictimClaim(accidentId) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const claim = insuranceClaims.find(c => c.accidentId === accidentId);
    return claim || null;
  },

  /**
   * Fetches appeals submitted by a victim
   * @param {string} victimId 
   * @returns {Promise<Array>}
   */
  async getVictimAppeals(victimId) {
    await new Promise(resolve => setTimeout(resolve, 400));
    return localAppeals.filter(a => a.victimId === victimId);
  },

  /**
   * Submits a new appeal
   * @param {string} victimId 
   * @param {string} accidentId 
   * @param {Object} appealData 
   * @param {string} appealData.reason 
   * @param {string} appealData.description 
   * @returns {Promise<Object>} Created appeal
   */
  async submitAppeal(victimId, accidentId, { reason, description }) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newAppeal = {
      id: `APL-${String(Date.now()).slice(-3)}`,
      victimId,
      accidentId,
      reason,
      status: 'Submitted',
      dateSubmitted: new Date().toISOString(),
      description,
      response: null
    };
    
    localAppeals.push(newAppeal);
    return newAppeal;
  }
};
