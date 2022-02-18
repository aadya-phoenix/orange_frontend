import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {

  public courcesList:any;
  public page=1;
  getUserprofile:any;
  constructor(private courceService: CourcesService,private authService:AuthenticationService) {}

  getProfile(){
    this.authService.getProfileDetails().subscribe((res:any)=>{
      console.log(res);
      this.getUserprofile = res.data;
    },(err:any)=>{
      console.log(err)
    })
  }

  getRoles(){
    this.authService.getRoles().subscribe((res:any)=>{
      console.log(res);
    },(err:any)=>{
      console.log(err)
    })
  }

  getUserRoles(){
    this.authService.getUserRoles().subscribe((res:any)=>{
      console.log(res);
    },(err:any)=>{
      console.log(err)
    })
  }

  ngOnInit(): void {
    this.getProfile();
    this.getRoles();
    this.getUserRoles();
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
