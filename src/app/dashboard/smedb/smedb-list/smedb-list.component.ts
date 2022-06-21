import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { SMEService } from 'src/app/shared/services/sme/sme.service';

@Component({
  selector: 'app-smedb-list',
  templateUrl: './smedb-list.component.html',
  styleUrls: ['./smedb-list.component.scss']
})
export class SmedbListComponent implements OnInit {
  smeList: any = [];
  getprofileDetails: any = {};
  smeContcatPerson: any = [];
  sme_count = {
    total: 0,
    draft: 0,
    approve: 0,
    pending: 0,
  }
  constructor( private smeService: SMEService,
    private commonService: CommonService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router) { 
      this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    }

  ngOnInit(): void {
    this.getSMEDatabase();
  }

  getSMEDatabase() {
    this.commonService.showLoading();
    this.smeService.getSMEDatabase().subscribe(
      (res: any) => {
        this.SMEContactPerson();
        if (res.status === 1 && res.message === 'Success') {
          this.smeList = res.data.sme.filter((x: { user_id: any; }) => x.user_id == this.getprofileDetails.data.id);
          this.sme_count = res.data.sme_count;
        }
        else{
          this.commonService.toastErrorMsg("Error", res.message);
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  SMEContactPerson() {
    this.commonService.showLoading();
    this.smeService.SMEContactPerson().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.smeContcatPerson = res.data;
        }
        else{
          this.commonService.toastErrorMsg("Error", res.message);
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  viewRequest(item: any) {
    if (item && item.id) {
      this.router.navigateByUrl(`/dashboard/smedb/view/${item.id}`);
    }
  }


}
