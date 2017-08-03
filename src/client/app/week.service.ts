import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Week } from './week';
import { Lecture } from './lecture';
import { Seminar } from './seminar';
import { SeminarInstance } from './seminar-instance';
//import { Resource } from './resource';
import { Feedback } from './feedback';
import { Observable }     from 'rxjs/Observable';
import { Subject }     from 'rxjs/Subject';

import './rxjs-operators';  // Add the RxJS Observable operators we need in this app.

//import { MODYULES } from './mock-modyules';

import myGlobals = require('./globals');

@Injectable()
export class WeekService {

    constructor (private http: Http) {}

    getWeeks (modyuleUrl: string): Observable<Week[]> {
        modyuleUrl = modyuleUrl.replace(myGlobals.unneededPartOfUrlForHierarchyCalls[myGlobals.runtimeEnvironment], '');
        if (myGlobals.runtimeEnvironment === 1) {//we're live in WL
            //fudge to change parameters returned by EB portal-hieracrchy so they can be used as portalpath query string
            modyuleUrl = modyuleUrl.substring(1); //removes first colon
            modyuleUrl = modyuleUrl.replace(/:/g,'/'); //converts colons globally to '/'
        }
        let urlToGet: string = myGlobals.entityBrokerBaseUrl[myGlobals.runtimeEnvironment];
        urlToGet = urlToGet + myGlobals.urlToSpecifyPortal[myGlobals.runtimeEnvironment];
        urlToGet = urlToGet + modyuleUrl+myGlobals.suffixForTestingOnly[myGlobals.runtimeEnvironment];
        return this.http.get(urlToGet)
            .cache()
            .map(this.initialiseWeeks)
            .catch(this.handleError);
    }

    getWeeksDetails (weeks:Week[]): Observable<Week[]> {
        let calls: any[]  = [];

        for (let week of weeks){
            let urlToGet: string = myGlobals.entityBrokerBaseUrl[myGlobals.runtimeEnvironment];
            //urlToGet = urlToGet + myGlobals.lessonsUrl + week.siteId + '.json';
            urlToGet = urlToGet + myGlobals.contentUrl + week.siteId + '.json?depth=3';
            calls.push(
                this.http.get(urlToGet).cache()
                );
        }

        var subject = new Subject<Week[]>();  //see: http://stackoverflow.com/a/38668416/2235210 for why Subject

        Observable.forkJoin(calls).subscribe((res: any) => {
            for (let response of res){
                // Note this is a really very awkward way of matching modyule with a siteId assigned in getModyules (above)
                // with the correct response from forkJoin (could come back in any order), by looking at the
                // requested url from the response object
                let foundWeek = weeks.find(week=> {
                    if(response.url) {
						return response.url.indexOf(week.siteId)!==-1;
					} else {
						return response._body.indexOf(week.siteId)!==-1; //IE 11 doesn't seem to return response.url - it's null
					}
                });
                let bodyAsJson = JSON.parse(response._body);
                //foundWeek.name = bodyAsJson.lessons_collection[0].lessonTitle;
                //foundWeek.lessonUrl = bodyAsJson.lessons_collection[0].contentsURL;
                foundWeek.name = bodyAsJson.content_collection[0].name;

                let startFolder = bodyAsJson.content_collection[0].resourceChildren.find((folder:any)=> {
                    return folder.name.toLowerCase() === 'start date';
                });
                if(startFolder) {
                    foundWeek.startDate = new Date(startFolder.description);
                } else {
                    foundWeek.startDate = new Date();
                }
                //foundWeek.siteUrl = bodyAsJson.content_collection[0].url;
                //foundWeek.siteId = bodyAsJson.content_collection[0].resourceId;
                }
            subject.next(weeks);
        });

        return subject;
    }

    getWeekLectures(week: Week): Observable<Week> {
        let lecturesUrl = myGlobals.contentUrl + week.siteId + '/Lectures.json?depth=3';
        return this.http.get(myGlobals.entityBrokerBaseUrl[myGlobals.runtimeEnvironment] + lecturesUrl)
            //.cache()
            .map(this.processLectures)
            .catch(this.handleError);
        }

    getWeekSupplementaries(week: Week): Observable<Week> {
        let supplementariesUrl = myGlobals.contentUrl + week.siteId + '/Supplementary.json?depth=3';
        return this.http.get(myGlobals.entityBrokerBaseUrl[myGlobals.runtimeEnvironment] + supplementariesUrl)
            //.cache()
            .map(this.processSupplementaries)
            .catch(this.handleError);
        }

    getWeekSeminars(week: Week): Observable<Week> {
        let seminarsUrl = myGlobals.contentUrl + week.siteId + '/Seminars.json?depth=3';
        return this.http.get(myGlobals.entityBrokerBaseUrl[myGlobals.runtimeEnvironment] + seminarsUrl)
            //.cache()
            .map(this.processSeminars)
            .catch(this.handleError);
        }

    getHtmlResource (htmlResourceUrl: string): Observable<string> {
        let htmlResourceUrlToFetch = htmlResourceUrl.replace(myGlobals.unneededPartOfUrlForLOCalls, '');
        htmlResourceUrlToFetch = myGlobals.baseUrlforLOs[myGlobals.runtimeEnvironment]+myGlobals.accessUrl + htmlResourceUrlToFetch;
        return this.http.get(htmlResourceUrlToFetch)
            .map(this.processHtmlResource)
            .catch(this.handleError);
    }

    private processHtmlResource (res: any) {
        //extract contents of body tag (if present) from .html
        let body = res._body;
        let htmlToReturn: string;
        let bEnd: number;
        let bStart: number;
        bStart = body.indexOf('<body');
        bEnd = body.indexOf('</body');
        if(bStart !== -1 && bEnd !== -1) {
            htmlToReturn = body.slice(bStart, bEnd);
        } else {
            htmlToReturn = body;
        }
        return htmlToReturn;
    }

    private initialiseWeeks(res: Response) {
        let body = res.json();
        let weeksToReturn: any[] = []; //: Week[] = []; //seems to need to be any!
        for (let site of body.subsites){
            if(site.siteUrl.indexOf('mod')!==-1 || site.siteUrl.indexOf('res')!==-1) {
                //ie only add subsites with 'mod' or 'res' in the name
                let tempWeek = new Week;
                tempWeek.siteId = site.siteId;
                tempWeek.siteUrl = site.siteUrl;
                weeksToReturn.push(tempWeek);
            }
        }
        return weeksToReturn;
    }

    private processLectures(res: Response) {
        let weekToReturn: Week = new Week;
        let body = res.json();
        weekToReturn.lectures = new Array<Lecture>();
        let lecture: Lecture;
        for(let lectureData of body.content_collection[0].resourceChildren) {
            if (lectureData.type === 'org.sakaiproject.content.types.folder') { //it's a folder
                lecture = new Lecture;
                lecture.type = 'main'; //because it's within a week
                lecture.name = lectureData.name;
                lecture.id = lectureData.resourceId;
                lecture.description = lectureData.description;
                for (let lectureDetail of lectureData.resourceChildren) {
                    if(lectureDetail.type === 'org.sakaiproject.content.types.urlResource'
                        && lectureDetail.name.toLowerCase()==='feedback link') { //it's a url
                        let feedback: Feedback =  new Feedback;
                        feedback.url = lectureDetail.url;
                        feedback.name = lectureDetail.name;
                        lecture.feedback = feedback;
                    } else if(lectureDetail.type === 'org.sakaiproject.content.types.urlResource'
                        && lectureDetail.name.toLowerCase()==='lecture link') { //it's a url
                        lecture.url = lectureDetail.url;
                    } else if((lectureDetail.type === 'org.sakaiproject.content.types.HtmlDocumentType'
                            || lectureDetail.type === 'org.sakaiproject.content.types.fileUpload')
                            && lectureDetail.name.toLowerCase().indexOf('outcome') !== -1) { //it's a url
                        lecture.learningOutcomesUrl = lectureDetail.resourceId;
                    } else if (lectureDetail.type === 'org.sakaiproject.content.types.folder'
                        && lectureDetail.name.toLowerCase()==='resources') {
                        let trimmedResourceId = lectureDetail.resourceId.substring(0, lectureDetail.resourceId.length - 1);
                        trimmedResourceId = trimmedResourceId.replace(myGlobals.unneededPartOfUrlForLOCalls, '');//remove group
                        let resourceUrl: string = myGlobals.entityBrokerBaseUrl[myGlobals.runtimeEnvironment] + myGlobals.contentUrl;
                        resourceUrl = resourceUrl  + trimmedResourceId + '.json';
                        lecture.resourcesUrl = resourceUrl;
                    } /*else if (lectureDetail.type === 'org.sakaiproject.content.types.folder'
                        && lectureDetail.name.toLowerCase()==='polls') {
                        let pollIds = lectureDetail.description;
                        let pollsToReturn:Poll[] = [];
                        if(pollIds.indexOf('&amp;') !== -1) {
                            let pollsList = pollIds.split('&amp;');
                            for (let poll of pollsList) {
                                let pollId = poll.trim();
                                let pollToReturn: Poll = new Poll;
                                pollToReturn.id = pollId;
                                pollsToReturn.push(pollToReturn);
                            }
                        } else {
                            let pollId = pollIds.trim();
                            let pollToReturn: Poll = new Poll;
                            pollToReturn = new Poll;
                            pollToReturn.id = pollId;
                            pollsToReturn.push(pollToReturn);
                        }
                        lecture.polls = pollsToReturn;
                    }*/
                }
            //description: string;
            weekToReturn.lectures.push(lecture);
            }
        }
        return weekToReturn;
    }

    private processSupplementaries(res: Response) {
        let weekToReturn: Week = new Week;
        let body = res.json();
        weekToReturn.supplementaries = new Array<Lecture>();
        let lecture: Lecture;
        for(let lectureData of body.content_collection[0].resourceChildren) {
            if (lectureData.type === 'org.sakaiproject.content.types.folder') { //it's a folder
                lecture = new Lecture;
                lecture.type = 'main'; //because it's within a week
                lecture.name = lectureData.name;
                lecture.id = lectureData.resourceId;
                lecture.description = lectureData.description;
                for (let lectureDetail of lectureData.resourceChildren) {
                    if(lectureDetail.type === 'org.sakaiproject.content.types.urlResource'
                        && lectureDetail.name.toLowerCase()==='feedback link') { //it's a url
                        let feedback: Feedback =  new Feedback;
                        feedback.url = lectureDetail.url;
                        feedback.name = lectureDetail.name;
                        lecture.feedback = feedback;
                    } else if(lectureDetail.type === 'org.sakaiproject.content.types.urlResource'
                        && lectureDetail.name.toLowerCase()==='lecture link') { //it's a url
                        lecture.url = lectureDetail.url;
                    } else if((lectureDetail.type === 'org.sakaiproject.content.types.HtmlDocumentType'
                            || lectureDetail.type === 'org.sakaiproject.content.types.fileUpload')
                            && lectureDetail.name.toLowerCase().indexOf('outcome') !== -1) { //it's a url
                        lecture.learningOutcomesUrl = lectureDetail.resourceId;
                    } else if (lectureDetail.type === 'org.sakaiproject.content.types.folder'
                        && lectureDetail.name.toLowerCase()==='resources') {
                        let trimmedResourceId = lectureDetail.resourceId.substring(0, lectureDetail.resourceId.length - 1);
                        trimmedResourceId = trimmedResourceId.replace(myGlobals.unneededPartOfUrlForLOCalls, '');//remove group
                        let resourceUrl: string = myGlobals.entityBrokerBaseUrl[myGlobals.runtimeEnvironment] + myGlobals.contentUrl;
                        resourceUrl = resourceUrl  + trimmedResourceId + '.json';
                        lecture.resourcesUrl = resourceUrl;
                    }
                }
            weekToReturn.supplementaries.push(lecture);
            }
        }
        return weekToReturn;
    }

    private processSeminars(res: Response) {
        let weekToReturn: Week = new Week;
        let body = res.json();
        weekToReturn.seminars = new Array<Seminar>();
        let seminar: Seminar = new Seminar;
        for(let seminarData of body.content_collection[0].resourceChildren) {
            if (seminarData.type === 'org.sakaiproject.content.types.folder') { //it's a folder
                seminar.id = seminarData.resourceId;
                seminar.name = seminarData.name;
                seminar.description = seminarData.description;
                seminar.seminarInstances = new Array<SeminarInstance>();
                for (let seminarDetail of seminarData.resourceChildren) {
                    //console.log(seminarDetail.name.toLowerCase().indexOf('assignment'));
                    //console.log(seminarDetail.resourceId);
                    if(seminarDetail.type === 'org.sakaiproject.content.types.urlResource'
                        && seminarDetail.name.toLowerCase()==='feedback link') { //it's a url
                        let feedback: Feedback =  new Feedback;
                        feedback.url = seminarDetail.url;
                        feedback.name = seminarDetail.name;
                        seminar.feedback = feedback;
                    //** removed until we can create direct links to seminars
                    } else if(seminarDetail.type === 'org.sakaiproject.content.types.urlResource') { //it's a seminar instance
                        let seminarInstance: SeminarInstance =  new SeminarInstance;
                        seminarInstance.url = seminarDetail.url;
                        seminarInstance.description = seminarDetail.description;
                        seminarInstance.name = seminarDetail.name;
                        seminar.seminarInstances.push(seminarInstance);
                    //** replacing seminar instances with content.html
                    } else if((seminarDetail.type === 'org.sakaiproject.content.types.HtmlDocumentType'
                                || seminarDetail.type === 'org.sakaiproject.content.types.fileUpload')
                                && seminarDetail.name.toLowerCase().indexOf('session') !== -1) {
                        seminar.sessionsUrl = seminarDetail.resourceId;
                    } else if((seminarDetail.type === 'org.sakaiproject.content.types.HtmlDocumentType'
                            || seminarDetail.type === 'org.sakaiproject.content.types.fileUpload')
                            && seminarDetail.name.toLowerCase().indexOf('outcome') !== -1) { //it's learning outcomes
                        //console.log('In there');
                        seminar.learningOutcomesUrl = seminarDetail.resourceId;
                    } else if((seminarDetail.type === 'org.sakaiproject.content.types.HtmlDocumentType'
                            || seminarDetail.type === 'org.sakaiproject.content.types.fileUpload')
                            && seminarDetail.name.toLowerCase().indexOf('assignment') !== -1) { //it's an assignment
                        seminar.assignmentUrl = seminarDetail.resourceId;
                        //console.log('In here');
                    } else if (seminarDetail.type === 'org.sakaiproject.content.types.folder'
                                && seminarDetail.name.toLowerCase()==='resources') {
                        let trimmedResourceId = seminarDetail.resourceId.substring(0, seminarDetail.resourceId.length - 1);
                        trimmedResourceId = trimmedResourceId.replace(myGlobals.unneededPartOfUrlForLOCalls, ''); //remove group
                        let resourceUrl: string = myGlobals.entityBrokerBaseUrl[myGlobals.runtimeEnvironment] + myGlobals.contentUrl;
                        resourceUrl = resourceUrl + trimmedResourceId + '.json';
                        seminar.resourcesUrl = resourceUrl;
                    } else if (seminarDetail.type === 'org.sakaiproject.content.types.folder'
                                && seminarDetail.name.toLowerCase()==='instructions') {
                        if(seminarDetail.resourceChildren.length>0) {
                            seminar.instructionsUrl = seminarDetail.resourceChildren[0].url;
                        }
                    }
                }
                //console.log(seminar);
            }
            weekToReturn.seminars.push(seminar);
        }
        return weekToReturn;
    }

    private handleError (error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

}
