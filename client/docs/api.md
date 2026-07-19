# Telemetry API and Mock Services

Sentry wraps database operations inside services under `src/services/` to simulate async network operations.

## Services Structure

### 1. `authService`
*   `login(userId, password)`: Validates credentials and returns user session object.
*   `getCurrentUser()`: Restores session from storage.

### 2. `reportService`
*   `getReports({ jurisdiction, search, severity, status })`: Fetches reports. Filters by police jurisdiction (city), search query, severity, and investigation status.
*   `getReportById(id, jurisdiction)`: Fetches a single report, validating that it lies within the requesting officer's jurisdiction.
*   `getPoliceStats(jurisdiction)`: Fetches camera status and accident statistics.

### 3. `claimService`
*   `getClaims(statusFilter)`: Returns claims filterable by pending/approved/denied.
*   `getClaimById(id)`: Returns specific claim.
*   `submitClaimDecision(id, decisionData, auditor)`: Approves or denies a claim. Persists the decision, repair estimate, and review notes in-memory.

### 4. `victimService`
*   `getVictimAccident(victimId)`: Fetches the accident involving the citizen.
*   `getVictimClaim(accidentId)`: Fetches the insurance claim associated with the accident.
*   `getVictimAppeals(victimId)`: Returns previous appeals.
*   `submitAppeal(victimId, accidentId, appealData)`: Files a dispute.
