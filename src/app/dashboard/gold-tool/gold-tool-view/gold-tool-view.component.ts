import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as _ from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { GoldToolService } from 'src/app/shared/services/gold-tool/gold-tool.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gold-tool-view',
  templateUrl: './gold-tool-view.component.html',
  styleUrls: ['./gold-tool-view.component.scss']
})
export class GoldToolViewComponent implements OnInit {
  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;
  goldToolStatus = dataConstant.GoldToolStatus;
  id = 0;
  getUserrole: any = {};
  getprofileDetails: any = {};
  RoleID = dataConstant.RoleID;
  selectedStatus = this.goldToolStatus.total;
  lableConstant: any = { french: {}, english: {} };
  searchText: any;
  requestdata: any = {};
  goldToolList: any = [];
  goldToolListToView: any = [];
  isHRBP = false;
  isGoldTeam = false;
  isRequester = false;
  goldTool_count = {
    grant: 0,
    hrbp_approve: 0,
    hrbp_pending: 0,
    hrbp_reject: 0,
    pending: 0,
    reject: 0,
    total: 0
  }

  constructor(private commonService: CommonService,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private goldToolService: GoldToolService
  ) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.getUserrole = this.authService.getRolefromlocal();
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.isGoldTeam = this.getUserrole.includes(this.RoleID.GoldTeam);
    this.isHRBP = this.getprofileDetails.data?.hrbp == 1 ? true : false;
    this.isRequester = this.getprofileDetails.data?.staff == 1 ? true : false;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.id = Id ? parseInt(Id) : 0;
      this.getGoldToolDetails();
    });

  }

  getGoldToolDetails() {
    this.commonService.showLoading();
    this.goldToolService.getGoldToolDetails(this.id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status == 1 && res.message == 'Success') {
          this.requestdata = res.data;
          this.goldTool_count = this.requestdata.count;
        }
      },
      (err: any) => {
        this.commonService.errorHandling(err);
        this.commonService.hideLoading();
      }
    );
  }

  statusChange() {
    Swal.fire({
      title: 'Are you sure want to chnage status?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.commonService.showLoading();
        var data = {
          gold_tool_id: this.requestdata.id,
          metadata_id: _.map(this.requestdata.metadata, (x: any) => {
            return { id: x.id, status: this.isHRBP ? x.hrbp_status : x.status }
          })
        }
        this.goldToolService.goldToolStatus(data).subscribe((res: any) => {
          this.commonService.hideLoading();
          Swal.fire(
            'Updated!',
            'Status Updated.',
            'success'
          )
        }, (err: any) => {
          this.commonService.hideLoading();
          this.commonService.errorHandling(err);
        })

      }
    })
  }


}
