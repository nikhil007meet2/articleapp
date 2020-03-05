import { Component, Input, OnInit, AfterViewInit, ViewChild, TemplateRef, ElementRef, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
//import Dexie from 'dexie';

import { OfflinDBService } from 'app/offlineDB/offlineDB.service'

import { locale as english } from './i18n/en';
import { locale as hindi } from './i18n/hi';
import { locale as marathi } from './i18n/mr';
//import { EncryptDecryptService } from '../../../_services/encrypt-decrypt.service';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { ApiService } from 'app/_services/api.service';
import { UtilsService } from 'app/_services/utils.service';
import { TranslateService } from '@ngx-translate/core';

import { MASTERDATA } from 'app/_services/MASTERDATA';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'app/_services/authentication.service';

/*let TREE_DATA = [
  { id: 1, parentid: null, nodeType: MASTERDATA.nodeType.domain, item: 'Activities Of Daily Living', bulletText: 'A', displayOrder: 1, gradingType: '1', scoringType: '2' },
  { id: 2, "parentid": 1, nodeType: MASTERDATA.nodeType.subDomain, item: 'Mealtime Activities', bulletText: 'a', displayOrder: 1 },
  { id: 3, "parentid": 2, nodeType: MASTERDATA.nodeType.question, item: 'Drinks water or liquid with assistance / help.', bulletText: '1', displayOrder: 1, makeInactive: true,isApplicable:true },
  { id: 4, "parentid": 2, nodeType: MASTERDATA.nodeType.question, item: 'Drinks independently without spilling from glass / cup.', bulletText: '2', displayOrder: 2 },
  { id: 5, "parentid": 2, nodeType: MASTERDATA.nodeType.question, item: 'Drinks with a straw.', bulletText: '3', displayOrder: 3 },
  { id: 6, "parentid": 1, nodeType: MASTERDATA.nodeType.subDomain, item: 'Hygiene', bulletText: 'b', displayOrder: 2 },
  { id: 7, "parentid": 6, nodeType: MASTERDATA.nodeType.question, item: 'Indicates after wetting/soiling.', bulletText: '1', displayOrder: 1 },

  { id: 8, parentid: null, nodeType: MASTERDATA.nodeType.domain, item: 'COMMUNICATION', bulletText: 'B', displayOrder: 2, gradingType: '2', scoringType: '1' },
  { id: 9, "parentid": 8, nodeType: MASTERDATA.nodeType.question, item: 'Responds to own name.', bulletText: '1', displayOrder: 1 },
  { id: 10, "parentid": 8, nodeType: MASTERDATA.nodeType.question, item: 'Communicates basic needs (E.g. Hungry, bathroom, sick, hurt).', bulletText: '2', displayOrder: 2 },

  { id: 11, "parentid": null, nodeType: MASTERDATA.nodeType.domain, item: 'Educational Activities', bulletText: 'C', displayOrder: 3 },
  { id: 12, "parentid": 11, nodeType: MASTERDATA.nodeType.subDomain, item: 'Reading Activities', bulletText: 'a', displayOrder: 1 },
  { id: 13, "parentid": 12, nodeType: MASTERDATA.nodeType.subSubDomain, item: 'Pre-Reading', bulletText: 'I', displayOrder: 1 },
  { id: 14, "parentid": 13, nodeType: MASTERDATA.nodeType.question, item: 'Imitates physical and vocal action (E.g. Action rhymes).', bulletText: '1', displayOrder: 1 }
]*/
let IEP_TRANSLATION_DATA = [
  { id: 1, "iepNodeId": 1, lang: 'en', description: 'Daily activity' },
  { id: 2, "iepNodeId": 1, lang: 'hi', description: 'Daily activity-Hi' },
  { id: 3, "iepNodeId": 1, lang: 'mr', description: 'Daily activity-MR' }
]

let studentData = [
  { "id": 1, firstName: "Shubham", middleName: "Prakash", lastName: "Dixit", "regId": 1, "schoolId": "1", "gender": "male", "gradeOfDisability": 1, "section": 1, "teacherId": "Neha Sanjai Malhotra", },
  { "id": 2, firstName: "Savita", "name": "Savita Ramesh Thakur", "regId": 2, "schoolId": "1", "gender": "male", "gradeOfDisability": 1, "section": 1, "teacherId": "Ashraf Sanjai Patil", },
  { "id": 3, middleName: "Raju", "name": "kaviata Raju Patil", "regId": 3, "schoolId": "1", "gender": "male", "gradeOfDisability": 1, "section": 1, "teacherId": "Ketan karan Mahtre", },
  { "id": 4, lastName: "Channe", "name": "Vikas sachin Channe", "regId": 4, "schoolId": "1", "gender": "male", "gradeOfDisability": 1, "section": 1, "teacherId": "Shifa Jhon Smith", },
  { "id": 5, "name": "Mugdhaa Pawan Desai", "regId": 5, "schoolId": "1", "gender": "male", "gradeOfDisability": 1, "section": 1, "teacherId": "Asha Rakesh Patil", },
  { "id": 6, "name": "Basant Nresh Das", "regId": 6, "schoolId": "1", "gender": "male", "gradeOfDisability": 1, "section": 1, "teacherId": "Rahul Ramesh Gandhi", }
]

@Component({
  selector: 'iep-assessment',
  templateUrl: './iep-assessment.component.html',
  styleUrls: ['./iep-assessment.component.scss']
})
export class IepAssessmentComponent implements OnInit, OnDestroy {
  
  displayedColumns = ['position', 'parameter', 'na', 'grade', 'score',  'goal'];
  subjectDisplayedColumns = ['position', 'subject', 'sections'];
  academic_year = '2019-2020'; //default set
  ageGroupList = [];//MASTERDATA.ageGroups;
  languageList = MASTERDATA.languages;
  gradingList = [];//MASTERDATA.grading;
  scoringList = [];//MASTERDATA.scoring;
  lovCodeObj: any = {};
  studentList = studentData;
  currentUser : any = '';
  currentStudent = {};
  questionIndexNo: number = -1;
  currentIepSession : any = {
    studentId: '',
    academicYear: '',
    iepLevel: '',
    teacherId: ''
  };
  MAIN_DATA : any[] = [];
  TREE_DATA : any[] = [];
  TRANSLATION_DATA: any = {};
  autoIepSaveTimer: any = 0;
  iepAssessmentStatusObj = MASTERDATA.iepAssessmentStatus;
  academicYearList : any[] = [];
  domainList: any[];
  subjectList: any[];
  isSubmitBtnEnable: boolean = true;
  @ViewChildren('goal') goal: QueryList<any>;
  @ViewChildren('grade') grade: ElementRef;
  @ViewChildren('scoringType') scoringType: QueryList<any>;
  @ViewChild('iepLevelDropdown', {static: true}) iepLevelDropdown;
  iepAssessmentForm: FormGroup;
  getTeacherInfoInSuccess : any = '';
  isCreateAssessmentBtnDisabled: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _translateService: TranslateService, 
    private utilsService: UtilsService,
    private apiService: ApiService,
    public router: Router,
    private authenticateService: AuthenticationService) {
      

      this.activatedRoute.data.subscribe(resp => {
        console.log(resp)
        this.processedIEPMasterData(resp.iepAssessmentMasterData[0]) // IEP Masters list
        this.processStudentMasterData(resp.iepAssessmentMasterData[1]) // Student list
        
        this.academicYearList = resp.iepAssessmentMasterData[2] //Academic Year
        this.subjectList = resp.iepAssessmentMasterData[3] //Subject List
        this.ageGroupList = resp.iepAssessmentMasterData[4] //Iep Level List
        this.gradingList = resp.iepAssessmentMasterData[5] //Grading List
        this.scoringList = resp.iepAssessmentMasterData[6] //Scoring List

        this.lovCodeObj['gradingNSO'] = resp.iepAssessmentMasterData[7] //Scoring List
        this.lovCodeObj['gradingDPI'] = resp.iepAssessmentMasterData[8] //Scoring List
        this.lovCodeObj['scoringPercent'] = resp.iepAssessmentMasterData[9] //Scoring List
        this.lovCodeObj['scoringRSO'] = resp.iepAssessmentMasterData[10] //Scoring List
        this.lovCodeObj['scoringSubject'] = resp.iepAssessmentMasterData[11] //Scoring List
      }, error => {
        alert('Issue with network')
      })
      this.currentUser = this.authenticateService.currentUserValue;
    this._fuseTranslationLoaderService.loadTranslations(english, hindi, marathi);
    // Use a language
    //this._translateService.use('en');
    this.resetIepAssessmentForm();
    //this.domainList = this.getDataForDomain(MASTERDATA.nodeType.domain);
    //this.renderDomainData();
  }
  //Reseting the form values..
  resetIepAssessmentForm(){

    let teacherInfo_Id; 
    if((this.currentUser.teacherInfo === undefined) || (this.currentUser.teacherInfo === null)){
      teacherInfo_Id = this.utilsService.emptyUUID();
    }
    else{
      teacherInfo_Id =  this.currentUser.teacherInfo.id;
    }
   
    this.clearAutoSaveTimer();
    this.isCreateAssessmentBtnDisabled = true;
    this.iepAssessmentForm = this.fb.group({
      selectedStudentId: [''],
      selectedAcademicYear: [this.getCurrentAcademicYear()],
      id: [this.utilsService.emptyUUID()],
      studentId: [''],
      //teacherId: [this.currentUser.teacherInfo.id],
      teacherId: [teacherInfo_Id],
      iepStatus: [this.iepAssessmentStatusObj['1']],
      iepLevel: [''],
      academicYear: [''],
      schoolId: [this.currentUser.schoolInfo.id],
      preferredLanguage: [''],
      getTeacherNameInfo: [''],
      isViewOnly: [true],
    });
  }

  //Get current academic year from academicYearList..  
  getCurrentAcademicYear(){
    const academicYearList = this.academicYearList;
    let currentAcademicYear = null;
    for (let i = 0; i < academicYearList.length; i += 1){
      if (academicYearList[i].lovOtherDetails === '1'){
        currentAcademicYear = academicYearList[i].lovCode;
        break
      }
    }
    return currentAcademicYear;
  }

  //iepAssessment form controls
  get iepAssessmentFormControls() {
    return this.iepAssessmentForm.controls;
  }

  // get isViewOnly value in isViewOnlyFormControlValue..
  get isViewOnlyFormControlValue(){
    return this.iepAssessmentForm.controls.isViewOnly.value;
  }

  //Clear auto save timer logic...
  clearAutoSaveTimer(){
    clearTimeout(this.autoIepSaveTimer);
    this.autoIepSaveTimer = 0;
    console.log('Cleared Timeout');
    
  }

  //Setup auto save timer logic for autosaving iep...
  setupAutoSaveTimer(){
    if (this.autoIepSaveTimer != 0){
      return
    }
    this.autoIepSaveTimer = setTimeout( () => {
      this.submitStudentIepAssessment('Draft', 'autosavetrigger');
    }, 1000*60*3)
    console.log('Timer start ' + this.autoIepSaveTimer);
    
  }

  //decrypting student master data object..
  processStudentMasterData(studentData){
    this.studentList = [...[]]
    for (let studentObj of studentData){
      if (['', null].indexOf(studentObj.deletedOn) == -1){
        continue
      }
      studentObj.firstName = this.utilsService.decryptData(studentObj.firstName);
      studentObj.middleName = this.utilsService.decryptData(studentObj.middleName);
      studentObj.lastName = this.utilsService.decryptData(studentObj.lastName);
      this.studentList.push(studentObj);
    }
    this.studentList.sort(this.utilsService.fieldSorter(['firstName'])); 
  }

  //Processing MAIN_DATA array list to render relevent data...
  processedIEPMasterData(iepMasterData){
    //TREE_DATA = [...[]]
    this.MAIN_DATA = [...[]];
    this.TRANSLATION_DATA = {...{}};
    for (let iepObj of iepMasterData){
      if (['', null].indexOf(iepObj.m_iepMasterInfo.deletedOn) == -1){
        continue
      }
      iepObj.m_iepMasterInfo.parentid = iepObj.m_iepMasterInfo.parentNodeId == this.utilsService.emptyUUID() ? null : iepObj.m_iepMasterInfo.parentNodeId;
      //TREE_DATA.push(iepObj.m_iepMasterInfo)
      iepObj.m_iepMasterInfo.translations = [...iepObj.m_TranslationInfo];
      this.MAIN_DATA.push(iepObj.m_iepMasterInfo);
    }
    this.setupTranslationReferenceObj();
  }
  // Setting up TRANSLATION_DATA for translation in IEP.. this is use for translation of iep data...
  setupTranslationReferenceObj(){
    for (let i = 0 , count = this.MAIN_DATA.length; i < count; i += 1){
      this.TRANSLATION_DATA[this.MAIN_DATA[i].id] = [...this.MAIN_DATA[i].translations];
    }
  }
  //get copy of MAIN_DATA
  getMainIepMasterData(){
    return this.MAIN_DATA.slice();
  }

  //get copy of TREE_DATA
  getTreeIepMasterData(){
    return this.TREE_DATA.slice();
  }

  //get copy of domainList
  get domainItemList(){
    
    try{
      
      return this.domainList.slice();
    } catch(e){
      return [];
    }
  }

  //On Preferred language dropdown change function...
  onPrefferedLangChange(item){
    enum LanguageOption {
      'en'= 1,
      'hi'= 2,
      'mr'= 3,
    }
    const langId = item.value;
    for (let i = this.domainList.length - 1; i > -1; i -= 1){
      const domainRec = this.domainList[i];
      domainRec.item = this.getTranslationText(domainRec.id, langId);

      for (let j = domainRec.subDomain.length - 1; j > -1; j -= 1){
        const questions = domainRec.subDomain[j].questions;
        domainRec.subDomain[j].header = this.getTranslationText(domainRec.subDomain[j].parameterNodeId, langId);
        for (let k = questions.length - 1; k > -1; k -= 1){
          questions[k].item = this.getTranslationText(questions[k].parameterNodeId, langId);
          questions[k].gradingList = this.getGradingScoringList(domainRec.gradingType, langId);
          questions[k].scoringList = this.getGradingScoringList(domainRec.scoringType, langId);
        }
        domainRec.subDomain[j].questions = [...questions];
      }
      
      this.domainList[i] = {...domainRec};
    }
    
    this._translateService.use(LanguageOption[langId]);
  }

  //Get Translation Text from global TRANSLATION_DATA list...
  getTranslationText(id: string, langId: string){
    const translationList = this.TRANSLATION_DATA[id];
    if (translationList === undefined){
      return '';
    }
    for (let i = 0, count = translationList.length; i < count; i += 1){
      if (translationList[i].languageId == +langId){
        return translationList[i].description;
      }
    }
  }

  //update the domainList based on data like sub domain, questions...
  renderDomainData() {
    this.questionIndexNo = -1;
    this.domainList.forEach(domainItem => {
      domainItem['questionCount'] = this.getQuestionsFromDomain(domainItem.id).length;
      domainItem['appearedQuestionCount'] = 0;
      domainItem['selectedGoalsCount'] = 0;
      let questionData = [];

      if (this.getChildTypeOfDomain(domainItem.id) == MASTERDATA.nodeType.subDomain) {

        let subDomainList = this.getDataForDomain(MASTERDATA.nodeType.subDomain, [domainItem.id]);

        subDomainList.forEach(subDomainItem => {
          
          if (this.getChildTypeOfDomain(subDomainItem.id) == MASTERDATA.nodeType.subSubDomain) {

            let subSubDomainList = this.getDataForDomain(MASTERDATA.nodeType.subSubDomain, [subDomainItem.id]);

            subSubDomainList.forEach(subSubDomainItem => {
              questionData.push(this.createSubDomainObject(subSubDomainItem.id, `${subSubDomainItem.bulletText}. ${subSubDomainItem.item} [${subDomainItem.bulletText}. ${subDomainItem.item}]`, domainItem));
            });

          } else questionData.push(this.createSubDomainObject(subDomainItem.id, `${subDomainItem.bulletText}. ${subDomainItem.item}`, domainItem));

        });
      } else questionData.push(this.createSubDomainObject(domainItem.id, null, domainItem));

      domainItem['subDomain'] = questionData;
    });
  }

  /*renderDomainData() {
    this.questionIndexNo = -1;
    for (let i = 0 , count = this.domainList.length; i < count; i += 1){
      const domainItem = {...this.domainList[i]};
      const questionData = [];
      domainItem.questionCount = this.getQuestionsFromDomain(domainItem.id).length;
      if (this.getChildTypeOfDomain(domainItem.id) == MASTERDATA.nodeType.subDomain) {
        const subDomainList = this.getDataForDomain(MASTERDATA.nodeType.subDomain, [domainItem.id]);

        subDomainList.forEach(subDomainItem => {

          if (this.getChildTypeOfDomain(subDomainItem.id) == MASTERDATA.nodeType.subSubDomain) {

            let subSubDomainList = this.getDataForDomain(MASTERDATA.nodeType.subSubDomain, [subDomainItem.id]);

            subSubDomainList.forEach(subSubDomainItem => {
              questionData.push(this.createSubDomainObject(subSubDomainItem.id, `${subSubDomainItem.bulletText}. ${subSubDomainItem.item} [${subDomainItem.bulletText}. ${subDomainItem.item}]`, domainItem));
            });

          } else questionData.push(this.createSubDomainObject(subDomainItem.id, `${subDomainItem.bulletText}. ${subDomainItem.item}`, domainItem));

        });
      } else questionData.push(this.createSubDomainObject(domainItem.id, null, domainItem));
      this.domainList[i] = {...domainItem};
    }
  }*/

  //build subdomain object from parentid and domain item...
  createSubDomainObject(parentId, header: String, domainItem): {} {
    const subDomainObject = {};
    subDomainObject['header'] = header;
    subDomainObject['parameterNodeId'] = parentId;
    subDomainObject['questions'] = this.getQuestionsFromDomain(parentId);
    subDomainObject['selectedGoalsCount'] = 0;
    subDomainObject['questions'].forEach(questionItem => {
      this.questionIndexNo += 1;
      questionItem['indexNo'] = this.questionIndexNo;
      questionItem['gradevalue'] = null;
      questionItem['isNA'] = false;
      questionItem['isModified'] = true;
      if (domainItem.gradingType)
        //questionItem['gradingList'] = this.gradingList.filter(e => { return e.id == domainItem.gradingType })[0].list;
        try{
          questionItem['gradingList'] = this.getGradingScoringList(domainItem.gradingType, '1');
        } catch(e){
          questionItem['gradingList'] = []
        }
        
        
      if (domainItem.scoringType)
        //questionItem['scoringList'] = this.scoringList.filter(e => { return e.id == domainItem.scoringType })[0].list;
        try{
          questionItem['scoringList'] = this.getGradingScoringList(domainItem.scoringType, '1');
        } catch(e){
          questionItem['scoringList'] = [];
        }
        
        
    });
    return subDomainObject;
  }

  //grading list option based on language...
  getGradingScoringList(type: string, langId: string){
    const optionList = []
    if (this.lovCodeObj[type] === undefined){
      return [];
    }
    for (let i = 0; i < this.lovCodeObj[type].length; i += 1){
      if (this.lovCodeObj[type][i].langId != langId){
        continue
      }
      optionList.push(this.lovCodeObj[type][i]);
    }
    return optionList.sort(this.utilsService.fieldSorter(['displayOrder']));
  }

  //on student selection changed...
  studentSelectionChanged(studentId) {
    this.isCreateAssessmentBtnDisabled = true;
    //this.currentStudent = this.studentList.find(element => element.id == studentId);
    //this.currentIepSession.studentId = studentId;
    //this.iepAssessmentForm.patchValue({
    //  studentId: studentId
    //});
  }

  //on academic year selection changed...
  academicYearSelectionChanged(academicYear: string){
    this.isCreateAssessmentBtnDisabled = true;
    this.iepAssessmentForm.patchValue({
      academicYear: academicYear
    });
  }

  //iep level selection changed...
  iepLevelSelectionChanged($event: any){
    if (confirm('Do you want to create ' +  $event.source.triggerValue + ' level of IEP?')){

    } else {
      this.iepAssessmentForm.patchValue({
        iepLevel: ''
      })
      return false;
    }
    // this.currentIepSession.iepLevel = iepLevel;
    this.iepAssessmentForm.patchValue({
      iepStatus: 'New'
    })
    
    this.TREE_DATA = this.filterIepMasterData();
    this.domainList = this.getDataForDomain(MASTERDATA.nodeType.domain);
    this.renderDomainData();
    this.submitStudentIepAssessment('Draft');
  }

  //get child type of domain...
  getChildTypeOfDomain(domainId: string) {
    let questionData = this.getDataForDomain(MASTERDATA.nodeType.question, [domainId]);
    if (questionData.length > 0) return MASTERDATA.nodeType.question;
    let subDomainData = this.getDataForDomain(MASTERDATA.nodeType.subDomain, [domainId]);
    if (subDomainData.length > 0) return MASTERDATA.nodeType.subDomain;
    let subSubDomainData = this.getDataForDomain(MASTERDATA.nodeType.subSubDomain, [domainId]);
    if (subSubDomainData.length > 0) return MASTERDATA.nodeType.subSubDomain;
  }

  // get question from domain...
  getQuestionsFromDomain(domainId: string) {
    let parentId = this.getAllParentIdsOfDomain(this.getTreeIepMasterData(), domainId);
    let data = this.getDataForDomain(MASTERDATA.nodeType.question, parentId);
    return data;
  }

  
  getAllParentIdsOfDomain(array, domainId) {
    let parentIds = []
    parentIds.push(domainId);
    let subDomainData = this.getDataForDomain(MASTERDATA.nodeType.subDomain, parentIds);
    subDomainData.forEach(element => { parentIds.push(element.id); });
    let SubSubDomainData = this.getDataForDomain(MASTERDATA.nodeType.subSubDomain, parentIds);
    SubSubDomainData.forEach(element => { parentIds.push(element.id); });
    return parentIds;
  }

  filterIepMasterData(){
    this.domainList = [...[]];
    const filteredData = [];
    const iepLevel = this.iepAssessmentForm.controls.iepLevel.value;
    const iepMainData = this.getMainIepMasterData();
    for (let i = 0, count = iepMainData.length; i < count; i += 1){
      if (iepMainData[i].lovCode != null && iepLevel !== '' && (iepMainData[i].lovCode == iepLevel || iepMainData[i].lovCode == 'global')){
        filteredData.push({...iepMainData[i]});
      }
    }
    return [...filteredData];
    //this.MAIN_DATA.filter(element =>{ return element.lovCode != null && element.lovCode == this.iepAssessmentForm.controls.iepLevel.value })
  }

  getDataForDomain(domain: string, parentid?: string[]) {
    let out = [];
    const iepLevel = this.iepAssessmentForm.controls.iepLevel.value;
    this.getTreeIepMasterData().forEach(element => {
      if (domain == element.nodeType && iepLevel !== '' && (iepLevel == element['lovCode'] || element.lovCode == 'global') ) {
        if (!parentid) {
          out.push(element);
        } else if (parentid.indexOf(element.parentid) > -1) {
          out.push(element);
        }
      }
    });
    out = this.utilsService.sortDataByKey('displayOrder', out);
      
    return out;
  }

  getFullName(item: any): string {
    if (item.firstName === undefined) return '';
    let fullName = "";
    if (item.firstName != null)
      fullName += item.firstName + ' ';
    if (item.middleName != null)
      fullName += item.middleName + ' ';
    if (item.lastName != null)
      fullName += item.lastName;

    fullName += ' (' + item.regId + ')';
    return fullName;
  }

  getStudentFullName(): string {
    const selectedStudentId = this.iepAssessmentFormControls.studentId.value;

    for (let i = this.studentList.length - 1; i > -1; i -= 1){
      if (this.studentList[i].id == selectedStudentId){
        let fullName = "";
      if (this.studentList[i].firstName != null)
        fullName += this.studentList[i].firstName + ' ';
      if (this.studentList[i].middleName != null)
        fullName += this.studentList[i].middleName + ' ';
      if (this.studentList[i].lastName != null)
        fullName += this.studentList[i].lastName;

      fullName += ' (' + this.studentList[i].regId + ')';
      return fullName;
      }
    }

    
    
  }

  getIepLevel(){
    return this.iepAssessmentFormControls.iepLevel.value;
  }

  getIepStatus(){
    return this.iepAssessmentFormControls.iepStatus.value;
  }

  getAcademicYear(){
    return this.iepAssessmentFormControls.academicYear.value;
  }

  //getTeacherName(getTeacherInfoSuccess='false'){
    getTeacherName(){

    //return this.currentUser.userInfo.firstName + ' ' + this.currentUser.userInfo.lastName + ' (' + this.currentUser.userInfo.userName + ')';
    // if(this.currentUser.teacherInfo !== null){
    //   return this.currentUser.userInfo.firstName + ' ' + this.currentUser.userInfo.lastName + ' (' + this.currentUser.userInfo.userName + ')';
    // }
    // else{
    //   if(getTeacherInfoSuccess === 'true'){
    //     return this.getTeacherInfoInSuccess; 
    //   }
    //   else{
    //     return "";
    //   }
    // }

    // this.iepAssessmentForm.patchValue({
    //   getTeacherNameInfo: iepAssessmentRecList[0].teacherInfo.firstName + ' ' + iepAssessmentRecList[0].teacherInfo.lastName
    // });


    let getTeacherNameInfo_ ;
    if(this.currentUser.teacherInfo !== null){
      getTeacherNameInfo_ =  this.currentUser.userInfo.firstName + ' ' + this.currentUser.userInfo.lastName + ' (' + this.currentUser.userInfo.userName + ')';
    }
    else{
      if(this.iepAssessmentFormControls.getTeacherNameInfo.value !== ''){
        getTeacherNameInfo_  = this.iepAssessmentFormControls.getTeacherNameInfo.value;
      }
      else{
        getTeacherNameInfo_ = "" ;
      }
    }
    return getTeacherNameInfo_;
    
  }

  toggleDraftButton(){
    if (this.domainList !== undefined && this.domainList.length === 0){
      return false;
    }
    if(this.currentUser.userInfo.userTypeId !== 5){
      return false;
    }
    return ['New', 'Draft'].indexOf(this.iepAssessmentFormControls.iepStatus.value) > -1 ? true : false;
  }

  toggleSubmitButton(){
    if (this.domainList !== undefined && this.domainList.length === 0){
      return false;
    }
    if(this.currentUser.userInfo.userTypeId !== 5){
      return false;
    }
    return this.iepAssessmentFormControls.iepStatus.value === 'Draft' ? true : false;
  }

  toggleResetButton(){
    if (this.domainList !== undefined && this.domainList.length === 0){
      return false;
    }
    if(this.currentUser.userInfo.userTypeId !== 5){
      return false;
    }
    return ['New', 'Draft'].indexOf(this.iepAssessmentFormControls.iepStatus.value) > -1 ? true : false;
  }

  toggleSubmitBtnEnable(){
    let isSubmitBtnDisable = false;
    this.domainList.forEach( domainEle => {
      
      
      for (const subDomain of domainEle.subDomain){
        for (const question of subDomain.questions){
          if (question.lovCode === 'global'){
            if ( [null, undefined, '', 0].indexOf(question.scoringType) > -1){
              isSubmitBtnDisable = true;
            }
          } else if (question.isNA === false && [null, undefined, '', 0].indexOf(question.gradevalue) > -1){
            isSubmitBtnDisable = true;
          }
          
        }
      }
      
      
    })
   
    return isSubmitBtnDisable;
  }

  resetIepForm(){
    this.iepAssessmentForm.patchValue({
      iepLevel: '',
      id: this.utilsService.emptyUUID(),
      iepStatus: '',
      preferredLanguage: ''
    })
  }

  resetIepAssessmentFormUI(){
    if (confirm('Do you want to Reset IEP Assessment details?\n\nPlease Note: All current IEP details will be DELETED and cannot be recovered later.')){
      const iepId = this.iepAssessmentFormControls.id.value;
      if (iepId !== this.utilsService.emptyUUID()){
        this.apiService.getDataByIdFromServer('resetIEPAssementDetailData', { iepAssementId : iepId } ).subscribe((iepResponse : any[]) => {
          this.updateIepAssessmentUI(iepResponse);
        });
      }
      
    }
  }

  toggleIepLevelDisabled(){
    if(this.currentUser.userInfo.userTypeId !== 5){
      return true;
    }

    return this.isCreateAssessmentBtnDisabled ? true : false;
    
    if (this.iepAssessmentFormControls.studentId.value === this.utilsService.emptyUUID() || this.iepAssessmentFormControls.academicYear.value === ''){
      return true;
    }
    if (this.domainList !== undefined && this.domainList.length === 0){
      return false;
    }
    return ['New', ''].indexOf(this.iepAssessmentFormControls.iepStatus.value) == -1 ? true : false;
  }

  toggleIepAssessmentFormFreez(){
    if(this.currentUser.userInfo.userTypeId !== 5){
      return true;
    }
    return ['New', '', 'Draft'].indexOf(this.iepAssessmentFormControls.iepStatus.value) == -1 ? true : false;
  }

  isViewMode(){
    if(this.currentUser.userInfo.userTypeId !== 5){
      return true;
    }
    return ['New', '', 'Draft'].indexOf(this.iepAssessmentFormControls.iepStatus.value) == -1 ? true : false;
  }

  toggleScoringTypeFreez(element: any){
    if (['New', '', 'Draft'].indexOf(this.iepAssessmentFormControls.iepStatus.value) == -1){
      return true;
    }
    return element.isNA;
  }

  isWarningColorForRow(row: any){
    if (['New', ''].indexOf(this.iepAssessmentFormControls.iepStatus.value) > -1){
      return false;
    }
    return row.isNA === false  && [null, undefined, '', 0].indexOf(row.gradevalue) > -1;
  }

  isGoalSelectedForRowColor(row){
    return row.isGoalSelected === true ? true : false;
  }

  createNewAssessment(){
    this.utilsService.showSuccess('Please select IEP Level to create New IEP assessment.', 'Important Note')
    this.iepLevelDropdown.open();
  }

  getStudentAssessment(){
    this.isCreateAssessmentBtnDisabled = true;
    if (this.iepAssessmentFormControls.selectedStudentId.value == ''){
      this.utilsService.showError('Please select student.', 'Invalid selection');
      return false;
    }

    if (this.iepAssessmentFormControls.selectedAcademicYear.value == ''){
      this.utilsService.showError('Please select Academic Year.', 'Invalid selection');
      return false;
    }
    this.utilsService.cleartoastr();
    this.clearAutoSaveTimer();
    this.apiService.getDataByIdFromServer('getIEPStudentAssesementData', { 
      //studentId: this.iepAssessmentFormControls.selectedStudentId.value,  academicYear: this.iepAssessmentFormControls.selectedAcademicYear.value})
      studentId: this.iepAssessmentFormControls.selectedStudentId.value,  academicYear: this.iepAssessmentFormControls.selectedAcademicYear.value, state: 'iep' })
      .subscribe((iepAssessmentRecList : any[]) => {
        this.domainList = [...[]];
        if (iepAssessmentRecList.length == 0){
          //this.renderDomainData();
          this.resetIepForm();
          this.iepAssessmentForm.patchValue({
            studentId: this.iepAssessmentFormControls.selectedStudentId.value,
            academicYear: this.iepAssessmentFormControls.selectedAcademicYear.value
          })
          this.isCreateAssessmentBtnDisabled = false;
          this.utilsService.showSuccess('No IEP started, please click Create Assessment button to start IEP assessment', 'Important Note')
          return false;
        }
        else{          
          //this.getTeacherInfoInSuccess = iepAssessmentRecList[0].teacherInfo.firstName + ' ' + iepAssessmentRecList[0].teacherInfo.lastName;
          
          //console.log("teacherInfoIn Success");
          //this.getTeacherName('true');

          this.iepAssessmentForm.patchValue({
            getTeacherNameInfo: iepAssessmentRecList[0].teacherInfo.firstName + ' ' + iepAssessmentRecList[0].teacherInfo.lastName
          });

        }
        this.updateIepAssessmentUI(iepAssessmentRecList);
        if(iepAssessmentRecList.length > 0 && iepAssessmentRecList[0].iepStudentAssessmentInfo.state == 'iep' && iepAssessmentRecList[0].iepStudentAssessmentInfo.status == 'Submitted') {
          this.utilsService.showSuccess("Below Assessment has been Submitted. School Admin will review and Approve or ask for Re-work", 'Important Notice');
        }
      })
  }

  updateIepAssessmentUI(iepAssessmentRecList: any[], autosavetrigger? : string){
    const iepAssessmentRec = iepAssessmentRecList[0];
    const iepStudentAssessmentInfo = iepAssessmentRec.iepStudentAssessmentInfo;
    
    if (autosavetrigger !== undefined){
      this.utilsService.showIepAssessmentToastrInfo(iepStudentAssessmentInfo.modifiedOn, 'Last IEP data Saved On')
      return false;
    }

    if (iepStudentAssessmentInfo.id === this.utilsService.emptyUUID()){
      this.resetIepAssessmentForm();
      
    } else {
      this.iepAssessmentForm.patchValue({
        academicYear: iepStudentAssessmentInfo.academicYear,
        iepLevel: iepStudentAssessmentInfo.ageGroup || '',
        id: iepStudentAssessmentInfo.id,
        studentId: iepStudentAssessmentInfo.studentId,
        teacherId: iepStudentAssessmentInfo.teacherId,
        schoolId: iepStudentAssessmentInfo.schoolId,
        iepStatus: iepStudentAssessmentInfo.status,
        preferredLanguage: ''
      })
  
    }

    
    this.iepAssessmentForm.patchValue({
      isViewOnly: this.isViewMode()
    });
    

    this.TREE_DATA = this.filterIepMasterData();
    this.domainList = this.getDataForDomain(MASTERDATA.nodeType.domain);
    
    const tmpRefIepDetailsParamObj = this.tmpParameterNodeIdObjFromDBRec(iepAssessmentRec.iepStudentAssessmentDetailsInfo);
    this.renderDomainData();
    for (let i = 0; i < this.domainList.length; i += 1){
      for (let j = 0; j < this.domainList[i].subDomain.length; j += 1){
        for (let k = 0; k < this.domainList[i].subDomain[j].questions.length; k += 1){
          const iepDetailsDbObj = tmpRefIepDetailsParamObj[this.domainList[i].subDomain[j].questions[k].id];
          if (!iepDetailsDbObj) {
            continue
          }
          this.domainList[i].subDomain[j].questions[k] = {...this.domainList[i].subDomain[j].questions[k], ...iepDetailsDbObj};
          const question = this.domainList[i].subDomain[j].questions[k];
          question.scoringType = iepDetailsDbObj.score;
          question.isGoalSelected = iepDetailsDbObj.isGoal;
          question.isNA = iepDetailsDbObj.isApplicable;
          
          question.gradingType = iepDetailsDbObj.gradevalue;//this.getGradeNameByValue(question.gradevalue);
          question.selectedGrade = iepDetailsDbObj.gradevalue;//this.getGradeNameByValue(question.gradevalue);
          question.isModified = false;
          if (iepDetailsDbObj.isGoal){
            this.domainList[i].selectedGoalsCount += 1;
            this.domainList[i].subDomain[j].selectedGoalsCount += 1;
          }
          if (question.isNA || [null, undefined, '', 0].indexOf(question.gradevalue) == -1){
            this.domainList[i].appearedQuestionCount += 1;
          }
          this.domainList[i].subDomain[j].questions[k] = {...question};
        }
      }

    }
    this.utilsService.showIepAssessmentToastrInfo(iepStudentAssessmentInfo.modifiedOn, 'Last IEP data Saved On')
  }

  tmpParameterNodeIdObjFromDBRec(iepStudentAssessmentDetailsInfo: any[]){
    const tempObj = {};
    iepStudentAssessmentDetailsInfo.forEach( iepDetailObj => {
      iepDetailObj.iepAssessmentDetailsRecId = iepDetailObj.id;
      tempObj[iepDetailObj.parameterNodeId] = iepDetailObj;
    });
    return tempObj;
  }

  onlyExpandPanel(matExpands, event: Event): void {
    event.stopPropagation(); // Preventing event bubbling
    matExpands.open();
  }

  ngOnInit() { 
    const stateInfo = history.state;
    // console.log("stateInfo",stateInfo);

    if(stateInfo.dashboardRedirectData !== undefined){
      console.log("stateInfo",stateInfo);
      this.iepAssessmentForm.patchValue({
        selectedAcademicYear: stateInfo.dashboardRedirectData.academicYear,
        selectedStudentId: stateInfo.dashboardRedirectData.studentId,
      });
      this.getStudentAssessment();
    }
    else{
      //console.log("stateInfo empty");
    }
    this.resetIepForm();

  }

  ngOnDestroy(){
    this.utilsService.cleartoastr();
    this.clearAutoSaveTimer();
  }

  onNAchange(event, element){
    this.goal.toArray()[element.indexNo]._checked = false;
    if (!event.checked){
      //element.isGoalSelected = tru;
      element.selectedGrade = '';
      element.gradevalue = '';
    } else {
      element.isGoalSelected = false;
      element.selectedGrade = '';
      element.gradevalue = '';
      this.scoringType.toArray()[element.indexNo].value = '';
      element.scoringType = '';
    }
    element.isModified = true;
    element.isNA = event.checked;
    setTimeout( () => this.updateSelectedGoalsCount(), 500 );
    this.setupAutoSaveTimer();
  }

  onGoalchange(event, element, subDomainObject){
    element.isGoalSelected = event.checked;
    element.isModified = true;
    setTimeout( () => this.updateSelectedGoalsCount(), 500 );
    this.setupAutoSaveTimer();
  }

  updateSelectedGoalsCount(){
    for (let i = 0 , count = this.domainList.length; i < count; i += 1){
      this.domainList[i].selectedGoalsCount = 0;
      this.domainList[i].appearedQuestionCount = 0;
      for (let j = 0, jcount = this.domainList[i].subDomain.length; j < jcount; j += 1) {
        const subDomain = this.domainList[i].subDomain[j];
        this.domainList[i].subDomain[j].selectedGoalsCount = 0;
        for (const question of subDomain.questions) {
          if (question.isGoalSelected){
            this.domainList[i].selectedGoalsCount += 1;
            this.domainList[i].subDomain[j].selectedGoalsCount += 1;
          }
          if (question.isNA || [null, undefined, '', 0].indexOf(question.gradevalue) == -1){
            this.domainList[i].appearedQuestionCount += 1;
          }
        }
      }
    }
  }

  onGradingSelection(element, event, item){
    if (item.lovCode === 'S' || item.lovCode === 'P'){
      const scoringType = element.scoringList[0].lovType;
      this.scoringType.toArray()[element.indexNo].value = scoringType === 'scoringRSO' ? 'S' : '36-70';
      element.scoringType = scoringType === 'scoringRSO' ? 'S' : '36-70';
      this.scoringType.toArray()[element.indexNo].disabled = false;
      this.scoringType.toArray()[element.indexNo].open();
    } else {
      this.scoringType.toArray()[element.indexNo].value = '';
      this.scoringType.toArray()[element.indexNo].disabled = true;
      element.scoringType = '';
    }
    //element.gradingType
    element.gradevalue = item.lovCode;//this.getGradeValueByName(item);
    element.isModified = true;
    setTimeout( () => this.updateSelectedGoalsCount(), 500 );
    this.setupAutoSaveTimer();
  }

  onScoringSelection(element, event){
    element.scoringType = event.value;
    element.isModified = true;
    if (element.lovCode === 'global'){
      element.isGoalSelected = true;
    }
    setTimeout( () => this.updateSelectedGoalsCount(), 500 );
    this.setupAutoSaveTimer();
  }

  getSubDomainSelectedGoals(subDomainObject){
    let selectedGoals = 0;
    for (const question of subDomainObject.questions){
      if (question.isGoalSelected) selectedGoals += 1;
      
    }
    return selectedGoals;
  }

  getDomainSelectedGoals(domainItem){
    let selectedGoals = 0;
    
    
    for (const subDomain of domainItem.subDomain){
      for (const question of subDomain.questions) {
        if (question.isGoalSelected) selectedGoals += 1;
      }
    }
    return selectedGoals;
  }

  getDomainQuestionsAppearedCount(domainItem){
    let appearedQuestions = 0;
    
    for (const subDomain of domainItem.subDomain){
      for (const question of subDomain.questions) {
        if (question.isNA || [null, undefined, '', 0].indexOf(question.gradevalue) == -1) appearedQuestions += 1;
      }
    }
    return appearedQuestions;
  }

  submitStudentIepAssessment(status: string, autosavetrigger?: string){
    this.addUpdateStudentIepAssessment(status, autosavetrigger);
  }

  // Add / Update Server call to IEP data
  addUpdateStudentIepAssessment(status: string, autosavetrigger?: string){
    this.isCreateAssessmentBtnDisabled = true;
    this.clearAutoSaveTimer();
    const iepAssessmentRec = [];
    const iepAssessmentHeaderObj = {
      "id": this.iepAssessmentForm.controls.id.value,
      "studentId": this.iepAssessmentForm.controls.studentId.value,
      "academicYear": this.iepAssessmentForm.controls.academicYear.value,
      "ageGroup": this.iepAssessmentForm.controls.iepLevel.value,
      "teacherId": this.iepAssessmentForm.controls.teacherId.value,
      "status": status,
      //"approvedBy": "00000000-0000-0000-0000-000000000000",
      //"approvedOn": "",
      "createdBy": this.currentUser.userInfo.id,
      "state": "iep",
      "schoolId": this.iepAssessmentForm.controls.schoolId.value,
      'districtId': this.currentUser.districtInfo.id,
      "modifiedBy": this.currentUser.userInfo.id
    };
    const iepStudentAssessmentDetailsInfo = [];
    if (this.currentUser.userInfo.userTypeId !== 5){
      return false;
    }

    if ([this.utilsService.emptyUUID(), null].indexOf(iepAssessmentHeaderObj.teacherId) > -1){
      this.utilsService.showError('Sorry, Due to some technical issue, We are not able to save IEP Assessment. Kindly logout and login again.', 'IEP Not saved')
      return false;
    }

    if ([this.utilsService.emptyUUID(), null].indexOf(iepAssessmentHeaderObj.schoolId) > -1){
      this.utilsService.showError('Sorry, Due to some technical issue, We are not able to save IEP Assessment. Kindly logout and login again.', 'IEP Not saved')
      return false;
    }

    this.domainList.forEach( domainEle => {
      
      
      for (const subDomain of domainEle.subDomain){
        for (const question of subDomain.questions){
         if (!question.isModified) {
           continue
         }
          const iepAssessmentDetailsObj = {
            "id": question.iepAssessmentDetailsRecId || this.utilsService.emptyUUID(),
            "iepAssessmentId": iepAssessmentHeaderObj.id,
            "parameterNodeId": question.parameterNodeId || question.id,
            "gradevalue": question.gradevalue || null,
            "score": question.scoringType || '',
            "modifiedBy": this.currentUser.userInfo.id,
            "isApplicable": question.isNA,
            "isGoal": question.isGoalSelected === undefined ? false : question.isGoalSelected
          }
          iepStudentAssessmentDetailsInfo.push({...iepAssessmentDetailsObj});
        }
      }
    })

    if (iepAssessmentHeaderObj.id === this.utilsService.emptyUUID() && iepStudentAssessmentDetailsInfo.length === 0){
      this.utilsService.showError('No Questions available for selected IEP Level', 'Invalid Selection');
      return false;
    } else if (iepAssessmentHeaderObj.id !== this.utilsService.emptyUUID() && iepStudentAssessmentDetailsInfo.length === 0 && iepAssessmentHeaderObj.status == 'Draft'){
      this.utilsService.showSuccess('No Changes/Updates Found. ', 'IEP Data');
      return false;
    }
    iepAssessmentRec.push({
      iepStudentAssessmentInfo: iepAssessmentHeaderObj,
      iepStudentAssessmentDetailsInfo: iepStudentAssessmentDetailsInfo});
      this.apiService.addUpdateRecordToServer(iepAssessmentRec, 'saveIEPStudentAssementData').subscribe(iepResponse => {
        const iepRespObj = iepResponse.lstIEPStudentAssement_Detail
        this.updateIepAssessmentUI(iepRespObj, autosavetrigger);
        if (iepRespObj.length > 0 && iepRespObj[0].iepStudentAssessmentInfo.state == 'iep' && iepRespObj[0].iepStudentAssessmentInfo.status == 'Draft'){
          this.utilsService.showSuccess('Assessment successfully saved as Draft.', 'Success');
        } else if(iepRespObj.length > 0 && iepRespObj[0].iepStudentAssessmentInfo.state == 'iep' && iepRespObj[0].iepStudentAssessmentInfo.status == 'Submitted') {
          this.utilsService.showSuccess("Assessment has been submitted for Approval. You can't do any more changes in the below assessment. Thank you!", 'Success');
        }
      })
  }

  getSubjectSectionList(element){
    return element.scoringList.filter(selement => element.validLovCodes.split(';').indexOf(selement.lovCode) > -1 );
  }

  //Get gradevalue by name from Masterdata object..
  getGradeValueByName(name: string){
    for (const gradevalue in MASTERDATA.gradeValueObj){
      if (MASTERDATA.gradeValueObj[gradevalue] == name){
        return gradevalue;
      }
    }
  }

  //Get gradeName by value from MASTERDATA object
  getGradeNameByValue(value: any){
    for (const gradevalue in MASTERDATA.gradeValueObj){
      if (gradevalue == value){
        return MASTERDATA.gradeValueObj[gradevalue];
      }
    }
  }

}
