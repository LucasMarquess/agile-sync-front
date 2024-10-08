import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './view/login-form/login-form.component';
import { LayoutComponent } from './view/layout/layout.component';
import { AuthGuardConst } from './guards/auth.guard';
import { DashboardComponent } from './view/dashboard/dashboard.component';
import { SettingsSyncComponent } from './view/settings-sync/settings-sync.component';
import { DocumentationComponent } from './view/documentation/documentation.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginFormComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuardConst],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'settings-trello', component: SettingsSyncComponent },
      { path: 'documentation', component: DocumentationComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
