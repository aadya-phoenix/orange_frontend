import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DnaService } from 'src/app/shared/services/dna/dna.service';
import Swal from 'sweetalert2';
import { DnaLearningFormComponent } from '../dna-learning-form/dna-learning-form.component';

@Component({
  selector: 'app-dna-create',
  templateUrl: './dna-create.component.html',
  styleUrls: ['./dna-create.component.scss']
})
export class DnaCreateComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  trackerId:number=0;
  learningList:any=[];
  learningListToShow:any=[];
  searchText:string='';
  isManager = false;

  constructor(
    private commonService: CommonService,
    private dnaService:DnaService,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private router: Router) { 
      this.isManager = this.authService.getProfileDetailsfromlocal().data?.manager == 1 ? true : false;
    }

  ngOnInit(): void {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.trackerId = Id ? parseInt(Id) : 0;
      if(this.isManager){
      this.getLearningList();
      }
    });
  }

  createNew() {
    this.router.navigateByUrl(`/dna/add-new/${this.trackerId}`);
  }

  delete(item:any){
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this request!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.commonService.showLoading();
        this.dnaService.delete({digital_learning_id : item.id}).subscribe((res:any)=>{
          Swal.fire(
            'Deleted!',
            'Your request has been deleted.',
            'success'
          )
          this.getLearningList();
          this.commonService.hideLoading();
          this.router.navigateByUrl(`/dna/create/${this.trackerId}`);
        },(err:any)=>{
          this.commonService.hideLoading();
        });
      }
    });
  }

  viewReport(){
    if (this.trackerId) {
      this.router.navigateByUrl(`/dna/view/${this.trackerId}`); 
      }
  }

  update(item:any){
    if(item){
    this.router.navigateByUrl(`/dna/update/${this.trackerId}/${item.id}`);
    }
  }

  share(item:any){}

  getLearningList(){
    this.commonService.showLoading();
    this.dnaService.getDna().subscribe(
      (res: any) => {
        if(res.status == 1){
        this.commonService.hideLoading();
        this.learningListToShow = res.data.digital_learning[this.trackerId];
        }
        else{
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', res.message);
        }
      },(err:any)=>{
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      });
  }

}
