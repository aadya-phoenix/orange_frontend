import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DesignLearningService } from 'src/app/shared/services/design-learning/design-learning.service';

@Component({
  selector: 'app-design-learning-chat',
  templateUrl: './design-learning-chat.component.html',
  styleUrls: ['./design-learning-chat.component.scss']
})
export class DesignLearningChatComponent implements OnInit {

  designId:number = 0;
  isSubmitted = false;
  status:string='';
  designStatus = dataConstant.DesignStatus;
  RoleID = dataConstant.RoleID;
  isChange = false;
  isFeedback = false;
  comment:string='';

  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  public chatList: any;
  public objectDetail: any;
  public modalType: any;
  public title: any;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbActiveModal,
    private designService: DesignLearningService,
    private commonService: CommonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.objectDetail = this.props.objectDetail ? this.props.objectDetail : '';
    this.designId = this.props.data;
    this.status = this.props.status;
    this.getChat();
  }

  getChat(){
    this.commonService.showLoading();
    this.designService.getDesignChats(this.designId).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 ) {
          this.chatList = res.data;
        }
      },
      (err: any) => {
        this.commonService.errorHandling(err);
        this.commonService.hideLoading();
    });
  }

  submit(){
    this.commonService.showLoading();
    this.designService.setDesignChats({comment:this.comment,id:this.designId}).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 ) {
          this.chatList = res.data;
          this.getChat();
        }
      },
      (err: any) => {
        this.commonService.errorHandling(err);
        this.commonService.hideLoading();
    });
  }

  closeModal() {
    this.modalService.close();
  }

  onClose() {
    this.passEntry.next();
    this.modalService.close();
  }
}
