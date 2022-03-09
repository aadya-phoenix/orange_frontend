import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';

@Component({
  selector: 'app-view-history',
  templateUrl: './view-history.component.html',
  styleUrls: ['./view-history.component.scss']
})
export class ViewHistoryComponent implements OnInit {
  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  constructor(private modalService:NgbActiveModal,private courseService:CourcesService) { }
  public courseHistory:any;
  public courseDetail:any;
  public modalType:any;
  public title:any;
  copyDeletecourse:any;
  ngOnInit(): void {
    this.setDialogProps(this.props)
  }

  setDialogProps(dialogdata:any){
    this.courseHistory = dialogdata.data ? dialogdata.data : '';
    this.courseDetail = dialogdata.data1 ? dialogdata.data1 : '';
    this.copyDeletecourse = dialogdata.data3 ? dialogdata.data3 : '';
    this.title= dialogdata.title
    this.modalType = dialogdata.type;
    console.log(this.courseHistory);
  }


  deleteRequest(){
     this.courseService.deleteCourse({course_id :this.copyDeletecourse.id}).subscribe((res:any)=>{
      console.log(res);
      this.onClose();
    },(err:any)=>{
      console.log(err)
    })
  }

  copyRequest(){
    this.courseService.copyCourse({course_id :this.copyDeletecourse.id}).subscribe((res:any)=>{
     console.log(res);
     this.onClose();
   },(err:any)=>{
     console.log(err)
   })
 }


  onClose() {
    this.passEntry.next();
    this.modalService.close();
  }

}
