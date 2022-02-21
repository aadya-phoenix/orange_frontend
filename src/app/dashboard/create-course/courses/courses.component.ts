import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateNewCourseComponent } from '../create-new-course/create-new-course.component';
import { ViewHistoryComponent } from '../view-history/view-history.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
  public courcesList: any;
  public page = 1;
  getUserprofile: any;
  getUserrole: any;
  constructor(
    private courceService: CourcesService,
    private authService: AuthenticationService,
    private modalService: NgbModal
  ) {
    this.getUserrole = this.authService.getRolefromlocal();
  }

  openModal(cource:any) {
    const modalRef = this.modalService.open(ViewHistoryComponent, {
      centered: true,
      size: 'md',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props ={
      title:'View History',
      data:cource
    }
  }

  ngOnInit(): void {
    console.log(this.getUserrole);

    this.courceService.getCources().subscribe(
      (res: any) => {
        console.log(res);
        if (res.status == 1 && res.message == 'Success') {
          this.courcesList = res.data;
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
}
