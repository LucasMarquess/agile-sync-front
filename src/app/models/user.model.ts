export class UserModel {
    login!: string;
    password!: string;
    email!: string;
    role!: string;

    constructor(init: Partial<UserModel>) {
        Object.assign(this, init);
    }
}