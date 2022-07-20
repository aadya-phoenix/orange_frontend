import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TABLE_HORIZONTAL_SPLIT } from '@syncfusion/ej2-angular-richtexteditor';
import * as _ from 'lodash';
import { Track } from 'ngx-audio-player';
import { elementAt } from 'rxjs-compat/operator/elementAt';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { SMEService } from 'src/app/shared/services/sme/sme.service';
import { UserManageService } from 'src/app/shared/services/user-management/user-manage.service';
import { brotliCompressSync } from 'zlib';
import { SmedbTermsComponent } from '../smedb-terms/smedb-terms.component';
// import { Track } from 'ngx-audio-player';

@Component({
  selector: 'app-smedb-create',
  templateUrl: './smedb-create.component.html',
  styleUrls: ['./smedb-create.component.scss']
})
export class SmedbCreateComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  createSmedbForm: FormGroup;
  contentSupportForm: FormGroup;
  deliveryForm: FormGroup;
  voiceOverLearningForm: FormGroup;
  professionalCertificationsForm: FormGroup;
  commentsForm: FormGroup;
  sme_id = 0;
  sme_details: any = {};
  CCTDomainExpert = [];
  ContcatPersion = [];
  CCTDomainSkills: any = [];
  CCTDeliveryExperience = [];
  availableLanguages: any = [];
  CCTLevel = [];
  isSubmitted = false;
  isAvailable = true;
  isProcced = false;
  files: any = [];
  minDate = {};
  maxDate = {};
  today = new Date();
  other_language = false;
  previous_voice = false;
  SMETabs = dataConstant.SMETabs;
  selectedTab = this.SMETabs.contecntSupport;
  msaapDisplayTitle = false;
  msaapDisplayPlayList = false;
  msaapDisplayVolumeControls = true;
  msaapDisplayRepeatControls = false;
  msaapDisplayArtist = false;
  msaapDisplayDuration = false;
  msaapDisablePositionSlider = true;
  msaapPlaylist:any =[];
  getprofileDetails: any = {};
  public yesNo: any = [
    { id: 'yes', name: 'Yes' },
    { id: 'no', name: 'No' },
  ];
  public gender_voice: any = [
    { id: 'male', name: 'Male' },
    { id: 'female', name: 'Female' },
  ]

  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private authService: AuthenticationService,
    private userManageService: UserManageService,
    private courceService: CourcesService,
    private smeService: SMEService) {
      this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.sme_id = Id ? parseInt(Id) : 0;
    });

    this.minDate = `${this.today.getFullYear()}-${("0" + (this.today.getMonth() + 1)).slice(-2)}-${("0" + this.today.getDate()).slice(-2)}`;
    this.createSmedbForm = this.formBuilder.group({
      phone: new FormControl('', [Validators.required, Validators.pattern("[0-9 ]{10}")]),
      domain: new FormControl('', [Validators.required]),
      available: new FormControl('yes', [Validators.required]),
      start_date: new FormControl('', [Validators.required]),
      end_date: new FormControl('', [Validators.required]),
      contact_person_id: new FormControl('', [Validators.required]),
      isStatus: new FormControl(false),
    });

    this.contentSupportForm = this.formBuilder.group({ 'content-support': this.formBuilder.array([]) });
    // this.addLearnerGuideline(0, '', '');

    this.deliveryForm = this.formBuilder.group({ 'delivery': this.formBuilder.array([]) });
    // this.addDelivery(0, '', '', '', '', '', true, false);
    this.voiceOverLearningForm = this.formBuilder.group({
      language: new FormControl('', [Validators.required]),
      other_language: new FormControl(''),
      gender_voice: new FormControl('', [Validators.required]),
      voice_recording: [],
      previous_experience: new FormControl('', [Validators.required])
    });
    this.professionalCertificationsForm = this.formBuilder.group({ 'professional-certifications': this.formBuilder.array([]) });
    // this.addProfessionalCertification(0, '', '');
    this.commentsForm = this.formBuilder.group({
      agree: new FormControl('', [Validators.required]),
      other_comment: new FormControl('')
    });

    this.createSmedbForm.get("available")?.valueChanges.subscribe((x: string) => {
      if (x === 'yes') {
        this.isAvailable = true;
        this.createSmedbForm.addControl('end_date', new FormControl('', [Validators.required]));
      } else {
        this.isAvailable = false;
        this.createSmedbForm.removeControl('end_date');
      }
    });
    this.createSmedbForm.get("start_date")?.valueChanges.subscribe((x: {}) => {
      this.maxDate = x;
    });
    this.voiceOverLearningForm.get("language")?.valueChanges.subscribe((x: any) => {
      if (_.includes(x, 'Others')) {
        this.other_language = true;
      }
      else {
        this.other_language = false;
        this.voiceOverLearningForm.controls.other_language.setValue(null);
      }
    });
    this.voiceOverLearningForm.get("previous_experience")?.valueChanges.subscribe((x: string) => {
      if (x == 'yes') {
        this.previous_voice = true;
        this.voiceOverLearningForm.addControl('comment', new FormControl(null, [Validators.required]));
      }
      else {
        this.previous_voice = false;
        this.voiceOverLearningForm.removeControl('comment');
      }
    });

  }

  ngOnInit(): void {
    this.getCCTDomainExpert();
  }

  changeTab(tab: string) {
    this.selectedTab = tab;
  }

  handleFileInput(event: any) {
    this.files = [];
    const fsize = event.target.files[0].size;
    const file = Math.round((fsize / 1024) / 1024);
    debugger;
    for (let index = 0; index < event.target.files.length; index++) {
      const element = event.target.files[index];
      this.commonService.FileConvertintoBytearray(element, async (f) => {
        // creating array bytes
        this.files.push({ file: this.commonService.byteArrayTobase64(f.bytes), ext: f.name.split('.').pop() });
      });
    }
  }

  showTerms() {
    const x = this.commentsForm.get("agree")?.value;
    if (!x) {
      const modalRef = this.modalService.open(SmedbTermsComponent, {
        centered: true,
        size: 'lg',
        windowClass: 'alert-popup',
      });
    }
  }

  getCCTDomainExpert() {
    this.commonService.showLoading();
    this.smeService.getCCTDomainExpert().subscribe(
      (res: any) => {
        if (res && res.status == 1) {
          this.CCTDomainExpert = res.data.filter((x: { mandatory: number; }) => x.mandatory == 0);
          this.getCCTDomainSkills();
        }
        else {
          this.commonService.toastErrorMsg("Error", res.message);
          this.commonService.hideLoading();
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  getCCTDomainSkills() {
    this.commonService.showLoading();
    this.smeService.getCCTDomainSkills().subscribe(
      (res: any) => {
        if (res && res.status == 1) {
          this.CCTDomainSkills = res.data;
          this.getcctLevel();
        }
        else {
          this.commonService.toastErrorMsg("Error", res.message);
          this.commonService.hideLoading();
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  getcctLevel() {
    this.commonService.showLoading();
    this.courceService.getcctLevel().subscribe(
      (res: any) => {
        if (res && res.status == 1) {
          this.CCTLevel = res.data.filter((x: { sme_level: any; }) => x.sme_level != null);
          this.getCCTDeliveryExperience();
        }
        else {
          this.commonService.toastErrorMsg("Error", res.message);
          this.commonService.hideLoading();
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }


  getCCTDeliveryExperience() {
    this.commonService.showLoading();
    this.smeService.getCCTDeliveryExperience().subscribe(
      (res: any) => {
        if (res && res.status == 1) {
          this.CCTDeliveryExperience = res.data.filter((x: { mandatory: number; }) => x.mandatory == 0);
          this.getLanguages();
        }
        else {
          this.commonService.toastErrorMsg("Error", res.message);
          this.commonService.hideLoading();
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  getLanguages() {
    this.commonService.showLoading();
    this.courceService.getLanguages().subscribe(
      (res: any) => {
        if (res && res.status == 1) {
          this.availableLanguages = res.data.filter((x: { carousel_show: number; }) => x.carousel_show == 1);
          this.availableLanguages.push({ "slug": "other", "name": "Other" })
          this.getContcatPersion();
        }
        else {
          this.commonService.toastErrorMsg("Error", res.message);
          this.commonService.hideLoading();
        }
      },
      (err: any) => {
        this.commonService.errorHandling(err);
        this.commonService.hideLoading();
      }
    );
  }

  getContcatPersion() {
    this.userManageService.getUsers().subscribe(
      (res: any) => {
        if (res && res.status == 1) {
          this.ContcatPersion = res.data.filter((x: {
            pdl_member: number;
          }) => x.pdl_member == 1);
          this.getSMEDatabase();
        }
        else {
          this.commonService.toastErrorMsg("Error", res.message);
          this.commonService.hideLoading();
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  getSMEDatabase() {
    this.smeService.getSMEDatabase().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          if (res.data.sme && res.data.sme.length) {
            if (this.sme_id) {
              this.sme_details = res.data.sme.find((x: { id: number; }) => x.id == this.sme_id);
            }
            else {
              this.sme_details = res.data.sme.find((x: { user_id: any; }) => x.user_id == this.getprofileDetails.data.id);
              this.sme_id = this.sme_details.id;
            }
            this.bindFormData()
          }
        }
        else {
          this.commonService.toastErrorMsg("Error", res.message);
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  bindFormData() {
    if (this.sme_details && this.sme_details.id > 0) {
      this.sme_id = this.sme_details.id;
      this.sme_details.domain = JSON.parse(this.sme_details.domain);
      const start_date = new Date(this.sme_details.start_date);
      const end_date = new Date(this.sme_details.end_date);
      this.sme_details.start_date = `${start_date.getFullYear()}-${("0" + (start_date.getMonth() + 1)).slice(-2)}-${("0" + start_date.getDate()).slice(-2)}`;
      this.sme_details.end_date = `${end_date.getFullYear()}-${("0" + (end_date.getMonth() + 1)).slice(-2)}-${("0" + end_date.getDate()).slice(-2)}`;
      this.sme_details.isStatus = this.sme_details.status == 'draft' ? true : false;
      this.createSmedbForm.patchValue(this.sme_details);
    }
    if (this.isProcced) {
      if (this.sme_details.domain.includes('content-support')) {
        this.contentSupportForm.controls["content-support"] = this.formBuilder.array([]);
        if (this.sme_details.metadata && this.sme_details.metadata["content-support"]?.length > 0) {
          this.sme_details.metadata["content-support"].forEach((x: any) => {
            this.addLearnerGuideline(x.id, x.title, x.level);
          })
        }
        else {
          this.addLearnerGuideline(0, '', '');
        }
      }
      if (this.sme_details.domain.includes('delivery')) {
        this.deliveryForm.controls["delivery"] = this.formBuilder.array([]);
        if (this.sme_details.metadata && this.sme_details.metadata["delivery"]?.length > 0) {
          this.sme_details.metadata["delivery"].forEach((x: any) => {
            this.addDelivery(x.id, x.level, x.title, x.previous_experience, x.need_help, x.comment, x.previous_experience == 'yes' ? true : false, x.need_help == 'yes' ? true : false);
          })
        } else {
          this.addDelivery(0, '', '', '', '', '', true, false);
        }
      }
      if (this.sme_details.domain.includes('voice-over-learning')) {
        if (this.sme_details.metadata && this.sme_details.metadata["voice-over-learning"]?.length > 0) {
          this.voiceOverLearningForm.controls["voice-over-learning"] = this.formBuilder.array([]);
          this.sme_details.metadata["voice-over-learning"].forEach((x: any) => {
            this.voiceOverLearningForm.controls.language.setValue(JSON.parse(x.language));
            this.voiceOverLearningForm.controls.other_language.setValue(x.other_language);
            this.voiceOverLearningForm.controls.gender_voice.setValue(x.gender_voice);
            this.voiceOverLearningForm.controls.previous_experience.setValue(x.previous_experience);
            if(x.previous_experience == 'yes'){
              this.previous_voice = true;
              this.voiceOverLearningForm.addControl('comment', new FormControl(x.comment, [Validators.required]));
            }
            if (x.voice_recording) {
              const voice_recording = JSON.parse(x.voice_recording);
              voice_recording.forEach((element: any) => {
                
                const msaapPlaylist = [
                  {
                    title: x.language,
                    link: `${dataConstant.ImageUrl}/${element}`
                  }
                ];

                this.msaapPlaylist.push(msaapPlaylist)
              })
            }
          })
        }
        else {
          this.voiceOverLearningForm = this.formBuilder.group({
            language: new FormControl('', [Validators.required]),
            other_language: new FormControl(''),
            gender_voice: new FormControl('', [Validators.required]),
            voice_recording: [],
            previous_experience: new FormControl('', [Validators.required])
          });
        }
      }
      this.professionalCertificationsForm.controls["professional-certifications"] = this.formBuilder.array([]);
      if (this.sme_details.metadata && this.sme_details.metadata["professional-certifications"]?.length > 0) {
        this.sme_details.metadata["professional-certifications"].forEach((x: any) => {
          this.addProfessionalCertification(x.id, x.certification_title, x.completion_year);
        })
      } else {
        this.addProfessionalCertification(0, '', '');
      }
      if (this.sme_details.metadata && this.sme_details.metadata["comments"]) {
        this.sme_details.metadata["comments"].forEach((x: any) => {
          this.commentsForm.controls.agree.setValue(x.agree);
          this.commentsForm.controls.other_comment.setValue(x.other_comment);
        })
      } else {
        this.commentsForm = this.formBuilder.group({
          agree: new FormControl('', [Validators.required]),
          other_comment: new FormControl('')
        });
      }
    }
  }

  get contentSupportFormArray(): FormArray {
    return this.contentSupportForm.get("content-support") as FormArray;
  }

  get deliveryFormArray(): FormArray {
    return this.deliveryForm.get("delivery") as FormArray;
  }

  get professionalCertificationsFormArray(): FormArray {
    return this.professionalCertificationsForm.get("professional-certifications") as FormArray;
  }


  addMoreContentSupport(id: number, title: string, level: string) {
    return this.formBuilder.group({
      id: new FormControl(id),
      title: new FormControl(title, [Validators.required]),
      level: new FormControl(level, [Validators.required]),
    });
  }

  addLearnerGuideline(id: number, titleval: string, descriptionval: string) {
    return this.contentSupportFormArray.push(this.addMoreContentSupport(id, titleval, descriptionval));
  }

  removeContentSupport(i: any) {
    this.contentSupportFormArray.removeAt(i);
  }

  addMoreDelivery(id: number, title: string, level: string, previous_experience: string, need_help: string, comment: string, isPrevious: boolean, isNeedHelp: boolean) {
    return this.formBuilder.group({
      id: new FormControl(id),
      title: new FormControl(title, [Validators.required]),
      level: new FormControl(level, [Validators.required]),
      previous_experience: new FormControl(previous_experience, [Validators.required]),
      need_help: new FormControl(need_help, [Validators.required]),
      comment: new FormControl(comment, [Validators.required]),
      isPrevious: isPrevious,
      isNeedHelp: isNeedHelp
    });
  }

  addDelivery(id: number, titleval: string, descriptionval: string, previous_experience: string, need_help: string, comment: string, isPrevious: boolean, isNeedHelp: boolean) {
    return this.deliveryFormArray.push(this.addMoreDelivery(id, titleval, descriptionval, previous_experience, need_help, comment, isPrevious, isNeedHelp));
  }

  removeDelivery(i: any) {
    this.deliveryFormArray.removeAt(i);
  }

  addMoreProfessionalCertification(id: number, certification_title: string, completion_year: string) {
    return this.formBuilder.group({
      id: new FormControl(id),
      certification_title: new FormControl(certification_title, [Validators.required]),
      completion_year: new FormControl(completion_year, [Validators.required]),
    });
  }

  addProfessionalCertification(id: number, certification_title: string, completion_year: string) {
    return this.professionalCertificationsFormArray.push(this.addMoreProfessionalCertification(id, certification_title, completion_year));
  }

  removeProfessionalCertification(i: any) {
    this.professionalCertificationsFormArray.removeAt(i);
  }

  changePerviousExperience(item: any) {
    item.controls.isPrevious.setValue(item.value.previous_experience == 'yes' ? true : false);
    if(item.controls.isPrevious.value){
      item.removeControl('need_help')
    }else{
      item.addControl('need_help', new FormControl(null, [Validators.required]))
    }
  }

  changeNeedHelp(item: any) {
    item.controls.isNeedHelp.setValue(item.value.need_help == 'yes' ? true : false);
    if(!item.controls.isNeedHelp.value){
      item.removeControl('comment')
    }else{
      item.addControl('comment', new FormControl(null, [Validators.required]))
    }
    // if(!item.value.isNeedHelp){
    //   this.createSmedbForm.removeControl('end_date');
    // }
  }


  saveSME() {
    this.isSubmitted = true;
    if (this.createSmedbForm.invalid) {
      return;
    }
    if (this.sme_details.domain && this.isProcced) {
      if (this.sme_details.domain.includes('content-support') && this.contentSupportForm.controls["content-support"].invalid) {
        this.selectedTab = this.SMETabs.contecntSupport;
        return;
      }
      if (this.sme_details.domain.includes('delivery') && this.deliveryForm.controls["delivery"].invalid) {
        this.selectedTab = this.SMETabs.delivery;
        return;
      }
      if (this.sme_details.domain.includes('voice-over-learning') && this.voiceOverLearningForm.invalid) {
        this.selectedTab = this.SMETabs.voiceOver;
        return;
      }
      if (this.sme_id && this.professionalCertificationsForm.controls["professional-certifications"].invalid) {
        this.selectedTab = this.SMETabs.professionalCertifications;
        return;
      }
      if (this.sme_id && this.commentsForm.invalid) {
        this.selectedTab = this.SMETabs.comments;
        return;
      }
    }
    const body = this.createSmedbForm.value;
    body.status = body.isStatus ? 'draft' : 'pending';
    if (!this.sme_id) {
      this.commonService.showLoading();
      this.smeService.create(body).subscribe(
        (res: any) => {
          if (res && res.status == 1) {
            this.commonService.toastSuccessMsg('SME Database', res.message);
            this.isProcced = true;
            this.getSMEDatabase();
            //this.router.navigateByUrl(`/dashboard/smedb/view/${res.data.id}`);
          } else {
            this.commonService.toastErrorMsg('Error', res.message);
          }
          this.commonService.hideLoading();
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.errorHandling(err);
        }
      );
    }
    else {
      body.sme_id = this.sme_id;
      if (this.isProcced) {
        body.matadata_update = 1;
        body.metadata = {
          "professional-certifications": this.professionalCertificationsForm.value["professional-certifications"],
          "comments": this.commentsForm.value
        }
        if (this.sme_details.domain.includes('content-support')) {
          body.metadata["content-support"] = this.contentSupportForm.controls["content-support"].value;
        }
        if (this.sme_details.domain.includes('delivery')) {
          body.metadata["delivery"] =  this.deliveryForm.controls["delivery"].value;
        }
        if (this.sme_details.domain.includes('voice-over-learning')) {
          body.metadata["voice-over-learning"] = this.voiceOverLearningForm.value;
        }
        if (this.files && this.files.length > 0) {
          body.metadata["voice-over-learning"].voice_recording = this.files;
        }
      }
      else if (this.sme_details.metadata) {
        body.matadata_update = 0;
      }
      this.commonService.showLoading();
      this.smeService.update(body).subscribe(
        (res: any) => {
          if (res && res.status == 1) {
            this.commonService.toastSuccessMsg('SME Database', res.message);
            if (this.isProcced) {
              this.router.navigateByUrl(`/dashboard/smedb/view/${this.sme_id}`);
            }
            else {
              this.isProcced = true;
              this.getSMEDatabase();
            }
          } else {
            this.commonService.toastErrorMsg('Error', res.message);
          }
          this.commonService.hideLoading();
          //this.router.navigateByUrl(`/dashboard/olcarousel/view/${this.carousel_id}`);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.errorHandling(err);
        }
      );
    }

  }





  onFilesAdded(event: { addedFiles: any; }) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onFilesRejected(event: any) {
    console.log(event);
  }

  onRemove(event: File) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }


  onSelect(event: any) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }


}
