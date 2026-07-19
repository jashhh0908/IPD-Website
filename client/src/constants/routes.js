import { ROLES } from './roles';

export const ROUTES = {
  PUBLIC: {
    LOGIN: '/login',
    ROOT: '/'
  },
  [ROLES.POLICE]: {
    DASHBOARD: '/police',
    REPORTS: '/police/reports',
    REPORT_DETAIL: (id) => `/police/reports/${id}`,
    REPORT_DETAIL_PATH: '/police/reports/:id',
    ANALYTICS: '/police/analytics'
  },
  [ROLES.INSURANCE]: {
    DASHBOARD: '/insurance',
    CLAIM_REVIEW: (id) => `/insurance/claims/${id}`,
    CLAIM_REVIEW_PATH: '/insurance/claims/:id'
  },
  [ROLES.VICTIM]: {
    DASHBOARD: '/victim',
    FOOTAGE: '/victim/footage',
    APPEALS: '/victim/appeals'
  }
};
