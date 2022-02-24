import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-history',
  templateUrl: './view-history.component.html',
  styleUrls: ['./view-history.component.scss']
})
export class ViewHistoryComponent implements OnInit {
  @Input() props: any;
  constructor(private modalService:NgbActiveModal) { }

  ngOnInit(): void {
    this.setDialogProps(this.props)
  }

  setDialogProps(dialogdata:any){
    console.log(dialogdata)
  }

}