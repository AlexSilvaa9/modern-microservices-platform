import { Page, Locator } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly googleButton: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByTestId('register-username-input');
    this.emailInput = page.getByTestId('register-email-input');
    this.passwordInput = page.getByTestId('register-password-input');
    this.submitButton = page.getByTestId('register-submit-button');
    this.googleButton = page.getByTestId('register-google-button');
    this.loginLink = page.getByTestId('register-login-link');
  }

  async navigate() {
    await this.page.goto('/auth/register');
  }

  async register(username: string, email: string, pass: string) {
    await this.usernameInput.fill(username);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.submitButton.click();
  }

  async goToLogin() {
    await this.loginLink.click();
  }
}
