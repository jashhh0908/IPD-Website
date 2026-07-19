import { users } from '../data/users';

export const authService = {
  /**
   * Mock login service
   * @param {string} userId 
   * @param {string} password 
   * @returns {Promise<Object>} User details
   */
  async login(userId, password) {
    // Artificial latency for a production-like loading experience
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = users[userId];
    if (!user || user.password !== password) {
      throw new Error('Invalid User ID or password.');
    }

    // Return user without password for security
    const { password: _, ...safeUser } = user;
    return safeUser;
  },

  /**
   * Mock session retrieval
   * @returns {Promise<Object|null>}
   */
  async getCurrentUser() {
    const savedUser = localStorage.getItem('sentry_session');
    if (!savedUser) return null;
    return JSON.parse(savedUser);
  }
};
