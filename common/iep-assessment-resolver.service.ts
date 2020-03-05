import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin } from 'rxjs';
import { UtilsService } from 'app/_services/utils.service';
import { OfflinDBService } from 'app/offlineDB/offlineDB.service';
import { ApiService } from 'app/_services/api.service';

@Injectable()
export class IepAssessmentResolverService implements Resolve<any> {

  constructor(private utilsService: UtilsService,
              private apiService: ApiService, 
              private offlineDbService: OfflinDBService) { }

  resolve(){
    const getCurrentUserInfo = JSON.parse(this.utilsService.getCurrentUserObj());
    const teacherData_RequestObj = {};
    if (getCurrentUserInfo.userInfo.userTypeId !== undefined && getCurrentUserInfo.userInfo.userTypeId === 5) {
      teacherData_RequestObj['TeacherID'] = getCurrentUserInfo.teacherInfo.id;
    } else if (getCurrentUserInfo.userInfo.userTypeId !== undefined && getCurrentUserInfo.userInfo.userTypeId === 3) {
      teacherData_RequestObj['SchoolID'] = getCurrentUserInfo.userInfo.schoolId;
    }
    
    const studentList = this.apiService.getMastersDataFromServer('getStudents', {...teacherData_RequestObj, ModifiedDate: new Date('1970-01-01').format()}).toPromise();
    const iepMasterDataList = this.offlineDbService.getModifiedOnFromOfflineRecs('iep_masters').then(_ => { return this.apiService.getMastersDataFromServer('getIEPMasterData').toPromise() });
    const academicYearList = this.apiService.getMastersDataFromServer('getLOVData', {'LOVType': 'academicYear'}).toPromise();
    const subjectList = this.apiService.getMastersDataFromServer('getLOVData', {'LOVType': 'subject'}).toPromise();
    
    const iepLevelList = this.apiService.getMastersDataFromServer('getLOVData', {'LOVType': 'ieplevel'}).toPromise();
    const gradingTypeList = this.apiService.getMastersDataFromServer('getLOVData', {'LOVType': 'gradingType'}).toPromise();
    const scoringTypeList = this.apiService.getMastersDataFromServer('getLOVData', {'LOVType': 'scoringType'}).toPromise();

    const gradingNSOList = this.apiService.getMastersDataFromServer('getLOVData', {'LOVType': 'gradingNSO'}).toPromise();
    const gradingDPIList = this.apiService.getMastersDataFromServer('getLOVData', {'LOVType': 'gradingDPI'}).toPromise();
    
    const scoringPercentList = this.apiService.getMastersDataFromServer('getLOVData', {'LOVType': 'scoringPercent'}).toPromise();
    const scoringRSOList = this.apiService.getMastersDataFromServer('getLOVData', {'LOVType': 'scoringRSO'}).toPromise();
    const scoringSubjectList = this.apiService.getMastersDataFromServer('getLOVData', {'LOVType': 'scoringSubject'}).toPromise();

    return forkJoin([iepMasterDataList, studentList, academicYearList, subjectList, iepLevelList, gradingTypeList, scoringTypeList,
      gradingNSOList, gradingDPIList, scoringPercentList, scoringRSOList, scoringSubjectList])
  }
}
