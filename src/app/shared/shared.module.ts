import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InputfieldDirective } from './directives/input.directive';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { PriceDirective } from './directives/price.directive';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgbdSortableHeader } from './directives/sorting.directive';

@NgModule({
  declarations: [InputfieldDirective, HeaderComponent, SidebarComponent,PriceDirective,NgbdSortableHeader],
  imports: [CommonModule, FormsModule, ReactiveFormsModule,NgbModule,Ng2SearchPipeModule],
  exports: [
    InputfieldDirective,
    HeaderComponent,
    SidebarComponent,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    PriceDirective,
    Ng2SearchPipeModule,
    NgbdSortableHeader
    //NgSelectModule
  ],
  providers: [],
})
export class SharedModule {}
