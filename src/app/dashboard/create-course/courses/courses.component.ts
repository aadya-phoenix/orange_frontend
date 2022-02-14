import { Component, OnInit } from '@angular/core';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {

  public courcesList:any;
  public page=1
  constructor(private courceService: CourcesService) {}

  ngOnInit(): void {
    this.courceService.getCources().subscribe(
      (res: any) => {
        console.log(res);
        if(res.status==1 && res.message=='Success'){
          this.courcesList = res.data;
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
}
