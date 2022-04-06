import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
const emailregexp = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';

@Component({
  selector: 'app-create-carousel',
  templateUrl: './create-carousel.component.html',
  styleUrls: ['./create-carousel.component.scss']
})
export class CreateCarouselComponent implements OnInit {
routergetdata: any;
  formCtrlSub: Subscription = new Subscription();
  isImageSaved: any;
  totalObjnew: any = {};

  
  public tools: object = {
    items: [
         'UnorderedList']
  };
  public newTools: object = {
    items: [
         'UnorderedList']
  };

  curriculumEditor:any;
  public cardImageBase64: any;
  public createCourceForm!: FormGroup;
  public commonCreateCourceForm!: FormGroup;
  public commonCreateCourceForm_playlist!: FormGroup;
  public iltandViltForm!: FormGroup;
  public videobasedForm!: FormGroup;
  public materialbasedForm!: FormGroup;
  public currriculumForm!: FormGroup;
  public webbasedForm!: FormGroup;
  public playlistForm!: FormGroup;
  public publishForm!: FormGroup;
  public showCertificateExpiry: boolean = false;
  public showCertificateExpiry_Curriculum: boolean = false;
  public showCertificateExpiry_Webbased: boolean = false;
  public regionTargetAudience: boolean = false;
  public regionTargetAudiencePlaylist: boolean = false;
  public externalVendorname: boolean = false;
  public externalVendorname_Webbased: boolean = false;
  public materialsourceurl: boolean = false;
  public materialsourceupload: boolean = false;
  showVendor: boolean = false;
  showVendor_Webbased: boolean = false;
  getprofileDetails: any;
  showrejectbutton: any;
  user_id: any;
  public learnerGuidearray: any = [];
  public learningType: any = '';
  public learningTypeSelected: any = '0';
  public selectedLanguages: any = [];
  public learnerGuidelines: any = [];
  fieldArrObj: any = []
  public cctLevel: any;
  coursesList: any;
  courseLength: any;
  notification: boolean = false;
  fileToUpload: any[] = [];
  fileToUpload_Material: any[] = [];
  j: any = 0;
  remainingText:any=0;
  public lang: any;
  public imageError: string = "";
  public requiredFields: any = {
    "1": {
      "common":
      {
        "title": [Validators.required],
        //"duration":[Validators.required],
        "learning_type": [Validators.required],
        "description": [Validators.required],
        "objective": [Validators.required],
        "level": [Validators.required],
        "subject": [Validators.required],
        "keyword": [Validators.required],
        "email": [Validators.required, Validators.pattern(emailregexp)],
        "certification_expiry_type": [Validators.required],
        "validity_period": [Validators.required],
        "external_vendor_name": [Validators.required],
        "training_provided_by": [Validators.required],
        "available_language": [Validators.required],
        "email_training_contact": [Validators.required, Validators.pattern(emailregexp)]
      },
      'each': {
        "manager_approval": [Validators.required],
        "digital": [Validators.required],
        "certification": [Validators.required],
        "delivery_method": [Validators.required],
        "for_whoom": [Validators.required],
        "first_session_date": [Validators.required],
        "expiry_date": [Validators.required],
        "external_vendor": [Validators.required],
        "entity_business_area": [Validators.required],
        "email_preffered_instructor": [Validators.required],
        'regional_cordinator': [Validators.required]
      }
    },
    '2':
    {
      'common':
      {
        "title": [Validators.required],
        "duration": [Validators.required],
        "learning_type": [Validators.required],
        "description": [Validators.required],
        "objective": [Validators.required],
        "level": [Validators.required],
        "subject": [Validators.required],
        "keyword": [Validators.required],
        "email": [Validators.required, Validators.pattern(emailregexp)],
        "training_provided_by": [Validators.required],
        "available_language": [Validators.required],
        "email_training_contact": [Validators.required, Validators.pattern(emailregexp)]
      },
      'each': {
        "email_preffered_instructor": [Validators.required, Validators.pattern(emailregexp)]
      }
    },
    '3':
    {
      'common':
      {
        "title": [Validators.required],
        "duration": [Validators.required],
        "learning_type": [Validators.required],
        "description": [Validators.required],
        "objective": [Validators.required],
        "level": [Validators.required],
        "subject": [Validators.required],
        "keyword": [Validators.required],
        "email": [Validators.required, Validators.pattern(emailregexp)],
        "training_provided_by": [Validators.required],
        "available_language": [Validators.required],
        "email_training_contact": [Validators.required, Validators.pattern(emailregexp)]
      },
      'each': {
        "material_source": [Validators.required],
        "url": [Validators.required]
      }
    },
    '4':
    {
      'common':
      {
        "title": [Validators.required],
        "duration": [Validators.required],
        "learning_type": [Validators.required],
        "description": [Validators.required],
        "objective": [Validators.required],
        "level": [Validators.required],
        "subject": [Validators.required],
        "keyword": [Validators.required],
        "email": [Validators.required, Validators.pattern(emailregexp)],
        "training_provided_by": [Validators.required],
        "available_language": [Validators.required],
        "email_training_contact": [Validators.required, Validators.pattern(emailregexp)]
      },
      'each': {
        "manager_approval": [Validators.required],
        "digital": [Validators.required],
        "certification": [Validators.required],
        "for_whoom": [Validators.required],
        "external_vendor_name": [Validators.required]
      }
    }, '5':
    {
      'common':
      {
        "title": [Validators.required],
        "duration": [Validators.required],
        "learning_type": [Validators.required],
        "description": [Validators.required],
        "objective": [Validators.required],
        "level": [Validators.required],
        "subject": [Validators.required],
        "keyword": [Validators.required],
        "email": [Validators.required, Validators.pattern(emailregexp)],
        "training_provided_by": [Validators.required],
        "available_language": [Validators.required],

      },
      'each': {
        "digital": [Validators.required],
        "certification": [Validators.required],
        "external_vendor": [Validators.required],
        "email_preffered_instructor": [Validators.required, Validators.pattern(emailregexp)]
      }
    }, '6':
    {
      'common':
      {
        "title": [Validators.required],
        "description": [Validators.required],
      },
      'each': {
        "url": [Validators.required],
        "video_link": [Validators.required],
        "for_whoom": [Validators.required],
        "level": [Validators.required],
        "who_see_course": [Validators.required],
        "free_field_content": [Validators.required],
        "email_preffered_instructor": [Validators.required]
      }
    }
  };
  public cctExpiryperiod: any = [
    {
      id: 1,
      name: '3 months',
      status: 1,
    },
    {
      id: 2,
      name: '6 months',
      status: 1,
    },
    {
      id: 3,
      name: '12 months',
      status: 1,
    },
  ];

  public yesNo: any = [
    { id: 'yes', name: 'Yes' },
    { id: 'no', name: 'No' },
  ];
  target_audience_selected ='no';
  public cctExpiryType: any;
  public validityPeriod: any;

  public vendorType: any;
  public cctSubjects: any;
  public entityList: any;

  public deliveryMethod: any;
  public selectedDeliveryMethod: any;
  public selectedemailPrefferedInstructor: any;
  public selectedentityBusinessArea: any;
  public selectedExternalVendor: any;
  public whocanSee: any;
  public preferedInstructor: any;
  public subjectId: any;
  public availableLanguages: any;
  public learningTypes: any;

  showtitle: any;
  showobjective: any;
  showdescription: any;
  showforwhoom: any;
  showlearnmore: any;
  showlevel: any;

  showCurriculumEmail: any;
  showCurriculumLink: any;
  showCurriculumFreeText: any;
  showCurriculumContent: any;
  showCurriculumLearnMore: any;
  showCurriculumForWhom: any;
  showCurriculumWhoSee: any;
  showCurriculumRegional: any;

  showMaterialURLchecked: boolean = false;
  showMaterialUploadchecked: boolean = false;

  showILTWhoSee: any;
  showILTEmail: any;
  showILTForWhom: any;
  showILTLearnMore: any;
  showILTtitleAdditional: any;
  showILTEntity: any;
  showILTVendorName: any;
  showILTRegional: any;
  showILTDeliveryMethod: any;
  showILTFree: any;

  public showPlaylistTargetAudience: any;
  showPlaylistEmail: any;
  rejectcomment: any;

  getUserrole: any; //to get user role
  public cordinatorsList: any = [];
  draftRequests: any = [];
  pendingRequests: any = [];
  rejectedRequests: any = [];
  closedRequests: any = [];
  stringArray: any = [];
  publisherList: any = [];
  selectedPublisherId: any;

  constructor() { }

  ngOnInit(): void {
  }

}
