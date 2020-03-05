import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';
import { NgxSpinnerModule } from "ngx-spinner";
import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';
import { ToastrModule } from 'ngx-toastr';


import { AppComponent } from 'app/app.component';
import { OfflinDBService } from './offlineDB/offlineDB.service';

import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';

import { EncryptDecryptService } from './_services/encrypt-decrypt.service';
import { ApiService } from './_services/api.service';
import { UtilsService } from './_services/utils.service';

/* masters modules imports*/
import { StatesModule } from './main/masters/states/states.module';
import { DistrictModule } from 'app/main/masters/district/district.module';
import { TeacherModule } from 'app/main/masters/teacher/teacher.module';
import { SchoolModule } from 'app/main/masters/school/school.module';
import { StudentModule } from './main/masters/student/student.module';
import { IepMasterModule } from './main/masters/iep-master/iep-master.module';

/* dashboards modules imports*/
import { DashboardTeacherModule } from './main/dashboards/dashboard-teacher/dashboard-teacher.module';
import { DashboardSchoolModule } from './main/dashboards/dashboard-school/dashboard-school.module';
import { DashboardDistrictModule } from './main/dashboards/dashboard-district/dashboard-district.module';
import { DashboardStateModule } from './main/dashboards/dashboard-state/dashboard-state.module';
import { DashboardAdminModule } from './main/dashboards/dashboard-admin/dashboard-admin.module';

/* other modules*/
import { UserManagementModule } from './main/user-management/user-management.module';
import { IepAssessmentModule } from './main/iep-assessment/iep-assessment.module';
import { GoalMonitoringModule } from './main/goal-monitoring/goal-monitoring.module';
import { ChangePasswordModule } from './main/change-password/change-password.module';

import { DistrictResolverService } from './main/masters/district/district-resolver.service';
import { SchoolResolverService } from './main/masters/school/school-resolver.service';
import { TeacherResolverService } from './main/masters/teacher/teacher-resolver.service';
import { StudentResolverService } from './main/masters/student/student-resolver.service';
import { UserManagementResolverService } from './main/user-management/user-management-resolver.service';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { StatesResolverService } from './main/masters/states/states-resolver.service';
import { IepAssessmentResolverService } from './main/iep-assessment/iep-assessment-resolver.service';
import { DashboardTeacherResolverService } from './main/dashboards/dashboard-teacher/dashboard-teacher-resolver.service';
import { DashboardSchoolResolverService } from './main/dashboards/dashboard-school/dashboard-school-resolver.service';
import { DashboardDistrictResolverService } from './main/dashboards/dashboard-district/dashboard-district-resolver.service';
import { IepMasterResolverService } from './main/masters/iep-master/iep-master-resolver.service';
import { DashboardStateResolverService } from './main/dashboards/dashboard-state/dashboard-state-resolver.service';
import { GoalMonitoringResolverService } from './main/goal-monitoring/goal-monitoring-resolver.service';
import { MAT_DATE_LOCALE } from '@angular/material';






// import { MatDialogModule, MatDialog } from '@angular/material';

const appRoutes: Routes = [
    {
        path: 'pages',
        loadChildren: './main/pages/pages.module#PagesModule'
    },
    /* Masters*/
    {
        path: 'masters-states',
        redirectTo: 'masters-states'
    },
    {
        path: 'masters-district',
        redirectTo: 'masters-district'
    },
    {
        path: 'masters-teacher',
        redirectTo: 'masters-teacher'
    },
    {
        path: 'masters-school',
        redirectTo: 'masters-school'
    },
    {
        path: 'masters-student',
        redirectTo: 'masters-student'
    },
    {
        path: ' masters-iep-master',
        redirectTo: ' masters-iep-master'
    },
    


    /* Dashboards*/
    {
        path: 'dashboard-teacher',
        redirectTo: 'dashboard-teacher'
    },
    {
        path: 'dashboard-school',
        redirectTo: 'dashboard-school'
    },
    {
        path: 'dashboard-district',
        redirectTo: 'dashboard-district'
    },
    {
        path: 'dashboard-state',
        redirectTo: 'dashboard-state'
    },
    {
        path: 'dashboard-admin',
        redirectTo: 'dashboard-admin'
    },
    /*other modules */
    {
        path: 'user-management',
        redirectTo: 'user-management'
    },
    {
        path: 'iep-assessment',
        redirectTo: 'iep-assessment'
    },
    {
        path: 'goal-monitoring',
        redirectTo: 'goal-monitoring'
    },
    {
        path: 'change-password',
        redirectTo: 'change-password'
    },
    /**/
    {
        path: '**',
        redirectTo: 'home'
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        NgxSpinnerModule,
        RouterModule.forRoot(appRoutes, {useHash:true} ),
        ToastrModule.forRoot(),
        TranslateModule.forRoot(),
        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,
        // MatDialogModule,
        // MatDialog,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // Masters modules
        LayoutModule,
        SampleModule,
        StatesModule,
        DistrictModule,
        TeacherModule,
        SchoolModule,
        StudentModule,
        IepMasterModule,

        // Dashboard modules 
        DashboardTeacherModule,
        DashboardSchoolModule,
        DashboardDistrictModule,
        DashboardStateModule,
        DashboardAdminModule,

        // other modules
        UserManagementModule,
        IepAssessmentModule,
        GoalMonitoringModule,
        ChangePasswordModule

    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
        UtilsService, ApiService, OfflinDBService, EncryptDecryptService, DistrictResolverService, SchoolResolverService, TeacherResolverService, StudentResolverService,UserManagementResolverService,
        StatesResolverService, IepMasterResolverService, IepAssessmentResolverService, GoalMonitoringResolverService, DashboardTeacherResolverService, DashboardSchoolResolverService, DashboardDistrictResolverService, DashboardStateResolverService
    ]
})
export class AppModule {
}
