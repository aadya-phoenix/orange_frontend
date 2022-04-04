import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class CourcesService {
  public basePath = environment.baseUrl;
  public apiVersion = environment.apiVersion;
  public clientId = environment.clientId;
  public clientSecret = environment.clientSecret;
  public lang = environment.lang;
  public headers = new Headers({});
  constructor(private http: HttpService) {
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  getCources() {
    const url = `/api/${this.apiVersion}/course`;
    const urllive = `${this.basePath}api/${this.apiVersion}/course`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  createCource(data: any) {
    const url = `/api/${this.apiVersion}/course/create`;
    const urllive = `${this.basePath}api/${this.apiVersion}/course/create`;
    return this.http.post(url, data).pipe(catchError(this.Errorhandling));
  }
  courceStatus(data: any) {
    const url = `/api/${this.apiVersion}/course/status`;
    const urllive = `${this.basePath}api/${this.apiVersion}/course/create`;
    return this.http.post(url, data).pipe(catchError(this.Errorhandling));
  }
  updateCourse(data: any) {
    const url = `api/${this.apiVersion}/course/update`;
    return this.http.post(url, data).pipe(catchError(this.Errorhandling));
  }

  changeStatus(data: any) {
    const url = `api/${this.apiVersion}/course/status`;
    return this.http.post(url, data).pipe(catchError(this.Errorhandling));
  }

  courseTransfer(data: any) {
    const url = `api/${this.apiVersion}/course/transfer`;
    return this.http.post(url, data).pipe(catchError(this.Errorhandling));
  }

  deleteCourse(data:any){
    const url =`api/${this.apiVersion}/course/delete`;
    return this.http.post(url, data).pipe(catchError(this.Errorhandling));
  }

  copyCourse(data:any){
    const url =`api/${this.apiVersion}/course/copy`;
    return this.http.post(url, data).pipe(catchError(this.Errorhandling));
  }

  courseDetail(data:any){
    const url =`api/${this.apiVersion}/course/${data}/detail`;
    return this.http.get(url,this.http.headers).pipe(catchError(this.Errorhandling))
  }

  courseHistory(data:any){
    const url =`api/${this.apiVersion}/course/${data}/history`;
    return this.http.get(url,this.http.headers).pipe(catchError(this.Errorhandling))
  }

  // /api/v4/cct-level
  // /api/v4/cct-validity-period
  // /api/v4/cct-vendor-type
  // /api/v4/cct-subject
  // /api/v4/cct-template
  // /api/v4/cct-entity-list

  getcctLevel() {
    const url = `/api/${this.apiVersion}/cct-level`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  getVendortype() {
    const url = `/api/${this.apiVersion}/cct-vendor-type`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  getSubjects() {
    const url = `/api/${this.apiVersion}/cct-subject`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  getTemplate() {
    const url = `/api/${this.apiVersion}/cct-template`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  getEntitylist() {
    const url = `/api/${this.apiVersion}/cct-entity-list`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  getValidityperiod() {
    const url = `/api/${this.apiVersion}/cct-validity-period`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  //who can see course
  whoSeeCourse() {
    const url = `api/${this.apiVersion}/cct-see-course`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  //learningType
  getLearningType() {
    const url = `api/${this.apiVersion}/cct-learning-type`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  //languages
  getLanguages() {
    const url = `api/${this.apiVersion}/cct-language`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  //prefered instructor
  getpreferedInstructor() {
    const url = `api/${this.apiVersion}/cct-prefered-instructor`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  //delivery method
  getDeliveryMethod() {
    const url = `api/${this.apiVersion}/cct-delivery-method`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  //get expiry
  getExpiryType() {
    const url = `api/${this.apiVersion}/cct-expiry-type`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  //regional cordinator
  getregionalCordinator() {
    const url = `/api/${this.apiVersion}/cct-regional-cordinator`;
    const urllive = `${this.basePath}api/${this.apiVersion}/cct-regional-cordinator`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }
    //role
    getRole(){
      const url = `/api/${this.apiVersion}/roles`;
      const urllive = `${this.basePath}api/${this.apiVersion}/roles`;
      return this.http
        .get(url, this.http.headers)
        .pipe(catchError(this.Errorhandling));
    }
  
    //role-users
     getRoleUsers(){
      const url = `/api/${this.apiVersion}/role-users`;
      const urllive = `${this.basePath}api/${this.apiVersion}/role-users`;
      return this.http
        .get(url, this.http.headers)
        .pipe(catchError(this.Errorhandling));
     }
   //complete-report-filter
     getCourseFilter(data:any){
      const url = `/api/${this.apiVersion}/course/filter`;
      const urllive = `${this.basePath}api/${this.apiVersion}/course/filter`;
      return this.http.post(url, data).pipe(catchError(this.Errorhandling));  
     }
  
     //departments
     getDepartments(){
      const url = `/api/${this.apiVersion}/department_description`;
      const urllive = `${this.basePath}api/${this.apiVersion}/department_description`;
      return this.http
        .get(url, this.http.headers)
        .pipe(catchError(this.Errorhandling));
     }
  
     //assign backup
     assignBackup(id:any){
      const url = `/api/${this.apiVersion}/user/transfer`;
      const urllive = `${this.basePath}api/${this.apiVersion}/user/transfer`;
      return this.http.post(url, id).pipe(catchError(this.Errorhandling));  
     }
     //remove backup
     removeBackup(){
      const url = `/api/${this.apiVersion}/user/transfer/reset`;
      const urllive = `${this.basePath}api/${this.apiVersion}/user/transfer/reset`;
      return this.http.post(url,{}).pipe(catchError(this.Errorhandling));  
     }
     //newregionalCordinator
     getNewregionalCordinator(){
      const url = `/api/${this.apiVersion}/regional-cordinator`;
      const urllive = `${this.basePath}api/${this.apiVersion}/regional-cordinator`;
      return this.http
        .get(url, this.http.headers)
        .pipe(catchError(this.Errorhandling));
     }
      //newPublisher
     getNewPublisher(){
      const url = `/api/${this.apiVersion}/transfer/publisher-list`;
      const urllive = `${this.basePath}api/${this.apiVersion}/transfer/publisher-list`;
      return this.http.post(url,{}).pipe(catchError(this.Errorhandling)); 
     }
     //newPublisherWithId
     getNewPublisherId(id:any){
      const url = `/api/${this.apiVersion}/transfer/publisher-list`;
      const urllive = `${this.basePath}api/${this.apiVersion}/transfer/publisher-list`;
      return this.http.post(url,id).pipe(catchError(this.Errorhandling)); 
     }

  Errorhandling(err: HttpErrorResponse) {
    if (err.error instanceof ErrorEvent) {
      console.error(err.error.message);
    } else {
      console.error(`Backend returned code ${err.status}`);
    }
    return throwError('Please try again later.');
  }
  getTText(displayText: any){
  var dText = "";
  var langSelected = localStorage.getItem("lang");
  if(langSelected == undefined){
	langSelected = this.lang;
  }
	if(typeof displayText == "string"){
		if(displayText.includes("[{")){
			let displayArr = JSON.parse(displayText);
			for(let i = 0; i<displayArr.length; i++){
				if(displayArr[i][langSelected] != undefined){
				dText = displayArr[i][langSelected];
				}
			}
		} else {
		if(displayText.includes('"')){
			return displayText.substring(1, displayText.length-1);
			} else 
			return displayText;
		}
	} else {
	
	}
	return dText;
  }
  getTexttoArray(displayText: any){
  var dText = [];
	if(typeof displayText == "string"){
		if(displayText.includes("[{")){
			dText = JSON.parse(displayText);
		}
	}
	return dText;
  }
}
