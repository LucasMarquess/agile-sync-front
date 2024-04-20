export class AuthenticationModel {
  user!: string;
  password!: string;

  constructor(init: Partial<AuthenticationModel>) {
    Object.assign(this, init);
  }
}
