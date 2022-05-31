import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';

@Component({
  selector: 'app-course-beautification-template',
  templateUrl: './course-beautification-template.component.html',
  styleUrls: ['./course-beautification-template.component.scss']
})
export class CourseBeautificationTemplateComponent implements OnInit {

  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  constructor(private modalService: NgbActiveModal, private courseService: CourcesService, private router: Router, private commonService: CommonService) { }
  public courseHistory: any;
  public courseDetail: any;
  public modalType: any;
  public title: any;
  colors = ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'bg-5', 'bg-6'];
  ngOnInit(): void {
    this.setDialogProps(this.props)
  }

  setDialogProps(dialogdata: any) {
    this.courseDetail = dialogdata.objectDetail ? dialogdata.objectDetail : '';
    this.courseDetail.description = this.courseService.getTText(this.courseDetail.description);
    this.courseDetail.for_whom = this.courseService.getTText(this.courseDetail.for_whom);
    this.courseDetail.for_whoom = this.courseService.getTText(this.courseDetail.for_whoom);
    this.courseDetail.objectiveByLang.map((Object: any) => {
      Object.color = this.colors[Math.floor(Math.random() * this.colors.length)];
      return Object;
    });
  }

  closeModal() {
    this.modalService.close();
  }

  onClose() {
    this.passEntry.next();
    this.modalService.close();
  }

}
