import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss']
})
export class RequestDetailComponent implements OnInit {
  getUserrole:any;
  routegetdata:any;
  closeResult = "";
  constructor(private authService:AuthenticationService,private router:Router,private modalService:NgbModal) { 
    this.routegetdata = this.router.getCurrentNavigation()?.extras.state;
    if(!this.routegetdata){
      this.router.navigateByUrl('/dashboard/cources');
    }
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
    this.router.navigateByUrl('/dashboard/cources/edit-cource',{state:this.routegetdata})
  }
  ngOnInit(): void {
    console.log(this.routegetdata);

    this.getRole();
  }

}
