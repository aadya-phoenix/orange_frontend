import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CarouselService } from 'src/app/shared/services/carousel/carousel.service';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
  selector: 'app-carousel-publish',
  templateUrl: './carousel-publish.component.html',
  styleUrls: ['./carousel-publish.component.scss']
})
export class CarouselPublishComponent implements OnInit {

  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  publishCarouselForm: FormGroup;
  isSubmitted = false;
  status = '';
  CarouselStatus = dataConstant.CarouselStatus;
  constructor(private formBuilder: FormBuilder,
    private modalService: NgbActiveModal,
    private carouselService: CarouselService,
    private commonService: CommonService,
    private router: Router) {
      this.publishCarouselForm = this.formBuilder.group({
        status_comment: new FormControl('', [Validators.required]),
      });
  }
  public historyList: any;
  public objectDetail: any;
  public modalType: any;
  public title: any;
  remainingText: any = 500;
  carouselPublisher: any = [];
  copyDeletecourse: any;
  ngOnInit(): void {
    this.objectDetail = this.props.objectDetail ? this.props.objectDetail : '';
    this.title = this.props.title;
    this.status = this.props.status;

    this.publishCarouselForm = this.formBuilder.group({
      status_comment: new FormControl('', this.props.status == this.CarouselStatus.publish ? [] : [Validators.required]),
    });
    this.publishCarouselForm.get("status_comment")?.valueChanges.subscribe(() => {
      this.valueChange();
    });
  }

  publishCarousel() {
    this.isSubmitted = true;
    if (this.publishCarouselForm.invalid) {
      return;
    }
    var data = {
      carousel_id: this.props.objectDetail.id,
      status_comment: this.publishCarouselForm.value.status_comment,
      status: this.props.status
    };
    this.commonService.showLoading();
    this.carouselService.carouselStatus(data).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.commonService.toastSuccessMsg('Carousel', `Successfully ${this.props.status}.`);
        this.modalService.close();
        this.router.navigate(['/dashboard/olcarousel']);
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  closeModal() {
    this.modalService.close();
  }

  onClose() {
    this.passEntry.next();
    this.modalService.close();
  }

  valueChange() {
    if (this.publishCarouselForm.value.status_comment) {
      this.remainingText = 500 - this.publishCarouselForm.value.status_comment.length;
    }
    else {
      this.remainingText = 500;
    }
  }


}
