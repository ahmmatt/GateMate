# Superadmin Journey Flow Documentation

## Introduction

This document outlines the end‑to‑end workflow for the **Superadmin** role in the SecureGate platform. It is derived directly from the existing Laravel codebase without any assumptions, focusing on routes, controllers, middleware, and view templates that constitute the Superadmin experience.

---

## 1. Route Definitions

- **File:** `routes/web.php`
- **Relevant Routes:**
  ```php
  Route::middleware(['auth', 'role:superadmin', 'ensure.superadmin'])->group(function () {
      Route::get('/superadmin/dashboard', [SuperadminController::class, 'dashboard'])->name('superadmin.dashboard');
      Route::post('/superadmin/withdrawals/execute', [SuperadminController::class, 'executeWithdrawal'])->name('superadmin.withdrawals.execute');
      Route::post('/superadmin/organizers/{id}/approve', [SuperadminController::class, 'approveOrganizer'])->name('superadmin.organizers.approve');
      Route::post('/superadmin/organizers/{id}/reject', [SuperadminController::class, 'rejectOrganizer'])->name('superadmin.organizers.reject');
  });
  ```
- All routes are protected by the **`auth`**, **`role:superadmin`**, and a custom middleware **`EnsureUserIsSuperadmin`**.

---

## 2. Middleware

- **File:** `app/Http/Middleware/EnsureUserIsSuperadmin.php`
- **Purpose:** Verifies that the authenticated user has the `role` field set to `superadmin`. If the check fails, the request is aborted with a **403** response.
- **Key Logic:**
  ```php
  if (auth()->user()->role !== 'superadmin') {
      abort(403, 'Unauthorized.');
  }
  return $next($request);
  ```

---

## 3. Controller Overview

- **File:** `app/Http/Controllers/SuperadminController.php`
- **Primary Methods:**
  1. **`dashboard()`** – Retrieves aggregate analytics and pending items, then returns the `superadmin/dashboard.blade.php` view.
  2. **`executeWithdrawal(Request $request)`** – Handles the final approval of pending financial transactions. Updates `WalletTransaction` status from `pending_superadmin` to `completed` and triggers any external settlement logic.
  3. **`approveOrganizer($id)`** – Sets `is_verified_organizer` to `true` for the given organizer user and logs the action.
  4. **`rejectOrganizer($id)`** – Deletes the organizer user record and any related pending submissions.

- **Data Retrieval Examples:**
  ```php
  $totalTransactions = WalletTransaction::where('status', 'completed')->count();
  $totalRevenue = WalletTransaction::where('status', 'completed')->sum('amount');
  $pendingWithdrawals = WalletTransaction::where('status', 'pending_superadmin')->get();
  $unverifiedOrganizers = User::where('role', 'organizer')->where('is_verified_organizer', false)->get();
  ```

---

## 4. View Template

- **File:** `resources/views/superadmin/dashboard.blade.php`
- **Key UI Elements:**
  - **Analytics Cards:** Show total transactions, gross revenue, active users, and pending withdrawals.
  - **KYC Modal:** Lists unverified organizers with **Approve** and **Reject** buttons that post to the respective controller actions.
  - **Withdrawal Execution Form:** A table of pending withdrawals each with a **Execute** button.
  - **Styling:** Uses Tailwind‑like utility classes defined in the project's custom CSS. No external layout (`@extends`) is used, keeping the Superadmin view isolated from the normal user layout to avoid header clashing.

---

## 5. Detailed Flow

### 5.1 Dashboard Rendering
1. Superadmin logs in → passes `auth` and `EnsureUserIsSuperadmin` middleware.
2. GET `/superadmin/dashboard` triggers `SuperadminController::dashboard()`.
3. Controller aggregates statistics and passes them to the view.
4. View renders a **single‑page dashboard** with real‑time data.

### 5.2 Organizer Verification (KYC)
1. In the KYC modal, each organizer row contains a hidden `organizer_id`.
2. **Approve** → POST `/superadmin/organizers/{id}/approve` → `approveOrganizer()` sets `is_verified_organizer = true`.
3. **Reject** → POST `/superadmin/organizers/{id}/reject` → `rejectOrganizer()` deletes the organizer user and any pending submissions.
4. After either action, the controller redirects back to the dashboard with a flash message.

### 5.3 Withdrawal Clearance
1. Superadmin selects a pending withdrawal and clicks **Execute**.
2. Form submits to POST `/superadmin/withdrawals/execute`.
3. `executeWithdrawal()` validates the transaction exists and is in `pending_superadmin` state.
4. Updates status to `completed`, records `executed_by = auth()->id()`, and optionally dispatches a job to notify the finance system.
5. Dashboard reloads, the transaction disappears from the pending list.

---

## 6. Security & Authorization
- All Superadmin routes are wrapped in the **`role:superadmin`** gate and **`EnsureUserIsSuperadmin`** middleware.
- CSRF protection is enforced on all POST forms via `@csrf`.
- Controller methods perform additional sanity checks (e.g., confirming the transaction belongs to the platform) before mutating data.

---

## 7. Future Extensibility
- **Audit Logging:** Introduce a dedicated audit table to capture every Superadmin action.
- **Pagination:** Large KYC or withdrawal lists can be paginated using Laravel’s paginator.
- **Real‑time Updates:** Replace page refreshes with Laravel Echo / WebSockets for instant dashboard updates.

---

*Document generated automatically on 2026‑05‑30 based solely on source code analysis.*
