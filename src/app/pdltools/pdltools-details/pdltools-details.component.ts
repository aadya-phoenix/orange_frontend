import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
  selector: 'app-pdltools-details',
  templateUrl: './pdltools-details.component.html',
  styleUrls: ['./pdltools-details.component.scss']
})
export class PdltoolsDetailsComponent implements OnInit {
  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  constructor(private modalService: NgbActiveModal, private router: Router, private commonService: CommonService) { }
  public detail: any;
  public modalType: any;
  public title: any;
  public selectedUser: any;
  public dataDetails : any;
  ngOnInit(): void {
    this.setDialogProps(this.props)
  }

  setDialogProps(dialogdata: any) {
    this.detail = dialogdata.objectDetail ? dialogdata.objectDetail : '';
    this.selectedUser = this.detail[0];
    this.detail =  this.detail[1]["learning_type"] ;
    this.title = dialogdata.title
    this.modalType = dialogdata.type;
    // this.commonService.showLoading();
  }

  closeModal() {
    this.modalService.close();
  }

  changeData(data:any){
    this.dataDetails = data.course ? data.course : [];
  }

}
