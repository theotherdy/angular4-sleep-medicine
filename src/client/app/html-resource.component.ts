import { Component, Input, OnInit } from '@angular/core';

//import { FaComponent } from 'angular2-fontawesome/components';

//import { CollapseDirective } from 'ng2-bootstrap/ng2-bootstrap';
//import { ACCORDION_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

import { Observable }     from 'rxjs/Observable';

//import { Week } from './week';
//import { LectureTypePipe } from './lecture-type.pipe';
//import { DescriptionFormatterPipe } from './description-formatter.pipe';
import { WeekService } from './week.service';

//import { ModyuleResourceComponent } from './modyule-resource.component';
//import { ResourceComponent } from './resource.component';

@Component({
    moduleId: module.id,
    selector: 'html-resource-component',
    templateUrl: 'html-resource.component.html',
    //template: `<p class="learningOutcomes" [innerHTML]="(learningOutcomesObservable | async)"></p>`,

    //directives: [ResourceComponent,ModyuleResourceComponent,FaComponent,ACCORDION_DIRECTIVES,CollapseDirective],
    styleUrls:  ['html-resource.component.css'],
    //pipes: [LectureTypePipe, DescriptionFormatterPipe],
    providers: [WeekService]
})

export class HtmlResourceComponent implements OnInit {
    @Input()
    htmlResourceUrl: string;
    htmlResourceObservable: Observable<string>;

    error: any;
    errorMessage: string;

    //public isCollapsed:boolean = true;

    constructor(
        private weekService: WeekService) {
    }

    ngOnInit() {
        this.htmlResourceObservable = this.weekService.getHtmlResource(this.htmlResourceUrl)
            .map(htmlResource => {
                return htmlResource;
                });
        console.log(this.htmlResourceObservable);
    }
}
