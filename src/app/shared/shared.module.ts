import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InputfieldDirective } from './directives/input.directive';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { PriceDirective } from './directives/price.directive';

@NgModule({
  declarations: [InputfieldDirective, HeaderComponent, SidebarComponent,PriceDirective],
  imports: [CommonModule, FormsModule, ReactiveFormsModule,NgbModule,],
  exports: [
    InputfieldDirective,
    HeaderComponent,
    SidebarComponent,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    PriceDirective,
    //NgSelectModule
  ],
  providers: [],
})
export class SharedModule {}
