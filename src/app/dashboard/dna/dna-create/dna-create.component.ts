import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DnaLearningFormComponent } from '../dna-learning-form/dna-learning-form.component';

@Component({
  selector: 'app-dna-create',
  templateUrl: './dna-create.component.html',
  styleUrls: ['./dna-create.component.scss']
})
export class DnaCreateComponent implements OnInit {

  trackerId:number=0;
  constructor(
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.trackerId = Id ? parseInt(Id) : 0;
    });
  }

  createNew() {
    this.router.navigateByUrl(`/dashboard/dna/add-new/${this.trackerId}`);
  }

}
