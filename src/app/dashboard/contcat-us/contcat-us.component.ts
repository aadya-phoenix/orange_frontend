import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { UserManageService } from 'src/app/shared/services/user-management/user-manage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contcat-us',
  templateUrl: './contcat-us.component.html',
  styleUrls: ['./contcat-us.component.scss']
})
export class ContcatUsComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  cordinatorsList = [];
  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  isSubmitted = false;
  contactUsForm: FormGroup;

  constructor(private modalService: NgbActiveModal,
    private authService: AuthenticationService,
    private userManageService: UserManageService,
    private courseService: CourcesService,
    private commonService: CommonService,
    private formBuilder: FormBuilder) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.contactUsForm = this.formBuilder.group({
      region: new FormControl('', [Validators.required]),
      subject: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required])
    });
  }
  ngOnInit(): void {
    this.getCordinators();
  }

  requiredMessage(field: any) {
    return this.lableConstant.form_fieldname_cannot_be_blank.replace('<form fieldname>', field).replace('<nom du champ>', field);
  }

  //get regional cordinators
  getCordinators() {
    this.commonService.showLoading();
    this.courseService.getNewregionalCordinator().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.cordinatorsList = res.data.filter((x: {
          status: number;
        }) => x.status == 1);
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }


  closeModal() {
    this.modalService.close();
  }

  submit() {
    this.isSubmitted = true;
    if (this.contactUsForm.invalid) {
      return;
    }
    const body = this.contactUsForm.value;
    this.commonService.showLoading();
    this.userManageService.contcatUs(body).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.modalService.close();
        Swal.fire(
          'Message Sent!',
          'Your message sent to Regional Operation Coordinator.',
          'success'
        )
      }, (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      });
  }

  lastLogin() {
    this.authService.lastLogin().subscribe(res => {
    }, err => {
      this.commonService.errorHandling(err);
    })
  }

  onClose() {
    this.passEntry.next();
    this.modalService.close();
  }
}
