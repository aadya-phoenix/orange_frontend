import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-get-report-list',
  templateUrl: './get-report-list.component.html',
  styleUrls: ['./get-report-list.component.scss']
})
export class GetReportListComponent implements OnInit {

  searchText:string='';
  getUserrole: any;
  getprofileDetails: any;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;
  constructor() { }

  ngOnInit(): void {
  }

 onSort({ column, direction }: any) {
    this.headers.forEach((header: { sortable: any; direction: string; }) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction && column) {
      this.carouselListToShow = _.orderBy(this.carouselListToShow, column, direction);
    }
    else {
      this.showRecords(this.selectedStatus);
    }
  }

}
