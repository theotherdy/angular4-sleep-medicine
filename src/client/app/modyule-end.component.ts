import { Component, Input, OnInit } from '@angular/core';

import { FaComponent } from 'angular2-fontawesome/components';

import { CollapseDirective } from 'ng2-bootstrap/ng2-bootstrap';

//import {CORE_DIRECTIVES} from '@angular/common';
import { Observable }     from 'rxjs/Observable';

//import { LectureTypePipe } from './lecture-type.pipe';
//import { DescriptionFormatterPipe } from './description-formatter.pipe';
//import { Lecture } from './lecture';
import { Modyule } from './modyule';
import { ModyuleService } from './modyule.service';

@Component({
    moduleId: module.id,
    selector: 'modyule-end-component',
    templateUrl: 'modyule-end.component.html',
    //directives: [FaComponent,CollapseDirective],
    styleUrls:  ['modyule-end.component.css'],
    //pipes: [LectureTypePipe, DescriptionFormatterPipe],
    providers: [ModyuleService]
})

export class ModyuleEndComponent implements OnInit {
    @Input()
    modyule: Modyule;
    modyuleEndObservable: Observable<Modyule>;

    error: any;
    errorMessage: string;

    public isCollapsed:boolean = true;

    constructor(
        private modyuleService: ModyuleService) {
    }

    ngOnInit() {
        this.modyuleEndObservable = this.modyuleService.getModyuleEnd(this.modyule)
            .map(modyule => {
                this.modyule.mcqs = modyule.mcqs;
                this.modyule.mcqsDescription = modyule.mcqsDescription;
                this.modyule.feedback = modyule.feedback;
                this.modyule.feedbackDescription = modyule.feedbackDescription;
                //console.log(modyule);
                return modyule;
            });
        //console.log(this.modyuleResourcesObservable);
    }
}
