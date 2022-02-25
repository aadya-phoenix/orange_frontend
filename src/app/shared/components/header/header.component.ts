import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/auth/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  getUserrole:any;
  constructor(private authService:AuthenticationService) { 
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
      this.getprofileDetails = res.data;
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
