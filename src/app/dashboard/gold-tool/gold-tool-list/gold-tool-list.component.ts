import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { GoldToolService } from 'src/app/shared/services/gold-tool/gold-tool.service';
import Swal from 'sweetalert2';
import { GoldToolHistoryComponent } from '../gold-tool-history/gold-tool-history.component';

@Component({
  selector: 'app-gold-tool-list',
  templateUrl: './gold-tool-list.component.html',
  styleUrls: ['./gold-tool-list.component.scss']
})
export class GoldToolListComponent implements OnInit {
  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;
  goldToolStatus = dataConstant.GoldToolStatus;
  dateTimeFormate = dataConstant.dateTimeFormate;
  selectedStatus = this.goldToolStatus.total;
  lableConstant: any = { french: {}, english: {} };
  searchText: any;
  goldToolList: any = [];
  goldToolListToView: any = [];
  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  };
  gold_tool_count = {
    close: 0,
    draft: 0,
    pending: 0,
    reject: 0,
    submit: 0,
    total: 0
  };

  constructor(private commonService: CommonService,
    private goldToolService: GoldToolService,
    private router: Router,
    private modalService: NgbModal,
    private route: ActivatedRoute) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        if (params?.status) {
          this.selectedStatus = params?.status;
        }
      }
      );
    this.refreshGoldTools();
  }

  refreshGoldTools() {
    this.commonService.showLoading();
    this.goldToolService.getGoldTool().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.goldToolList = res.data.gold_tool;
          this.gold_tool_count = res.data.gold_tool_count;
          this.getrecords(this.selectedStatus);
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
      this.router.navigateByUrl(`/gold-tool/view/${item.id}`);
    }
  }

  showPaginationCount(pageStart: any, pageEnd: any, total: any) {
    return this.commonService.showPaginationCount(pageStart, pageEnd, total, this.lableConstant.showing_number_entries);
  }

  pageChanged(event: any) {
    this.pagination.pageNumber = event;
  }

  onSort({ column, direction }: any) {
    this.headers.forEach((header: { sortable: any; direction: string; }) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction && column) {
      this.goldToolListToView = _.orderBy(this.goldToolListToView, column, direction);
    }
    else {
      this.getrecords(this.selectedStatus);
    }
  }

  getrecords(type: string) {
    if (type === this.goldToolStatus.total) {
      this.goldToolListToView = this.goldToolList.map((x: any) => Object.assign({}, x));
    } else {
      this.goldToolListToView = this.goldToolList.filter((x: any) => { if (x.status_show === type) { return x } }).map((x: any) => Object.assign({}, x));
    }
    this.selectedStatus = type;
  }

  editRequest(item: any) {
    if (item && item.id) {
      this.router.navigateByUrl(`/gold-tool/update/${item.id}`);
    }
  }

  deleteRequest(gold_tool_id: number) {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this request!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.commonService.showLoading();
        this.goldToolService.goldToolDelete({ gold_tool_id: gold_tool_id }).subscribe((res: any) => {
          this.commonService.hideLoading();
          this.refreshGoldTools();
          Swal.fire(
            'Deleted!',
            'Your request has been deleted.',
            'success'
          )
        }, (err: any) => {
          this.commonService.hideLoading();
          this.commonService.errorHandling(err);
        })

      }
    })
  }

  openModal(item: any) {
    const modalRef = this.modalService.open(GoldToolHistoryComponent, {
      centered: true,
      size: 'xl',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      data: item.id,
      objectDetail: item,
    };
  }


}
