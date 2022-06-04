import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
  selector: 'app-smedb-create',
  templateUrl: './smedb-create.component.html',
  styleUrls: ['./smedb-create.component.scss']
})
export class SmedbCreateComponent implements OnInit {
  createSmedbForm: FormGroup;
  isSubmitted = false;
  files: File[] = [];

  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private authService: AuthenticationService,) {
    this.createSmedbForm = this.formBuilder.group({
      phone_no: new FormControl('', [Validators.required])
    });
   }


   onFilesAdded(event: { addedFiles: any; }) {
     console.log(event);
     this.files.push(...event.addedFiles);
   }
 
   onFilesRejected(event: any) {
     console.log(event);
   }
 
   onRemove(event: File) {
     console.log(event);
     this.files.splice(this.files.indexOf(event), 1);
   }

  ngOnInit(): void {
  }

  onSelect(event:any) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }


}
