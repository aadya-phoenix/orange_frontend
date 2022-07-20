import { AfterViewInit, Component } from '@angular/core';
import { dataConstant } from '../shared/constant/dataConstant';
import { CommonService } from '../shared/services/common/common.service';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import { PldtoolsService } from '../shared/services/pldtools/pldtools.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdltoolsDetailsComponent } from './pdltools-details/pdltools-details.component';
import { DnaService } from '../shared/services/dna/dna.service';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);

@Component({
  selector: 'app-pdltools',
  templateUrl: './pdltools.component.html',
  styleUrls: ['./pdltools.component.scss']
})
export class PdltoolsComponent implements AfterViewInit {
  lableConstant: any = { french: {}, english: {} };
  yearsList: any = [];
  moduleList: any = [];
  courceData: any = {};
  smeData: any = {};
  sessionData: any = {};
  dnaData: any = {};
  reportData: any = {};
  publisherReportData: any = [];
  rocReportData: any = [];
  rocData: any = [];
  contentSupportData: any = [];
  deliveryMethodData: any = [];
  voiceOverData: any = [];
  publisherData: any = [];
  activeSMECount: any = [];
  trackerList = [];
  dnaPriority:any = [];
  dnaRegion:any = [];
  dnaCountry:any = [];
  modules = dataConstant.Modules;
  year = null;
  selectedTracker = null;
  selectedModule: any;

  constructor(private commonService: CommonService, private pldtoolsService: PldtoolsService, private modalService: NgbModal, private dnaService: DnaService) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.yearsList = this.commonService.LastFewYearsList();
    this.year = this.yearsList[0].id;
    this.moduleList = dataConstant.ModuleList;
    this.selectedModule = this.modules.course;
  }
  public ngAfterViewInit(): void {
    this.getNewData();
  }

  getNewData() {
    this.courceData = {};
    this.reportData = {};
    this.sessionData = {};
    if (this.year) {
      if (this.selectedModule === this.modules.course) {
        this.getCourceData();
      }
      if (this.selectedModule === this.modules.session) {
        this.getSessionData();
      }
      if (this.selectedModule === this.modules.getReport) {
        this.getReportData();
      }
      if (this.selectedModule === this.modules.carousel) {
        this.getCarouselData();
      }
      if (this.selectedModule === this.modules.backOffice) {
        this.getBackOfficeRoleData();
      }
      if (this.selectedModule === this.modules.sme) {
        this.getSMEDatabaseData();
      }
      if (this.selectedModule === this.modules.design) {
        this.getLearningModuleData();
      }
      if (this.selectedModule === this.modules.dna) {
        this.getTrackerList();
      }
    }
  }

  getTrackerList() {
    this.commonService.showLoading();
    this.dnaService.getTrackerList().subscribe((res: any) => {
      this.trackerList = res.data.tracker;
      this.commonService.hideLoading();
    },
      err => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      });
  }

  openModal(item: any) {
    const modalRef = this.modalService.open(PdltoolsDetailsComponent, {
      centered: true,
      size: 'xl',
      modalDialogClass: 'large-width',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: 'Regional Operations Coordinator Activities report',
      data: item.id,
      objectDetail: item,
      type: 'rocactivity'
    };
  }

  private getCourceData() {
    const body = {
      year: this.year
    }
    this.commonService.showLoading();
    this.pldtoolsService.getCourceData(body).subscribe(
      (res: any) => {
        if (res && res.status == 1) {
          this.courceData = res.data;
          this.publisherReportData = [];
          this.rocReportData = [];
          this.rocData = Object.entries(this.courceData.roc_activity);
          this.publisherData = Object.entries(this.courceData.publisher_activity);
          Object.entries(this.courceData.publisher_activity).forEach((element: any, index: any) => {
            const data = {
              name: element[0],
              data: Object.keys(element[1].monthly).map((key) => element[1].monthly[key].total)
            }
            this.publisherReportData.push(data);
          });
          this.rocData.forEach((element: any, index: any) => {
            const data = {
              name: element[0],
              data: Object.keys(element[1].monthly).map((key) => element[1].monthly[key].total)
            }
            this.rocReportData.push(data);
          });
        } else {
          this.commonService.toastErrorMsg('Error', res.message);
        }
        this.createChartColumn(this.courceData);
        this.createChartLine('chart-publisher', 'Publisher Activity Report', this.publisherReportData);
        this.createChartLine('chart-roc', 'ROC Activity Report', this.rocReportData);
        this.createMonthWiseLinechart('comp-chart-publisher-month', `Publisher month wise average time ${this.year}`, this.publisherReportData)
        this.createMonthWiseLinechart('comp-chart-roc-month', `ROC month wise average time ${this.year}`, this.rocReportData)
        this.createPieChart();
        this.CreateLinechart();
        this.createChartDepartActivities();
        this.commonService.hideLoading();
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  private getSessionData() {
    const body = {
      year: this.year
    }
    this.commonService.showLoading();
    this.pldtoolsService.getSessionData(body).subscribe(
      (res: any) => {
        if (res && res.status == 1) {
          this.sessionData = res.data;
          this.courceData = res.data;
          this.publisherReportData = [];
          this.rocReportData = [];
          this.rocData = Object.entries(this.sessionData.roc_activity);
          this.publisherData = Object.entries(this.sessionData.session_publisher_activity);
          Object.entries(this.sessionData.session_publisher_activity).forEach((element: any, index: any) => {
            const data = {
              name: element[0],
              data: Object.keys(element[1].monthly).map((key) => element[1].monthly[key].total)
            }
            this.publisherReportData.push(data);
          });
          this.rocData.forEach((element: any, index: any) => {
            const data = {
              name: element[0],
              data: Object.keys(element[1].monthly).map((key) => element[1].monthly[key].total)
            }
            this.rocReportData.push(data);
          });
        } else {
          this.commonService.toastErrorMsg('Error', res.message);
        }
        this.createChartColumn(this.sessionData);
        this.createChartLine('chart-publisher', 'Publisher Activity Report', this.publisherReportData);
        this.createChartLine('chart-roc', 'ROC Activity Report', this.rocReportData);
        this.createMonthWiseLinechart('comp-chart-publisher-month', `Publisher month wise average time ${this.year}`, this.publisherReportData)
        this.createMonthWiseLinechart('comp-chart-roc-month', `ROC month wise average time ${this.year}`, this.rocReportData)
        this.createPieChart();
        this.CreateLinechart();
        this.createChartDepartActivities();
        this.commonService.hideLoading();
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  private getReportData() {
    const body = {
      year: this.year
    }
    this.commonService.showLoading();
    this.pldtoolsService.getReportData(body).subscribe(
      (res: any) => {
        if (res && res.status == 1) {
          this.reportData = res.data;
          this.courceData = res.data;
          this.publisherReportData = [];
          this.rocReportData = [];
          this.rocData = Object.entries(this.reportData.roc_activity);
          this.publisherData = Object.entries(this.reportData.data_analyst_activity);
          Object.entries(this.reportData.data_analyst_activity).forEach((element: any, index: any) => {
            const data = {
              name: element[0],
              data: Object.keys(element[1].monthly).map((key) => element[1].monthly[key].total)
            }
            this.publisherReportData.push(data);
          });
          this.rocData.forEach((element: any, index: any) => {
            const data = {
              name: element[0],
              data: Object.keys(element[1].monthly).map((key) => element[1].monthly[key].total)
            }
            this.rocReportData.push(data);
          });
        } else {
          this.commonService.toastErrorMsg('Error', res.message);
        }
        this.createChartColumn(this.reportData);
        this.createChartLine('chart-publisher', 'Data Analyst Activity Report', this.publisherReportData);
        this.createChartLine('chart-roc', 'ROC Activity Report', this.rocReportData);
        this.createMonthWiseLinechart('comp-chart-publisher-month', `Publisher month wise average time ${this.year}`, this.publisherReportData)
        this.createMonthWiseLinechart('comp-chart-roc-month', `ROC month wise average time ${this.year}`, this.rocReportData)
        this.createPieChart();
        this.CreateLinechart();
        this.createChartDepartActivities();
        this.commonService.hideLoading();
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }


  private getCarouselData() {
    const body = {
      year: this.year
    }
    this.commonService.showLoading();
    this.pldtoolsService.getCarouselData(body).subscribe(
      (res: any) => {
        if (res && res.status == 1) {
          this.reportData = res.data;
          this.courceData = res.data;
          this.publisherReportData = [];
          this.rocReportData = [];
          // this.rocData = Object.entries(this.reportData.roc_activity);
          // this.publisherData = Object.entries(this.reportData.data_analyst_activity);
          // Object.entries(this.reportData.data_analyst_activity).forEach((element: any, index:any) => {
          //   const data = {
          //     name: element[0],
          //     data: Object.keys(element[1].monthly).map((key) => element[1].monthly[key].total)
          //   }
          //   this.publisherReportData.push(data);
          // });
          // this.rocData.forEach((element: any, index:any) => {
          //   const data = {
          //     name: element[0],
          //     data: Object.keys(element[1].monthly).map((key) => element[1].monthly[key].total)
          //   }
          //   this.rocReportData.push(data);
          // });
        } else {
          this.commonService.toastErrorMsg('Error', res.message);
        }
        this.createChartColumn(this.reportData);
        // this.createChartLine('chart-publisher','Data Analyst Activity Report',this.publisherReportData);
        // this.createChartLine('chart-roc','ROC Activity Report',this.rocReportData);
        // this.createMonthWiseLinechart('comp-chart-publisher-month',`Publisher month wise average time ${this.year}`,this.publisherReportData)
        // this.createMonthWiseLinechart('comp-chart-roc-month',`ROC month wise average time ${this.year}`,this.rocReportData)
        // this.createPieChart();
        // this.CreateLinechart();
        // this.createChartDepartActivities();
        this.commonService.hideLoading();
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  private getBackOfficeRoleData() {
    const body = {
      year: this.year
    }
    this.commonService.showLoading();
    this.pldtoolsService.getBackOfficeRoleData(body).subscribe(
      (res: any) => {
        if (res && res.status == 1) {
          this.reportData = res.data;
          this.courceData = res.data;
          this.publisherReportData = [];
          this.rocReportData = [];
          // this.rocData = Object.entries(this.reportData.roc_activity);
          // this.publisherData = Object.entries(this.reportData.data_analyst_activity);
          // Object.entries(this.reportData.data_analyst_activity).forEach((element: any, index:any) => {
          //   const data = {
          //     name: element[0],
          //     data: Object.keys(element[1].monthly).map((key) => element[1].monthly[key].total)
          //   }
          //   this.publisherReportData.push(data);
          // });
          // this.rocData.forEach((element: any, index:any) => {
          //   const data = {
          //     name: element[0],
          //     data: Object.keys(element[1].monthly).map((key) => element[1].monthly[key].total)
          //   }
          //   this.rocReportData.push(data);
          // });
        } else {
          this.commonService.toastErrorMsg('Error', res.message);
        }
        this.createChartColumn(this.reportData);
        // this.createChartLine('chart-publisher','Data Analyst Activity Report',this.publisherReportData);
        // this.createChartLine('chart-roc','ROC Activity Report',this.rocReportData);
        // this.createMonthWiseLinechart('comp-chart-publisher-month',`Publisher month wise average time ${this.year}`,this.publisherReportData)
        // this.createMonthWiseLinechart('comp-chart-roc-month',`ROC month wise average time ${this.year}`,this.rocReportData)
        // this.createPieChart();
        // this.CreateLinechart();
        // this.createChartDepartActivities();
        this.commonService.hideLoading();
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  private getSMEDatabaseData() {
    const body = {
      year: this.year
    }
    this.commonService.showLoading();
    this.pldtoolsService.getSMEDatabaseData(body).subscribe(
      (res: any) => {
        if (res && res.status == 1) {
          this.smeData = res.data;
          this.contentSupportData = [];
          this.deliveryMethodData = [];
          if (this.smeData.metadata) {
            if (this.smeData.metadata['content-support']) {
              Object.keys(this.smeData.metadata['content-support']).forEach((element: any) => {
                this.contentSupportData.push({
                  title: element,
                  basic: this.smeData.metadata['content-support'][element].Basic ? this.smeData.metadata['content-support'][element].Basic : 0,
                  advanced: this.smeData.metadata['content-support'][element].Advanced ? this.smeData.metadata['content-support'][element].Advanced : 0,
                  expert: this.smeData.metadata['content-support'][element].Expert ? this.smeData.metadata['content-support'][element].Expert : 0,
                  total: this.smeData.metadata['content-support'][element].total ? this.smeData.metadata['content-support'][element].total : 0,
                })
              });
            }
            if (this.smeData.metadata['delivery']) {
              Object.keys(this.smeData.metadata['delivery']).forEach((element: any) => {
                this.deliveryMethodData.push({
                  title: element,
                  basic: this.smeData.metadata['delivery'][element].Basic ? this.smeData.metadata['delivery'][element].Basic : 0,
                  advanced: this.smeData.metadata['delivery'][element].Advanced ? this.smeData.metadata['delivery'][element].Advanced : 0,
                  expert: this.smeData.metadata['delivery'][element].Expert ? this.smeData.metadata['delivery'][element].Expert : 0,
                  total: this.smeData.metadata['delivery'][element].total ? this.smeData.metadata['delivery'][element].total : 0,
                })
              });
            }
          }

          this.voiceOverData = [{
            laungauge: 'English',
            male: 2,
            female: 2,
            total: 4
          }, {
            laungauge: 'French',
            male: 2,
            female: 2,
            total: 4
          }, {
            laungauge: 'Other',
            male: 2,
            female: 2,
            total: 4
          }]
          this.activeSMECount = [];
          Object.keys(this.smeData.sme_status).forEach((element: any) => {
            this.activeSMECount.push([element, this.smeData.sme_status[element]]);
          });
          this.createSMEChart();
        } else {
          this.commonService.toastErrorMsg('Error', res.message);
        }
        this.commonService.hideLoading();
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  private getDNAModuleData() {
    const body = {
      year: this.year
    }
    this.dnaData = {};
    if (this.selectedTracker) {
      this.commonService.showLoading();
      this.pldtoolsService.getDNAModuleData(body, this.selectedTracker).subscribe(
        (res: any) => {
          if (res && res.status == 1) {
            this.dnaData = res.data;
            this.dnaPriority = [];
            Object.keys(this.dnaData.priority).forEach((element: any) => {
              this.dnaPriority.push([element, this.dnaData.priority[element]]);
            });
            this.dnaCountry = [];
            Object.keys(this.dnaData.country).forEach((element: any) => {
              this.dnaCountry.push([element, this.dnaData.country[element]]);
            });
            this.dnaRegion = [];
            Object.keys(this.dnaData.region).forEach((element: any) => {
              this.dnaRegion.push([element, this.dnaData.region[element]]);
            });
            this.createDNAModuleChart();
          } else {
            this.commonService.toastErrorMsg('Error', res.message);
          }
          this.commonService.hideLoading();
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.errorHandling(err);
        }
      );
    }
  }

  private getLearningModuleData() {
    // const body = {
    //   year: this.year
    // }
    // this.commonService.showLoading();
    // this.pldtoolsService.getLearningModuleData(body, 1).subscribe(
    //   (res: any) => {
    //     if (res && res.status == 1) {
    //       this.courceData = res.data;
    setTimeout(() => {
      this.createLearningModuleChart();
    }, 2000);
    //     } else {
    //       this.commonService.toastErrorMsg('Error', res.message);
    //     }
    //     this.commonService.hideLoading();
    //   },
    //   (err: any) => {
    //     this.commonService.hideLoading();
    //     this.commonService.errorHandling(err);
    //   }
    // );
  }

  private createSMEChart(): void {
    Highcharts.chart('comp-content-support' as any, {
      chart: {
        type: 'column',
        options3d: {
          enabled: true
        }
      },
      title: {
        text: `Content Support ${this.year}`,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: Object.keys(this.contentSupportData).map((key) => this.contentSupportData[key].title),
        labels: {
          skew3d: true,
          style: {
            fontSize: '16px'
          }
        }
      },

      yAxis: {
        title: {
          text: null
        }
      },
      series: [{
        name: 'Total Requests',
        data: Object.keys(this.contentSupportData).map((key) => this.contentSupportData[key].total)
      }],

      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y}'
      },
    } as any);

    Highcharts.chart('comp-delivery-method' as any, {
      chart: {
        type: 'column',
        options3d: {
          enabled: true
        }
      },
      title: {
        text: `Content Support ${this.year}`,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: Object.keys(this.deliveryMethodData).map((key) => this.deliveryMethodData[key].title),
        labels: {
          skew3d: true,
          style: {
            fontSize: '16px'
          }
        }
      },

      yAxis: {
        title: {
          text: null
        }
      },
      series: [{
        name: 'Total Requests',
        data: Object.keys(this.deliveryMethodData).map((key) => this.deliveryMethodData[key].total)
      }],

      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y}'
      },
    } as any);

    Highcharts.chart('comp-voice-over' as any, {
      chart: {
        type: 'column',
        options3d: {
          enabled: true
        }
      },
      title: {
        text: `Content Support ${this.year}`,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: Object.keys(this.voiceOverData).map((key) => this.voiceOverData[key].laungauge),
        labels: {
          skew3d: true,
          style: {
            fontSize: '16px'
          }
        }
      },

      yAxis: {
        title: {
          text: null
        }
      },
      series: [{
        name: 'Total Requests',
        data: Object.keys(this.voiceOverData).map((key) => this.voiceOverData[key].total)
      }],

      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y}'
      },
    } as any);

    Highcharts.chart('comp-chart-pie-sme-active' as any, {
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45
        }
      },
      title: {
        text: 'SME Request'
      },
      subtitle: {
        text: ''
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          innerSize: 100,
          depth: 45
        }
      },
      series: [{
        name: 'SME Request',
        data: this.activeSMECount
      }]
    } as any);

    Highcharts.chart('comp-sme-status' as any, {
      chart: {
        type: 'column',
        options3d: {
          enabled: true
        }
      },
      title: {
        text: `SME Database ${this.year}`,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: Object.keys(this.smeData.status),
        labels: {
          skew3d: true,
          style: {
            fontSize: '16px'
          }
        }
      },

      yAxis: {
        title: {
          text: null
        }
      },
      series: [{
        name: 'Requests',
        data: Object.values(this.smeData.status)
      }],

      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y}'
      },
    } as any);

    Highcharts.chart('comp-sme-status-yearly' as any, {
      chart: {
        type: 'column'
      },
      title: {
        text: 'SME database yearly report'
      },
      xAxis: {
        categories: ['2018', '2019', '2020', '2021', '2022']
      },
      credits: {

        enabled: false,
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Total request '
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: 'gray',
            textOutline: 'none'
          }
        }
      },
      legend: {
        align: 'right',
        x: -30,
        verticalAlign: 'top',
        y: 25,
        floating: true,
        backgroundColor: 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [{
        name: 'Pending approval from manager',
        data: [5, 3, 4, 7, 2]
      }, {
        name: 'Save as draft',
        data: [2, 2, 3, 2, 1]
      }, {
        name: 'Added to the SME database',
        data: [3, 4, 4, 2, 5]
      }, {
        name: 'Rejected',
        data: [3, 4, 4, 2, 5]
      }]
    } as any);
  }

  private createLearningModuleChart(): void {
    Highcharts.chart('comp-design-status' as any, {
      chart: {
        type: 'column',
        options3d: {
          enabled: true
        }
      },
      title: {
        text: `Learning Module ${this.year}`,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: ['Draft', 'Submitted', 'Pending', 'Forwarded', 'Closed', 'Rejected'],
        labels: {
          skew3d: true,
          style: {
            fontSize: '16px'
          }
        }
      },

      yAxis: {
        title: {
          text: null
        }
      },
      series: [{
        name: 'Requests',
        data: [10, 20, 50, 10, 5, 7]
      }],

      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y}'
      },
    } as any);

    Highcharts.chart('comp-design-status-yearly' as any, {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Learning Module yearly report'
      },
      xAxis: {
        categories: ['2018', '2019', '2020', '2021', '2022']
      },
      credits: {
        enabled: false,
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Total request '
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: 'gray',
            textOutline: 'none'
          }
        }
      },
      legend: {
        align: 'right',
        x: -30,
        verticalAlign: 'top',
        y: 25,
        floating: true,
        backgroundColor: 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [{
        name: 'Draft',
        data: [5, 3, 4, 7, 2]
      }, {
        name: 'Submitted',
        data: [2, 2, 3, 2, 1]
      }, {
        name: 'Pending',
        data: [3, 4, 4, 2, 5]
      }, {
        name: 'Forwarded',
        data: [3, 4, 4, 2, 5]
      }, {
        name: 'Closed',
        data: [3, 4, 4, 2, 5]
      }, {
        name: 'Rejected',
        data: [3, 4, 4, 2, 5]
      }]
    } as any);
  }

  private createDNAModuleChart(): void {
    Highcharts.chart('comp-dna-status' as any, {
      chart: {
        type: 'column',
        options3d: {
          enabled: true
        }
      },
      title: {
        text: `Learning Module ${this.year}`,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: Object.keys(this.dnaData.status),
        labels: {
          skew3d: true,
          style: {
            fontSize: '16px'
          }
        }
      },

      yAxis: {
        title: {
          text: null
        }
      },
      series: [{
        name: 'Requests',
        data: Object.values(this.dnaData.status)
      }],

      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y}'
      },
    } as any);

    Highcharts.chart('comp-dna-status-yearly' as any, {
      chart: {
        type: 'column'
      },
      title: {
        text: 'DNA Module yearly report'
      },
      xAxis: {
        categories: ['2018', '2019', '2020', '2021', '2022']
      },
      credits: {
        enabled: false,
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Total request '
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: 'gray',
            textOutline: 'none'
          }
        }
      },
      legend: {
        align: 'right',
        x: -30,
        verticalAlign: 'top',
        y: 25,
        floating: true,
        backgroundColor: 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [{
        name: 'Pending',
        data: [3, 4, 4, 2, 5]
      }, {
        name: 'Forwarded',
        data: [3, 4, 4, 2, 5]
      }, {
        name: 'Closed',
        data: [3, 4, 4, 2, 5]
      }]
    } as any);

    Highcharts.chart('comp-dna-priority' as any, {
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45
        }
      },
      title: {
        text: 'DNA Priority'
      },
      subtitle: {
        text: ''
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          innerSize: 100,
          depth: 45
        }
      },
      series: [{
        name: 'DNA Priority',
        data: this.dnaPriority
      }]
    } as any);

    Highcharts.chart('comp-dna-country' as any, {
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45
        }
      },
      title: {
        text: 'DNA Country'
      },
      subtitle: {
        text: ''
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          innerSize: 100,
          depth: 45
        }
      },
      series: [{
        name: 'DNA Country',
        data: this.dnaCountry
      }]
    } as any);

    Highcharts.chart('comp-dna-region' as any, {
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45
        }
      },
      title: {
        text: 'DNA Region'
      },
      subtitle: {
        text: ''
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          innerSize: 100,
          depth: 45
        }
      },
      series: [{
        name: 'DNA Region',
        data: this.dnaRegion
      }]
    } as any);

    Highcharts.chart('comp-dna-business' as any, {
      chart: {
        type: 'column',
        options3d: {
          enabled: true
        }
      },
      title: {
        text: `DNA Business Unit`,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: Object.keys(this.dnaData.business_unit),
        labels: {
          skew3d: true,
          style: {
            fontSize: '16px'
          }
        }
      },

      yAxis: {
        title: {
          text: null
        }
      },
      series: [{
        name: 'Requests',
        data: Object.values(this.dnaData.business_unit)
      }],

      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y}'
      },
    } as any);
  }

  private createChartColumn(data: any): void {
    const chart = Highcharts.chart('comp-chart-column' as any, {
      chart: {
        type: 'column',
        options3d: {
          enabled: true
        }
      },
      title: {
        text: `Overall Progress ${this.year}`,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: {
          skew3d: true,
          style: {
            fontSize: '16px'
          }
        }
      },

      yAxis: {
        title: {
          text: null
        }
      },
      series: [{
        name: 'Total Requests',
        data: Object.keys(data.monthly).map((key) => data.monthly[key].total)
      }],

      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y}'
      },
    } as any);
  }

  private createChartDepartActivities(): void {
    const chart = Highcharts.chart('comp-depart-activities' as any, {
      chart: {
        type: 'column',
        options3d: {
          enabled: true
        }
      },
      title: {
        text: `Department wise activities report ${this.year}`,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: ['Human Resources', 'Orange Intl Networks Infrastruct & Svcs(OINIS)', 'Hosted staff/ INNOV & Others-EQ', 'Sales & Marketing Americas'],
        labels: {
          skew3d: true,
          style: {
            fontSize: '16px'
          }
        }
      },

      yAxis: {
        title: {
          text: null
        }
      },
      series: [{
        name: 'Total Requests',
        data: [138, 9, 1, 9]
      }],

      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y}'
      },
    } as any);
  }

  private CreateLinechart(): void {
    const chart = Highcharts.chart('comp-chart-line' as any, {
      chart: {
        type: 'line'
      },
      title: {
        text: 'ROC month wise average process time 2022'
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yAxis: {
        title: {
          text: 'Response Time'
        }
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true
          },
          enableMouseTracking: false
        }
      },
      series: [{
        name: 'Process Time',
        data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
      }]
    } as any);
  }

  private createMonthWiseLinechart(chartname: string, title: string, data: any): void {
    const chart = Highcharts.chart(chartname as any, {
      chart: {
        type: 'line'
      },
      title: {
        text: title
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yAxis: {
        title: {
          text: 'Response Time'
        }
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true
          },
          enableMouseTracking: false
        }
      },
      series: data
    } as any);
  }

  private createPieChart(): void {
    // Highcharts.chart('comp-chart-pie-roc' as any, {
    //   chart: {
    //     type: 'pie',
    //     options3d: {
    //         enabled: true,
    //         alpha: 45
    //     }
    // },
    // title: {
    //     text: 'ROC Activity Report'
    // },
    // subtitle: {
    //     text: ''
    // },
    // plotOptions: {
    //     pie: {
    //         innerSize: 100,
    //         depth: 45
    //     }
    // },
    // series: [{
    //     name: 'Published Request',
    //     data: [
    //         ['Summit Maggu', 8],
    //         ['Irina Sipratova', 3],
    //         ['Chaimaa Hafez', 1],
    //         ['Daniela Hlucha', 6],
    //         ['Fernanda Bernstorff', 8]
    //     ]
    // }]
    // } as any);

    // Highcharts.chart('comp-chart-pie-publisher' as any, {
    //   chart: {
    //     type: 'pie',
    //     options3d: {
    //         enabled: true,
    //         alpha: 45
    //     }
    // },
    // title: {
    //     text: 'Publisher Activity Report'
    // },
    // subtitle: {
    //     text: ''
    // },
    // plotOptions: {
    //     pie: {
    //         innerSize: 100,
    //         depth: 45
    //     }
    // },
    // series: [{
    //     name: 'Published Request',
    //     data: [
    //         ['Tracy Stevens', 8],
    //         ['Bernard Siefert', 5],
    //         ['Francoise Latreille', 1],
    //         ['Girish Chand Pandey', 2],
    //         ['Fatma Elarini', 10]
    //     ]
    // }]
    // } as any);
  }

  private createChartLine(chartname: string, title: string, data: any): void {
    const chart = Highcharts.chart(chartname, {
      chart: {
        type: 'column'
      },
      title: {
        text: title
      },
      subtitle: {
        text: `Month wise ${this.year}`
      },
      xAxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ],
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Requests'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: data,
      credits: {
        enabled: false,
      }
    } as any);
  }

}
