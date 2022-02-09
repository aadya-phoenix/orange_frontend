import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InputfieldDirective } from './directives/input.directive';

@NgModule({
  declarations: [InputfieldDirective],
  imports: [CommonModule],
  exports: [InputfieldDirective],
  providers: [],
})
export class SharedModule {}
