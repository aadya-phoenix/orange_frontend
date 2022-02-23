import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss']
})
export class RequestDetailComponent implements OnInit {
  getUserrole:any;
  routegetdata:any;
  constructor(private authService:AuthenticationService,private router:Router) { 
    this.routegetdata = this.router.getCurrentNavigation()?.extras.state;
    if(!this.routegetdata){
      this.router.navigateByUrl('/dashboard/cources');
    }
  }
  getRole(){
    this.getUserrole = this.authService.getRolefromlocal();
  }

  updateCource(){
    this.router.navigateByUrl('/dashboard/cources/edit-cource',{state:this.routegetdata})
  }
  ngOnInit(): void {
    console.log(this.routegetdata);

    this.getRole();
  }

}
