import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import { ROLES } from '../constants/roles';
import { ROUTES } from '../constants/routes';
import Spinner from '../components/common/Spinner';
import useAuth from '../hooks/useAuth';

// Lazy loading page components
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));

// Police pages
const PoliceDashboard = lazy(() => import('../pages/police/PoliceDashboard'));
const PoliceReports = lazy(() => import('../pages/police/PoliceReports'));
const PoliceReportDetail = lazy(() => import('../pages/police/PoliceReportDetail'));
const PoliceAnalytics = lazy(() => import('../pages/police/PoliceAnalytics'));
const PoliceMap = lazy(() => import('../pages/police/PoliceMap'));

// Insurance pages
const InsuranceDashboard = lazy(() => import('../pages/insurance/InsuranceDashboard'));
const ClaimReview = lazy(() => import('../pages/insurance/ClaimReview'));

// Victim pages
const VictimDashboard = lazy(() => import('../pages/victim/VictimDashboard'));
const VictimFootage = lazy(() => import('../pages/victim/VictimFootage'));
const VictimAppeal = lazy(() => import('../pages/victim/VictimAppeal'));

// Layout Shell (We will build it)
const LayoutShell = lazy(() => import('../components/layout/LayoutShell'));

// Fallback spinner component
const PageSpinner = () => (
  <div style={{ display: 'flex', flex: 1, minHeight: '60vh', justifyContent: 'center', alignItems: 'center' }}>
    <Spinner size="lg" />
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', height: '100vh', width: '100vw', justifyContent: 'center', alignItems: 'center', background: 'var(--color-bg-primary)' }}>
        <Spinner size="lg" />
      </div>
    }>
      <Routes>
        <Route path={ROUTES.PUBLIC.LOGIN} element={<LoginPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          
          {/* Main Layout wrapper for pages */}
          <Route element={<LayoutShell />}>
            {/* Redirect root to user role dashboard */}
            <Route path={ROUTES.PUBLIC.ROOT} element={<HomeRedirect />} />

            {/* Police routes */}
            <Route element={<RoleRoute allowedRole={ROLES.POLICE} />}>
              <Route path={ROUTES[ROLES.POLICE].DASHBOARD} element={<Suspense fallback={<PageSpinner />}><PoliceDashboard /></Suspense>} />
              <Route path={ROUTES[ROLES.POLICE].REPORTS} element={<Suspense fallback={<PageSpinner />}><PoliceReports /></Suspense>} />
              <Route path={ROUTES[ROLES.POLICE].REPORT_DETAIL_PATH} element={<Suspense fallback={<PageSpinner />}><PoliceReportDetail /></Suspense>} />
              <Route path={ROUTES[ROLES.POLICE].ANALYTICS} element={<Suspense fallback={<PageSpinner />}><PoliceAnalytics /></Suspense>} />
              <Route path={ROUTES[ROLES.POLICE].MAP} element={<Suspense fallback={<PageSpinner />}><PoliceMap /></Suspense>} />
            </Route>

            {/* Insurance routes */}
            <Route element={<RoleRoute allowedRole={ROLES.INSURANCE} />}>
              <Route path={ROUTES[ROLES.INSURANCE].DASHBOARD} element={<Suspense fallback={<PageSpinner />}><InsuranceDashboard /></Suspense>} />
              <Route path={ROUTES[ROLES.INSURANCE].CLAIM_REVIEW_PATH} element={<Suspense fallback={<PageSpinner />}><ClaimReview /></Suspense>} />
            </Route>

            {/* Victim routes */}
            <Route element={<RoleRoute allowedRole={ROLES.VICTIM} />}>
              <Route path={ROUTES[ROLES.VICTIM].DASHBOARD} element={<Suspense fallback={<PageSpinner />}><VictimDashboard /></Suspense>} />
              <Route path={ROUTES[ROLES.VICTIM].FOOTAGE} element={<Suspense fallback={<PageSpinner />}><VictimFootage /></Suspense>} />
              <Route path={ROUTES[ROLES.VICTIM].APPEALS} element={<Suspense fallback={<PageSpinner />}><VictimAppeal /></Suspense>} />
            </Route>

          </Route>
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.PUBLIC.ROOT} replace />} />
      </Routes>
    </Suspense>
  );
}

// Redirects `/` path to the user's corresponding portal homepage
function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to={ROUTES.PUBLIC.LOGIN} replace />;
  const redirectPath = ROUTES[user.role]?.DASHBOARD || ROUTES.PUBLIC.LOGIN;
  return <Navigate to={redirectPath} replace />;
}
