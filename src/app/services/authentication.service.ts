import { UserModel } from 'src/app/models/user.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticationStore } from './stores/authentication.store';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<UserModel | null>;
  public currentUser: Observable<UserModel | null>;

  constructor(private authenticationStore: AuthenticationStore) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<UserModel | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserModel | null {
    return this.currentUserSubject.getValue();
  }

  //TODO - Passar para o componente ou não
  login(user: UserModel) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  //TODO - Passar para o componente ou não
  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('username');
    this.currentUserSubject.next(null);
  }

  setUserName(username: string) {
    localStorage.setItem('username', JSON.stringify(username));
  }

  getUserName() {
    return JSON.parse(localStorage.getItem('username') || 'null');
  }
}
