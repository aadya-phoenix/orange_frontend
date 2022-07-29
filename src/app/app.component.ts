import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Event, Router } from '@angular/router';
import { threadId } from 'worker_threads';
import { dataConstant } from './shared/constant/dataConstant';
import { CommonService } from './shared/services/common/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'orange';
  isLoad = false;
  constructor(private commonService: CommonService, private router: Router, private titleService: Title) {
    this.languageTranslation();
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const laungauge = localStorage.getItem('laungauge');
        let pageName = '';
        const url = event.url.split('?')[0];
        switch (url.replace(/[0-9]/g, '')) {
          case '/login':
          case '/':
            pageName = dataConstant.TitleList.login;
            break;
          case '/dashboard':
            pageName = dataConstant.TitleList.home;
            break;
          case '/dashboard/cct':
            pageName = dataConstant.TitleList.cct;
            break;
          case '/dashboard/cct/create':
            pageName = dataConstant.TitleList.cct_create;
            break;
          case '/dashboard/cct/update/':
            pageName = dataConstant.TitleList.cct_update;
            break;
          case '/dashboard/cct/view-complete-report':
            pageName = dataConstant.TitleList.cct_report;
            break;
          case '/dashboard/cct/view/':
            pageName = dataConstant.TitleList.cct_view;
            break;
          case '/dashboard/sct':
            pageName = dataConstant.TitleList.sct;
            break;
          case '/dashboard/sct/create':
            pageName = dataConstant.TitleList.sct_create;
            break;
          case '/dashboard/sct/update/':
            pageName = dataConstant.TitleList.sct_update;
            break;
          case '/dashboard/sct/view-complete-report':
            pageName = dataConstant.TitleList.sct_report;
            break;
          case '/dashboard/sct/view/':
            pageName = dataConstant.TitleList.sct_view;
            break;
          case '/dashboard/olcarousel':
            pageName = dataConstant.TitleList.olcarousel;
            break;
          case '/dashboard/olcarousel/create':
            pageName = dataConstant.TitleList.olcarousel_create;
            break;
          case '/dashboard/olcarousel/update/':
            pageName = dataConstant.TitleList.olcarousel_update;
            break;
          case '/dashboard/olcarousel/view-complete-report':
            pageName = dataConstant.TitleList.olcarousel_report;
            break;
          case '/dashboard/olcarousel/view/':
            pageName = dataConstant.TitleList.olcarousel_view;
            break;
          case '/dashboard/back-office':
            pageName = dataConstant.TitleList.backOffice;
            break;
          case '/dashboard/back-office/create':
            pageName = dataConstant.TitleList.backOffice_create;
            break;
          case '/dashboard/back-office/update/':
            pageName = dataConstant.TitleList.backOffice_update;
            break;
          case '/dashboard/back-office/view-complete-report':
            pageName = dataConstant.TitleList.backOffice_report;
            break;
          case '/dashboard/back-office/view/':
            pageName = dataConstant.TitleList.backOffice_view;
            break;
          case '/dashboard/designlearning':
            pageName = dataConstant.TitleList.designlearning;
            break;
          case '/dashboard/designlearning/create':
            pageName = dataConstant.TitleList.designlearning_create;
            break;
          case '/dashboard/designlearning/update/':
            pageName = dataConstant.TitleList.designlearning_update;
            break;
          case '/dashboard/designlearning/view-complete-report':
            pageName = dataConstant.TitleList.designlearning_report;
            break;
          case '/dashboard/designlearning/view/':
            pageName = dataConstant.TitleList.designlearning_view;
            break;
          case '/dashboard/olreport':
            pageName = dataConstant.TitleList.olreport;
            break;
          case '/dashboard/olreport/create':
            pageName = dataConstant.TitleList.olreport_create;
            break;
          case '/dashboard/olreport/update/':
            pageName = dataConstant.TitleList.olreport_update;
            break;
          case '/dashboard/olreport/view-complete-report':
            pageName = dataConstant.TitleList.olreport_report;
            break;
          case '/dashboard/olreport/view/':
            pageName = dataConstant.TitleList.olreport_view;
            break;
          case '/dashboard/smedb':
            pageName = dataConstant.TitleList.smedb;
            break;
          case '/dashboard/smedb/create':
            pageName = dataConstant.TitleList.smedb_create;
            break;
          case '/dashboard/smedb/update/':
            pageName = dataConstant.TitleList.smedb_update;
            break;
          case '/dashboard/smedb/view-complete-report':
            pageName = dataConstant.TitleList.smedb_report;
            break;
          case '/dashboard/smedb/view/':
            pageName = dataConstant.TitleList.smedb_view;
            break;
          case '/dashboard/vendormanagement':
            pageName = dataConstant.TitleList.vendormanagement;
            break;
          case '/dashboard/vendormanagement/create':
            pageName = dataConstant.TitleList.vendormanagement_create;
            break;
          case '/dashboard/vendormanagement/update/':
            pageName = dataConstant.TitleList.vendormanagement_update;
            break;
          case '/dashboard/vendormanagement/report':
            pageName = dataConstant.TitleList.vendormanagement_report;
            break;
          case '/dashboard/vendormanagement/rating':
            pageName = dataConstant.TitleList.vendormanagement_rating;
            break;
          case '/dashboard/vendormanagement/view/':
            pageName = dataConstant.TitleList.vendormanagement_view;
            break;
          case '/pdltools':
            pageName = dataConstant.TitleList.pdltools;
            break;
          case '/user':
            pageName = dataConstant.TitleList.user;
            break;
          case '/dashboard/sctworkflow':
            pageName = dataConstant.TitleList.sctworkflow;
            break;
          case '/dashboard/set-backup':
            pageName = dataConstant.TitleList.setBackup;
            break;
          case '/dashboard/dna':
            pageName = dataConstant.TitleList.dna;
            break;
          case '/dashboard/dna/create/':
            pageName = dataConstant.TitleList.dna_create;
            break;
          case '/dashboard/dna/update//':
            pageName = dataConstant.TitleList.dna_update;
            break;
          case '/dashboard/dna/user':
            pageName = dataConstant.TitleList.dna_user;
            break;
          case '/dashboard/dna/user/edit/':
            pageName = dataConstant.TitleList.dna_userEdit;
            break;
          case '/dashboard/dna/tracker':
            pageName = dataConstant.TitleList.dna_tracker;
            break;
          case '/dashboard/dna/tracker/create':
            pageName = dataConstant.TitleList.dna_trackerCreate;
            break;
          case '/dashboard/dna/tracker/edit/':
            pageName = dataConstant.TitleList.dna_trackerEdit;
            break;
          case '/dashboard/dna/add-new/':
            pageName = dataConstant.TitleList.dna_addNew;
            break;
          case '/dashboard/dna/managersdata/':
            pageName = dataConstant.TitleList.dna_managersdata;
            break;
          case '/dashboard/dna/view/':
            pageName = dataConstant.TitleList.dna_view;
            break;
          case '/dashboard/dna/view-rpt/':
            pageName = dataConstant.TitleList.dna_viewRPT;
            break;
          case '/dashboard/dna/view-bp/':
            pageName = dataConstant.TitleList.dna_viewBP;
            break;
          case '/dashboard/dna/view-complete-report/':
            pageName = dataConstant.TitleList.dna_report;
            break;
          default:
            pageName = '';
            break;
        }
        this.titleService.setTitle(`${dataConstant.TitlePrefix} ${pageName ? ` - ${pageName} - ` : ` - `} ${laungauge ? laungauge : dataConstant.Laungauges.EN}`)
        try {
          var windows = window as any;
          windows.utag.track('view', event.url, event.urlAfterRedirects);
        } catch (e) {
          console.error('utag object does not exist on this page');
        }
      }
    });
  }

  languageTranslation() {
    this.commonService.showLoading();
    this.commonService.getLanguageTranslation().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.commonService.laungaugesData = res.data
        this.isLoad = true;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

}
