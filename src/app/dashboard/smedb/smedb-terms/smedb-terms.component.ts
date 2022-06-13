import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-smedb-terms',
  templateUrl: './smedb-terms.component.html',
  styleUrls: ['./smedb-terms.component.scss']
})
export class SmedbTermsComponent implements OnInit {

  constructor(private modalService: NgbActiveModal, ) { }

  ngOnInit(): void {
  }

  closeModal() {
    this.modalService.close();
  }

}
