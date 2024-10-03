import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticationStore } from './stores/authentication.store';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<string | null>;
  public currentUser: Observable<string | null>;

  constructor(private authenticationStore: AuthenticationStore) {
    const storedUser = localStorage.getItem('currentUserToken');
    this.currentUserSubject = new BehaviorSubject<string | null>(
      storedUser ? storedUser : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): string | null {
    return this.currentUserSubject.getValue();
  }

  saveLogin(token: string) {
    const object = JSON.parse(atob(token.split('.')[1]));
    localStorage.setItem('currentUserToken', token);
    localStorage.setItem('userName', object.sub);
    this.currentUserSubject.next(token);
  }

  logout() {
    localStorage.removeItem('currentUserToken');
    localStorage.removeItem('userName');
    this.currentUserSubject.next(null);
  }

  //TODO verificar necessidade
  setUserName(username: string) {
    localStorage.setItem('username', JSON.stringify(username));
  }

  getUserName() {
    return JSON.parse(localStorage.getItem('userName') || 'null');
  }
}
