import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';

@Component({
  selector: 'app-course-beautification-template',
  templateUrl: './course-beautification-template.component.html',
  styleUrls: ['./course-beautification-template.component.scss']
})
export class CourseBeautificationTemplateComponent implements OnInit {

  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  constructor(private modalService: NgbActiveModal, private courseService: CourcesService, private router: Router, private commonService: CommonService) { }
  public courseHistory: any;
  public courseDetail: any;
  public modalType: any;
  public title: any;
  templateData = ''
  colors = ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'bg-5', 'bg-6'];
  ngOnInit(): void {
    this.setDialogProps(this.props)
  }

  setDialogProps(dialogdata: any) {
    this.courseDetail = dialogdata.objectDetail ? dialogdata.objectDetail : '';
    this.courseDetail.description = this.courseService.getTText(this.courseDetail.description);
    this.courseDetail.for_whom = this.courseService.getTText(this.courseDetail.for_whom);
    this.courseDetail.for_whoom = this.courseService.getTText(this.courseDetail.for_whoom);
    let objectiveList = '<ul>';
    this.courseDetail.objectiveByLang.map((Object: any) => {
      Object.color = this.colors[Math.floor(Math.random() * this.colors.length)];
      objectiveList += `<li>${Object.description}</li>`;
      return Object;
    });
    objectiveList += '</ul>'
    this.courseDetail.objectiveList = objectiveList;
  }

  closeModal() {
    this.modalService.close();
  }

  copyToClipBoardSource() {
    this.templateData = `<div id="g"><div id="p"><img src="https://orange.csod.com/clientimg/orange/welcome/Core/pq.png" alt=""><div><h2>For whom?</h2>${this.courseDetail.for_whoom}</div></div><div class="s"></div><div id="r"><img src="https://orange.csod.com/clientimg/orange/welcome/Core/pr.png" alt=""><div><h2>Prerequisite</h2>${this.courseDetail.prerequisite}</div></div><div id="m"><div id="d"><h2>Description</h2><div>${this.courseDetail.description}</div></div><div class="s"></div><div id="o"><h2>Objectives</h2>${this.courseDetail.objectiveList}</div><div class="s"></div></div><div id="i"><h2>More information</h2><a href="" target="_blank" ></a><br><a id="c" href="mailto:${this.courseDetail.email_training_contact}?subject=Request information for:${this.courseDetail.titleByLang}"><img src="https://orange.csod.com/clientimg/orange/welcome/Core/c.png" alt="">Contact</a></div><div hidden="">ll2</div></div><style>#g{max-width: 750px;font-family: helvetica neue,helvetica;color:black!important;font-size: 12px;}#g h4{margin: 5px 0 0 0;font-size: 16px;}#g h2{font-size: 20px;}#g span{min-width: 30px;height: 30px;margin-right: 15px;}.s{height: 2px;background-color: #EEEEEE;width: 100%;margin:5px 0;}#m {border:2px solid #EEEEEE;padding:0 30px 30px 30px;margin: 15px 0;}#o div{display: flex;font-weight: bold;}#p{display: flex;}#p img{min-width:100px;height: 100px;margin-right: 30px}#r{display:flex;}#r img{min-width: 100px;height: 100px;margin-right: 30px}#i{background-color:#EEEEEE;padding:1px 30px 15px 30px;display: flex;flex-direction: column;}#c{border:2px solid black;padding:5px 10px;text-decoration: none;color:black;font-weight: bold;font-size: 22px;display: flex;margin-top: 15px;width: 120px;}#c img{width: 28px;height: 28px;margin-right: 10px;}#o div{margin-bottom:5px;}#o ul{display:block;}#o ul li{list-style-type: none;position:relative;font-family: helvetica neue,helvetica;color: black !important;font-size: 12px;font-weight:bold;margin:20px;left:-1.2em;}#o ul li:before{ content:' ';background:red;width:2.5em;height:2.5em;position:absolute; margin-top: -5px;left:-3.8em;}#o ul li:nth-child(5n+1):before{background:#50be87;}#o ul li:nth-child(5n+2):before{background:#a885d8;}#o ul li:nth-child(5n+3):before{background:#ffd200;}#o ul li:nth-child(5n+4):before{background:#4bb4e6;}#o ul li:nth-child(5n+5):before{background:#085ebd;}#o ul li:nth-child(5n+6):before{background:#ffb4e6;}#o ul li:nth-child(5n+7):before{background:#ffb400;}#o ul li:nth-child(5n+8):before{background:#ff6600;}</style>`    
    navigator.clipboard.writeText(this.templateData);
  }

  onClose() {
    this.passEntry.next();
    this.modalService.close();
  }

}
