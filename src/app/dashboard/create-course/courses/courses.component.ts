import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateNewCourseComponent } from '../create-new-course/create-new-course.component';
import { ViewHistoryComponent } from '../view-history/view-history.component';
import { Router } from '@angular/router';

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
  collectionSize: any;
  searchText:any;
  constructor(
    private courceService: CourcesService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private router:Router
  ) {
    this.getUserrole = this.authService.getRolefromlocal();
    //this.getUserrole = JSON.parse(this.authService.getRolefromlocal());
  }

  openModal(cource: any) {
    const modalRef = this.modalService.open(ViewHistoryComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: 'View History',
      data: cource,
    };
  }

  service: any = {
    page: 1,
    pageSize: 5,
    maxSize: 2,
  };

  refreshCourses() {
    console.log(this.service.page)
    this.courceService.getCources().subscribe(
      (res: any) => {
        console.log(res);
        if (res.status == 1 && res.message == 'Success') {
          this.courcesList = res.data;
          this.collectionSize = this.courcesList.length;
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getRequest(cource:any){
    this.router.navigateByUrl('/dashboard/cources/request-detail',{state:cource});
    console.log(cource)
  }

  ngOnInit(): void {
    // console.log(this.getUserrole);
    this.refreshCourses();
  }
}
