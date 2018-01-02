import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatMenuModule, MatSelectModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule
} from '@angular/material';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormSameSpeciesComponent } from './components/form-same-species/form-same-species.component';
import { FormDistinctSpeciesComponent } from './components/form-distinct-species/form-distinct-species.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {SpeciesService} from './services/species.service';
import { InteractomeService } from './services/interactome.service';
import { GeneService } from './services/gene.service';
import { InteractionService } from './services/interaction.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { TabgroupComponent } from './components/tabgroup/tabgroup.component';
import { LoginComponent } from './components/login/login.component';
import { UserService } from './services/user.service';
import { DialogComponent } from './components/dialog/dialog.component';
import { UserManagerComponent } from './components/user-manager/user-manager.component';
import {AdminService} from './services/admin.service';
import {AuthInterceptor} from './classes/auth.interceptor';
import {AuthService} from './services/auth.service';

@NgModule({
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatIconModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatAutocompleteModule,
    MatCardModule,
    MatDialogModule,
    MatMenuModule,
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatIconModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatAutocompleteModule,
    MatCardModule,
    MatDialogModule,
    MatMenuModule,
  ],
})
export class MaterialModule { }

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FormSameSpeciesComponent,
    FormDistinctSpeciesComponent,
    TabgroupComponent,
    LoginComponent,
    DialogComponent,
    UserManagerComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    SpeciesService,
    InteractomeService,
    GeneService,
    InteractionService,
    UserService,
    AdminService,
    AuthService,
  ],
  entryComponents: [
    DialogComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
