# End-to-End Testing Strategy & Use Cases

This document outlines the End-to-End (E2E) testing strategy for the application using Playwright. It lists all the major user journeys and scenarios covered by the test suite.

## 1. Public Journeys
These tests ensure that unauthenticated users can browse public-facing pages without encountering errors.

- **Landing Page & Blog**
  - Verify that the landing page renders correctly (hero section, call-to-actions).
  - Verify that navigating to the blog loads the blog list.
  - Verify that localization/language routes work (e.g. `/es`, `/en`).

## 2. Authentication
Tests the core identity management flows for both registering new users and logging in existing ones.

- **Login Flow**
  - Submit empty form and observe validation errors.
  - Navigate to register page.
  - Successfully log in with correct credentials.
- **Registration Flow**
  - Submit empty form and observe validation errors.
  - Navigate to login page.
  - Successfully register a new account.
- **Logout Flow**
  - Verify that an authenticated user can log out successfully and is redirected appropriately (e.g., to login or landing page).

## 3. B2C Customer Journey (Shopping)
Tests the complete purchase flow for a customer.

- **Catalog Browsing**
  - Display the product list and test pagination.
  - Verify unauthenticated users are redirected to login if they attempt to add items to the cart.
- **Cart Management**
  - Display an empty cart message when no items exist.
  - Display items if the cart has products.
  - Increase/decrease item quantity.
  - Proceed to checkout successfully.
- **Checkout & Order History**
  - Register, login, add item to cart, and proceed to payment.
  - Complete mock payment successfully.
  - Verify the order appears in the user's Order History.

## 4. User Profile
Tests user ability to manage their account.

- **Profile Management**
  - View user details on the profile page.
  - Update details (if functionality is present) and verify the changes persist.

## 5. B2B Admin Journey
Tests the admin portal and ensures administrative tools are restricted and functional.

- **Admin Access**
  - Log in with administrative credentials.
  - Verify the admin sidebar renders options properly.
  - Access User Management, Order Management, SEO, and Analytics pages without unauthorized errors.

## Execution
To run all tests:
```bash
cd frontend
npx playwright test
```
To run tests with a UI for debugging:
```bash
npx playwright test --ui
```
