import { Directive,HostListener } from '@angular/core';

@Directive({
  selector: '[Inputfield]'
})
export class InputfieldDirective {

  constructor() { }
  @HostListener('keypress',['$event']) keypress(event: KeyboardEvent) { 
    console.log(event)
    var k = event.charCode;  
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 )
    
  }

}
