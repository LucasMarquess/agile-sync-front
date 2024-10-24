import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../app.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsSyncTrelloComponent } from './settings-sync-trello/settings-sync-trello.component';
import { DocumentationComponent } from './documentation/documentation.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatExpansionModule,
    FormsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
  ],
  declarations: [
    AppComponent,
    LayoutComponent,
    LoginFormComponent,
    DashboardComponent,
    SettingsSyncTrelloComponent,
    DocumentationComponent,
  ],
  exports: [
    AppComponent,
    LayoutComponent,
    LoginFormComponent,
    DashboardComponent,
  ],
  providers: [AuthenticationService],
})
export class ViewsModule {}
