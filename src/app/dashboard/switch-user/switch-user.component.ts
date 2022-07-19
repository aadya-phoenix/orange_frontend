import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CarouselService } from 'src/app/shared/services/carousel/carousel.service';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
  selector: 'app-switch-user',
  templateUrl: './switch-user.component.html',
  styleUrls: ['./switch-user.component.scss']
})
export class SwitchUserComponent implements OnInit {

  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  isSubmitted = false;
  loginForm: FormGroup;
  public historyList: any;
  public objectDetail: any;
  public modalType: any;
  public title: any;
  copyDeletecourse: any;
  public emails: any = [{
    id:'123', name:'Summit Maggu'
  },{
    id:'123', name:'Asia Pacific'
  }];
  
  constructor(private modalService: NgbActiveModal, private carouselService: CarouselService,  private commonService: CommonService, private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required])
    });
   }
  ngOnInit(): void {
    this.setDialogProps(this.props)
  }

  setDialogProps(dialogdata: any) {
  }

  closeModal() {
    this.modalService.close();
  }
  
  login(){
    this.isSubmitted = true;
  }

  onClose() {
    this.passEntry.next();
    this.modalService.close();
  }
}
