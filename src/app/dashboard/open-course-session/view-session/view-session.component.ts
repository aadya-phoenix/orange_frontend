import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CourseSessionService } from 'src/app/shared/services/course_session/course-session.service';

@Component({
  selector: 'app-view-session',
  templateUrl: './view-session.component.html',
  styleUrls: ['./view-session.component.scss']
})
export class ViewSessionComponent implements OnInit {

  id = 0;
  sessiondata: any = {};
  getUserrole: any;
  rejectcomment:string='';
  closeResult:string = "";

  constructor(
    private courseSessionService:CourseSessionService,
    private authService:AuthenticationService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router
  ) { 
    this.getUserrole = this.authService.getRolefromlocal();
  }

  ngOnInit(): void {
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
          console.log("session data",this.sessiondata)
          this.sessiondata.metadata.forEach((element:any) => {
          });
        }
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

  updateSession(){
    this.router.navigateByUrl(`/dashboard/opensession/update/${this.id}`);
  }
}
