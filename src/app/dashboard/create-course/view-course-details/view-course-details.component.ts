import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { ModalDismissReasons, NgbModal, } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-view-course-details',
  templateUrl: './view-course-details.component.html',
  styleUrls: ['./view-course-details.component.scss']
})
export class ViewCourseDetailsComponent implements OnInit {

  getUserrole:any;
  routegetdata:any;
  publisherList:any=[];
  otherRocsList:any=[];
  closeResult = "";
  profileDetails:any;
  constructor(private authService:AuthenticationService,private router:Router,private modalService:NgbModal) { 
    this.routegetdata = this.router.getCurrentNavigation()?.extras.state;
    let profileDetails = this.authService.getProfileDetailsfromlocal()
    this.profileDetails = profileDetails.data;
    if(!this.routegetdata){
    //  this.router.navigateByUrl('/dashboard/cources');
    }
  }

  saveChange(){
    console.log('save')
  }

  getPublisher(){
    this.authService.getUserRoles().subscribe((res:any)=>{
      console.log(res);
      this.publisherList = res.data['4'];
      console.log(this.publisherList)
    },(err:any)=>{
      console.log(err)
    })
  }

  transferOtherroc(){
    this.authService.getUserRoles().subscribe((res:any)=>{
      console.log(res);
      this.otherRocsList = res.data['3'];
      console.log(this.otherRocsList)
    },(err:any)=>{
      console.log(err)
    })
  }

  open(content:any) {
    this.modalService
      .open(content, { size: "sm", backdrop: "static" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  getRole(){
    this.getUserrole = this.authService.getRolefromlocal();
    //this.getUserrole = JSON.parse(this.authService.getRolefromlocal());
  }

  updateCource(){
    this.router.navigateByUrl('/dashboard/cources/create-cource',{state:this.routegetdata})
  }
  ngOnInit(): void {
    console.log(this.routegetdata);
    console.log(this.profileDetails)

    this.getRole();
  }


}
