import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CarouselService } from 'src/app/shared/services/carousel/carousel.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
const emailregexp = dataConstant.EmailPattren;

@Component({
  selector: 'app-create-carousel',
  templateUrl: './create-carousel.component.html',
  styleUrls: ['./create-carousel.component.scss']
})
export class CreateCarouselComponent implements OnInit {

  languageList: any = [];
  public createOlcarouselForm!: FormGroup;
  languageText = "";
  carouselImage = "";
  isSubmitted = false;
  carousel_count = {
    total: 0,
    draft: 0,
    closed: 0,
    rejected: 0,
    pending: 0,
    submitted: 0,
    transferred: 0
  }

  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private carouselService: CarouselService) {
    this.createOlcarouselForm = this.formBuilder.group({
      languages: new FormArray([]),
      metadata: this.formBuilder.array([]),
      image: new FormControl('', [Validators.required]),
      publication_date: new FormControl('', [Validators.required]),
      expiry_date: new FormControl('', [Validators.required]),
      additional_comment: new FormControl('', [Validators.required]),
    });
    this.getLanguageList();
  }

  ngOnInit(): void {
    this.getTotalCourse();
  }

  get lauguageFormArray(): FormArray {
    return this.createOlcarouselForm.get("languages") as FormArray;
  }

  get carouselFormArray(): FormArray {
    return this.createOlcarouselForm.get("metadata") as FormArray;
  }

  newMetaData(language: { id: any; name: any; slug: any; }): FormGroup {
    return this.formBuilder.group({ language: language.id, languageName: language.name, language_slug: language.slug, title: new FormControl('', [Validators.required]), description: new FormControl('', [Validators.required]), link: new FormControl('', [Validators.required]), display_manager: 0 })
  }

  getTotalCourse() {
    this.carouselService.getCarousel().subscribe(
      (res: any) => {
        this.carousel_count = res.data.carousel_count;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getLanguageList() {
    this.commonService.getLanguages().subscribe(
      (res: any) => {
        this.languageList = res.data;
        this.languageText = this.languageList.map((x: { name: string }) => x.name).join('/');
        this.languageList.forEach((x: { name: string, id: number, slug: string }) => {
          this.lauguageFormArray.push(new FormControl(x.slug === 'english' ? true : false));
          if (x.slug === 'english') {
            this.carouselFormArray.push(this.newMetaData(x));
          }
        });
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  languageChange() {
    this.lauguageFormArray.controls.forEach((x, index) => {
      const language = this.languageList[index];
      const formControl = this.carouselFormArray.controls.find(x => x.value.language === language.id);
      if (x.value && !formControl) {
        this.carouselFormArray.push(this.newMetaData(language));
      }
      else if (!x.value && formControl) {
        this.carouselFormArray.removeAt(this.carouselFormArray.controls.findIndex(x => x.value.language === language.id));
      }
    });
  }

  removeCarousel(carousel: any) {
    this.carouselFormArray.removeAt(this.carouselFormArray.controls.findIndex(x => x.value.language === carousel?.value?.language));
    this.lauguageFormArray.controls[this.languageList.findIndex((x: { id: any; }) => x.id === carousel?.value?.language)].setValue(false);
  }

  handleFileInput(event: any) {
    this.commonService.FileConvertintoBytearray(event.target.files[0], async (f) => { // creating array bytes
      this.carouselImage = this.commonService.byteArrayTobase64(f.bytes);
    });
  }

  saveCarousel(status:string) {
    this.isSubmitted = true;
    if (this.createOlcarouselForm.invalid) {
      return;
    }
    const body = this.createOlcarouselForm.value;
    body.image = this.carouselImage;
    body.reviewer_id = "";
    body.status = status;
    this.carouselService.create(body).subscribe(
      (res: any) => {
        console.log(res);
        debugger;
        if (res) {
        }
      },
      (err: any) => {
        console.log(err);
      }
    );

  }

}
