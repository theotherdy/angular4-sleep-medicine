import { Component, Input, OnInit } from '@angular/core';

import { Observable }     from 'rxjs/Observable';

import { Forum } from './forum';
import { Topic } from './topic';
import { ForumService } from './forum.service';

@Component({
    moduleId: module.id,
    selector: 'forum-component',
    templateUrl: 'forum.component.html',
    //directives: [ResourceComponent,ModyuleResourceComponent,FaComponent,ACCORDION_DIRECTIVES,CollapseDirective],
    styleUrls:  ['forum.component.css'],
    //pipes: [LectureTypePipe, DescriptionFormatterPipe],
    providers: [ForumService]
})

export class ForumComponent implements OnInit {
    @Input()
    siteId: string;

    forum: Forum;
    forumObservable: Observable<Forum>;

    error: any;
    errorMessage: string;

    public isCollapsed:boolean = true;

    constructor(
        private forumService: ForumService) {
    }

    ngOnInit() {
        this.forumObservable = this.forumService.getForum(this.siteId)
            .map(forum => {
                this.forum = forum;
                return this.forum;
            })
            .switchMap(forum => this.forumService.getTopics(this.forum))
            .map(topics => {
                topics.sort(this.compareByTopicDates);
                this.forum.topics = topics;
                //console.log(this.forum.topics);
                return this.forum;
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

    /*
    * Sort by modified date - most recent first
    */

    private compareByTopicDates(topicA: Topic,topicB: Topic): number {
            if(topicA.modifiedOn>topicB.modifiedOn) return -1;
            if(topicA.modifiedOn<topicB.modifiedOn) return 1;
            return 0;
    }
}
