import { Component, OnInit } from '@angular/core';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
  constructor(private courceService: CourcesService) {}

  ngOnInit(): void {
    this.courceService.getCources().subscribe(
      (res: any) => {
        console.log(res);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
}
