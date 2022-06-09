import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
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

  dnaStatus = dataConstant.DnaStatus;
  dnaForwardForm: FormGroup;

  public titleLists: any;
  public modalType: any;
  public title: any;
  public learningIds:any;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbActiveModal,
    private dnaService: DnaService,
    private commonService: CommonService,
    private router: Router
  ) { 
    this.dnaForwardForm = this.formBuilder.group({
      strategic: new FormControl('', []),
      status_comment: new FormControl('', [])
    });
  }

  ngOnInit(): void {
    this.titleLists = this.props.objectDetail ? this.props.objectDetail : '';
    this.learningIds = this.props.data;
  }

  forward(){
    if (this.dnaForwardForm.invalid) {
      return;
    }
    const body = this.dnaForwardForm.value;
    body.digital_learning_id = this.learningIds;
    body.status  = this.dnaStatus.pending;

    this.dnaService.dnaChangeStatus(body).subscribe((res: any) => {
      if(res.status == 1){
      this.commonService.hideLoading();
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

  getStrategic(event:any){}

  closeModal() {
    this.modalService.close();
  }

  onClose() {
    this.passEntry.next();
    this.modalService.close();
  }

}
