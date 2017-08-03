import { Component, Input, OnInit } from '@angular/core';

//import { FaComponent } from 'angular2-fontawesome/components';

//import { CollapseDirective } from 'ng2-bootstrap/ng2-bootstrap';
//import { ACCORDION_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

import { Observable }     from 'rxjs/Observable';

import { Week } from './week';
//import { LectureTypePipe } from './lecture-type.pipe';
//import { DescriptionFormatterPipe } from './description-formatter.pipe';
import { WeekService } from './week.service';

//import { PollComponent } from './poll.component';
//import { ResourceComponent } from './resource.component';

@Component({
    moduleId: module.id,
    selector: 'week-detail-component',
    templateUrl: 'week-detail.component.html',
    //directives: [ResourceComponent,ModyuleResourceComponent,FaComponent,ACCORDION_DIRECTIVES,CollapseDirective],
    styleUrls:  ['week-detail.component.css'],
    //pipes: [LectureTypePipe, DescriptionFormatterPipe],
    providers: [WeekService]
})

export class WeekDetailComponent implements OnInit {
    @Input()
    week: Week;
    lecturesObservable: Observable<Week>;

    error: any;
    errorMessage: string;

    public isCollapsed:boolean = true;

    constructor(
        private weekService: WeekService) {
    }

    ngOnInit() {
        this.lecturesObservable = this.weekService.getWeekLectures(this.week)
            .map(week => {
                this.week.lectures = week.lectures;
                return this.week;
            })
            .switchMap(week => this.weekService.getWeekSeminars(this.week))
            .map(week => {
                this.week.seminars = week.seminars;
                return this.week;
            })
            .switchMap(week => this.weekService.getWeekSupplementaries(this.week))
            .map(week => {
                this.week.supplementaries = week.supplementaries;
                return this.week;
            });
            /*.switchMap(week => this.weekService.getLectureLearningOutcomes(this.week))
            .map(week => {
                this.week.lectures = week.lectures;
                return this.week;
            }).switchMap(week => this.weekService.getSeminarLearningOutcomes(this.week))
            .map(week => {
                for (let returnedSeminar of week.seminars) {
                    //if we have learning outcomes, then find the matching seminar and copy across
                    if(returnedSeminar.learningOutcomes !== undefined && returnedSeminar.learningOutcomes !=='') {
                        //find matching seminar
                        for (let existingSeminar of this.week.seminars) {
                            if(existingSeminar.id == returnedSeminar.id) {
                                existingSeminar.learningOutcomes = returnedSeminar.learningOutcomes;
                            }
                        }
                    }
                }
                //this.week.seminars = week.seminars;
                return this.week;
            });*/
        //console.log(this.lecturesObservable);
    }
}
