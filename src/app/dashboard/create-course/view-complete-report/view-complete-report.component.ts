import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { ViewHistoryComponent } from '../view-history/view-history.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-view-complete-report',
  templateUrl: './view-complete-report.component.html',
  styleUrls: ['./view-complete-report.component.scss']
})
export class ViewCompleteReportComponent implements OnInit {

  public filterForm!: FormGroup;
  public courcesList: any=[];
  public fitertedcoursedata:any=[];
  public pageNumber= 1;
  public pageSize=10;
  public course_count = {
    closed: 0,
    draft: 0,
    pending: 0,
    rejected: 0,
    submitted: 0,
    total: 0,
    transferred: 0
  };
  startPageEntry:any;
  endPageEntry:any;
  public filteredCourseList:any;
  public learningTypes: any;
  public roles:any;
  public roleUsers:any;
  public departments:any;
  collectionSize: any;
  p:any
  draftRequests:any =[];
  pendingRequests:any=[];
  closedRequests:any=[];
  rejectedRequests:any=[];
  submittedRequests:any=[];
  transferredRequests: any = [];
  usersubmitRequests:any=[];
  allcoursedataroc: any = [];
  allcoursedatapub: any = [];
  allcoursedatareq: any = [];
  allCourses:any;
  routegetdata:any;
  getUserrole: any;
  getprofileDetails:any;
  rocObj:any=[];
  publisherObj:any=[];
  flagVar:boolean=false;
  filterflag:boolean=false;
  addDate:any;
  coursedata: any=[];
  i: number = 0;
  j: number = 0;

  fileName = 'ExcelSheet.xlsx' ;
  

  public compare = (v1: string | number, v2: string | number) =>
  v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;
  
  constructor(
    private fb: FormBuilder,
    private courceService: CourcesService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private router: Router
    ) {
      this.getUserrole = this.authService.getRolefromlocal();
      this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
      this.routegetdata = this.router.getCurrentNavigation()?.extras.state;
       /*  if(!this.routegetdata){
          this.router.navigateByUrl('/dashboard/cources');
        }
        else{
          this.allCourses = this.pendingRequests;
        } */
     }

  ngOnInit(): void {
    this.refreshCourses();
    this.getLearningType();
    this.getRoles();
    this.getDepartments();
    this.filterForm= this.fb.group({
      start_date: new FormControl('', []),
      end_date: new FormControl('', []),
      reporting_period: new FormControl('', []),
      learning_type: new FormControl('', []),
      status: new FormControl('', []),
      department: new FormControl('', []),
      roc: new FormControl('', []),
      publisher: new FormControl('', []),
     //custom_date:new FormControl('', []),
    });
    this.startPageEntry = (this.pageSize * (this.pageNumber - 1) ) + 1;
    this.endPageEntry = this.pageSize * this.pageNumber;
  }

  refreshCourses() {
    // console.log(this.service.page);
    // console.log(this.service.pageSize);
    this.pendingRequests = [];
    this.rejectedRequests = [];
    this.draftRequests = [];
    this.closedRequests = [];

    this.courceService.getCourseWithoutFilter().subscribe(
      (res: any) => {
        // console.log(res);
        if (res.status == 1 && res.message == 'Success') {
          this.i = 0;
          this.j = 0;
          this.coursedata = res.data.course;
          this.course_count = res.data.course_count;
          for (this.i = 0; this.i < this.coursedata.length; this.i++) {
            // console.log(this.coursedata[this.i].request_id);
            this.coursedata[this.i]['titleByLang'] = this.courceService.getTText(this.coursedata[this.i]['title']);
            if (this.coursedata[this.i].request_id != "" && this.coursedata[this.i].request_id != null) {
             
              this.courcesList[this.j] = this.coursedata[this.i]
              if (this.getUserrole.id == 3) {
                if (((this.coursedata[this.i].publisher_status === 'reject' && this.coursedata[this.i].transfer_user_id != null) || (this.coursedata[this.i].status === 'pending') && this.coursedata[this.i].transfer_user_id == null && this.coursedata[this.i].user_id != this.getprofileDetails.data.id)) {
                  
                  this.pendingRequests.push(this.coursedata[this.i])
                  this.allcoursedataroc.push(this.coursedata[this.i])
                 
                }
                if ((this.coursedata[this.i].status === 'pending' && this.coursedata[this.i].publisher_status != 'reject') && this.coursedata[this.i].transfer_user_id != null && this.coursedata[this.i].user_id != this.getprofileDetails.data.id) {
                 
                  this.transferredRequests.push(this.coursedata[this.i])
                  this.allcoursedataroc.push(this.coursedata[this.i])
                }
              }
              else {
                if (this.coursedata[this.i].status === 'pending' && this.coursedata[this.i].user_id != this.getprofileDetails.data.id) {
                 
                  this.pendingRequests.push(this.coursedata[this.i])
                  
                  this.allcoursedatapub.push(this.coursedata[this.i])
                  
                }
              }
              if (this.coursedata[this.i].status === 'pending') {
                
                this.usersubmitRequests.push(this.coursedata[this.i])
          
              }
              if (this.coursedata[this.i].status === 'pending' && this.coursedata[this.i].user_id == this.getprofileDetails.data.id) {
               
                this.submittedRequests.push(this.coursedata[this.i])
                this.allcoursedataroc.push(this.coursedata[this.i])
                this.allcoursedatareq.push(this.coursedata[this.i])
                this.allcoursedatapub.push(this.coursedata[this.i])
                
              }
              if (this.coursedata[this.i].status === 'reject') {
              
                this.rejectedRequests.push(this.coursedata[this.i])
                this.allcoursedataroc.push(this.coursedata[this.i])
                this.allcoursedatareq.push(this.coursedata[this.i])
                this.allcoursedatapub.push(this.coursedata[this.i])
               
              }
              if (this.coursedata[this.i].status === 'draft' && this.coursedata[this.i].user_id == this.getprofileDetails.data.id) {
                
                this.draftRequests.push(this.coursedata[this.i])
                this.allcoursedataroc.push(this.coursedata[this.i])
                this.allcoursedatareq.push(this.coursedata[this.i])
                this.allcoursedatapub.push(this.coursedata[this.i])
               
              }
              if (this.coursedata[this.i].status === 'publish') {
                
                this.closedRequests.push(this.coursedata[this.i])
                this.allcoursedataroc.push(this.coursedata[this.i])
                this.allcoursedatareq.push(this.coursedata[this.i])
                this.allcoursedatapub.push(this.coursedata[this.i])
               
              }

              this.j = this.j + 1;
            }
          }
          if (this.getUserrole.id == 3) {
            this.allCourses = this.allcoursedataroc;
          }
          else if (this.getUserrole.id == 2) {
            this.allCourses = this.allcoursedatareq;
          }
          else if (this.getUserrole.id == 4) {
            this.allCourses = this.allcoursedatapub;
          }
         
          this.collectionSize = this.courcesList.length;
          
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
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
    if(!this.filterflag){
    this.courcesList = data;
    }
    if(this.filterflag){
      this.fitertedcoursedata= data;
    }
  }

  //getLearning type
  getLearningType() {
    this.courceService.getLearningType().subscribe(
      (res: any) => {
        console.log(res);
        this.learningTypes = res.data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getRoles(){
    this.courceService.getRole().subscribe((res: any) => {
      console.log("roles are",res);
      this.roles = res.data;
      },
      (err: any) => {
        console.log(err);
    });
    this.courceService.getRoleUsers().subscribe((res: any) => {
      console.log("res data is ",res.data);
       console.log("res data is ",res.data[2]);
      //this.rocObj = res.data[2].map((x:any)=>x.id==3);
      for(let item of res.data[2]){
        if (item.role_id==3){
          console.log(item);
          this.rocObj.push(item);
        }
        else if(item.role_id==4){
          this.publisherObj.push(item);
        }
      }
      for(let item of res.data[3]){
        if (item.role_id==3){
          console.log(item);
          this.rocObj.push(item);
        }
        else if(item.role_id==4){
          this.publisherObj.push(item);
        }
      }
      for(let item of res.data[4]){
        if (item.role_id==3){
          console.log(item);
          this.rocObj.push(item);
        }
        else if(item.role_id==4){
          this.publisherObj.push(item);
        }
      }
      console.log("roc is",this.rocObj);
      console.log("publisher is",this.publisherObj);
      },
      (err: any) => {
        console.log(err);
    });

  }
  getDepartments(){
    this.courceService.getpreferedInstructor().subscribe(
      (res: any) => {
        let depart = res.data.map((x:any)=>x.department_description);
        console.log("this.departments",depart);
       // this.departments = res.data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  applyFilter(){
    this.filterflag = true;
    console.log("apply call");
    this.pendingRequests=[];
    this.rejectedRequests=[];
    this.draftRequests=[];
    this.closedRequests=[];
    this.transferredRequests = [];
    this.allCourses=[];
    this.usersubmitRequests=[];
    this.allcoursedataroc = [];
    this.allcoursedatapub = [];
    this.allcoursedatareq = [];
    if(this.filterForm.value.reporting_period){
     this.filterForm.value.start_date = '';
     this.filterForm.value.end_date = '';
    }
    let totalObj = {
      ...this.filterForm.value
    };
    console.log("obhjj",totalObj);
    if (this.filterForm.valid) {
      console.log("api call");
      this.courceService.getCourseFilter(totalObj).subscribe((res: any) => {
        console.log("filtered",res);
        if (res.status == 1 && res.message == 'Success') {
        this.fitertedcoursedata = res.data.course;
        this.course_count = res.data.course_count;
        this.flagVar = true;
        for (this.i = 0; this.i < this.fitertedcoursedata.length; this.i++) {
          this.fitertedcoursedata[this.i]['titleByLang'] = this.courceService.getTText(this.fitertedcoursedata[this.i]['title']);
             if (this.fitertedcoursedata[this.i].request_id != "" && this.fitertedcoursedata[this.i].   request_id != null){
            if (this.getUserrole.id == 3) {
              if (((this.fitertedcoursedata[this.i].publisher_status === 'reject' && this.fitertedcoursedata[this.i].transfer_user_id != null) || (this.fitertedcoursedata[this.i].status === 'pending') && this.fitertedcoursedata[this.i].transfer_user_id == null && this.fitertedcoursedata[this.i].user_id != this.getprofileDetails.data.id)) {
                this.pendingRequests.push(this.fitertedcoursedata[this.i])
                this.allcoursedataroc.push(this.fitertedcoursedata[this.i])
              }
              if ((this.fitertedcoursedata[this.i].status === 'pending' && this.fitertedcoursedata[this.i].publisher_status != 'reject') && this.fitertedcoursedata[this.i].transfer_user_id != null && this.fitertedcoursedata[this.i].user_id != this.getprofileDetails.data.id) {
                this.transferredRequests.push(this.fitertedcoursedata[this.i])
                this.allcoursedataroc.push(this.fitertedcoursedata[this.i])
              }
            }
            else {
              if (this.fitertedcoursedata[this.i].status === 'pending' && this.fitertedcoursedata[this.i].user_id != this.getprofileDetails.data.id) {
                this.pendingRequests.push(this.fitertedcoursedata[this.i])
                this.allcoursedatapub.push(this.fitertedcoursedata[this.i])
              }
            }
            if (this.fitertedcoursedata[this.i].status === 'pending') {
              this.usersubmitRequests.push(this.fitertedcoursedata[this.i])
            }
            if (this.fitertedcoursedata[this.i].status === 'pending' && this.fitertedcoursedata[this.i].user_id == this.getprofileDetails.data.id) {
             
              this.submittedRequests.push(this.fitertedcoursedata[this.i])
              this.allcoursedataroc.push(this.fitertedcoursedata[this.i])
              this.allcoursedatareq.push(this.fitertedcoursedata[this.i])
              this.allcoursedatapub.push(this.fitertedcoursedata[this.i])
            }
            if (this.fitertedcoursedata[this.i].status === 'reject') {
              this.rejectedRequests.push(this.fitertedcoursedata[this.i])
              this.allcoursedataroc.push(this.fitertedcoursedata[this.i])
              this.allcoursedatareq.push(this.fitertedcoursedata[this.i])
              this.allcoursedatapub.push(this.fitertedcoursedata[this.i])
            }
            if (this.fitertedcoursedata[this.i].status === 'draft' && this.fitertedcoursedata[this.i].user_id == this.getprofileDetails.data.id) {
              this.draftRequests.push(this.fitertedcoursedata[this.i])
              this.allcoursedataroc.push(this.fitertedcoursedata[this.i])
              this.allcoursedatareq.push(this.fitertedcoursedata[this.i])
              this.allcoursedatapub.push(this.fitertedcoursedata[this.i])
            }
            if (this.fitertedcoursedata[this.i].status === 'publish') {
              this.closedRequests.push(this.fitertedcoursedata[this.i])
              this.allcoursedataroc.push(this.fitertedcoursedata[this.i])
              this.allcoursedatareq.push(this.fitertedcoursedata[this.i])
              this.allcoursedatapub.push(this.fitertedcoursedata[this.i])
            }
            this.j = this.j + 1;
          }
         }
         if (this.getUserrole.id == 3) {
          this.allCourses = this.allcoursedataroc;
        }
        else if (this.getUserrole.id == 2) {
          this.allCourses = this.allcoursedatareq;
        }
        else if (this.getUserrole.id == 4) {
          this.allCourses = this.allcoursedatapub;
        }
        this.allCourses = this.fitertedcoursedata;
         console.log("this.filteredCourseList",this.filteredCourseList)
         this.collectionSize = this.fitertedcoursedata.length;
        }},
        (err: any) => {
          console.log(err);
        });
    }
    else {
      this.filterForm.markAllAsTouched();
    }
  }
  pageChanged(event:any){
    console.log(event);
    this.pageNumber = event;
    this.startPageEntry = (this.pageSize * (this.pageNumber - 1) ) + 1;
    this.endPageEntry = this.pageSize * this.pageNumber;
  }
  openModal(course: any){
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

  reset(){
    this.filterflag = false;
    this.refreshCourses();
    this.getLearningType();
    this.flagVar = false;
    this.filterForm= this.fb.group({
      start_date: new FormControl('', []),
      end_date: new FormControl('', []),
      reporting_period: new FormControl('', []),
      learning_type: new FormControl('', []),
      status: new FormControl('', []),
      department: new FormControl('', []),
      roc: new FormControl('', []),
      publisher: new FormControl('', []),
     //custom_date:new FormControl('', []),
    });
    this.addDate =null;
  }
  exportToExcel():void{
    console.log("excel call");
   let element = document.getElementById("excel-table");
   const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

   const wb: XLSX.WorkBook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
   XLSX.writeFile(wb, this.fileName);
  }

}
