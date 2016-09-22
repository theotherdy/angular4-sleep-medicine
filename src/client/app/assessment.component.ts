import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';

//import {CORE_DIRECTIVES} from '@angular/common';
import { Observable }     from 'rxjs/Observable';
//import { TAB_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

import { Assessment }     from './assessment';
import { AssessmentService }     from './assessment.service';
//import { TreeViewComponent }     from './tree-view.component';

//import { ResourceComponent } from './resource.component';

//import { LectureTypePipe } from './lecture-type.pipe';
//import { DescriptionFormatterPipe } from './description-formatter.pipe';


@Component({
    moduleId: module.id,
    selector: 'assessment-component',
    templateUrl: 'assessment.component.html',
    //directives: [ResourceComponent,TAB_DIRECTIVES],
    //pipes: [LectureTypePipe, DescriptionFormatterPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    //providers: [AssessmentService]
})

export class AssessmentComponent implements OnInit {
    @Input()
    assessmentUrl: string;
    assessmentObservable: Observable<Assessment>;

    error: any;
    errorMessage: string;

    public isCollapsed:boolean = true;

    constructor(
        private assessmentService: AssessmentService) {
    }

    ngOnInit() {
        this.assessmentObservable = this.assessmentService.getAssessment(this.assessmentUrl)
            .map(assessment => {
                return assessment;
            });
    }
}
