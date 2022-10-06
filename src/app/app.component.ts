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
            pageName = dataConstant.TitleList.login;
            break;
          case '/':
            pageName = dataConstant.TitleList.home;
            break;
          case '/cct':
            pageName = dataConstant.TitleList.cct;
            break;
          case '/cct/create':
            pageName = dataConstant.TitleList.cct_create;
            break;
          case '/cct/update/':
            pageName = dataConstant.TitleList.cct_update;
            break;
          case '/cct/view-complete-report':
            pageName = dataConstant.TitleList.cct_report;
            break;
          case '/cct/view/':
            pageName = dataConstant.TitleList.cct_view;
            break;
          case '/sct':
            pageName = dataConstant.TitleList.sct;
            break;
          case '/sct/create':
            pageName = dataConstant.TitleList.sct_create;
            break;
          case '/sct/update/':
            pageName = dataConstant.TitleList.sct_update;
            break;
          case '/sct/view-complete-report':
            pageName = dataConstant.TitleList.sct_report;
            break;
          case '/sct/view/':
            pageName = dataConstant.TitleList.sct_view;
            break;
          case '/olcarousel':
            pageName = dataConstant.TitleList.olcarousel;
            break;
          case '/olcarousel/create':
            pageName = dataConstant.TitleList.olcarousel_create;
            break;
          case '/olcarousel/update/':
            pageName = dataConstant.TitleList.olcarousel_update;
            break;
          case '/olcarousel/view-complete-report':
            pageName = dataConstant.TitleList.olcarousel_report;
            break;
          case '/olcarousel/view/':
            pageName = dataConstant.TitleList.olcarousel_view;
            break;
          case '/back-office':
            pageName = dataConstant.TitleList.backOffice;
            break;
          case '/back-office/create':
            pageName = dataConstant.TitleList.backOffice_create;
            break;
          case '/back-office/update/':
            pageName = dataConstant.TitleList.backOffice_update;
            break;
          case '/back-office/view-complete-report':
            pageName = dataConstant.TitleList.backOffice_report;
            break;
          case '/back-office/view/':
            pageName = dataConstant.TitleList.backOffice_view;
            break;
          case '/designlearning':
            pageName = dataConstant.TitleList.designlearning;
            break;
          case '/designlearning/create':
            pageName = dataConstant.TitleList.designlearning_create;
            break;
          case '/designlearning/update/':
            pageName = dataConstant.TitleList.designlearning_update;
            break;
          case '/designlearning/view-complete-report':
            pageName = dataConstant.TitleList.designlearning_report;
            break;
          case '/designlearning/view/':
            pageName = dataConstant.TitleList.designlearning_view;
            break;
          case '/olreport':
            pageName = dataConstant.TitleList.olreport;
            break;
          case '/olreport/create':
            pageName = dataConstant.TitleList.olreport_create;
            break;
          case '/olreport/update/':
            pageName = dataConstant.TitleList.olreport_update;
            break;
          case '/olreport/view-complete-report':
            pageName = dataConstant.TitleList.olreport_report;
            break;
          case '/olreport/view/':
            pageName = dataConstant.TitleList.olreport_view;
            break;
          case '/smedb':
            pageName = dataConstant.TitleList.smedb;
            break;
          case '/smedb/create':
            pageName = dataConstant.TitleList.smedb_create;
            break;
          case '/smedb/update/':
            pageName = dataConstant.TitleList.smedb_update;
            break;
          case '/smedb/view-complete-report':
            pageName = dataConstant.TitleList.smedb_report;
            break;
          case '/smedb/view/':
            pageName = dataConstant.TitleList.smedb_view;
            break;
          case '/vendormanagement':
            pageName = dataConstant.TitleList.vendormanagement;
            break;
          case '/vendormanagement/create':
            pageName = dataConstant.TitleList.vendormanagement_create;
            break;
          case '/vendormanagement/update/':
            pageName = dataConstant.TitleList.vendormanagement_update;
            break;
          case '/vendormanagement/report':
            pageName = dataConstant.TitleList.vendormanagement_report;
            break;
          case '/vendormanagement/rating':
            pageName = dataConstant.TitleList.vendormanagement_rating;
            break;
          case '/vendormanagement/view/':
            pageName = dataConstant.TitleList.vendormanagement_view;
            break;
          case '/pdltools':
            pageName = dataConstant.TitleList.pdltools;
            break;
          case '/user':
            pageName = dataConstant.TitleList.user;
            break;
          case '/message':
          case '/message/create':
          case '/message/update':
            pageName = dataConstant.TitleList.message;
            break;
          case '/sctworkflow':
            pageName = dataConstant.TitleList.sctworkflow;
            break;
          case '/set-backup':
            pageName = dataConstant.TitleList.setBackup;
            break;
          case '/dna':
            pageName = dataConstant.TitleList.dna;
            break;
          case '/dna/create/':
            pageName = dataConstant.TitleList.dna_create;
            break;
          case '/dna/update/':
            pageName = dataConstant.TitleList.dna_update;
            break;
          case '/dna/user':
            pageName = dataConstant.TitleList.dna_user;
            break;
          case '/dna/user/edit/':
            pageName = dataConstant.TitleList.dna_userEdit;
            break;
          case '/dna/tracker':
            pageName = dataConstant.TitleList.dna_tracker;
            break;
          case '/dna/tracker/create':
            pageName = dataConstant.TitleList.dna_trackerCreate;
            break;
          case '/dna/tracker/edit/':
            pageName = dataConstant.TitleList.dna_trackerEdit;
            break;
          case '/dna/add-new/':
            pageName = dataConstant.TitleList.dna_addNew;
            break;
          case '/dna/managersdata/':
            pageName = dataConstant.TitleList.dna_managersdata;
            break;
          case '/dna/view/':
            pageName = dataConstant.TitleList.dna_view;
            break;
          case '/dna/view-rpt/':
            pageName = dataConstant.TitleList.dna_viewRPT;
            break;
          case '/dna/view-bp/':
            pageName = dataConstant.TitleList.dna_viewBP;
            break;
          case '/dna/view-complete-report/':
            pageName = dataConstant.TitleList.dna_report;
            break;
          case '/oltest':
            pageName = dataConstant.TitleList.oltest;
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
