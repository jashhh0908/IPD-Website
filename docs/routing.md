# Centralized Routing Design

Sentry utilizes React Router v7 (`react-router-dom`) for secure, centralized routing.

## Configurations

All routes are defined in `src/constants/routes.js` to prevent magic strings:

*   `/login`: Entry sign-in page.
*   `/police`: Dispatch command overview.
*   `/police/reports`: Case database.
*   `/police/reports/:id`: Printable FIR and incident details.
*   `/police/analytics`: Trend graphs and camera network logs.
*   `/insurance`: Claim queue.
*   `/insurance/claims/:id`: Claims audit assessment dashboard.
*   `/victim`: Case progress timeline.
*   `/victim/footage`: Traffic video stream player.
*   `/victim/appeals`: Dispute submission forms.

## Security Guards

Route access is restricted using two custom route wraps:

1.  `ProtectedRoute.jsx`: Verifies if a user is authenticated. If not, redirects to `/login`.
2.  `RoleRoute.jsx`: Checks if the authenticated user's role matches the required role. If a user attempts to access an unauthorized route, they are automatically redirected to their corresponding home dashboard.

## Code Splitting

All page routes are lazy loaded using `React.lazy` and wrapped in `React.Suspense` with a custom loading Spinner to optimize loading times.
