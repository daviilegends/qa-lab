export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Password");
    this.submitButton = page.getByRole("button", { name: "Log in" });
    this.errorMessage = page.getByTestId("login-error");
  }

  async goto() {
    await this.page.goto("/login");
  }

  async loginAs(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
