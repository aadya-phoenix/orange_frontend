import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DnaService } from 'src/app/shared/services/dna/dna.service';

@Component({
  selector: 'app-dna-forward',
  templateUrl: './dna-forward.component.html',
  styleUrls: ['./dna-forward.component.scss']
})
export class DnaForwardComponent implements OnInit {

  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  RoleID = dataConstant.RoleID;
  getUserrole: any = {};
  dnaStatus = dataConstant.DnaStatus;
  dnaForwardForm: FormGroup;
  trackerId:number=0;
  isDomainExpert = false;
  isBussinessConsultant = false;
  isRom = false
  isLearningPartner = false;

  public titleLists: any=[];
  public modalType: any;
  public title: any;
  public learningIds:any;
  learningList:any=[];

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbActiveModal,
    private authService:AuthenticationService,
    private dnaService: DnaService,
    private commonService: CommonService,
    private router: Router
  ) { 
    this.dnaForwardForm = this.formBuilder.group({
      strategic: new FormControl('', []),
      status_comment: new FormControl('', [])
    });
    this.getUserrole = this.authService.getRolefromlocal();
    this.isRom = this.getUserrole.id == this.RoleID.Rom;
    this.isBussinessConsultant = this.getUserrole.id == this.RoleID.BussinessConsultant;
    this.isLearningPartner = this.getUserrole.id == this.RoleID.LearningPartner;
    this.isDomainExpert = this.getUserrole.id == this.RoleID.DomainExpert;
  }

  ngOnInit(): void {
    this.title =  this.props.title;
    this.learningList =  this.props.objectDetail ? this.props.objectDetail : '';
    this.learningIds = this.props.data;
    this.trackerId = this.props.trackerId;
    this.learningList.forEach((item: any) => {
      let title = this.learningIds.find((x: any) => x == item.id);
      if (title) {
        this.titleLists.push(item.title);
      }
    });
  }

  forward(status:any){
    if (this.dnaForwardForm.invalid) {
      return;
    }
    const body = this.dnaForwardForm.value;
    body.digital_learning_id = this.learningIds;
    body.status  = status;

    this.dnaService.dnaChangeStatus(body).subscribe((res: any) => {
      if(res.status == 1){
      this.commonService.hideLoading();
      if(status == this.dnaStatus.pending){
      this.commonService.toastSuccessMsg('Request', 'Successfully Forwarded.');
      }
      else{
        this.commonService.toastSuccessMsg('Request', 'Successfully Closed.');
      }
      this.modalService.close();
        this.router.navigateByUrl(`/dashboard/dna`); 
      }
      else{
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', res.message);
      }
    },(err:any)=>{
      this.commonService.hideLoading();
      this.commonService.toastErrorMsg('Error', err.message);
    })
  }

  closeModal() {
    this.modalService.close();
  }

  onClose() {
    this.passEntry.next();
    this.modalService.close();
  }

}
