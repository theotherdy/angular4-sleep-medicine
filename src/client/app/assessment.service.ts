import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Assessment } from './assessment';
import { AssessmentItem } from './assessment-item';
import { Observable }     from 'rxjs/Observable';

import './rxjs-operators';  // Add the RxJS Observable operators we need in this app.

import myGlobals = require('./globals');

//import { MODYULES } from './mock-modyules';

@Injectable()
export class AssessmentService {

    constructor (private http: Http) {}

    getAssessment (assessmentUrl: string): Observable<Assessment> {
        return this.http.get(assessmentUrl)
            .map(this.processAssessment)
            .catch(this.handleError);
    }

    private processAssessment = (res: Response) => { //have to use instance syntax to allow this.processResource
        let body = res.json();
        let assessmentToReturn: any = new Assessment;  //exepecting observable so can't return Resource
        assessmentToReturn.assessmentItems = new Array<AssessmentItem>();
        for(let child of body.content_collection[0].resourceChildren) {
            let assessmentItem: AssessmentItem = new AssessmentItem;
            assessmentItem.name = child.name;
            if(child.name.indexOf('xam') !== -1) { //should capture exam or examination info
                assessmentItem.active = true;
            }
            assessmentItem.description = child.description;
            let trimmedResourceId = child.resourceId.substring(0, child.resourceId.length - 1);
            trimmedResourceId = trimmedResourceId.replace(myGlobals.unneededPartOfUrlForLOCalls, ''); //remove group
            let resourceUrl: string = myGlobals.entityBrokerBaseUrl[myGlobals.runtimeEnvironment] + myGlobals.contentUrl;
            resourceUrl = resourceUrl + trimmedResourceId + '.json';
            assessmentItem.resourcesUrl = resourceUrl;
            assessmentToReturn.assessmentItems.push(assessmentItem);
        }
        return assessmentToReturn;
    }

    private handleError (error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

}
