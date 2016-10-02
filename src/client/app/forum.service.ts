import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Forum } from './forum';
import { Topic } from './topic';
import { Message } from './message';
import { Observable }     from 'rxjs/Observable';

import './rxjs-operators';  // Add the RxJS Observable operators we need in this app.

import myGlobals = require('./globals');

@Injectable()
export class ForumService {

    mySiteId: string;
    myForumId: string;
    myTopicId: string;
    //myMessageId: string;

    constructor (private http: Http) {}

    getForum (siteId: string): Observable<Forum> {
        this.mySiteId = siteId;
        let forumUrl: string = myGlobals.entityBrokerBaseUrl[myGlobals.runtimeEnvironment];
        forumUrl = forumUrl + myGlobals.forumDirectUrl + siteId + '.json';
        return this.http.get(forumUrl)
            .map(this.processForum)
            .catch(this.handleError);
    }

    getTopics (forum: Forum): Observable<any> {
        this.mySiteId = forum.siteId;
        this.myForumId = forum.id;
        let topicUrl: string = myGlobals.entityBrokerBaseUrl[myGlobals.runtimeEnvironment];
        topicUrl = topicUrl + myGlobals.forumDirectUrl + this.mySiteId + '/forum/' + this.myForumId + '.json';
        return this.http.get(topicUrl)
            .map(this.processTopics)
            .catch(this.handleError);
    }

    getThreads (topic: Topic): Observable<any> {
        this.mySiteId = topic.siteId;
        this.myForumId = topic.forumId;
        this.myTopicId = topic.id;
        let threadUrl: string = myGlobals.entityBrokerBaseUrl[myGlobals.runtimeEnvironment];
        threadUrl = threadUrl + myGlobals.forumDirectUrl + this.mySiteId + '/forum/' + this.myForumId;
        threadUrl = threadUrl + '/topic/' + this.myTopicId + '.json';
        return this.http.get(threadUrl)
            .map(this.processThreads)
            .catch(this.handleError);

    }

    /*
    * Actually only ever expecting one headline message per threadId but returning array
    * for recursive display of messages
    */
    getMessages (thread: Message): Observable<any> {
        this.mySiteId = thread.siteId;
        this.myForumId = thread.forumId;
        this.myTopicId = thread.topicId;
        //this.myMessageId = message.id;
        let messageUrl: string = myGlobals.entityBrokerBaseUrl[myGlobals.runtimeEnvironment];
        messageUrl = messageUrl + myGlobals.forumDirectUrl + this.mySiteId + '/forum/' + this.myForumId + '/topic/';
        messageUrl = messageUrl + this.myTopicId + '/message/' + thread.id + '.json';
        return this.http.get(messageUrl)
            .map(this.processMessage)
            .catch(this.handleError);

    }

    private processForum = (res: Response) => { //have to use instance syntax to allow this.processResource
        let body = res.json();
        let forumToReturn: any = new Forum;  //exepecting observable so can't return Resource
        forumToReturn.name = body.forums_collection[0].title;
        forumToReturn.id = body.forums_collection[0].id;
        forumToReturn.description = body.forums_collection[0].shortDescription;
        forumToReturn.readMessages = body.forums_collection[0].readMessages;
        forumToReturn.totalMessages = body.forums_collection[0].totalMessages;

        //console.log(res); // log to console instead
        //let beginningOfSiteId = res.url.indexOf(myGlobals.forumDirectUrl) + myGlobals.forumDirectUrl.length - 1;
        //let endOfSiteId = res.url.indexOf('.json');

        forumToReturn.siteId = this.mySiteId;
        return forumToReturn;
    }

    private processTopics = (res: Response) => {
        let body = res.json();
        let topicsToReturn:Topic[]  =  new Array<Topic>();

        for (let topicData of body.topics) {
            let topicToReturn = new Topic;
            topicToReturn.id = topicData.id;
            topicToReturn.name = topicData.title;
            topicToReturn.readMessages = topicData.readMessages;
            topicToReturn.totalMessages = topicData.totalMessages;
            topicToReturn.unreadMessages = topicData.totalMessages-topicData.readMessages;
            topicToReturn.createdOn = new Date(topicData.createdDate * 1000);
            topicToReturn.modifiedOn = new Date(topicData.modifiedDate * 1000);
            topicToReturn.siteId = this.mySiteId;
            topicToReturn.forumId = this.myForumId;
            topicsToReturn.push(topicToReturn);
        }
        return topicsToReturn;
    }

    private processThreads = (res: Response) => {
        let body = res.json();
        let threadsToReturn:Message[]  =  new Array<Message>();

        for (let threadData of body.threads) {
            let threadToReturn = new Message;
            threadToReturn.id = threadData.messageId;
            threadToReturn.name = threadData.title;
            threadToReturn.description = threadData.body;
            threadToReturn.createdBy = threadData.authoredBy;
            threadToReturn.readMessages = threadData.readMessages;
            threadToReturn.totalMessages = threadData.totalMessages;
            threadToReturn.unreadMessages = threadData.totalMessages-threadData.readMessages;
            threadToReturn.createdOn = new Date(threadData.createdDate * 1000);
            threadToReturn.modifiedOn = new Date(threadData.modifiedDate * 1000);
            threadToReturn.siteId = this.mySiteId;
            threadToReturn.forumId = this.myForumId;
            threadToReturn.topicId = this.myTopicId;
            let directUrl:string = myGlobals.baseUrlforForums + 'dd7e4210-9e50-4652-ba62-3ca89ba98ce4'; //top-level forum
            directUrl = directUrl + '/discussionForum/message/dfViewThreadDirect.jsf?messageId=' + threadData.messageId;
            directUrl = directUrl + '&topicId='+ this.myTopicId + '&forumId=' + this.myForumId;
            threadToReturn.directUrl = directUrl;
            threadsToReturn.push(threadToReturn);
        }
        return threadsToReturn;
    }

    private processMessage = (res: Response) => {
        let body = res.json();
        let messagesToReturn: Message[] = new Array<Message>();
        let messageToReturn: Message;
        messageToReturn = this.processMessageAndReplies(body);
        messagesToReturn.push(messageToReturn);
        return messagesToReturn;
    }

    private processMessageAndReplies(messageData:any) {
        let messageToReturn = new Message;
        messageToReturn.id = messageData.id;
        messageToReturn.name = messageData.title;
        messageToReturn.description = messageData.body;
        messageToReturn.createdBy = messageData.authoredBy;
        //messageToReturn.readMessages = reply.readMessages;
        //messageToReturn.totalMessages = reply.totalMessages;
        //messageToReturn.unreadMessages = reply.totalMessages-threadData.readMessages;
        messageToReturn.read = messageData.read;
        messageToReturn.createdOn = new Date(messageData.createdOn * 1000);
        messageToReturn.modifiedOn = new Date(messageData.lastModified * 1000);
        messageToReturn.siteId = this.mySiteId;
        messageToReturn.forumId = this.myForumId;
        messageToReturn.topicId = this.myTopicId;
        if(messageData.replies.length > 0) {
            messageToReturn.replies = new Array<Message>();
            for (let subReply of messageData.replies) {
                let tempReply = this.processMessageAndReplies(subReply);
                messageToReturn.replies.push(tempReply);
            }
        }
        return messageToReturn;
    }


    private handleError (error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

}
