import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardConst } from './services/guards/auth.guard';
import { DashboardComponent } from './view/dashboard/dashboard.component';
import { LayoutComponent } from './view/layout/layout.component';
import { LoginFormComponent } from './view/login-form/login-form.component';
import { SettingsSyncTrelloComponent } from './view/settings-sync-trello/settings-sync-trello.component';

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
      { path: 'settings-trello', component: SettingsSyncTrelloComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
