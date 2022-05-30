import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DnaLearningFormComponent } from '../dna-learning-form/dna-learning-form.component';

@Component({
  selector: 'app-dna-create',
  templateUrl: './dna-create.component.html',
  styleUrls: ['./dna-create.component.scss']
})
export class DnaCreateComponent implements OnInit {

  constructor(
    private router: Router) { }

  ngOnInit(): void {
    
  }

  createNew() {
    this.router.navigateByUrl(`/dashboard/dna/add-new`);
  }

}
