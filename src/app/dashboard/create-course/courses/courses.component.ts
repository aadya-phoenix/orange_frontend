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
  usersubmitRequests:any=[];
  rejectedRequests:any=[];
  closedRequests:any=[];
  submittedRequests:any=[]
  allCourses:any;
  routegetdata:any;
  getprofileDetails:any;
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
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.routegetdata = this.router.getCurrentNavigation()?.extras.state;
    if(!this.routegetdata){
      this.router.navigateByUrl('/dashboard/cources');
    }
    else{
      this.allCourses = this.pendingRequests;
    }
    console.log(this.getprofileDetails)
    
  }

  openModal(course: any) {
    this.courceService.courseHistory(course.id).subscribe((res:any)=>{
      console.log(res);
      if(res && res.status==1){
        const modalRef = this.modalService.open(ViewHistoryComponent, {
          centered: true,
          size: 'lg',
          windowClass: 'alert-popup',
        });
        modalRef.componentInstance.props = {
          title: 'View History',
          data: res.data,
          data1:course,
          type:'viewhistory'
        };
      }
    })
   
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
    this.pendingRequests=[];
    this.rejectedRequests=[];
    this.draftRequests=[];
    this.closedRequests=[];
    this.courceService.getCources().subscribe(
      (res: any) => {
        console.log(res);
        if (res.status == 1 && res.message == 'Success') {
          this.courcesList = res.data;
          this.allCourses = this.courcesList;
          if( this.routegetdata && this.routegetdata.status){
            console.log('this.routegetdata',this.routegetdata)
            console.log('this.cou',this.courcesList.filter((course:any)=>course.status == this.routegetdata.status))
            this.courcesList =this.courcesList.filter((course:any)=>course.status ==this.routegetdata.status)
          }
          

          this.collectionSize = this.courcesList.length;
          this.courcesList.map((course:any)=>{
            if(course.status === 'pending' && course.user_id != this.getprofileDetails.data.id){
              this.pendingRequests.push(course)
            }
            if(course.status === 'pending'){
              this.usersubmitRequests.push(course)
            }
            if(course.status === 'pending' && course.user_id == this.getprofileDetails.data.id){
              this.submittedRequests.push(course)
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
    this.courceService.courseDetail(cource.id).subscribe((res:any)=>{
      console.log(res);
      let coursedetail = res.data;
      let username =  { user_name : cource.user_name}
      this.router.navigateByUrl('/dashboard/cources/request-detail', {
        state: {...coursedetail,...username},
      });
    },(err:any)=>{
      console.log(err)
    })
   
   
  }

  editRequest(course:any){
    this.router.navigateByUrl('/dashboard/cources/edit-cource', {
      state: course,
    });
    console.log(course)
  }

  deleteRequest(course:any){

    const modalRef = this.modalService.open(ViewHistoryComponent, {
      centered: true,
      size: 'sm',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: 'Delete Request',
      data3:course,
      type:'delete'
    };
    modalRef.componentInstance.passEntry.subscribe((res: any) => {
      this.refreshCourses();
    });
    this.routegetdata='';
    // console.log(course);
    // this.courceService.deleteCourse({course_id :course.id}).subscribe((res:any)=>{
    //   console.log(res);
    //   this.refreshCourses();
    // },(err:any)=>{
    //   console.log(err)
    // })
  }

  copyRequest(course:any){

    const modalRef = this.modalService.open(ViewHistoryComponent, {
      centered: true,
      size: 'sm',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: 'Copy Request',
      data3:course,
      type:'copy'
    };
    modalRef.componentInstance.passEntry.subscribe((res: any) => {
      this.refreshCourses();
    });
    this.routegetdata='';
    // console.log(course);
    // this.courceService.copyCourse({course_id :course.id}).subscribe((res:any)=>{
    //   console.log(res);
    //   this.refreshCourses();
    // },(err:any)=>{
    //   console.log(err)
    // })

  }

  ngOnInit(): void {
    // console.log(this.getUserrole);
    console.log(this.routegetdata)
    this.refreshCourses();

    
  }
}
