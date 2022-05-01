import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { CourseSessionService } from 'src/app/shared/services/course_session/course-session.service';

const urlregex = dataConstant.UrlPattern;
@Component({
  selector: 'app-view-session',
  templateUrl: './view-session.component.html',
  styleUrls: ['./view-session.component.scss']
})
export class ViewSessionComponent implements OnInit {

  public publishForm!: FormGroup;
  
  id = 0;
  status:any;
  sessiondata: any = {};
  getUserrole: any;
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
    private authService:AuthenticationService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router
  ) { 
    this.getUserrole = this.authService.getRolefromlocal();
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
    this.courseSessionService.getSessionDetails(this.id).subscribe(
      (res: any) => {
        if (res.status === 1 && res.message === 'Success') {
          this.sessiondata = res.data;
          this.status = this.sessiondata.status;
          console.log("session data",this.sessiondata);

          this.sessiondata.metadata.forEach((element:any) => {
            element.email = JSON.parse(element.email_participant);
            element.break_data = JSON.parse(element.break);
            console.log("break data",element.break_data);
          });
          console.log(this.sessiondata);
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getCordinators() {
    this.courseService.getNewregionalCordinator().subscribe(
      (res: any) => {
        console.log(res);
        this.cordinatorsList = res.data;
      },
      (err: any) => {
        console.log(err);
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
      console.log(res);
      this.router.navigate(['/dashboard/opensession']);
    }, (err: any) => {
      console.log(err)
    })
  }

  publishRequest() {
    let publishobj = { session_id: this.id, status: 'publish', status_comment: this.publishForm.value.status_comment };
    if (this.publishForm.valid) {
      this.courseSessionService.changeStatusSession(publishobj).subscribe(
        (res: any) => {
          console.log(res);
          if (res) {
            this.router.navigate(['/dashboard/opensession']);
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
    else {
      console.log("form invalid");
    }
  }

  getRoleUsers(){
    this.authService.getUserRoles().subscribe((res: any) => {    
      this.roleuserlist = res.data;
    }, (err: any) => {
      console.log(err)
    })
  }

  getRoc(event:any){
    let region = this.roleuserlist[3];
    console.log(region);

    region.forEach((field: any) => {
      if (field.region_id == event.target.value) {
        this.selectedotherRoc = field.id;
        console.log(this.selectedotherRoc);
      }
    });
  }

  transfertoOtherRoc(){
    if (this.selectedotherRoc) {
      let transferobj = { session_id: this.id, status: 'pending', transfer_id: this.selectedotherRoc, status_comment: this.transfercomment};
      this.courseSessionService.courseSessionTransfer(transferobj).subscribe((res: any) => {
        console.log(res);
        this.router.navigate(['/dashboard/opensession']);
      }, (err: any) => {
        console.log(err)
      })
    }
  }

  updateSession(){
    this.router.navigateByUrl(`/dashboard/opensession/update/${this.id}`);
  }
}
