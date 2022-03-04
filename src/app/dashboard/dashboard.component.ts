import { Component, OnInit } from '@angular/core';
import { CourcesService } from '../shared/services/cources/cources.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  pendingRequests: any = [];
  courcesList: any;
  constructor(private courseService: CourcesService) {}

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
