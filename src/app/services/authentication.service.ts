import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticationStore } from './stores/authentication.store';
import { Route, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserTokenSubject: BehaviorSubject<string | null>;
  public currentUserToken: Observable<string | null>;

  constructor(
    private authenticationStore: AuthenticationStore,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUserToken');
    this.currentUserTokenSubject = new BehaviorSubject<string | null>(
      storedUser ? storedUser : null
    );
    this.currentUserToken = this.currentUserTokenSubject.asObservable();
  }

  public get currentUserTokenValue(): string | null {
    return this.currentUserTokenSubject.getValue();
  }

  get username(): string | null {
    return localStorage.getItem('username');
  }

  saveLogin(token: string) {
    const object = JSON.parse(atob(token.split('.')[1]));
    localStorage.setItem('currentUserToken', token);
    localStorage.setItem('username', object.sub);
    this.currentUserTokenSubject.next(token);
  }

  logout() {
    localStorage.removeItem('currentUserToken');
    localStorage.removeItem('username');
    this.currentUserTokenSubject.next(null);
    this.router.navigate(['login']);
  }
}
