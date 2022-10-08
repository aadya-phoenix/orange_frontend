import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gold-tool-agree',
  templateUrl: './gold-tool-agree.component.html',
  styleUrls: ['./gold-tool-agree.component.scss']
})
export class GoldToolAgreeComponent implements OnInit {
  src = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  constructor() { }

  ngOnInit(): void {
  }

}
