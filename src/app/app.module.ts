import { BrowserModule } from '@angular/platform-browser';
import {NgModule, Renderer2} from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { VialsComponent } from './vials/vials.component';
import { PlatesComponent } from './plates/plates.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import {AuthService} from './auth/auth.service';
import { DropdownDirective } from './shared/dropdown.directive';
import { RegisterVialsComponent } from './vials/register-vials/register-vials.component';
import {AgGridModule} from 'ag-grid-angular';
import { VialsToPlatesComponent } from './vials/vials-to-plates/vials-to-plates.component';
import {VialsService} from './vials/vials.service';
import {FileHelpersModule} from 'ngx-file-helpers';
import {PapaParseModule} from 'ngx-papaparse';
import {DataStorageService} from './shared/data-storage.service';
import { ImportFileComponent } from './shared/import-file/import-file.component';
import {CsrfInterceptor} from './shared/csrf.interceptor';
import {CookieModule} from 'ngx-cookie';
import { FeedbackGridComponent } from './shared/feedback-grid/feedback-grid.component';
import {FileManagerService} from './shared/file-manager.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NotFoundComponent,
    VialsComponent,
    PlatesComponent,
    HomeComponent,
    SigninComponent,
    SignupComponent,
    DropdownDirective,
    RegisterVialsComponent,
    VialsToPlatesComponent,
    ImportFileComponent,
    FeedbackGridComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    CookieModule.forRoot(),
    AgGridModule.withComponents([]),
    FileHelpersModule,
    PapaParseModule,
  ],
  providers: [
    AuthService,
    VialsService,
    DataStorageService,
    FileManagerService,
    {provide: HTTP_INTERCEPTORS, useClass: CsrfInterceptor, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
