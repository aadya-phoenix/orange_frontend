import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourcesService } from '../shared/services/cources/cources.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  pendingRequests: any = [];
  courcesList: any;
  constructor(private courseService: CourcesService,private router:Router) {}

  navigatetoPending(status:any){
    let statusobj = { status :status};
    this.router.navigateByUrl('/dashboard/cources', {
      state: statusobj,
    });
  }

  getpendingCourses() {
    this.pendingRequests = [];

    this.courseService.getCources().subscribe(
      (res: any) => {
        console.log(res);
        if (res.status == 1 && res.message == 'Success') {
          this.courcesList = res.data;

          this.courcesList.map((course: any) => {
            if (course.status === 'pending') {
              this.pendingRequests.push(course);
            }
          });
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
