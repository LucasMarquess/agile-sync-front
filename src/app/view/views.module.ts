import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from '../app-routing.module';
import { AuthenticationService } from '../services/authentication.service';
import { TrelloIntegrationStore } from '../services/stores/integrations-trello.store';
import { IntegrationsStore } from '../services/stores/integrations.store';
import { ReportsStore } from '../services/stores/reports.store';
import { CfdGraphicComponent } from './cfd-graphic/cfd-graphic.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { SettingsSyncTrelloComponent } from './settings-sync-trello/settings-sync-trello.component';

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
    MatSelectModule,
    MatTableModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatExpansionModule,
    FormsModule,
    MatPaginatorModule,
    ToastrModule.forRoot(),
    HttpClientModule,
  ],
  declarations: [
    LayoutComponent,
    LoginFormComponent,
    DashboardComponent,
    SettingsSyncTrelloComponent,
    DocumentationComponent,
    CfdGraphicComponent,
  ],
  exports: [LayoutComponent, LoginFormComponent, DashboardComponent],
  providers: [AuthenticationService, IntegrationsStore, TrelloIntegrationStore, ReportsStore],
})
export class ViewsModule {}
