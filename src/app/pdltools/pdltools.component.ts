import { AfterViewInit, Component } from '@angular/core';
import { dataConstant } from '../shared/constant/dataConstant';
import { CommonService } from '../shared/services/common/common.service';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import { PldtoolsService } from '../shared/services/pldtools/pldtools.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdltoolsDetailsComponent } from './pdltools-details/pdltools-details.component';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);

@Component({
  selector: 'app-pdltools',
  templateUrl: './pdltools.component.html',
  styleUrls: ['./pdltools.component.scss']
})
export class PdltoolsComponent implements AfterViewInit {
  yearsList: any = [];
  moduleList: any = [];
  courceData: any = {};
  sessionData: any = {};
  reportData: any = {};
  publisherReportData:any = [];
  rocReportData:any = [];
  rocData: any = [];
  publisherData: any = [];
  modules = dataConstant.Modules;
  year = null;
  selectedModule = null;

  constructor(private commonService: CommonService, private pldtoolsService: PldtoolsService,  private modalService: NgbModal) {
    this.yearsList = this.commonService.LastFewYearsList();
    this.moduleList = dataConstant.ModuleList;
  }
  public ngAfterViewInit(): void {
    
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
    }
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
          Object.entries(this.courceData.publisher_activity).forEach((element: any, index:any) => {
            const data = {
              name: element[0],
              data: Object.keys(element[1].monthly).map((key) => element[1].monthly[key].total)
            }
            this.publisherReportData.push(data);
          });
          this.rocData.forEach((element: any, index:any) => {
            const data = {
              name: element[0],
              data: Object.keys(element[1].monthly).map((key) => element[1].monthly[key].total)
            }
            this.rocReportData.push(data);
          });
        } else {
          this.commonService.toastErrorMsg('Error', res.message);
        }
        this.createChartColumn();
        this.createChartLine('chart-publisher','Publisher Activity Report',this.publisherReportData);
        this.createChartLine('chart-roc','ROC Activity Report',this.rocReportData);
        this.createMonthWiseLinechart('comp-chart-publisher-month',`Publisher month wise average time ${this.year}`,this.publisherReportData)
        this.createMonthWiseLinechart('comp-chart-roc-month',`ROC month wise average time ${this.year}`,this.rocReportData)
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

  private getReportData() {
    const body = {
      year: this.year
    }
    this.commonService.showLoading();
    this.pldtoolsService.getReportData(body).subscribe(
      (res: any) => {
        if (res && res.status == 1) {
          this.reportData = res.data;
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


  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

 
  private createChartColumn(): void {
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
        data: Object.keys(this.courceData.monthly).map((key) => this.courceData.monthly[key].total)
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
        data: [138,9,1,9]
      }],

      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y}'
      },
    } as any);
  }

  private CreateLinechart():void {
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

  private createMonthWiseLinechart(chartname:string,title:string, data:any):void {
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

  private createPieChart():void{
    Highcharts.chart('comp-chart-pie-roc' as any, {
      chart: {
        type: 'pie',
        options3d: {
            enabled: true,
            alpha: 45
        }
    },
    title: {
        text: 'ROC Activity Report'
    },
    subtitle: {
        text: ''
    },
    plotOptions: {
        pie: {
            innerSize: 100,
            depth: 45
        }
    },
    series: [{
        name: 'Published Request',
        data: [
            ['Summit Maggu', 8],
            ['Irina Sipratova', 3],
            ['Chaimaa Hafez', 1],
            ['Daniela Hlucha', 6],
            ['Fernanda Bernstorff', 8]
        ]
    }]
    } as any);

    Highcharts.chart('comp-chart-pie-publisher' as any, {
      chart: {
        type: 'pie',
        options3d: {
            enabled: true,
            alpha: 45
        }
    },
    title: {
        text: 'Publisher Activity Report'
    },
    subtitle: {
        text: ''
    },
    plotOptions: {
        pie: {
            innerSize: 100,
            depth: 45
        }
    },
    series: [{
        name: 'Published Request',
        data: [
            ['Tracy Stevens', 8],
            ['Bernard Siefert', 5],
            ['Francoise Latreille', 1],
            ['Girish Chand Pandey', 2],
            ['Fatma Elarini', 10]
        ]
    }]
    } as any);
  }

  private createChartLine(chartname:string,title:string, data:any): void {
    const chart = Highcharts.chart(chartname, {
      chart: {
        type: 'column'
    },
    title: {
        text:title
    },
    subtitle: {
      text:`Month wise ${this.year}`
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
