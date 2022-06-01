import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DnaService } from 'src/app/shared/services/dna/dna.service';

@Component({
  selector: 'app-dna-dashboard',
  templateUrl: './dna-dashboard.component.html',
  styleUrls: ['./dna-dashboard.component.scss']
})
export class DnaDashboardComponent implements OnInit {

  trackerObj:any = [];

  constructor(
    private dnaService:DnaService,
    private commonService:CommonService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.getTrackerList();
  }

  addLearning(id:number){
    if (id) {
      this.router.navigateByUrl(`/dashboard/dna/create/${id}`);
    }
  }

  getTrackerList(){
  this.dnaService.getTrackerList().subscribe((res:any)=>{
    this.trackerObj = res.data.tracker;
  },
  err=>{

  });
  }
}
