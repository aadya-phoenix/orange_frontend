import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { OlTestCreateModelComponent } from '../ol-test-create-model/ol-test-create-model.component';

@Component({
  selector: 'app-ol-test-list',
  templateUrl: './ol-test-list.component.html',
  styleUrls: ['./ol-test-list.component.scss']
})
export class OlTestListComponent implements OnInit {
  layoutGrid = true;
  constructor(private commonService: CommonService,
    private router: Router,
    private modalService: NgbModal,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
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
