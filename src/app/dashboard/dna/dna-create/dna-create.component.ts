import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  trackerId:number=0;
  learningList:any=[];
  learningListToShow:any=[];
  
  constructor(
    private commonService: CommonService,
    private dnaService:DnaService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.trackerId = Id ? parseInt(Id) : 0;
    });
    this.getLearningList();
  }

  createNew() {
    this.router.navigateByUrl(`/dashboard/dna/add-new/${this.trackerId}`);
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
          this.commonService.hideLoading();
          this.router.navigateByUrl(`/dashboard/dna/create/${this.trackerId}`);
        },(err:any)=>{
          this.commonService.hideLoading();
        });
      }
    });
  }

  update(item:any){
    if(item){
    this.router.navigateByUrl(`/dashboard/dna/update/${this.trackerId}/${item.id}`);
    }
  }

  share(item:any){}

  getLearningList(){
    this.commonService.showLoading();
    this.dnaService.getDna().subscribe(
      (res: any) => {
        if(res.status == 1){
        this.commonService.hideLoading();
        this.learningList = res.data.digital_learning;
        this.learningListToShow = this.learningList.filter((x:any)=>x.tracker_id === this.trackerId);
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
