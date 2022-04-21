import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CarouselService } from 'src/app/shared/services/carousel/carousel.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CarouselForwardComponent } from '../carousel-forward/carousel-forward.component';
import { CarouselPublishComponent } from '../carousel-publish/carousel-publish.component';
const emailregexp = dataConstant.EmailPattren;

@Component({
  selector: 'app-create-carousel',
  templateUrl: './create-carousel.component.html',
  styleUrls: ['./create-carousel.component.scss']
})
export class CreateCarouselComponent implements OnInit {
  RoleID = dataConstant.RoleID;
  CarouselStatus = dataConstant.CarouselStatus;
  carousel_id = 0;
  carousel_details: any = {};
  languageList: any = [];
  cctExpiryperiod: any = [];
  carouselPublisher: any = [];
  getUserrole: any = {};
  createOlcarouselForm: FormGroup;
  languageText = "";
  isReviewer = false;
  isPublisher = false;
  isRequester = false;
  rejectcomment = "";
  carouselImage = { image: '', ext: '' };
  isSubmitted = false;
  carousel_count = {
    total: 0,
    draft: 0,
    closed: 0,
    rejected: 0,
    pending: 0,
    submitted: 0,
    transferred: 0
  }

  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private authService: AuthenticationService,
    private carouselService: CarouselService) {
    this.getUserrole = this.authService.getRolefromlocal();
    this.isReviewer = this.getUserrole.id === this.RoleID.CarouselReviewer;
    this.isPublisher = this.getUserrole.id === this.RoleID.CarouselPublisher;
    this.isRequester = this.getUserrole.id === this.RoleID.RequesterID;
    this.createOlcarouselForm = this.formBuilder.group({
      languages: new FormArray([]),
      metadata: this.formBuilder.array([]),
      image: new FormControl('', [Validators.required]),
      publication_date: new FormControl('', [Validators.required]), 
      expiry_type: new FormControl('', [Validators.required]),
      additional_comment: new FormControl('', [Validators.required]),
      ...(this.isReviewer && {
        publisher_id: new FormControl('', [Validators.required]),
      }),
    });
   
  }

  async  ngOnInit() {
    await this.getTotalCourse();
    await this.getLanguageList();
    await this.getExpiryDateType();
    if (this.isReviewer) {
      await this.getCarouselPublisher();
    }
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.carousel_id = Id ? parseInt(Id) : 0;
      this.getCarouselDetails();
    });
  }

  getCarouselDetails() {
    this.commonService.showLoading();
    this.carouselService.getCarouselDetails(this.carousel_id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.carousel_details = res.data;
          this.createOlcarouselForm.controls.expiry_type.setValue(this.carousel_details.expiry_type);
          this.createOlcarouselForm.controls.additional_comment.setValue(this.carousel_details.additional_comment);
          this.createOlcarouselForm.controls.publication_date.setValue(new Date(this.carousel_details.publication_date).toISOString().slice(0, 10));
          // this.createOlcarouselForm.controls.image.setValue(this.carousel_details.image);
          this.launguageFormBind();
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  get lauguageFormArray(): FormArray {
    return this.createOlcarouselForm.get("languages") as FormArray;
  }

  get carouselFormArray(): FormArray {
    return this.createOlcarouselForm.get("metadata") as FormArray;
  }

  newMetaData(language: { id: any; name: any; slug: any; }): FormGroup {
    return this.formBuilder.group({
      language: language.id, languageName: language.name, language_slug: language.slug,
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      link: new FormControl('', [Validators.required, Validators.pattern(new RegExp(
        `${dataConstant.UrlPattern}`,
        'i'
      ))]), display_manager: 0
    })
  }

  getTotalCourse() {
    this.commonService.showLoading();
    this.carouselService.getCarousel().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.carousel_count = res.data.carousel_count;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getLanguageList() {
    this.commonService.showLoading();
    this.commonService.getLanguages().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.languageList = res.data.filter((x: { carousel_show: number; }) => x.carousel_show === 1);
        this.languageText = this.languageList.map((x: { name: string }) => x.name).join('/');
        if (!this.carousel_id) {
          this.launguageFormBind();
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  launguageFormBind() {
    if (!this.carousel_id) {
      this.languageList.forEach((x: { name: string, id: number, slug: string, carousel_show: number }) => {
        if (x.carousel_show === 1) {
          this.lauguageFormArray.push(new FormControl(x.slug === 'english' ? true : false));
          if (x.slug === 'english') {
            this.carouselFormArray.push(this.newMetaData(x));
          }
        }
      });
    }
    else {
      this.languageList.forEach((x: { name: string, id: number, slug: string, carousel_show: number }) => {
        if (x.carousel_show === 1) {
          const existData = this.carousel_details.metadata.find((y: { language_slug: any; }) => y.language_slug == x.slug);
          if (existData) {
            this.lauguageFormArray.push(new FormControl(true));
            const formControl = this.newMetaData(x)
            formControl.controls.title.setValue(existData.title);
            formControl.controls.description.setValue(existData.description);
            formControl.controls.link.setValue(existData.link);
            formControl.controls.display_manager.setValue(existData.display_manager);
            this.carouselFormArray.push(formControl);
          }
          else {
            this.lauguageFormArray.push(new FormControl(false));
          }
        }
      });
    }
  }

  getExpiryDateType() {
    this.commonService.showLoading();
    this.commonService.getExpiryDateType().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.cctExpiryperiod = res.data;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
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
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  languageChange() {
    this.lauguageFormArray.controls.forEach((x, index) => {
      const language = this.languageList[index];
      const formControl = this.carouselFormArray.controls.find(x => x.value.language === language.id);
      if (x.value && !formControl) {
        this.carouselFormArray.push(this.newMetaData(language));
      }
      else if (!x.value && formControl) {
        this.carouselFormArray.removeAt(this.carouselFormArray.controls.findIndex(x => x.value.language === language.id));
      }
    });
  }

  removeCarousel(carousel: any) {
    this.carouselFormArray.removeAt(this.carouselFormArray.controls.findIndex(x => x.value.language === carousel?.value?.language));
    this.lauguageFormArray.controls[this.languageList.findIndex((x: { id: any; }) => x.id === carousel?.value?.language)].setValue(false);
  }

  handleFileInput(event: any) {
    this.commonService.FileConvertintoBytearray(event.target.files[0], async (f) => {
      // creating array bytes
      this.carouselImage = { image: this.commonService.byteArrayTobase64(f.bytes), ext: f.name.split('.').pop() };
    });
  }

  isDraft(){
    if (this.carousel_details?.status === this.CarouselStatus.publish){
      return false;  
    }
    if(this.carousel_details?.status === this.CarouselStatus.pending){
      return false;
    }
    if(this.carousel_details?.transfer_user_id && !this.carousel_details?.publisher_status && this.isReviewer){
      return false;
    }
    return true;
  }

  isReject(){
    if (this.carousel_details?.status === this.CarouselStatus.publish){
      return false;  
    }
    if(this.isRequester || !this.carousel_details.id){
      return false;
    }
    if(this.carousel_details?.status === this.CarouselStatus.draft){
      return false;
    }
    if(this.carousel_details?.transfer_user_id && !this.carousel_details?.publisher_status && this.isReviewer){
      return false;
    }
    return true;
  }

  isPublish(){
    if (this.carousel_details?.status === this.CarouselStatus.publish){
      return false;  
    }
    if(!this.isPublisher){
      return false;
    }
    if(this.carousel_details?.transfer_user_id && !this.carousel_details?.publisher_status && this.isReviewer){
      return false;
    }
    return true;
  }

  isSubmit(){
    if (this.carousel_details?.status === this.CarouselStatus.publish){
      return false;  
    }
    if (this.carousel_details?.status === this.CarouselStatus.pending){
      return false;  
    }
    if(this.isPublisher){
      return false;
    }
    if(this.carousel_details?.transfer_user_id && !this.carousel_details?.publisher_status && this.isReviewer){
      return false;
    }

    return true;
  }

  forwardRequest(){
    const modalRef = this.modalService.open(CarouselForwardComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: 'Request Forward',
      data: this.carousel_details.id,
      objectDetail: this.carousel_details
    };
  }

  statusChangeRequest(status:any){
    const modalRef = this.modalService.open(CarouselPublishComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: `Request ${status == this.CarouselStatus.reject ? "Reject" : "Publish"}`,
      status: status,
      data: this.carousel_details.id,
      objectDetail: this.carousel_details
    };
  }

  saveCarousel(status: string) {
    this.isSubmitted = true;
    if (this.createOlcarouselForm.invalid) {
      return;
    }
    const body = this.createOlcarouselForm.value;
    body.image = this.carouselImage.image;
    body.image_ext = this.carouselImage.ext;
    body.reviewer_id = "";
    body.status = status;
    if (!this.carousel_id) {
      this.commonService.showLoading();
      this.carouselService.create(body).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('Carousel', 'Successfully Saved.');
          this.router.navigate(['/dashboard/olcarousel']);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', err.message);
        }
      );
    }
    else {
      body.carousel_id = this.carousel_id;
      this.commonService.showLoading();
      this.carouselService.update(body).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('Carousel', 'Successfully Saved.');
          this.router.navigate(['/dashboard/olcarousel']);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', err.message);
        }
      );
    }

  }

}
