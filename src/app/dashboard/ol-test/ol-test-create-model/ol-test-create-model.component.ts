import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
  selector: 'app-ol-test-create-model',
  templateUrl: './ol-test-create-model.component.html',
  styleUrls: ['./ol-test-create-model.component.scss']
})
export class OlTestCreateModelComponent implements OnInit {
  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  lableConstant: any = { french: {}, english: {} };
  
  constructor(private modalService: NgbActiveModal,  private commonService: CommonService,private router: Router) { 
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
  }
  

  ngOnInit(): void {
  }

  closeModal() {
    this.modalService.close();
  }

  openOrangeTest(){
    this.router.navigateByUrl(`/oltest/create/orange`);
    this.closeModal();
  }

  openOrangeScorm(){
    this.router.navigateByUrl(`/oltest/create/scorm`);
    this.closeModal();
  }

}
