import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { OlTestService } from 'src/app/shared/services/ol-test/ol-test.service';
import Swal from 'sweetalert2';
import { OlTestCreateModelComponent } from '../ol-test-create-model/ol-test-create-model.component';

@Component({
  selector: 'app-ol-test-list',
  templateUrl: './ol-test-list.component.html',
  styleUrls: ['./ol-test-list.component.scss']
})
export class OlTestListComponent implements OnInit {
  layoutGrid = true;
  lableConstant: any = { french: {}, english: {} };
  oltestList: any = [];

  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor(
    private olTestService: OlTestService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private router: Router) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
  }

  ngOnInit(): void {
    this.getTest();
  }

  showPaginationCount(pageStart: any, pageEnd: any, total: any) {
    return this.commonService.showPaginationCount(pageStart, pageEnd, total, this.lableConstant.showing_number_entries);
  }

  getTest() {
    this.commonService.showLoading();
    this.olTestService.getOlTest().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.oltestList = res.data?.ol_test;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  viewRequest(oltest: any) {
    if (oltest && oltest.id) {
      this.router.navigateByUrl(`/oltest/view/${oltest.id}`);
    }
  }

  editRequest(oltest: any) {
    if (oltest && oltest.id) {
      this.router.navigateByUrl(`/oltest/update/${oltest.id}`);
    }
  }

  deleteRequest(id: any) {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this test!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.commonService.showLoading();
        this.olTestService.OlTestDelete({ ol_test_id: id }).subscribe((res: any) => {
          this.commonService.hideLoading();
          this.getTest();
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

  copyRequest(id: number) {
    Swal.fire({
      title: 'Are you sure you want to copy?',
      text: 'You will copy this request',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, copy it!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        // this.commonService.showLoading();
        // this.olTestService.copyCourse({ oltest_id: id }).subscribe((res: any) => {
        //   this.commonService.hideLoading();
        //   this.getTest();
        //   Swal.fire(
        //     'Copied!',
        //     'Your request has been copyed.',
        //     'success'
        //   )
        // }, (err: any) => {
        //   this.commonService.hideLoading();
        //   this.commonService.errorHandling(err);
        // })

      }
    })
  }

  onSort({ column, direction }: any) {
    this.headers.forEach((header: { sortable: any; direction: string; }) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction && column) {
      this.oltestList = _.orderBy(this.oltestList, column, direction);
    }
    else {
      this.oltestList = this.oltestList;
    }
  }

  pageChanged(event: any) {
    this.pagination.pageNumber = event;
  }

  openCreateModal() {
    const modalRef = this.modalService.open(OlTestCreateModelComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {};
  }

}
