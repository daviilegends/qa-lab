# Copilot instructions — Playwright E2E testing

These rules apply whenever you generate or edit Playwright test code in this
repo (`tests/`). They are self-contained — don't assume any other project file
exists.
##  github.copilot.chat.codeGeneration.useInstructionFiles

## Approach: black-box

Discover locators from the **rendered app** (accessibility snapshot, DevTools,
codegen) — never by reading component/page source. Wait for the engineer to
hand you the locators they found; don't guess selectors from a feature name.

## Folder structure (Page Object Model, grouped by domain)

This is the base layout for an e-commerce suite — scalable to many flows
without becoming a flat pile of files. Create missing folders/files following
this structure; group new specs/pages under the closest existing domain folder
before inventing a new one:

```
tests/
├── e2e/                        # specs (*.spec.js), grouped by domain
│   ├── auth/
│   │   ├── login.spec.js
│   │   └── logout.spec.js
│   ├── catalog/                # PLP: browse, search, filter, sort, stock
│   │   ├── browse-and-filter.spec.js
│   │   ├── search.spec.js
│   │   └── product-details.spec.js   # PDP: details, add to cart, subscribe
│   ├── cart/
│   │   ├── cart-management.spec.js   # qty, remove, save for later
│   │   ├── coupons.spec.js
│   │   └── promotions.spec.js        # free shipping, discounts
│   ├── checkout/
│   │   ├── checkout-flow.spec.js     # happy path + declined payment
│   │   ├── addresses.spec.js         # add/edit/delete/make-primary in checkout
│   │   └── payment-methods.spec.js
│   ├── account/                      # "My info" / profile area
│   │   ├── profile.spec.js
│   │   ├── addresses.spec.js
│   │   ├── payment-methods.spec.js
│   │   └── subscription-manager.spec.js
│   └── order-confirmation/
│       └── order-confirmation.spec.js
│
├── pages/                      # Page Objects — mirror the e2e/ domains
│   ├── LoginPage.js
│   ├── ProductListPage.js
│   ├── ProductDetailsPage.js
│   ├── CartPage.js
│   ├── CheckoutPage.js
│   ├── AccountPage.js
│   ├── SubscriptionManagerPage.js
│   ├── OrderConfirmationPage.js
│   └── components/             # shared widgets reused across pages
│       ├── NavBar.js
│       ├── AddressModal.js     # the "edit/delete/make primary" modal
│       └── PaymentMethodModal.js
│
├── data/                       # static, predictable mock data (plain objects)
│   ├── users.js                # roles: standard, new, subscribed, blocked...
│   ├── products.js             # incl. in-stock / out-of-stock / subscribable
│   ├── coupons.js              # valid / expired / not-applicable
│   ├── promotions.js           # free-shipping threshold, etc.
│   ├── addresses.js
│   └── paymentMethods.js       # dummy card numbers per outcome (approved/declined/...)
│
├── fixtures/                   # Playwright test fixtures (extend `test`)
│   ├── auth.fixture.js         # e.g. `loggedInAsStandard`, `loggedInAsSubscribed`
│   ├── cart.fixture.js         # e.g. `cartWithItems`
│   └── index.js                # merges fixtures, re-exports `test`/`expect`
│
├── support/                    # test *infrastructure* (not page-specific)
│   ├── env.js                  # single place that reads/validates process.env
│   └── globalSetup.js          # e.g. storageState/auth-session setup, if used
│
└── utils/                      # pure, generic helper functions (no test/env coupling)
    ├── dates.js                # e.g. addMonthsToDate, formatOrderDate
    ├── money.js                # e.g. parsePrice("$12.99") -> 12.99, roundToCents
    └── assertions.js           # custom/shared expect helpers reused across specs
```

**Why `data/` and `fixtures/` are split** (this trips people up): "fixtures" in
Playwright means something specific — reusable test *setup* that extends the
`test` function (e.g. "give me a page that's already logged in as a subscribed
user"). That's different from static *mock data* (a list of users/products/
coupons as plain objects). Keeping them apart means fixtures can `import` data,
compose cleanly, and stay readable as the suite grows — they don't become one
giant junk drawer.

**Why `support/` and `utils/` are also split**: `support/` is *test
infrastructure* — it knows about `process.env`, global setup, the `test`
object. `utils/` is *pure logic* — plain functions that take inputs and return
outputs, with no idea they're running inside a test (date math, price parsing,
string formatting, custom assertions). Pure functions are trivial to unit-test
on their own and safe to reuse from page objects, fixtures or specs without
dragging in env/test coupling. If a helper needs `process.env` or `test`, it
belongs in `support/`; if it's just "transform this input into that output",
it belongs in `utils/`.

Rules for this structure:
- `pages/*Page.js` — one file per page/flow; `pages/components/` for widgets
  reused on multiple pages (modals, nav bar). Constructor declares locators
  only. Methods describe **user behavior** (`loginAs(user)`,
  `addToCart(productName)`, `makeAddressPrimary(label)`), never low-level
  actions (`clickButton1`).
- `e2e/<domain>/*.spec.js` — specs. **Assertions live here**, not in page
  objects or fixtures. Name the file after the flow, not the page object.
- `data/*.js` — plain, deterministic mock data. Never random/faker data.
- `fixtures/*.js` — Playwright `test.extend()` fixtures that compose `data/`
  into ready-to-use test setup (logged-in sessions, pre-filled carts, etc.).
- `utils/*.js` — pure helper functions with no `process.env`/`test` coupling
  (date math, price parsing, custom assertions). `support/*.js` — test
  infrastructure that *does* touch env/global setup. When in doubt: "does this
  function need to know it's running in a test?" → `support/`; "is it just
  input → output?" → `utils/`.
- When a new flow needs covering, add matching files across `e2e/`, `pages/`
  (and `data/`/`fixtures/` if it needs new data or setup) — keep naming
  symmetric (`subscription-manager.spec.js` ↔ `SubscriptionManagerPage.js`)
  so the relationship is obvious at a glance.

## Locators — priority order

1. `getByRole` (with accessible name)
2. `getByLabel`
3. `getByText` / `getByPlaceholder`
4. `data-testid` — last resort, or when role/label is ambiguous

Avoid `nth-child`, generated CSS classes, deep CSS chains.

Watch for collisions the "obvious" locator misses, e.g.:
- `getByLabel("Category")` can match both a `<select>` and an `aria-label` on a
  `<nav>` (substring + case-insensitive matching) → use `data-testid` instead.
- `getByRole("alert")` can match a real error message **and** an empty global
  toast container at the same time → target the specific element by testid.
- A nav link's accessible name can change per logged-in user (shows the user's
  name) → match by `data-testid`, not by text.

## Naming and tags

- Test names read like a spec for non-engineers: precondition + action +
  expected result (e.g. `"shows a specific error for a blocked account"`).
- Tag every `describe` with a type (`@smoke`, `@sanity`, `@regression`,
  `@negative`) and a domain (`@auth`, `@cart`, `@checkout`, `@subscriptions`...).
- Tests must be independent — no test relies on another having run first.

## Environment and secrets

Never hardcode base URLs, credentials, card numbers, API keys or tokens
directly in specs, page objects or `data/*.js` literals. The flow is:

1. **`.env`** holds the actual values for the machine running the tests
   (`BASE_URL`, `STANDARD_USER_PASSWORD`, `DUMMY_CARD_APPROVED`, ...).
   Different files per environment if needed (`.env.local`, `.env.qa`,
   `.env.staging`) — `playwright.config.js` loads the right one via `dotenv`
   based on an `ENV`/`TEST_ENV` variable, and exposes `BASE_URL` to `use.baseURL`
   so specs never read `process.env` directly for it.
2. **`support/env.js`** is the *only* place that calls `process.env` — it reads,
   validates ("fail fast if `STANDARD_USER_PASSWORD` is missing") and exports
   typed values. Nothing else touches `process.env` directly.
3. **`data/*.js`** imports from `support/env.js` to fill in the sensitive
   fields, e.g. `data/users.js`:
   ```js
   import { env } from "../support/env";
   export const users = {
     standard: { email: "standard@test.com", password: env.STANDARD_USER_PASSWORD, role: "standard" },
     blocked:  { email: "blocked@test.com",  password: env.BLOCKED_USER_PASSWORD,  role: "blocked"  },
   };
   ```
   Specs then do `users.standard`, never a literal email/password/card number.
4. **`.gitignore`**: ignore `.env` and any `.env.<environment>` that holds real
   values. **Commit `.env.example`** listing every variable name with a
   placeholder/dummy value, so the suite is reproducible without leaking
   anything and Copilot/teammates know which vars to set.

This applies even to dummy/local projects with no real secrets — the goal is
the habit, and keeping specs portable across environments (local/qa/staging)
and parallel runs without any code changes.

When generating or editing `data/*.js`, always wire sensitive fields through
`support/env.js` rather than writing literal strings — if a needed env var
doesn't exist yet, add it to `.env.example` and ask the engineer to set the
real value locally.

## When asked to generate a spec or page object

Ask for (or wait for) the locators and exact text/states the engineer observed
on the real page. Generate the Page Object first, then the spec that consumes
it — keep that order, and keep assertions out of the Page Object.
