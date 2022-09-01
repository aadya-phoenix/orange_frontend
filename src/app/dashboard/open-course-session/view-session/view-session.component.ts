import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { CourseSessionService } from 'src/app/shared/services/course_session/course-session.service';

const urlregex = dataConstant.UrlPattern;
@Component({
  selector: 'app-view-session',
  templateUrl: './view-session.component.html',
  styleUrls: ['./view-session.component.scss']
})
export class ViewSessionComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  public publishForm!: FormGroup;
  isStaff = false;
  id = 0;
  status:any;
  status_show:string='';
  sessiondata: any = {};
  getUserrole: any;
  userDetails:any;
  rejectcomment:string='';
  publishComment:string='';
  closeResult:string = "";
  cordinatorsList: any = [];
  roleuserlist: any = [];
  selectedotherRoc: any;
  transfercomment:string='';

  constructor(
    private fb: FormBuilder,
    private courseSessionService:CourseSessionService,
    private courseService:CourcesService,
    private commonService: CommonService,
    private authService:AuthenticationService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router,
    private datepipe: DatePipe
  ) { 
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.getUserrole = this.authService.getRolefromlocal();
    this.userDetails = this.authService.getUserDetailslocal();
    this.isStaff = this.userDetails.staff == 1 ? true : false;
  }

  ngOnInit(): void {
    this.getRoleUsers();
    this.publishForm = this.fb.group({
     /*  intranet_url: new FormControl('', [
        Validators.required,
        Validators.pattern(urlregex),
      ]),
      internet_url: new FormControl('', [
        Validators.required,
        Validators.pattern(urlregex),
      ]), */
      status_comment: new FormControl('', [
        Validators.required
      ]),
    });

    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.id = Id ? parseInt(Id) : 0;
      this.getSessionDetails();
    });
    
  }

  getSessionDetails(){
    this.commonService.showLoading();
    this.courseSessionService.getSessionDetails(this.id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.sessiondata = res.data;
          this.status = this.sessiondata.status;
          this.status_show = this.sessiondata.status_show;

          this.sessiondata.metadata.forEach((element:any) => {
            element.email = JSON.parse(element.email_participant);
            element.break_data = JSON.parse(element.break);
            element.training_cost_euro = '€ ' + (element.training_cost != null ? element.training_cost : 0) ;
            element.end_date = this.datepipe.transform(element.end_date,'dd-MM-yyyy');
            element.start_date = this.datepipe.transform(element.start_date,'dd-MM-yyyy');
            element.registration_deadline = this.datepipe.transform(element.registration_deadline,'dd-MM-yyyy');
          });
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  getCordinators() {
    this.courseService.getNewregionalCordinator().subscribe(
      (res: any) => {
        
        this.cordinatorsList = res.data;
      },
      (err: any) => {
        this.commonService.errorHandling(err);
      }
    );
  }

  open(content: any) {
    this.modalService
      .open(content, { size: "sm", backdrop: "static" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  reject() {
    let statusobj = { session_id: this.id, status: 'reject', status_comment: this.rejectcomment }
    this.courseSessionService.changeStatusSession(statusobj).subscribe((res: any) => {
      
      this.router.navigate(['/dashboard/sct']);
    }, (err: any) => {
      this.commonService.errorHandling(err);
    })
  }

  publishRequest() {
    let publishobj = { session_id: this.id, status: 'publish', status_comment: this.publishForm.value.status_comment };
    if (this.publishForm.valid) {
      this.courseSessionService.changeStatusSession(publishobj).subscribe(
        (res: any) => {
          
          if (res) {
            this.router.navigate(['/dashboard/sct']);
          }
        },
        (err: any) => {
          this.commonService.errorHandling(err);
        }
      );
    }
    else {
    }
  }

  getRoleUsers(){
    this.authService.getUserRoles().subscribe((res: any) => {    
      this.roleuserlist = res.data;
    }, (err: any) => {
      this.commonService.errorHandling(err);
    })
  }

  getRoc(event:any){
    let region = this.roleuserlist[3];

    region.forEach((field: any) => {
      if (field.region_id == event.target.value) {
        this.selectedotherRoc = field.id;
      }
    });
  }

  transfertoOtherRoc(){
    if (this.selectedotherRoc) {
      let transferobj = { session_id: this.id, status: 'pending', transfer_id: this.selectedotherRoc, status_comment: this.transfercomment};
      this.courseSessionService.courseSessionTransfer(transferobj).subscribe((res: any) => {
        
        this.router.navigate(['/dashboard/sct']);
      }, (err: any) => {
        this.commonService.errorHandling(err);
      })
    }
  }

  updateSession(){
    this.router.navigateByUrl(`/dashboard/sct/update/${this.id}`);
  }
}
