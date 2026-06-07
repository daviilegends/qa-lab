
export class LoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Log in' });
    this.loginError = page.getByTestId('login-error');
    this.accountNavLink = page.getByTestId('nav-account-link');
    this.logoutButton = page.getByTestId('logout-button');
    this.navLoginLink = page.getByTestId('nav-login-link');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

