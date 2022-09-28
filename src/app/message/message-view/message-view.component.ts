import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { MessageService } from 'src/app/shared/services/message/message.service';

@Component({
  selector: 'app-message-view',
  templateUrl: './message-view.component.html',
  styleUrls: ['./message-view.component.scss']
})
export class MessageViewComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  constructor(private modalService: NgbActiveModal, private messageService: MessageService, private commonService: CommonService) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
  }
  public messageList: any;
  ngOnInit(): void {
    this.setDialogProps(this.props)
  }

  setDialogProps(dialogdata: any) {
    this.commonService.showLoading();
    this.messageService.getActiveMessage().subscribe((res: any) => {
      this.commonService.hideLoading();
      if (res && res.status == 1) {
        this.messageList = res.data;
      }
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
