import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewHistoryComponent } from '../view-history/view-history.component';
import { Router } from '@angular/router';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';

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
  searchText: any;
  draftRequests:any =[];
  pendingRequests:any=[];
  rejectedRequests:any=[];
  closedRequests:any=[];
  public compare = (v1: string | number, v2: string | number) =>
    v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor(
    private courceService: CourcesService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private router: Router
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

  onSort({ column, direction }: any) {
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.courcesList = this.courcesList;
    } else {
      this.courcesList = [...this.courcesList].sort((a, b) => {
        const res = this.compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  getrecords(data:any){
    this.courcesList = data;
  }

  refreshCourses() {
    console.log(this.service.page);
    console.log(this.service.pageSize);
    this.courceService.getCources().subscribe(
      (res: any) => {
        console.log(res);
        if (res.status == 1 && res.message == 'Success') {
          this.courcesList = res.data;
          this.collectionSize = this.courcesList.length;
          this.courcesList.map((course:any)=>{
            if(course.status === 'pending'){
              this.pendingRequests.push(course)
            }
            if(course.status === 'reject'){
              this.rejectedRequests.push(course)
            }
            if(course.status === 'draft'){
              this.draftRequests.push(course)
            }
            if(course.status === 'close'){
              this.closedRequests.push(course)
            }
      
          })
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getRequest(cource: any) {
    this.router.navigateByUrl('/dashboard/cources/request-detail', {
      state: cource,
    });
    console.log(cource);
  }

  ngOnInit(): void {
    // console.log(this.getUserrole);
    this.refreshCourses();

    
  }
}
