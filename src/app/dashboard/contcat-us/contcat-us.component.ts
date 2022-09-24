import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { UserManageService } from 'src/app/shared/services/user-management/user-manage.service';

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
      regional_cordinator: new FormControl('', [Validators.required]),
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
    // this.userManageService.ContcatUs(body).subscribe(
    //   (res: any) => {
    //     if (res && res.status) {
    //       const tokenDetails = {
    //         access_token: res.data,
    //         expires_in: 0,
    //         refresh_token: "",
    //         token_type: "Bearer"
    //       }
    //       localStorage.setItem('loginDetails', JSON.stringify(tokenDetails));
    //       this.lastLogin();
    //       this.authService.getProfileDetails().subscribe((profile) => {
    //         // this.authService.getRoles().subscribe((res: any) => {
    //         //   allroles = res.data;
    //         //   allroles.find((currentrole: any) => {
    //         //     if (currentrole.id === profile.data.role_id) {
    //         //       roleObj = currentrole;
    //         //     }
    //         //   });
    //         //   this.commonService.hideLoading();
    //         //   localStorage.setItem('role', JSON.stringify(roleObj));
    //         // });
    //         localStorage.setItem('profileDetails', JSON.stringify(profile));
    //         let params = this.route.snapshot.queryParams;
    //         if (params['redirectURL']) {
    //           this.router.navigate([params['redirectURL']]);
    //         } else {
    //           this.router.navigate(['/']).then(() => {
    //             window.location.reload();
    //           });
    //         }
    //       });
    //       this.commonService.hideLoading();
    //       this.modalService.close();
    //     }
    //     else {
    //       this.commonService.toastErrorMsg('Error', res.message);
    //       this.commonService.hideLoading();
    //     }
    //   },
    //   (err: any) => {
    //     this.commonService.hideLoading();
    //     this.commonService.toastErrorMsg('Error', err.message);
    //   }
    // );
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
