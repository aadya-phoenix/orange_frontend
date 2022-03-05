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
  public courseHistory:any;
  public courseDetail:any;

  ngOnInit(): void {
    this.setDialogProps(this.props)
  }

  setDialogProps(dialogdata:any){
    this.courseHistory = dialogdata.data;
    this.courseDetail = dialogdata.data1;
    console.log(this.courseHistory);
  }

}
