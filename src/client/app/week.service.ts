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
                    return response.url.indexOf(week.siteId)!==-1;
                });
                let bodyAsJson = JSON.parse(response._body);
                //foundWeek.name = bodyAsJson.lessons_collection[0].lessonTitle;
                //foundWeek.lessonUrl = bodyAsJson.lessons_collection[0].contentsURL;
                foundWeek.name = bodyAsJson.content_collection[0].name;
                //foundWeek.siteUrl = bodyAsJson.content_collection[0].url;
                //foundWeek.siteId = bodyAsJson.content_collection[0].resourceId;
                }
            subject.next(weeks);
        });

        return subject;
    }

    /**
    * For week-detail component to get details of the materials inside it
    */

    /*getWeekLesson(week: Week): Observable<Week> {
        let lessonUrl = week.lessonUrl.replace(myGlobals.unneededPartOfUrlForLessonCalls, '');
        return this.http.get(myGlobals.entityBrokerBaseUrl[myGlobals.runtimeEnvironment]+lessonUrl + '.json')
            //.cache()
            .map(this.processLessons)
            .catch(this.handleError);
        }*/

    getWeekLectures(week: Week): Observable<Week> {
        let lecturesUrl = myGlobals.contentUrl + week.siteId + '/Lectures.json?depth=3';
        return this.http.get(myGlobals.entityBrokerBaseUrl[myGlobals.runtimeEnvironment] + lecturesUrl)
            //.cache()
            .map(this.processLectures)
            .catch(this.handleError);
        }

    getWeekSeminars(week: Week): Observable<Week> {
        let seminarsUrl = myGlobals.contentUrl + week.siteId + '/Seminars.json?depth=3';
        return this.http.get(myGlobals.entityBrokerBaseUrl[myGlobals.runtimeEnvironment] + seminarsUrl)
            //.cache()
            .map(this.processSeminars)
            .catch(this.handleError);
        }

    /*getLectureLearningOutcomes (week:Week): Observable<Week> {
        let calls: any[]  = [];

        for (let lecture of week.lectures) {
            if(lecture.learningOutcomesUrl !== undefined && lecture.learningOutcomes===undefined) {
                let lectureLOUrl = lecture.learningOutcomesUrl.replace(myGlobals.unneededPartOfUrlForLOCalls, '');
                lectureLOUrl = myGlobals.baseUrlforLOs[myGlobals.runtimeEnvironment]+myGlobals.accessUrl + lectureLOUrl;
                calls.push(  //learning outcomes
                    this.http.get(lectureLOUrl)//.cache()
                    );
            }
        }

        var subject = new Subject<Week>();  //see: http://stackoverflow.com/a/38668416/2235210 for why Subject

        Observable.forkJoin(calls).subscribe((res: any) => {
            for (let response of res){
                let body = response._body;
                let foundLecture = week.lectures.find(lecture=> {
                    let lessonUrl = encodeURI(lecture.learningOutcomesUrl.replace(myGlobals.unneededPartOfUrlForLOCalls, ''));
                    return response.url.indexOf(lessonUrl)!==-1;
                });
                //extract contents of body tag (if present) from .html
                let bEnd: number;
                let bStart: number;
                bStart = body.indexOf('<body');
                bEnd = body.indexOf('</body');
                if(bStart !== -1 && bEnd !== -1) {
                    foundLecture.learningOutcomes = body.slice(bStart, bEnd);
                } else {
                    foundLecture.learningOutcomes = body;
                }
            }
            subject.next(week);
        });

        return subject;
    }*/

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


    /*getSeminarLearningOutcomes (week:Week): Observable<Week> {
        let calls: any[]  = [];

        let noOfUrls = 0;

        for (let seminar of week.seminars) {
            if(seminar.learningOutcomesUrl !== undefined && seminar.learningOutcomes===undefined) {
                let seminarLOUrl = seminar.learningOutcomesUrl.replace(myGlobals.unneededPartOfUrlForLOCalls, '');
                seminarLOUrl = myGlobals.baseUrlforLOs[myGlobals.runtimeEnvironment]+myGlobals.accessUrl + seminarLOUrl;
                noOfUrls++;
                calls.push(  //learning outcomes
                    this.http.get(seminarLOUrl)//.cache()
                    );
            }
        }

        var subject = new Subject<Week>();  //see: http://stackoverflow.com/a/38668416/2235210 for why Subject

        if(noOfUrls>0) {
            Observable.forkJoin(calls).subscribe((res: any) => {
                for (let response of res){
                    let body = response._body;
                    let foundSeminar = week.seminars.find(seminar=> {
                        let LOUrl = encodeURI(seminar.learningOutcomesUrl.replace(myGlobals.unneededPartOfUrlForLOCalls, ''));
                        return response.url.indexOf(LOUrl)!==-1;
                    });
                    //extract contents of body tag (if present) from .html
                    let bEnd: number;
                    let bStart: number;
                    bStart = body.indexOf('<body');
                    bEnd = body.indexOf('</body');
                    if(bStart !== -1 && bEnd !== -1) {
                        foundSeminar.learningOutcomes = body.slice(bStart, bEnd);
                    } else {
                        foundSeminar.learningOutcomes = body;
                    }
                }
                subject.next(week);
            });
            return subject;
        } else {
            return Observable.from([]);
        }
    }*/


    private initialiseWeeks(res: Response) {
        let body = res.json();
        let weeksToReturn: any[] = []; //: Week[] = []; //seems to need to be any!
        for (let site of body.subsites){
            if(site.siteUrl.indexOf('mod')!==-1) {  //ie only add subsites with 'mod' in the name
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
                    }
                }
            //description: string;
            weekToReturn.lectures.push(lecture);
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
                    if(seminarDetail.type === 'org.sakaiproject.content.types.urlResource'
                        && seminarDetail.name.toLowerCase()==='feedback link') { //it's a url
                        let feedback: Feedback =  new Feedback;
                        feedback.url = seminarDetail.url;
                        feedback.name = seminarDetail.name;
                        seminar.feedback = feedback;
                    } else if(seminarDetail.type === 'org.sakaiproject.content.types.urlResource') { //it's a seminar instance
                        let seminarInstance: SeminarInstance =  new SeminarInstance;
                        seminarInstance.url = seminarDetail.url;
                        seminarInstance.description = seminarDetail.description;
                        seminarInstance.name = seminarDetail.name;
                        seminar.seminarInstances.push(seminarInstance);
                    } else if((seminarDetail.type === 'org.sakaiproject.content.types.HtmlDocumentType'
                            || seminarDetail.type === 'org.sakaiproject.content.types.fileUpload')
                            && seminarDetail.name.toLowerCase().indexOf('outcome') !== -1) { //it's a url
                        seminar.learningOutcomesUrl = seminarDetail.resourceId;
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
