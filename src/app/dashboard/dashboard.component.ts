import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourcesService } from '../shared/services/cources/cources.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  pendingRequestCount = 0;
  courcesList: any;
  constructor(private courseService: CourcesService,private router:Router) {}

  navigatetoPending(status:any){
    let statusobj = { status :status};
    console.log("status obj",status);
    this.router.navigateByUrl('/dashboard/cources', {
      state: statusobj,
    });
  }

  getpendingCourses() {
    this.courseService.getCources().subscribe(
      (res: any) => {
        if (res.status == 1) {
          this.pendingRequestCount = res.data?.course_count?.pending;
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  ngOnInit(): void {
    this.getpendingCourses();
  }
}
