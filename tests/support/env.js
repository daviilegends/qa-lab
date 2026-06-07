// Centralized environment access for Playwright tests
// Expose only the variables tests need, with safe defaults for local dev.
export const env = {
  STANDARD_USER_EMAIL: process.env.STANDARD_USER_EMAIL ?? 'standard@test.com',
  STANDARD_USER_PASSWORD: process.env.STANDARD_USER_PASSWORD ?? 'Password123',
};

// Helper to require that a variable is set in environments like CI
export function requireEnv(name) {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env var: ${name}`);
  return val;
}
