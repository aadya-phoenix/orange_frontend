import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InputfieldDirective } from './directives/input.directive';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  declarations: [InputfieldDirective, HeaderComponent, SidebarComponent],
  imports: [CommonModule],
  exports: [InputfieldDirective, HeaderComponent, SidebarComponent],
  providers: [],
})
export class SharedModule {}
