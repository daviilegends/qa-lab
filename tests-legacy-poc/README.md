# Legacy POC suite — archived

These specs/page-objects/fixtures were written WITH access to the app's source code
(white-box). They served their purpose: proving the MiniCommerce QA Lab flows work
end-to-end (24 passing tests across auth, cart, checkout, PLP and subscriptions).

They are kept here for reference only and are NOT part of the active suite
(playwright.config.js -> testDir: "./tests/e2e" no longer points here).

The active suite under /tests is being rebuilt from scratch using a black-box
approach — as if we only had access to the running website, not the code —
to practice real-world QA automation discovery (inspecting the rendered app,
deciding locators, building POM incrementally). See PW-GUIDE.md for the process.
