import { accidents } from '../data/police';
import { policeStats } from '../data/analytics';

export const reportService = {
  /**
   * Fetches all reports filtered by jurisdiction (city), search, severity, and status
   * @param {Object} options
   * @param {string} [options.jurisdiction]
   * @param {string} [options.search]
   * @param {string} [options.severity]
   * @param {string} [options.status]
   * @returns {Promise<Array>} List of filtered reports
   */
  async getReports({ jurisdiction, search, severity, status } = {}) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Mock network delay

    let filtered = [...accidents];

    // Police should only see reports in their own jurisdiction (city)
    if (jurisdiction) {
      filtered = filtered.filter(a => a.city?.toLowerCase() === jurisdiction.toLowerCase());
    }

    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(a => 
        a.id.toLowerCase().includes(query) ||
        a.caseId.toLowerCase().includes(query) ||
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
  },

  /**
   * Fetches detailed report by ID
   * @param {string} id 
   * @param {string} [jurisdiction] Optional jurisdiction check
   * @returns {Promise<Object>} The report
   */
  async getReportById(id, jurisdiction = null) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const report = accidents.find(a => a.id === id);
    if (!report) throw new Error(`Report ${id} not found.`);
    
    if (jurisdiction && report.city?.toLowerCase() !== jurisdiction.toLowerCase()) {
      throw new Error('Access denied. This report is outside your jurisdiction.');
    }
    
    return report;
  },

  /**
   * Fetches statistics for the dashboard/analytics view
   * @param {string} [jurisdiction] 
   * @returns {Promise<Object>} Statistics
   */
  async getPoliceStats(_jurisdiction) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // In a real database, we would aggregate statistics for a specific jurisdiction.
    // For mock purposes, we return the base stats.
    return policeStats;
  }
};
