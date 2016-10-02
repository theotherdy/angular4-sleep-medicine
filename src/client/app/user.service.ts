import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { User } from './user';
import { Observable }     from 'rxjs/Observable';

import './rxjs-operators';  // Add the RxJS Observable operators we need in this app.

import myGlobals = require('./globals');

//import { MODYULES } from './mock-modyules';

@Injectable()
export class UserService {

    user: User;
    groupName: string;

    constructor (private http: Http) {}

    getUser (userCurrentUrl: string): Observable<User> {
        return this.http.get(userCurrentUrl)
            .map(this.processUser)
            .catch(this.handleError);
    }

    getRole (user: User): Observable<string> {
        let ebBasePlus:string = myGlobals.entityBrokerBaseUrl[myGlobals.runtimeEnvironment] + 'membership/' + user.id;
        let roleUrl:string  = ebBasePlus + myGlobals.membershipUrl[myGlobals.runtimeEnvironment] + myGlobals.homeSiteId + '.json';
        return this.http.get(roleUrl)
            .map(this.processRole)
            .catch(this.handleError);
    }

    getGroup (user: User, groupName: string): Observable<User> {
        this.user = user;
        this.groupName = groupName;
        let groupUrl:string = myGlobals.entityBrokerBaseUrl[myGlobals.runtimeEnvironment] + 'membership/group/';
        groupUrl = groupUrl + myGlobals.groupId[groupName] + '.json';
        return this.http.get(groupUrl)
            .map(this.processGroup)
            .catch(this.handleError);
    }

    private processUser = (res: Response) => { //have to use instance syntax to allow this.processResource
        let body = res.json();
        let userToReturn: any = new User;  //exepecting observable so can't return Resource
        userToReturn.id = body.id;
        userToReturn.name = body.displayName;
        userToReturn.firstName = body.firstName;
        userToReturn.lastName = body.lastName;
        userToReturn.oxfordUsername = body.displayId;
        return userToReturn;
    }

    private processRole = (res: Response) => { //have to use instance syntax to allow this.processResource
        let body = res.json();
        let roleToReturn: string;  //exepecting observable so can't return Resource
        roleToReturn = body.memberRole;
        return roleToReturn;
    }

    private processGroup = (res: Response) => { //have to use instance syntax to allow this.processResource
        let body = res.json();
        //let isMemberOfGroup: boolean;  //exepecting observable so can't return Resource
        for (let membership of body.membership_collection) {
            if (this.user.id === membership.userId ) {
                switch (this.groupName) {
                    case 'CPD' :
                        this.user.isCPD = true;
                        break;
                    case 'Dip' :
                        this.user.isDip = true;
                        break;
                    case 'MSc' :
                        this.user.isMSc = true;
                        break;
                }
            }
        }
        return this.user;
    }

    private handleError (error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

}
