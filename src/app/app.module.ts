import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './shared/interceptor/token-interceptor';
import { AuthenticationServiceGuard } from './shared/services/guards/authentication.guards';
import { AuthorizationServiceGuard } from './shared/services/guards/authorization.guards';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxSpinnerModule } from "ngx-spinner";
import { GetareportComponent } from './getareport/getareport.component';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AppComponent, GetareportComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, NgxSpinnerModule, HttpClientModule, ToastrModule.forRoot()],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
