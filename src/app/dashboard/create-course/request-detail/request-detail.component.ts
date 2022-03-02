import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { ModalDismissReasons, NgbModal, } from "@ng-bootstrap/ng-bootstrap";
import { CourcesService } from 'src/app/shared/services/cources/cources.service';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss']
})
export class RequestDetailComponent implements OnInit {
  getUserrole:any;
  routegetdata:any;
  publisherList:any=[];
  otherRocsList:any=[];
  selectedotherRoc:any;
  selectedPublisher:any;
  closeResult = "";
  constructor(private authService:AuthenticationService,private router:Router,private modalService:NgbModal,private courseService:CourcesService) { 
    this.routegetdata = this.router.getCurrentNavigation()?.extras.state;
    if(!this.routegetdata){
      this.router.navigateByUrl('/dashboard/cources');
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
    this.router.navigateByUrl('/dashboard/cources/edit-cource',{state:this.routegetdata})
  }


  reject(){
    let statusobj = { course_id:this.routegetdata.id ,status:'reject'}
    this.courseService.changeStatus(statusobj).subscribe((res:any)=>{
      console.log(res);
      this.router.navigate(['/dashboard/cources']);
    },(err:any)=>{
      console.log(err)
    })
  }

  getRoc(event:any){
    this.selectedotherRoc = event.target.value;
    console.log(this.selectedotherRoc)

  }

  getPublisherselected(event:any){
  this.selectedPublisher = event.target.value;
  console.log(this.selectedPublisher)
  }

  transferOtherRoc(){
    let transferobj ={ course_id:this.routegetdata.id ,transfer_id:this.selectedotherRoc};
    this.courseService.courseTransfer(transferobj).subscribe((res:any)=>{
      console.log(res)
    },(err:any)=>{
      console.log(err)
    })
  }

  transfertoPublisher(){
    let transferobj ={ course_id:this.routegetdata.id ,transfer_id:this.selectedPublisher};
    this.courseService.courseTransfer(transferobj).subscribe((res:any)=>{
      console.log(res)
    },(err:any)=>{
      console.log(err)
    })
  }

  ngOnInit(): void {
    console.log(this.routegetdata);

    this.getRole();
  }

}
