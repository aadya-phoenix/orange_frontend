import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appPrice]'
})
export class PriceDirective {

  constructor() { }
   count = 0;

  @HostListener('keypress',['$event']) keypress(event: any) {  

    const reg = /^-?\d*(\.\d{0,3})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode) ;
 
    if (!reg.test(input)) {
        event.preventDefault();
    }

  }  

}