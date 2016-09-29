import { Component, Input, OnInit } from '@angular/core';

import { Observable }     from 'rxjs/Observable';

//import { Forum } from './forum';
import { Topic } from './topic';
import { Message } from './message';
import { ForumService } from './forum.service';

@Component({
    moduleId: module.id,
    selector: 'thread-component',
    templateUrl: 'thread.component.html',
    //directives: [ResourceComponent,ModyuleResourceComponent,FaComponent,ACCORDION_DIRECTIVES,CollapseDirective],
    //styleUrls:  ['topic.component.css'],
    //pipes: [LectureTypePipe, DescriptionFormatterPipe],
    providers: [ForumService]
})

export class ThreadComponent implements OnInit {
    @Input()
    thread: Message;

    threadsObservable: Observable<Topic>;

    error: any;
    errorMessage: string;

    public isCollapsed:boolean = true;

    constructor(
        private forumService: ForumService) {
    }

    ngOnInit() {
        this.threadsObservable = this.forumService.getMessages(this.thread)
            .map(messages => {
                //message.sort(this.compareByMessageDates);
                //this.topic.threads = threads;
                console.log(messages);
                return messages;                
            });
    }

    /*
    * Sort by modified date - most recent first
    */

    /*private compareByMessageDates(messageA: Message,messageB: Message): number {
            if(messageA.modifiedOn>messageB.modifiedOn) return -1;
            if(messageA.modifiedOn<messageB.modifiedOn) return 1;
            return 0;
    }*/
}
