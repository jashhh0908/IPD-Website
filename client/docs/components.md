# Shared UI Components Directory

Sentry is built using highly reusable, accessible components.

## Reusable UI Elements

1.  **`StatCard` (`src/components/ui/StatCard.jsx`)**: Renders KPI statistics with titles, numerical values, trend percentages, and colored icons.
2.  **`StatusBadge` (`src/components/ui/StatusBadge.jsx`)**: Formats case status or severity levels using custom class variables. Includes color coding and dot indicators.
3.  **`Spinner` (`src/components/common/Spinner.jsx`)**: Renders a loading animation supporting small, medium, and large sizing options.
4.  **`EmptyState` (`src/components/common/EmptyState.jsx`)**: Accessible layout displayed when data queries return no matches. Includes icon, descriptive text, and optional action button slots.
5.  **`Modal` (`src/components/common/Modal.jsx`)**: Accessible dialog modal. Listens to keyboard shortcuts (`Escape` to dismiss) and locks background scrolls.
6.  **`Toast` (`src/components/ui/Toast.jsx`)**: Active toast notification banner provider. Allows triggering toasts using a `useToast` hook.

## Layouts

*   **`Sidebar`**: Left navigation bar. Generates navigation links depending on the active user role, displays user details, and includes the logout control.
*   **`Header`**: Top bar containing breadcrumbs, active window titles, and a live clock updating every second.
*   **`LayoutShell`**: Shell template mapping header and sidebar navigation onto the view frame.
