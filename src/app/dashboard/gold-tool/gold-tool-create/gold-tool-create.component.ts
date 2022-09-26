import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
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
  gold_tool_id = 0;
  getUserrole: any;
  getprofileDetails: any = {};

  public createGoldToolForm!: FormGroup;
  constructor(private commonService: CommonService,
    private authService: AuthenticationService,
    private goldToolService: GoldToolService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.getUserrole = this.authService.getRolefromlocal();
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.gold_tool_id = Id ? parseInt(Id) : 0;
    });
    this.createGoldToolForm = this.fb.group({
      requester_name: new FormControl(''),
      requester_email: new FormControl(''),
      additional_comment: new FormControl(''),
      metadata: this.fb.array([

      ]),
    });
  }

  ngOnInit(): void {
    if (this.gold_tool_id) {
      this.getGoldToolDetails();
    } else {
      this.addMetadata();
    }
  }

  requiredMessage(field: any) {
    return this.lableConstant.form_fieldname_cannot_be_blank.replace('<form fieldname>', field).replace('<nom du champ>', field);
  }

  private metaDataGroup(): FormGroup {
    return this.fb.group({
      id: '',
      name: new FormControl('', [Validators.required]),
      email_for_participant: new FormControl('', [Validators.required, Validators.pattern(dataConstant.EmailPattren)]),
      cuid_ftid: new FormControl('', [Validators.required]),
      email_participant: new FormControl('', [Validators.required]),
      p1: new FormControl('', [Validators.required]),
      data_scope: new FormControl('', [Validators.required]),
      gold_level_access: new FormControl('', [Validators.required]),
      hrbp_email: new FormControl('', [Validators.required, Validators.pattern(dataConstant.EmailPattren)]),
      business_justification: new FormControl('', [Validators.required]),
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

  getGoldToolDetails() {
    this.commonService.showLoading();
    this.goldToolService.getGoldToolDetails(this.gold_tool_id).subscribe((res: any) => {
      this.commonService.hideLoading();
      if (res.status === 1 && res.message === 'Success') {
        // this.session_details = res.data;
        // this.session_status = this.session_details.status;

        // this.createSessionForm.controls.title.setValue(this.session_details.title);
        // this.createSessionForm.controls.region_id.setValue(this.session_details.region_id);
        // const metadata = this.session_details.metadata;
        // for (let meta of metadata) {
        //   this.breaksArray = [];

        //   meta.delivery_method_id = JSON.parse(meta.delivery_method);
        //   meta.country_id = JSON.parse(meta.country);
        //   meta.email = JSON.parse(meta.email_participant);

        //   if (meta.break != null) {
        //     meta.break_data = JSON.parse(meta.break)
        //     for (let item of meta.break_data) {
        //       this.breaksArray.push(this.fb.group({ description: item.description, duration: item.duration }));
        //     }
        //     meta.breakArray = this.breaksArray;
        //   }
        //   else {
        //     meta.breakArray = [];
        //   }
        //   this.metadataArray.push(this.updateMetadata(meta));
        // }
      }
    }, err => {
      this.commonService.hideLoading();
      this.commonService.errorHandling(err);
    });
  }

  createGoldTool(status: any) {
    this.isSubmitted = true;
    if (this.createGoldToolForm.invalid) {
      return;
    }
    const body = this.createGoldToolForm.value;
    body.status = status;
    if (!this.gold_tool_id) {
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
      body.gold_tool_id = this.gold_tool_id;
      this.commonService.showLoading();
      this.goldToolService.update(body).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('Gold Tool Request', 'Successfully Saved.');
          this.router.navigateByUrl(`/dashboard/gold-tool/view/${this.gold_tool_id}`);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.errorHandling(err);
        }
      );
    }

  }

}
