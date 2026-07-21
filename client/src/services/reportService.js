import { policeStats } from '../data/analytics';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/accidents`;

export const reportService = {
  /**
   * Fetches all reports from the database and filters them in-memory
   * @param {Object} options
   * @param {string} [options.jurisdiction]
   * @param {string} [options.search]
   * @param {string} [options.severity]
   * @param {string} [options.status]
   * @returns {Promise<Array>} List of filtered reports
   */
  async getReports({ jurisdiction, search, severity, status } = {}) {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch reports: ${response.statusText}`);
      }
      const data = await response.json();

      // Map MongoDB _id to frontend id key to resolve data model mismatch
      const mappedAccidents = data.map(accident => ({
        ...accident,
        id: accident._id
      }));

      let filtered = [...mappedAccidents];

      // Police should only see reports in their own jurisdiction (city)
      if (jurisdiction) {
        filtered = filtered.filter(a => a.city?.toLowerCase() === jurisdiction.toLowerCase());
      }

      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(a => 
          a.id.toLowerCase().includes(query) ||
          (a.caseId && a.caseId.toLowerCase().includes(query)) ||
          a.location.toLowerCase().includes(query) ||
          (a.description && a.description.toLowerCase().includes(query))
        );
      }

      if (severity && severity !== 'all') {
        filtered = filtered.filter(a => a.severity.toLowerCase() === severity.toLowerCase());
      }

      if (status && status !== 'all') {
        filtered = filtered.filter(a => a.status.toLowerCase() === status.toLowerCase());
      }

      return filtered;
    } catch (error) {
      console.error('Failed to get reports from database:', error);
      throw error;
    }
  },

  /**
   * Fetches detailed report by ID
   * @param {string} id 
   * @param {string} [jurisdiction] Optional jurisdiction check
   * @returns {Promise<Object>} The report
   */
  async getReportById(id, jurisdiction = null) {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch report detail: ${response.statusText}`);
      }
      const data = await response.json();

      // Map keys
      const mappedAccidents = data.map(accident => ({
        ...accident,
        id: accident._id
      }));

      // Find the accident (supports lookup by both MongoDB _id and FIR caseId)
      const report = mappedAccidents.find(a => a.id === id || a.caseId === id);
      if (!report) throw new Error(`Report ${id} not found.`);
      
      if (jurisdiction && report.city?.toLowerCase() !== jurisdiction.toLowerCase()) {
        throw new Error('Access denied. This report is outside your jurisdiction.');
      }
      
      return report;
    } catch (error) {
      console.error(`Failed to get report by ID:`, error);
      throw error;
    }
  },

  /**
   * Fetches statistics for the dashboard/analytics view (remains mock for now)
   * @param {string} [jurisdiction] 
   * @returns {Promise<Object>} Statistics
   */
  async getPoliceStats(_jurisdiction) {
    await new Promise(resolve => setTimeout(resolve, 400));
    return policeStats;
  }
};
