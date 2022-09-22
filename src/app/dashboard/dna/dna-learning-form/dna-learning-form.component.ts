import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DnaService } from 'src/app/shared/services/dna/dna.service';
import { GeneralDropdownsService } from 'src/app/shared/services/general-dropdowns/general-dropdowns.service';
import { GetReportService } from 'src/app/shared/services/get-report/get-report.service';

@Component({
  selector: 'app-dna-learning-form',
  templateUrl: './dna-learning-form.component.html',
  styleUrls: ['./dna-learning-form.component.scss']
})
export class DnaLearningFormComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  public modalType: any;
  createDnaForm: FormGroup;
  isFrance = false;
  isManager = false;
  bpStatusObj: any = [];
  countriesObj: any = [];
  locationsObj: any = [];
  priorityObj: any = [];
  regionsObj: any = [];
  regionObj: any = [];
  domainObj: any = [];
  bussinessUnitObj: any = [];
  titleList: any = [];
  form_details: any;
  tracker_details: any;
  training_type: string = '';
  training_provider: string = '';
  training_hours: any;
  training_description: string = '';
  trackerId: number = 0;
  trainingId: number = 0;
  regionId: number = 0;
  formId: number = 0;
  title = 'Add New Learning';
  isSubmitted = false;
  isOtherBU = false;
  isDescription = false;
  isCountry = true;
  type: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private generalDrpdownsService: GeneralDropdownsService,
    private dnaService: DnaService,
    private commonService: CommonService,
    private authService: AuthenticationService,
    private router: Router) {
    this.isManager = this.authService.getProfileDetailsfromlocal().data?.manager == 1 ? true : false;
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.createDnaForm = this.formBuilder.group({
      learning_id: new FormControl('', []),
      title: new FormControl('', []),
      // description: new FormControl('', []),
      number_of_participant: new FormControl('', [Validators.required]),
      priority_id: new FormControl('', [Validators.required]),
      region_id: new FormControl('', [Validators.required]),
      // management_code:'',
      // domain_training_id: new FormControl('',[]),
      // location: new FormControl('', []),
      business_unit_id: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    if (this.isManager) {
      this.route.paramMap.subscribe((params: ParamMap) => {
        const Id = params.get('id');
        const form_id = params.get('form_id');
        this.trackerId = Id ? parseInt(Id) : 0;
        this.getTrackerDetail();
        this.formId = form_id ? parseInt(form_id) : 0;
      });

      if (this.isFranceType()) {
        this.createDnaForm.addControl('domain_training_id', new FormControl('', [Validators.required]));
        this.createDnaForm.addControl('location', new FormControl('', [Validators.required]));
        this.createDnaForm.removeControl('management_code');
        this.createDnaForm.removeControl('country');
      }
      else {
        this.createDnaForm.addControl('management_code', new FormControl('', [Validators.required]));
        this.createDnaForm.addControl('country', new FormControl('', [Validators.required]));
        this.createDnaForm.removeControl('domain_training_id');
        this.createDnaForm.removeControl('location');
      }

      this.getPriority();
      this.getRegions();
      this.getBusinessUnits();
      this.getDomain();
      this.getLocations();
    }
  }

  isFranceType() {
    return this.type == 1;
  }

  getEvent(region: any) {
    this.regionId = region.id;
    if (region.region_name == 'Global') {
      this.isCountry = false;
      this.createDnaForm.removeControl('country');
    }
    else {
      this.isCountry = true;
      this.getCountries();
    }
  }

  getTitle(event: any) {
    this.training_type = event.training_type;
    this.training_provider = event.training_provider;
    this.training_description = event.training_description;
    this.training_hours = event.training_hours;
    if (event && event.id) {
      this.isDescription = false;
      this.createDnaForm.removeControl('description');
    }
    else {
      this.isDescription = true;
      this.createDnaForm.addControl('description', new FormControl('', [Validators.required]));
    }
  }

  getOtherBusinessUnit(item: any) {
    if (item.id == 8) {
      this.isOtherBU = true;
      this.createDnaForm.addControl('other_bussiness_unit', new FormControl('', [Validators.required]));
    }
    else {
      this.isOtherBU = false;
      this.createDnaForm.removeControl('other_bussiness_unit');
    }
    console.log("item", item);
  }

  save() {
    this.isSubmitted = true;
    if (this.createDnaForm.invalid) {
      return;
    }
    const body = this.createDnaForm.value;
    body.tracker_id = this.trackerId;
    body.training_type = this.training_type;
    body.training_provider = this.training_provider;
    body.training_description = this.training_description;
    body.training_hours = this.training_hours;
    if (this.formId) {
      body.digital_learning_id = this.formId;
      this.update(body);
    }
    else {
      this.create(body);
    }
  }

  create(body: any) {
    this.commonService.showLoading();
    this.dnaService.create(body).subscribe(
      (res: any) => {
        if (res.status == 1) {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('New Learning', 'Successfully Created.');
          this.router.navigateByUrl(`/dna/create/${this.trackerId}`);
        }
        else {
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', res.message);
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  update(body: any) {
    this.commonService.showLoading();
    this.dnaService.update(body).subscribe(
      (res: any) => {
        if (res.status == 1) {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('New Learning', 'Successfully Updated.');
          this.router.navigateByUrl(`/dna/create/${this.trackerId}`);
        }
        else {
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', res.message);
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getFormDetails() {
    this.commonService.showLoading();
    this.dnaService.getFormDetails(this.formId).subscribe(
      (res: any) => {
        if (res.status == 1) {
          this.form_details = res.data;
          this.createDnaForm.controls.learning_id.setValue(this.form_details.learning_id);
          if (!this.form_details.learning_id) {
            this.titleList = [...this.titleList, { training_title: this.form_details.title, id: -1 }];
            this.createDnaForm.controls.learning_id.setValue(-1);
            this.isDescription = true;
            this.createDnaForm.addControl('description', new FormControl('', [Validators.required]));
            this.createDnaForm.controls.description.setValue(this.form_details.description);
          }
          this.createDnaForm.controls.priority_id.setValue(this.form_details.priority_id);
          this.createDnaForm.controls.number_of_participant.setValue(this.form_details.number_of_participant);
          if (this.form_details.management_code) {
            this.createDnaForm.controls.management_code.setValue(this.form_details.management_code);
          }
          if (this.form_details.domain_training_id) {
            this.createDnaForm.controls.domain_training_id.setValue(this.form_details.domain_training_id);
          }
          this.createDnaForm.controls.region_id.setValue(this.form_details.region_id);
          if (this.form_details.country) {
            this.isCountry = true;
            this.createDnaForm.controls.country.setValue(this.form_details.country);
          }
          else {
            this.isCountry = false;
          }
          this.createDnaForm.controls.business_unit_id.setValue(this.form_details.business_unit_id);
          this.commonService.hideLoading();
        }
        else {
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', res.message);
        }
      }, err => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      });
  }

  close() {
    this.router.navigateByUrl(`/dna/create/${this.trackerId}`);
  }

  createNew = (term: string) => {
    this.titleList = [...this.titleList, { training_title: term }];
    this.isDescription = true;
    this.createDnaForm.addControl('description', new FormControl('', [Validators.required]));
    this.createDnaForm.controls.title.setValue(term);
  }

  getTrackerDetail() {
    this.commonService.showLoading();
    this.dnaService.getTrackerDetail(this.trackerId).subscribe(
      (res: any) => {
        if (res.status == 1) {

          this.tracker_details = res.data;
          this.trainingId = this.tracker_details.training_data;
          this.getTitleDropdown();
          this.type = this.tracker_details.type;
          this.type == 1 ? this.isFrance = true : this.isFrance = false;
          if (this.isFrance) {
            this.createDnaForm.addControl('domain_training_id', new FormControl('', [Validators.required]));
            this.createDnaForm.addControl('location', new FormControl('', [Validators.required]));
            this.createDnaForm.removeControl('management_code');
            this.createDnaForm.removeControl('country');
          }
          else {
            this.createDnaForm.addControl('management_code', new FormControl('', [Validators.required]));
            this.createDnaForm.addControl('country', new FormControl('', [Validators.required]));
            this.createDnaForm.removeControl('domain_training_id');
            this.createDnaForm.removeControl('location');
          }
          this.commonService.hideLoading();
        }
        else {
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', res.message);
        }
      }, err => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      });
  }

  getBusinessUnits() {
    this.generalDrpdownsService.getBusinessUnits().subscribe((res: any) => {
      this.commonService.hideLoading();
      this.bussinessUnitObj = res.data;
    },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getCountries() {
    this.commonService.showLoading();
    this.generalDrpdownsService.getCountries().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        let regions = res.data;
        this.countriesObj = regions.filter((x: any) => x.region_id === this.regionId);
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getDomain() {
    this.commonService.showLoading();
    this.generalDrpdownsService.getDomain().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.domainObj = res.data;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getRegions() {
    this.commonService.showLoading();
    this.generalDrpdownsService.getRegions().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.regionsObj = res.data;
        this.regionObj = this.regionsObj.filter((x: any) => x.id === 5);
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getLocations() {
    this.commonService.showLoading();
    this.generalDrpdownsService.getLocations().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        let locations = res.data;
        this.locationsObj = locations.filter((x: any) => x.region_id === 5);
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getPriority() {
    this.commonService.showLoading();
    this.generalDrpdownsService.getPriority().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.priorityObj = res.data;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getTitleDropdown() {
    this.dnaService.getTitleDropdown(this.trainingId).subscribe(
      (res: any) => {
        this.titleList = res.data;
        if (this.formId) {
          this.getFormDetails();
        }
        this.commonService.hideLoading();
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      })
  }
}
