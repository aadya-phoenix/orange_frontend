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
  id = 0;
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
    this.getRole();
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.id = Id ? parseInt(Id) : 0;
    });
  }

  ngOnInit(): void {
    if(this.id){
      this.getCourseDetails();
    }
  }

  getCourseDetails() {
    this.commonService.showLoading();
    this.courseService.courseDetail(this.id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.routegetdata = res.data;
          this.learnerGuidelines = JSON.parse(this.routegetdata['learner_guideline']);
          this.curriculumContent = JSON.parse(this.routegetdata['learner_guideline']);
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
          this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
          this.status = this.routegetdata.status;
          this.transfer_user_id = this.routegetdata.transfer_user_id;
          if(this.routegetdata.showbuttons){
            let no = this.routegetdata.showbuttons.split('#').length;
            this.showbuttons = this.routegetdata.showbuttons.split('#')[no - 1];
          }
          if (this.routegetdata.purchase_order) {
            this.purchaseOrder = this.routegetdata.purchase_order.split('#')[0];
          }
          if (this.routegetdata.resource) {
            this.imgUrl = `${dataConstant.ImageUrl}/${this.routegetdata.resource}`;
          }
          debugger;
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
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }

  beautificationTemplate(item: any) {
    const modalRef = this.modalService.open(CourseBeautificationTemplateComponent, {
      centered: true,
      // size: 'xl',
      modalDialogClass: 'large-width',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      data: this.routegetdata.id,
      objectDetail: this.routegetdata
    };
  }


  getPublisher() {
    this.authService.getUserRoles().subscribe((res: any) => {
      //  console.log("roles are",res);
      this.publisherList = res.data['4'];
      this.roleuserlist = res.data;
      console.log(this.publisherList)
    }, (err: any) => {
      console.log(err)
    })
  }

  //get Languages
  getLanguages() {
    this.courseService.getLanguages().subscribe(
      (res: any) => {
        console.log(res);
        this.availableLanguages = res.data;
      },
      (err: any) => {
        console.log(err);
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
    this.courseService.courseDetail(this.routegetdata.id).subscribe((res: any) => {
      this.coursedetail = res.data;
    }, (err: any) => {
    })
  }

  transferOtherroc() {
    this.authService.getUserRoles().subscribe((res: any) => {
      console.log(res);
      this.otherRocsList = res.data['3'];
      console.log(this.otherRocsList)
    }, (err: any) => {
      console.log(err)
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
    console.log("duyration", str);
    console.log("duation", this.routegetdata.duration);
    if (this.routegetdata.duration != undefined) {
      let hours = str.match(/(.*):/g).pop().replace(":", "");
      let min = str.match(/:(.*)/g).pop().replace(":", "");
      this.trainingDurationHours = hours + " " + "hours" + " " + min + " " + "minutes";
    }
  }
  getRole() {
    this.getUserrole = this.authService.getRolefromlocal();
  }

  updateCource() {
    this.router.navigateByUrl(`/dashboard/cct/update/${this.id}`);
  }

  PublishRequest() {
    let transferobj = { course_id: this.routegetdata.id, transfer_id: this.selectedPublisher, status: 'publish', intranet_url: this.publishForm.value.intranet_url, internet_url: this.publishForm.value.internet_url, status_comment: this.publishForm.value.status_comment };
    if (this.publishForm.valid) {
      this.courseService.courceStatus(transferobj).subscribe(
        (res: any) => {
          console.log(res);
          if (res) {
            this.router.navigate(['/dashboard/cct']);
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
    else {
      console.log("form invalid");
    }
  }
  reject() {
    let statusobj = { course_id: this.routegetdata.id, status: 'reject', status_comment: this.rejectcomment }
    this.courseService.changeStatus(statusobj).subscribe((res: any) => {
      console.log(res);
      this.router.navigate(['/dashboard/cct']);
    }, (err: any) => {
      console.log(err)
    })
  }

  getRoc(event: any) {
    this.selectedotherRoc = event.target.value;
    console.log(this.selectedotherRoc)
    let region = this.roleuserlist[3];
    console.log(region);
    let user = region.filter((d: any) => d.region_id === event.target.value);

    region.forEach((field: any) => {
      if (field.region_id == event.target.value) {
        this.selectedotherRoc = field.id;
        //alert(this.selectedotherRoc);
      }
    });
    console.log(user);
    //  .map((res: any) => {
    //  this.selectedotherRoc = res.id;
    //  alert(this.selectedotherRoc)
    //})

  }

  getNewPublisherByLearningType() {
    this.courseService.getNewPublisherByLearningType(this.routegetdata.learning_type).subscribe(
      (res: any) => {
        console.log("pub new", res);
        this.newPublisherList = res.data;
      }, (err: any) => {
        console.log(err);
      });
  }

  getPublisherselected(event: any) {
    this.selectedPublisher = event.target.value;
    console.log(this.selectedPublisher)
  }

  transfertoOtherRoc() {
    if (this.selectedotherRoc) {
      let transferobj = { course_id: this.routegetdata.id, status: 'pending', transfer_id: this.selectedotherRoc, status_comment: this.transfercomment };
      this.courseService.courseTransfer(transferobj).subscribe((res: any) => {
        console.log(res);
        //this.router.navigate(['/dashboard/cources']);
        // let transferobj1 = { course_id: this.routegetdata.id, status: 'pending' };
        // // Commenting it as it is not required : ANkur : 7Apr
        // this.courseService.courceStatus(transferobj1).subscribe((res: any) => {
        //   console.log(res);
        this.router.navigate(['/dashboard/cources']);
        // }, (err: any) => {
        //   console.log(err)
        // })
      }, (err: any) => {
        console.log(err)
      })
    }
  }

  transfertoPublisher() {
    if (this.selectedPublisher) {
      let transferobj = { course_id: this.routegetdata.id, transfer_id: this.selectedPublisher };
      this.courseService.courseTransfer(transferobj).subscribe((res: any) => {
        console.log(res);
        this.router.navigate(['/dashboard/cources']);
      }, (err: any) => {
        console.log(err)
      })
    }
  }


  getImageUrl(): void {
    this.imgUrl = `https://orange.mindscroll.info/public/public/${this.routegetdata.resource}`;
    console.log("this.imgUrl", this.imgUrl);
    return this.imgUrl;
  }
  setrejectbutton(id: any) {
    this.courseService.courseHistory(id).subscribe((res: any) => {
      console.log(res);
      if (res && res.status == 1) {
        let history = res.data;
        this.showrejectbutton = history[history.length - 1].action_by;
        console.log("showrejectbutton", this.showrejectbutton)
      }
    })
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  getCordinators() {
    this.courseService.getNewregionalCordinator().subscribe(
      (res: any) => {
        console.log(res);
        this.cordinatorsList = res.data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  copyToClipBoard(text: string) {
    navigator.clipboard.writeText(text);
  }


}
