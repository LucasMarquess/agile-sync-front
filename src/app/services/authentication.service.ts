import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticationStore } from './stores/authentication.store';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserTokenSubject: BehaviorSubject<string | null>;
  public currentUserToken: Observable<string | null>;

  constructor(private authenticationStore: AuthenticationStore) {
    const storedUser = localStorage.getItem('currentUserToken');
    this.currentUserTokenSubject = new BehaviorSubject<string | null>(
      storedUser ? storedUser : null
    );
    this.currentUserToken = this.currentUserTokenSubject.asObservable();
  }

  public get currentUserTokenValue(): string | null {
    return this.currentUserTokenSubject.getValue();
  }

  saveLogin(token: string) {
    const object = JSON.parse(atob(token.split('.')[1]));
    localStorage.setItem('currentUserToken', token);
    localStorage.setItem('userName', object.sub);
    this.currentUserTokenSubject.next(token);
  }

  logout() {
    localStorage.removeItem('currentUserToken');
    localStorage.removeItem('userName');
    this.currentUserTokenSubject.next(null);
  }

  //TODO verificar necessidade
  setUserName(username: string) {
    localStorage.setItem('username', JSON.stringify(username));
  }

  getUserName() {
    return JSON.parse(localStorage.getItem('userName') || 'null');
  }
}
