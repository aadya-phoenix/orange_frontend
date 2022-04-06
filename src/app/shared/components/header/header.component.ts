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
  userName:any;
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
    if(localStorage.getItem('userName')){
      this.userName = JSON.parse(localStorage.getItem('userName') as any);
    }
    if(this.userName){
      this.firstName = this.userName.first_name;
      this.lastName = this.userName.last_name;
    }
    
  }

  getUserprofile(){
    this.authService.getProfileDetails().subscribe((res:any)=>{
      console.log(res);
      if(res != undefined){
      this.getprofileDetails = res.data;
      localStorage.setItem('userName',JSON.stringify(this.getprofileDetails));
      } 
      if(localStorage.getItem('userName')){
        this.userName = JSON.parse(localStorage.getItem('userName') as any);
      }
      if(this.userName){
        this.firstName = this.userName.first_name;
        this.lastName = this.userName.last_name;
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
    localStorage.removeItem('userName');
  }

}
