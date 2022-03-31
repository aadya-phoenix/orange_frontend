import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/auth/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  getUserrole:any;
  firstName:any;
  lastName:any;

  constructor(private authService:AuthenticationService,
    private router:Router) { 
    this.getUserrole = this.authService.getRolefromlocal();
    //this.getUserrole = JSON.parse(this.authService.getRolefromlocal());
  }
  public showUserMenu:boolean=false;
  getprofileDetails:any;

  ngOnInit(): void {
    this.getUserprofile();
  }

  getUserprofile(){
    this.authService.getProfileDetails().subscribe((res:any)=>{
      console.log(res);
      if(res != undefined){
      this.getprofileDetails = res.data;
      this.firstName = this.getprofileDetails.first_name;
      this.lastName = this.getprofileDetails.last_name;
      console.log("profile details",this.getprofileDetails);
      } 
    },(err:any)=>{
      console.log(err)
    })
  }

  userMenu(){
    this.showUserMenu = !this.showUserMenu;
  }

  logout(){
    console.log('he')
    this.authService.logOut();
  }

}
