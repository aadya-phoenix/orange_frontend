import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InputfieldDirective } from './directives/input.directive';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [InputfieldDirective, HeaderComponent, SidebarComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [
    InputfieldDirective,
    HeaderComponent,
    SidebarComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
})
export class SharedModule {}
