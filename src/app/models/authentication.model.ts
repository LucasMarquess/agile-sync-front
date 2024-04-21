export class AuthenticationModel {
  login!: string;
  password!: string;

  constructor(init: Partial<AuthenticationModel>) {
    Object.assign(this, init);
  }
}
