import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Announcement } from './announcement';
import { Attachment } from './attachment';
import { Observable }     from 'rxjs/Observable';

import './rxjs-operators';  // Add the RxJS Observable operators we need in this app.

@Injectable()
export class AnnouncementService {

    constructor (private http: Http) {}

    getAnnouncements (announcementsUrl: string): Observable<Announcement[]> {
        return this.http.get(announcementsUrl)
            .map(this.processAnnouncements)
            .catch(this.handleError);
    }

    private processAnnouncements = (res: Response) => {
        let body = res.json();
        let announcementsToReturn = new Array<Announcement>();  //exepecting observable so can't return Resource
        for(let announcement of body.announcement_collection) {
            let tempAnnouncement: Announcement = new Announcement();
            tempAnnouncement.id = announcement.id;
            tempAnnouncement.name = announcement.title;
            tempAnnouncement.description = announcement.body;
            tempAnnouncement.createdBy = announcement.createdByDisplayName;
            tempAnnouncement.expanded = false;
            tempAnnouncement.createdOn = new Date(announcement.createdOn);
            if(announcement.attachments.length>0) {
                tempAnnouncement.attachments = new Array<Attachment>();
                for(let attachment of announcement.attachments) {
                    let tempAttachment: Attachment = new Attachment();
                    tempAttachment.id = attachment.id;
                    tempAttachment.name = attachment.name;
                    tempAttachment.type = attachment.type;
                    tempAttachment.url = attachment.url;
                    tempAnnouncement.attachments.push(tempAttachment);
                }
            }
            announcementsToReturn.push(tempAnnouncement);
        }
        return announcementsToReturn;
    }

    private handleError (error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

}
