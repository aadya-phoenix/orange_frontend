import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { UserManageService } from 'src/app/shared/services/user-management/user-manage.service';

@Component({
  selector: 'app-switch-user',
  templateUrl: './switch-user.component.html',
  styleUrls: ['./switch-user.component.scss']
})
export class SwitchUserComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  getUserrole: any;
  userName: any;
  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  isSubmitted = false;
  loginForm: FormGroup;
  userList: any = [];
  isAdmin = false;
  public historyList: any;
  public objectDetail: any;
  public modalType: any;
  public title: any;
  copyDeletecourse: any;

  constructor(private modalService: NgbActiveModal,
    private authService: AuthenticationService,
    private userManageService: UserManageService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {
    this.userName = this.authService.getProfileDetailsfromlocal();
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.isAdmin = this.userName.admin == 1 ? true : false;
    this.loginForm = this.formBuilder.group({
      uid: new FormControl('', [Validators.required])
    });
  }
  ngOnInit(): void {
    if (this.isAdmin) {
      this.getUsers();
    }
    else {
      this.getROMUsers();
    }
  }

  requiredMessage(field: any) {
    return this.lableConstant.form_fieldname_cannot_be_blank.replace('<form fieldname>', field).replace('<nom du champ>', field);
  }

  getUsers() {
    this.commonService.showLoading();
    this.userManageService.getUsers().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.userList = res.data;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getROMUsers() {
    this.commonService.showLoading();
    this.authService.getROMROCList(this.userName.data.id).subscribe((res: any) => {
      this.commonService.hideLoading();
      this.userList = res.data;
    }, (err: any) => {
      this.commonService.hideLoading();
      this.commonService.toastErrorMsg('Error', err.message);
    })
  }

  setDialogProps(dialogdata: any) {
  }

  closeModal() {
    this.modalService.close();
  }

  login() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    const body = this.loginForm.value;
    this.commonService.showLoading();
    let allroles;
    let roleObj: any;
    this.userManageService.switchUser(body).subscribe(
      (res: any) => {
        if (res && res.status) {
          const tokenDetails = {
            access_token: res.data,
            expires_in: 0,
            refresh_token: "",
            token_type: "Bearer"
          }
          localStorage.setItem('loginDetails', JSON.stringify(tokenDetails));
          this.lastLogin();
          this.authService.getProfileDetails().subscribe((profile) => {
            // this.authService.getRoles().subscribe((res: any) => {
            //   allroles = res.data;
            //   allroles.find((currentrole: any) => {
            //     if (currentrole.id === profile.data.role_id) {
            //       roleObj = currentrole;
            //     }
            //   });
            //   this.commonService.hideLoading();
            //   localStorage.setItem('role', JSON.stringify(roleObj));
            // });
            localStorage.setItem('profileDetails', JSON.stringify(profile));
            let params = this.route.snapshot.queryParams;
            if (params['redirectURL']) {
              this.router.navigate([params['redirectURL']]);
            } else {
              this.router.navigate(['/dashboard']).then(() => {
                window.location.reload();
              });
            }
          });
          this.commonService.hideLoading();
          this.modalService.close();
        }
        else {
          this.commonService.toastErrorMsg('Error', res.message);
          this.commonService.hideLoading();
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
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
