import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { CourseBeautificationTemplateComponent } from '../course-beautification-template/course-beautification-template.component';
const urlregex = dataConstant.UrlPattern;
@Component({
  selector: 'app-course-view',
  templateUrl: './course-view.component.html',
  styleUrls: ['./course-view.component.scss']
})
export class CourseViewComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  id = 0;
  isStaff = false;
  public publishForm!: FormGroup;
  public learnerGuidelines: any = [];
  public emailPrefferedEmail: any = [];
  public curriculumContent: any = [];
  purchaseOrder: any;
  getUserrole: any;
  routegetdata: any = {};
  imgUrl: any;
  trainingDurationHours: any;
  status: any;
  transfer_user_id: any;
  urlPrifix = dataConstant.ImageUrl;
  material_sourceUrl: any;
  publisherList: any = [];
  newPublisherList: any = [];
  roleuserlist: any = [];
  cordinatorsList: any = [];
  showbuttons: any;
  otherRocsList: any = [];
  selectedotherRoc: any;
  transfercomment: any;
  getprofileDetails: any;
  selectedPublisher: any;
  showrejectbutton: any;
  availableLanguages: any = [];
  closeResult = "";
  coursedetail: any;
  translateData = [];
  rejectcomment: any;
  constructor(private route: ActivatedRoute, private commonService: CommonService, private fb: FormBuilder, private authService: AuthenticationService, private router: Router, private modalService: NgbModal, private courseService: CourcesService) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.publishForm = this.fb.group({
      intranet_url: new FormControl('', [
        Validators.required,
        Validators.pattern(urlregex),
      ]),
      internet_url: new FormControl('', [
        Validators.required,
        Validators.pattern(urlregex),
      ]),
      status_comment: new FormControl('', [
        Validators.required
      ]),
    });
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.getRole();
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.id = Id ? parseInt(Id) : 0;
    });
  }

  ngOnInit(): void {
    if (this.id) {
      this.getCourseDetails();
    }
  }

  backToList(){
    this.router.navigate(['/cct']);
  }

  getCourseDetails() {
    this.commonService.showLoading();
    this.courseService.courseDetail(this.id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.routegetdata = res.data;
          this.learnerGuidelines = JSON.parse(this.routegetdata['learner_guideline']);
          this.curriculumContent = JSON.parse(this.routegetdata['curriculum_content']);
          if (this.routegetdata['email_preffered_instructor']) {
            try {
              this.emailPrefferedEmail = JSON.parse(this.routegetdata['email_preffered_instructor']);
            } catch {
              this.emailPrefferedEmail = '';
            }
          }
          this.routegetdata['titleByLang'] = this.courseService.getTText(this.routegetdata['title']);
          this.routegetdata['descriptionByLang'] = this.courseService.getTText(this.routegetdata['description']);
          this.routegetdata['objectiveByLang'] = JSON.parse(this.routegetdata['objective']);
          this.routegetdata['learn_moreByLang'] = this.courseService.getTText(this.routegetdata['learn_more']);
          this.routegetdata['for_whoomByLang'] = this.courseService.getTText(this.routegetdata['for_whoom']);
          this.routegetdata['for_whomByLang'] = this.courseService.getTText(this.routegetdata['for_whom']);
          this.status = this.routegetdata.status;
          this.transfer_user_id = this.routegetdata.transfer_user_id;
          if (this.routegetdata.showbuttons) {
            let no = this.routegetdata.showbuttons.split('#').length;
            this.showbuttons = this.routegetdata.showbuttons.split('#')[no - 1];
          }
          if (this.routegetdata.purchase_order) {
            this.purchaseOrder = this.routegetdata.purchase_order.split('#')[0];
          }
          if (this.routegetdata.resource) {
            this.imgUrl = `${dataConstant.ImageUrl}/${this.routegetdata.resource}`;
          }
          if (this.routegetdata.material_source) {
            this.material_sourceUrl = `${dataConstant.ImageUrl}/${this.routegetdata.material_source}`;
          }
          this.setrejectbutton(this.routegetdata.id);
          this.getPublisher();
          this.getLanguages();
          this.getNewPublisherByLearningType();
          this.getDetailsOfCourse();
          this.getCordinators();
          this.getTrainingHours();
        }
      },
      (err: any) => {
        this.commonService.errorHandling(err);
        this.commonService.hideLoading();
      }
    );
  }

  beautificationTemplate(item: any) {
    const modalRef = this.modalService.open(CourseBeautificationTemplateComponent, {
      centered: true,
      size: 'xl',
      modalDialogClass: 'large-width',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      data: this.routegetdata.id,
      objectDetail: this.routegetdata
    };
  }


  getPublisher() {
    this.commonService.showLoading();
    this.authService.getUserRoles().subscribe((res: any) => {
      this.commonService.hideLoading();
      this.publisherList = res.data['4'];
      this.roleuserlist = res.data;
    }, (err: any) => {
      this.commonService.hideLoading();
      this.commonService.errorHandling(err);
    })
  }

  //get Languages
  getLanguages() {
    this.commonService.showLoading();
    this.courseService.getLanguages().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.availableLanguages = res.data;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  changeTranslateData(data: string) {
    if (data == 'title') {
      this.translateData = this.coursedetail.title ? JSON.parse(this.coursedetail.title) : [];
    }
    if (data == 'learn_more') {
      this.translateData = this.coursedetail.learn_more ? JSON.parse(this.coursedetail.learn_more) : [];
    }
    if (data == 'description') {
      this.translateData = this.coursedetail.description ? JSON.parse(this.coursedetail.description) : [];
    }
    if (data == 'for_whoom') {
      this.translateData = this.coursedetail.for_whoom ? JSON.parse(this.coursedetail.for_whoom) : [];
    }
  }

  getLabel(data: any) {
    let result;
    if (data) {
      const lang = this.availableLanguages.find((x: { slug: any; }) => x.slug == Object.keys(data)[0]);
      result = lang?.name;
    }
    return result;
  }

  getValue(data: any) {
    let result;
    if (data) {
      result = data[Object.keys(data)[0]]
    }
    return result;
  }

  getDetailsOfCourse() {
    this.commonService.showLoading();
    this.courseService.courseDetail(this.routegetdata.id).subscribe((res: any) => {
      this.coursedetail = res.data;
      this.commonService.hideLoading();
    }, (err: any) => {
      this.commonService.hideLoading();
      this.commonService.errorHandling(err);
    })
  }

  transferOtherroc() {
    this.commonService.showLoading();
    this.authService.getUserRoles().subscribe((res: any) => {
      this.commonService.hideLoading();
      this.otherRocsList = res.data['3'];
    }, (err: any) => {
      this.commonService.hideLoading();
      this.commonService.errorHandling(err);
    })
  }

  open(content: any) {
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

  getTrainingHours() {
    let str = this.routegetdata.duration;
    if (this.routegetdata.duration != undefined) {
      let hours = str.match(/(.*):/g).pop().replace(":", "");
      let min = str.match(/:(.*)/g).pop().replace(":", "");
      this.trainingDurationHours = hours + " " + "hours" + " " + min + " " + "minutes";
    }
  }
  getRole() {
    this.getUserrole = this.authService.getRolefromlocal();
    this.isStaff = this.getprofileDetails.data?.staff == 1 ? true : false;
  }

  updateCource() {
    this.router.navigateByUrl(`/cct/update/${this.id}`);
  }

  PublishRequest() {
    if (this.publishForm.invalid) {
      return;
    }
    let transferobj = { course_id: this.routegetdata.id, transfer_id: this.selectedPublisher, status: 'publish', intranet_url: this.publishForm.value.intranet_url, internet_url: this.publishForm.value.internet_url, status_comment: this.publishForm.value.status_comment };
    this.commonService.showLoading();
    this.courseService.courceStatus(transferobj).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res) {
       //   this.router.navigate(['/cct']);
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }
  reject() {
    let statusobj = { course_id: this.routegetdata.id, status: 'reject', status_comment: this.rejectcomment }
    this.commonService.showLoading();
    this.courseService.changeStatus(statusobj).subscribe((res: any) => {
      this.commonService.hideLoading();
      this.router.navigate(['/cct']);
    }, (err: any) => {
      this.commonService.hideLoading();
      this.commonService.errorHandling(err);
    })
  }

  getRoc(event: any) {
    this.selectedotherRoc = event.target.value;
    let region = this.roleuserlist[3];
    let user = region.filter((d: any) => d.region_id === event.target.value);

    region.forEach((field: any) => {
      if (field.region_id == event.target.value) {
        this.selectedotherRoc = field.id;
        //alert(this.selectedotherRoc);
      }
    });
    //  .map((res: any) => {
    //  this.selectedotherRoc = res.id;
    //  alert(this.selectedotherRoc)
    //})

  }

  getNewPublisherByLearningType() {
    this.commonService.showLoading();
    this.courseService.getNewPublisherByLearningType(this.routegetdata.learning_type).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.newPublisherList = res.data;
      }, (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      });
  }

  getPublisherselected(event: any) {
    this.selectedPublisher = event.target.value;
  }

  transfertoOtherRoc() {
    if (this.selectedotherRoc) {
      let transferobj = { course_id: this.routegetdata.id, status: 'pending', transfer_id: this.selectedotherRoc, status_comment: this.transfercomment };
      this.commonService.showLoading();
      this.courseService.courseTransfer(transferobj).subscribe((res: any) => {
        this.commonService.hideLoading();
        this.router.navigate(['/cct']);
      }, (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      })
    }
  }

  transfertoPublisher() {
    if (this.selectedPublisher) {
      let transferobj = { course_id: this.routegetdata.id, transfer_id: this.selectedPublisher };
      this.commonService.showLoading();
      this.courseService.courseTransfer(transferobj).subscribe((res: any) => {
        this.commonService.hideLoading();
        this.router.navigate(['/cct']);
      }, (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      })
    }
  }


  getImageUrl(): void {
    this.imgUrl = `https://orange.mindscroll.info/public/public/${this.routegetdata.resource}`;
    return this.imgUrl;
  }
  setrejectbutton(id: any) {
    this.courseService.courseHistory(id).subscribe((res: any) => {
      if (res && res.status == 1) {
        let history = res.data;
        this.showrejectbutton = history[history.length - 1].action_by;
      
      }
    })
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  getCordinators() {
    this.commonService.showLoading();
    this.courseService.getNewregionalCordinator().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.cordinatorsList = res.data;
      },
      (err: any) => {
        this.commonService.errorHandling(err);
        this.commonService.hideLoading();
      }
    );
  }

  copyToClipBoard(text: string) {
    navigator.clipboard.writeText(text);
  }


}
