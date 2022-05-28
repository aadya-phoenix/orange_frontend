import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';

@Component({
  selector: 'app-multi-launguage',
  templateUrl: './multi-launguage.component.html',
  styleUrls: ['./multi-launguage.component.scss']
})
export class MultiLaunguageComponent implements OnInit {
  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  public multiLaungaugeForm!: FormGroup;
  valueDetails: any = [];
  availableLanguages: any = [];
  constructor(private courceService: CourcesService,
    private modalService: NgbActiveModal,
    private fb: FormBuilder,
    private commonService: CommonService) {
    this.multiLaungaugeForm = this.fb.group({
      titleArr: new FormArray([])
    });
  }

  get titlecontrol() {
    return this.multiLaungaugeForm.get("titleArr") as FormArray;
  }

  ngOnInit(): void {
    this.getLanguages();
  }



  //get Languages
  getLanguages() {
    this.commonService.showLoading();
    this.courceService.getLanguages().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.availableLanguages = res.data;
        this.availableLanguages.forEach((element: any) => {
          let controlValue = ''
          if(this.props?.data){
            controlValue = this.props?.data?.find((x: {}) => Object.keys(x) == element.slug);
          }
          this.titlecontrol.push(this.fb.group({
            value: controlValue ? new FormControl(`${controlValue[element.slug]}`): new FormControl(''),
          }));
        });

      },
      (err: any) => {
        this.commonService.hideLoading();
      }
    );
  }

  closeModal() {
    this.modalService.close();
  }

  gettitlelanguage() {
    if (this.multiLaungaugeForm?.value?.titleArr?.length > 0) {
      this.multiLaungaugeForm.value.titleArr.forEach((element: any, index: any) => {
        this.valueDetails.push({ [`${this.availableLanguages[index].slug}`]: element.value });
      });
    }
    this.passEntry.next(this.valueDetails);
    this.modalService.close();
  }

  onClose() {
    this.passEntry.next();
    this.modalService.close();
  }
}
