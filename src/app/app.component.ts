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
