import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'layout-component',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  shouldShowLayout(): boolean {
    return this.router.url !== '/login';
  }

  logout() {
    this.authService.logout();
  }
}
