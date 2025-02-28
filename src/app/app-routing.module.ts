import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './view/login-form/login-form.component';
import { LayoutComponent } from './view/layout/layout.component';
import { DashboardComponent } from './view/dashboard/dashboard.component';
import { SettingsSyncTrelloComponent } from './view/settings-sync-trello/settings-sync-trello.component';
import { DocumentationComponent } from './view/documentation/documentation.component';
import { AuthGuardConst } from './services/guards/auth.guard';

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
export class AppRoutingModule { }
