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
  routegetdata: any;
  status: any;
  transfer_user_id: any;
  publisherList: any = [];
  roleuserlist: any = [];
  cordinatorsList: any = [];
  showbuttons: any;
  otherRocsList:any=[];
  selectedotherRoc:any;
  selectedPublisher:any;
  objectarray:any=[];
  closeResult = "";
  rejectcomment:any;
  constructor(private authService:AuthenticationService,private router:Router,private modalService:NgbModal,private courseService:CourcesService) { 
    this.routegetdata = this.router.getCurrentNavigation()?.extras.state;
				this.routegetdata['titleByLang'] = this.courseService.getTText(this.routegetdata['title']);
				this.routegetdata['descriptionByLang'] = this.courseService.getTText(this.routegetdata['description']);
				this.routegetdata['objectiveByLang'] = this.courseService.getTText(this.routegetdata['objective']);
				this.routegetdata['learn_moreByLang'] = this.courseService.getTText(this.routegetdata['learn_more']);
				this.routegetdata['for_whomByLang'] = this.courseService.getTText(this.routegetdata['for_whom']);

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
      this.roleuserlist = res.data;
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


  reject(){
    let statusobj = { course_id:this.routegetdata.id ,status:'reject',status_comment:this.rejectcomment}
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
    let region = this.roleuserlist[3];
    console.log(region);
    let user = region.filter((d: any) => d.region_id === event.target.value);

    region.forEach((field: any) => {
      if (field.region_id == event.target.value) {
        this.selectedotherRoc = field.id;
        alert(this.selectedotherRoc);
      }
    });
    console.log(user);
    //  .map((res: any) => {
    //  this.selectedotherRoc = res.id;
    //  alert(this.selectedotherRoc)
    //})

  }

  getPublisherselected(event:any){
  this.selectedPublisher = event.target.value;
  console.log(this.selectedPublisher)
  }

  transfertoOtherRoc(){
    let transferobj ={ course_id:this.routegetdata.id,status:'pending' ,transfer_id:this.selectedotherRoc};
    this.courseService.courseTransfer(transferobj).subscribe((res:any)=>{
      console.log(res);
      let transferobj1 = { course_id: this.routegetdata.id, status: 'pending' };
      this.courseService.courceStatus(transferobj1).subscribe((res: any) => {
        console.log(res);
        this.router.navigate(['/dashboard/cources']);
      }, (err: any) => {
        console.log(err)
      })
    },(err:any)=>{
      console.log(err)
    })
    
  }

  transfertoPublisher(){
    let transferobj ={ course_id:this.routegetdata.id ,transfer_id:this.selectedPublisher};
    this.courseService.courseTransfer(transferobj).subscribe((res:any)=>{
      console.log(res);
      this.router.navigate(['/dashboard/cources']);
    },(err:any)=>{
      console.log(err)
    })
  }

  ngOnInit(): void {
    console.log(this.routegetdata);
    let arr1 = this.routegetdata.objective;
    this.status = this.routegetdata.status;
    
    this.transfer_user_id = this.routegetdata.transfer_user_id;
    this.showbuttons = this.routegetdata.showbuttons.split('#')[1];
    
	console.log(arr1);
    this.objectarray = [];//arr1.split('• ')
    //console.log(arr1.split('• '))
    this.getPublisher();
    this.getCordinators();
    this.getRole();
  }
  getCordinators() {
    this.courseService.getregionalCordinator().subscribe(
      (res: any) => {
        console.log(res);
        this.cordinatorsList = res.data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
}
