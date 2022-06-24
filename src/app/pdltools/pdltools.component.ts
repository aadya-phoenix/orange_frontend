import { AfterViewInit, Component } from '@angular/core';
import { dataConstant } from '../shared/constant/dataConstant';
import { CommonService } from '../shared/services/common/common.service';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import { PldtoolsService } from '../shared/services/pldtools/pldtools.service';

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

  constructor(private commonService: CommonService, private pldtoolsService: PldtoolsService) {
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

  private createChartGauge(): void {
    const chart = Highcharts.chart('chart-gauge', {
      chart: {
        type: 'solidgauge',
      },
      title: {
        text: 'Gauge Chart',
      },
      credits: {
        enabled: false,
      },
      pane: {
        startAngle: -90,
        endAngle: 90,
        center: ['50%', '85%'],
        size: '160%',
        background: {
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc',
        },
      },
      yAxis: {
        min: 0,
        max: 100,
        stops: [
          [0.1, '#55BF3B'], // green
          [0.5, '#DDDF0D'], // yellow
          [0.9, '#DF5353'], // red
        ],
        minorTickInterval: null,
        tickAmount: 2,
        labels: {
          y: 16,
        },
      },
      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: -25,
            borderWidth: 0,
            useHTML: true,
          },
        },
      },
      tooltip: {
        enabled: false,
      },
      series: [{
        name: null,
        data: [this.getRandomNumber(0, 100)],
        dataLabels: {
          format: '<div style="text-align: center"><span style="font-size: 1.25rem">{y}</span></div>',
        },
      }],
    } as any);

    // setInterval(() => {
    //   chart.series[0].points[0].update(this.getRandomNumber(0, 100));
    // }, 1000);
  }

  private createChartPie(): void {
    let date = new Date();
    const data: any[] = [];

    for (let i = 0; i < 5; i++) {
      date.setDate(new Date().getDate() + i);
      data.push({
        name: `${date.getDate()}/${date.getMonth() + 1}`,
        y: this.getRandomNumber(0, 1000),
      });
    }

    const chart = Highcharts.chart('chart-pie', {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Pie Chart',
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        headerFormat: `<span class="mb-2">Date: {point.key}</span><br>`,
        pointFormat: '<span>Amount: {point.y}</span>',
        useHTML: true,
      },
      series: [{
        name: null,
        innerSize: '50%',
        data,
      }],
    } as any);

    // setInterval(() => {
    //   date.setDate(date.getDate() + 1);
    //   chart.series[0].addPoint({
    //     name: `${date.getDate()}/${date.getMonth() + 1}`,
    //     y: this.getRandomNumber(0, 1000),
    //   }, true, true);
    // }, 1500);
  }

  private createChartColumn(): void {
    let date = new Date();
    const data: any[] = [];

    for (let i = 0; i < 10; i++) {
      date.setDate(new Date().getDate() + i);
      data.push({
        name: `${date.getDate()}/${date.getMonth() + 1}`,
        y: this.getRandomNumber(0, 1000),
      });
    }

    const chart = Highcharts.chart('chart-column' as any, {
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

      // plotOptions: {
      //   column: {
      //     depth: 25
      //   }
      // }
    } as any);

    // setInterval(() => {
    //   date.setDate(date.getDate() + 1);
    //   chart.series[0].addPoint({
    //     name: `${date.getDate()}/${date.getMonth() + 1}`,
    //     y: this.getRandomNumber(0, 1000),
    //   }, true, true);
    // }, 1500);
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

    // setInterval(() => {
    //   date.setDate(date.getDate() + 1);
    //   chart.series[0].addPoint([`${date.getDate()}/${date.getMonth() + 1}`, this.getRandomNumber(0, 1000)], true, true);
    // }, 1500);
  }

}
