import { Message } from './message';

/**
 * Represents a forum topic
 *
 */

export class Topic {
    id: string;  //id
    name: string; //title
    readMessages: number;
    totalMessages: number;
    unreadMessages: number;
    createdOn: Date; //createdDate
    modifiedOn: Date; //lastModified
    closeDate: Date;
    openDate: Date;

    siteId: string;
    forumId: string;

    directUrl: string;

    expanded: boolean = false; //for ui toggle

    threads: Message[];

    toggle() {
        this.expanded = !this.expanded;
    }
}
