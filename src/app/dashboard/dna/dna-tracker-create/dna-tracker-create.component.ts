import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { DnaService } from 'src/app/shared/services/dna/dna.service';
import { GeneralDropdownsService } from 'src/app/shared/services/general-dropdowns/general-dropdowns.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dna-tracker-create',
  templateUrl: './dna-tracker-create.component.html',
  styleUrls: ['./dna-tracker-create.component.scss']
})
export class DnaTrackerCreateComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  dateFormate = dataConstant.dateFormate;
  learningNeedForm: FormGroup;
  languageObj: any = [];
  typeObj: any = [];
  trainingDataObj: any = [];
  isSubmitted = false;
  isManager = false;
  tracker_id: any = 0;
  tracker_details: any;
  isCreate = false;

  constructor(
    private formBuilder: FormBuilder,
    private courceService: CourcesService,
    private dnaService: DnaService,
    private generalService: GeneralDropdownsService,
    private commonService: CommonService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private datepipe: DatePipe) {
    this.isManager = this.authService.getProfileDetailsfromlocal().data?.manager == 1 ? true : false;
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.learningNeedForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', []),
      open_date: new FormControl('', []),
      close_date: new FormControl('', [Validators.required]),
      type: new FormControl('', []),
      training_data: new FormControl('', []),
    });
  }

  ngOnInit(): void {
    if (this.isManager) {
      this.route.paramMap.subscribe((params: ParamMap) => {
        const Id = params.get('id');
        this.tracker_id = Id ? parseInt(Id) : 0;
        if (this.tracker_id) {
          this.isCreate = false;
          this.getTrackerDetails();
        }
        else {
          this.isCreate = true;
        }
      });
      this.getLanguages();
      this.getDnaType();
      this.getTrainingData();
    }
  }

  save(status: any) {
    this.isSubmitted = true;
    if (this.learningNeedForm.invalid) {
      return;
    }
    const body = this.learningNeedForm.value;
    body.status = status;
    !this.tracker_id ? this.create(body) : this.update(body);

  }

  getTrackerDetails() {
    this.commonService.showLoading();
    this.dnaService.getTrackerDetail(this.tracker_id).subscribe(
      (res: any) => {
        if (res.status == 1) {
          this.commonService.hideLoading();
          this.tracker_details = res.data;
          this.learningNeedForm.controls.title.setValue(this.tracker_details.title);
          this.learningNeedForm.controls.description.setValue(this.tracker_details.description);
          this.learningNeedForm.controls.open_date.setValue(this.dateFormat(this.tracker_details.open_date));
          this.learningNeedForm.controls.close_date.setValue(this.dateFormat(this.tracker_details.close_date));
          this.learningNeedForm.controls.type.setValue(JSON.parse(this.tracker_details.type));
          this.learningNeedForm.controls.training_data.setValue(JSON.parse(this.tracker_details.training_data));
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

  create(body: any) {
    this.commonService.showLoading();
    this.dnaService.createTracker(body).subscribe((res: any) => {
      if (res.status == 1) {
        this.commonService.hideLoading();
        this.commonService.toastSuccessMsg('New Tracker', 'Successfully Created.');
        this.router.navigateByUrl(`/user/dna`);
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

  update(body: any) {
    body.tracker_id = this.tracker_id;
    this.commonService.showLoading();
    this.dnaService.updateTracker(body).subscribe(
      (res: any) => {
        if (res.status == 1) {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('Tracker', 'Successfully Updated.');
          this.router.navigateByUrl(`/dna/tracker`);
        }
        else {
          this.commonService.toastErrorMsg('Error', res.message);
          this.commonService.hideLoading();
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  delete() {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this request!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.commonService.showLoading();
        this.dnaService.deleteTracker({ tracker_id: this.tracker_id }).subscribe((res: any) => {
          this.commonService.hideLoading();
          Swal.fire(
            'Deleted!',
            'Your request has been deleted.',
            'success'
          );
          this.router.navigateByUrl(`/dna/tracker`);
        }, (err: any) => {
          this.commonService.hideLoading();
        });
      }
    });
  }

  dateFormat(date: any) {
    const newdate = new Date(date);
    return this.datepipe.transform(newdate, 'yyyy-MM-dd');
  }

  getLanguages() {
    this.courceService.getLanguages().subscribe(res => {
      this.languageObj = res.data;
    }, err => {
      console.log(err);
    });
  }

  getDnaType() {
    this.generalService.getDnaType().subscribe((res: any) => {
      this.typeObj = res.data;
    }, err => {
      console.log(err);
    });
  }

  getTrainingData() {
    this.generalService.getTrainingData().subscribe((res: any) => {
      this.trainingDataObj = res.data;
    }, err => {
      console.log(err);
    });
  }
}
