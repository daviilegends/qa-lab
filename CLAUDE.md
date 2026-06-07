# CLAUDE.md — MiniCommerce QA Lab

## Purpose
Living guide for MiniCommerce QA Lab: a dummy e-commerce for QA Automation practice with Playwright + JavaScript.
Goal: realistic, safe, local and predictable e-commerce flows for testing.
Not a real store. No real payments, real users or production data.
Keep this file short and update it as decisions evolve.

## Role
Act as a senior QA automation architect, frontend developer and UX reviewer.
Priority order: testability, predictable data, clean architecture, professional UX, simple implementation.

## Token Rules
Keep responses short and task-focused.
Do not rewrite the full project unless requested.
Mention affected files before large changes.
Prefer file paths, summaries and next steps.
Avoid repeated context and unnecessary theory.
Do not add implementation code to this document.
Use this file as the project source of truth.

## Stack
Frontend: Next.js or React.
Language: JavaScript.
Styles: Tailwind CSS.
Testing: Playwright.
Data: local mock data first.
Backend: optional later.
Payments: dummy only.
CI later: GitHub Actions.
Optional later: MSW, SQLite, Playwright reports, Docker.
UX guide: UI UX Pro Max Skill when available.

## UI UX Pro Max Usage
Use UI UX Pro Max as optional UX/design guidance.
Purpose: improve layout, spacing, typography, color, accessibility and page polish.
Do not sacrifice Playwright testability for visual design.
Do not add random animations, unstable text or fragile UI.
Ask for install command when needed: npm install -g uipro-cli.
Ask for Copilot setup when needed: uipro init --ai copilot.
Use it for design systems, UX reviews, page polish and component consistency.
Document UX decisions in the project document.

## UX Standards
Professional, clean, responsive e-commerce UI.
Use semantic HTML, visible labels, clear headings and clear CTAs.
Use accessible contrast, readable prices, consistent spacing and responsive layouts.
Use hover, focus and disabled states.
Respect reduced motion.
Prefer predictable UI states over fancy effects.
Do not use emojis as primary icons.
Use test-friendly forms, product cards, cart and checkout layouts.

## App Scope
Required flows: login, logout, PLP, search, filters, PDP, add to cart, update quantity, remove item, save for later, coupons, checkout, shipping address, dummy card, order confirmation, subscriptions, loyalty points and promotions.
Recommended pages: Login, PLP, PDP, Cart, Checkout, Order Confirmation, Account, Addresses, Payment Methods and Subscriptions.

## Dummy Users
Use predictable users only: standard, new, subscribed, blocked, saved address, saved payment, active subscription and expired subscription.
Never use real personal information.

## Business Rules
New users can use a welcome coupon.
Free shipping applies above a defined amount.
Subscribed users can earn extra loyalty points.
Users subscribed in the last 3 months receive double points during June and July.
Coupons can be valid, expired or not applicable.
Products can be in stock, out of stock, subscription-enabled or non-subscription.

## Testing Standards
Tests must be readable by QA and business people.
Prefer locators by role, label, text and placeholder.
Use data-testid only when semantic locators are not enough.
Avoid fragile selectors, random classes, deep CSS chains and nth-child.
Each test needs clear name, precondition, action and assertion.
Tests must be independent and use predictable data.

## Test Categories
Use tags or naming for: smoke, sanity, regression, checkout, promotions, subscriptions, cart, auth and negative.
Smoke: critical flows.
Sanity: recent changes.
Regression: broader business coverage.

## First Automation Goals
valid login.
invalid login.
product search.
open PDP.
add to cart.
update cart quantity.
remove product.
apply valid coupon.
apply invalid coupon.
successful checkout.
declined payment.
subscription checkout.
order confirmation.

## Page Object Model
Use POM when actions repeat.
Suggested pages: LoginPage, ProductListPage, ProductDetailsPage, CartPage, CheckoutPage, OrderConfirmationPage, AccountPage, SubscriptionsPage.
Page objects contain locators and actions.
Most assertions stay in test files.
Method names should describe user behavior.

## Data Strategy
Keep mock data separate from UI.
Data types: users, products, categories, coupons, promotions, addresses, payments, subscriptions and orders.
Support happy paths, negative paths and edge cases.
Avoid uncontrolled random data.

## Environments
Use: local, qa and staging.
Production is read-only discussion.
Never run destructive tests against production.
Base URLs must be configurable.
Do not hardcode environment values inside tests.
Start local, then move to QA/staging.

## Accessibility And Testability
Every input has a visible label.
Every key button has clear text.
Every page has a clear heading.
Errors are visible and specific.
Loading and disabled states are testable.
UI text should be stable and predictable.

## Definition Of Done
A feature is done when it works manually, uses dummy data safely, has predictable states, is easy to automate, has clear test scenarios, has critical scenarios automated and docs are updated if standards or rules changed.

## Living Documentation
Maintain a separate project document as the project grows.
Track decisions, architecture, UX decisions, business rules, test strategy, test data, environments, commands, risks and improvements.
CLAUDE.md stays short and strategic.

## Prompt: Folder Architecture
Act as a senior frontend developer and QA automation architect. Propose a simple folder architecture for MiniCommerce QA Lab, a local dummy e-commerce for Playwright testing with JavaScript. Prioritize testability, mock data separation, reusable components, business logic separation, UX scalability and future CI. Do not overengineer. Explain each folder briefly.

## Prompt: UX Design System
Act as a senior UI/UX designer using UI UX Pro Max principles. Create a clean, professional, responsive design system for MiniCommerce QA Lab. Include layout, colors, typography, spacing, buttons, forms, product cards, cart, checkout, accessibility rules and anti-patterns. Keep everything automation-friendly.

## Prompt: New Feature
Create [feature name] for MiniCommerce QA Lab. It must be realistic but dummy, Playwright-friendly and based on predictable mock data. Include accessible labels, stable text, professional UX, clear CTAs and test-friendly behavior. Explain which flows should be automated.

## Prompt: Playwright Tests
Act as a senior QA automation engineer. Create Playwright test scenarios for [feature or rule] using JavaScript. Include stable locators, readable steps, predictable data, positive cases, negative cases and edge cases. Classify as smoke, sanity or regression. Avoid fragile selectors.

## Prompt: Business Rule
Analyze this e-commerce rule from a QA automation perspective: [business rule]. Identify test data, positive cases, negative cases, edge cases, risks, assertions and first Playwright tests to automate.

## Prompt: Environments
Define local, QA and staging handling for MiniCommerce QA Lab. Include base URL strategy, test data strategy and commands to run Playwright against each environment. Keep it beginner-friendly and scalable.

## Useful Command Requests
Ask the AI for one command per line plus a short explanation.
Useful topics: initialize project, install dependencies, run app, install Playwright, install UI UX Pro Max, setup UI UX Pro Max for Copilot, run all tests, run smoke tests, headed mode, UI mode, open report, record flow, run by environment and run in CI.

## Current Status
Planning and initial setup.
Priority: project structure, smallest testable MVP, UX direction, mock data, Playwright readiness and first smoke test.

## Next Prompt
Using CLAUDE.md, create the initial implementation plan for MiniCommerce QA Lab. Start with the smallest testable MVP: login, product listing, product details, cart, checkout and order confirmation. Include simple professional UX based on UI UX Pro Max principles, but keep Playwright testability as the main priority.
