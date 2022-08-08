import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CarouselService } from 'src/app/shared/services/carousel/carousel.service';
import { CommonService } from 'src/app/shared/services/common/common.service';


@Component({
  selector: 'app-carousel-forward',
  templateUrl: './carousel-forward.component.html',
  styleUrls: ['./carousel-forward.component.scss']
})
export class CarouselForwardComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  publishCarouselForm: FormGroup;
  isSubmitted = false;
  constructor(private formBuilder: FormBuilder, 
    private modalService: NgbActiveModal,
    private carouselService: CarouselService, 
    private commonService: CommonService,
    private router: Router) {
      this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.publishCarouselForm = this.formBuilder.group({
        publisher_id: new FormControl('', [Validators.required]),
    });
   }
  public historyList: any;
  public objectDetail: any;
  public modalType: any;
  public title: any;
  carouselPublisher: any = [];
  copyDeletecourse: any;
  ngOnInit(): void {
    this.objectDetail = this.props.objectDetail ? this.props.objectDetail : '';
    this.title = this.props.title;
    this.getCarouselPublisher();
  }

  getCarouselPublisher() {
    this.commonService.showLoading();
    this.carouselService.getCarouselPublisher().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.carouselPublisher = res.data;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  transferToPublisher(){
    this.isSubmitted = true;
    if (this.publishCarouselForm.invalid) {
      return;
    }
    var data = {
      carousel_id:this.props.objectDetail.id,
      transfer_id: this.publishCarouselForm.value.publisher_id
    };
      this.commonService.showLoading();
      this.carouselService.carouselTransfer(data).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('Carousel', 'Successfully Transfered.');
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
}
