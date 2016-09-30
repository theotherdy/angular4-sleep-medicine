import { Component, Input, OnInit } from '@angular/core';

import { Observable }     from 'rxjs/Observable';

//import { Forum } from './forum';
import { Topic } from './topic';
import { Message } from './message';
import { ForumService } from './forum.service';

@Component({
    moduleId: module.id,
    selector: 'topic-component',
    templateUrl: 'topic.component.html',
    //directives: [ResourceComponent,ModyuleResourceComponent,FaComponent,ACCORDION_DIRECTIVES,CollapseDirective],
    styleUrls:  ['topic.component.css'],
    //pipes: [LectureTypePipe, DescriptionFormatterPipe],
    providers: [ForumService]
})

export class TopicComponent implements OnInit {
    @Input()
    topic: Topic;

    topicObservable: Observable<Topic>;

    error: any;
    errorMessage: string;

    public isCollapsed:boolean = true;

    constructor(
        private forumService: ForumService) {
    }

    ngOnInit() {
        this.topicObservable = this.forumService.getThreads(this.topic)
            .map(threads => {
                threads.sort(this.compareByThreadDates);
                this.topic.threads = threads;
                return this.topic;
            });
    }

    /*
    * Sort by modified date - most recent first
    */

    private compareByThreadDates(threadA: Message,threadB: Message): number {
            if(threadA.modifiedOn>threadB.modifiedOn) return -1;
            if(threadA.modifiedOn<threadB.modifiedOn) return 1;
            return 0;
    }
}
