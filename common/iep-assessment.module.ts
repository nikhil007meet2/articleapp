import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { RouterModule } from '@angular/router';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatTableModule,
  MatPaginatorModule,
  MatRadioButton,
  MatRadioModule,
  MatCheckboxModule,
  MatTooltipModule,
  MatIconModule,
  MatExpansionModule
} from '@angular/material';
import { IepAssessmentComponent } from './iep-assessment.component';
import { AuthGuard } from 'app/_guards/auth.guards';
import { IepAssessmentResolverService } from './iep-assessment-resolver.service';


const routes = [
  {
      path     : 'iep-assessment',
      canActivate: [AuthGuard],
      component: IepAssessmentComponent,
      resolve: {
        iepAssessmentMasterData: IepAssessmentResolverService
      }
  }
];


@NgModule({
  declarations: [IepAssessmentComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FuseSharedModule,
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    TranslateModule,
    FuseSharedModule,
    MatRadioModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatIconModule,
    MatExpansionModule,
  ],
  exports: [
    IepAssessmentComponent
  ]
})
export class IepAssessmentModule { }
