import { Component } from '@angular/core';
import { threadId } from 'worker_threads';
import { CommonService } from './shared/services/common/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'orange';
  isLoad = false;
  constructor(private commonService: CommonService) {
    this.languageTranslation();
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
