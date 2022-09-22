import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { GoldToolService } from 'src/app/shared/services/gold-tool/gold-tool.service';

@Component({
  selector: 'app-gold-tool-create',
  templateUrl: './gold-tool-create.component.html',
  styleUrls: ['./gold-tool-create.component.scss']
})
export class GoldToolCreateComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  isSubmitted = false;
  goldtool_id = 0;
  getUserrole: any;

  public createGoldToolForm!: FormGroup;
  constructor(private commonService: CommonService,
    private authService:AuthenticationService,
    private goldToolService: GoldToolService,
    private router: Router,
    private fb: FormBuilder) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.getUserrole = this.authService.getRolefromlocal();
    this.createGoldToolForm = this.fb.group({
      requester_name: new FormControl('', [Validators.required]),
      requester_email: new FormControl('', [Validators.required, Validators.pattern(dataConstant.EmailPattren)]),
      comment:  new FormControl(''),
      metadata: this.fb.array([
        
      ]),
    });
  }

  ngOnInit(): void {
    this.addMetadata();
  }

  requiredMessage(field:any){
    return this.lableConstant.form_fieldname_cannot_be_blank.replace('<form fieldname>', field).replace('<nom du champ>', field);
  }

  private metaDataGroup(): FormGroup {
    return this.fb.group({
      metadata_id: '',
      delivery_method: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      instructor_name: new FormControl('', [Validators.required]),
      attachment:  new FormControl('', []),
      email_participant: new FormControl('', [Validators.required]),
      start_date: new FormControl('', [Validators.required]),
      start_time: new FormControl('', [Validators.required]),
      end_date: new FormControl('', [Validators.required]),
      end_time: new FormControl('', [Validators.required]),
      time_zone: new FormControl(''),
      comment: new FormControl(),
      registration_deadline: new FormControl('', [Validators.required]),
      availability: new FormControl('', [Validators.required]),
      external_vendor: new FormControl('', [Validators.required]),
      external_vendor_name:new FormControl(''),
      manager_approval: new FormControl(''),
    });
  }

  get metadataArray(): FormArray {
    return <FormArray>this.createGoldToolForm.get('metadata');
  }

  addMetadata(): void {
    this.metadataArray.push(this.metaDataGroup());
  }

  removeMetadata(index: number): void {
    this.metadataArray.removeAt(index);
  }

  createGoldTool(status: any) {
    this.isSubmitted = true;
    if (this.createGoldToolForm.invalid) {
      return;
    }
    const body = this.createGoldToolForm.value;
    body.status = status;
    if (!this.goldtool_id) {
      this.commonService.showLoading();
      this.goldToolService.create(body).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('Gold Tool Request', 'Successfully Saved.');
          this.router.navigateByUrl(`/dashboard/gold-tool/view/${res.data.id}`);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.errorHandling(err);
        }
      );
    }
    else {
      body.goldtool_id = this.goldtool_id;
      this.commonService.showLoading();
      this.goldToolService.update(body).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('Gold Tool Request', 'Successfully Saved.');
          this.router.navigateByUrl(`/dashboard/gold-tool/view/${this.goldtool_id}`);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.errorHandling(err);
        }
      );
    }
   
  }

}
