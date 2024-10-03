import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './view/login-form/login-form.component';
import { LayoutComponent } from './view/layout/layout.component';
import { MetricasComponent } from './view/metricas/metricas.component';
import { AuthGuardConst } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginFormComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuardConst],
    children: [{ path: 'metricas', component: MetricasComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
