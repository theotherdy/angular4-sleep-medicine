import { Component, Input, OnInit } from '@angular/core';

import { Observable }     from 'rxjs/Observable';

import { Announcement }     from './announcement';
import { AnnouncementService }     from './announcement.service';

@Component({
    moduleId: module.id,
    selector: 'announcement-component',
    templateUrl: 'announcement.component.html',
    providers: [AnnouncementService]
})

export class AnnouncementComponent implements OnInit {
    @Input()
    announcementsUrl: string;
    announcementsObservable: Observable<Announcement[]>;

    error: any;
    errorMessage: string;

    public isCollapsed:boolean = true;

    constructor(
        private announcementService: AnnouncementService) {
    }

    ngOnInit() {
        this.announcementsObservable = this.announcementService.getAnnouncements(this.announcementsUrl)
            .map(announcements => {
                return announcements;
            });
    }
}
