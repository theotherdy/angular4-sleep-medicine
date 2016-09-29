/**
 * Represents a forum thread and message - thread is essentially the first message in a series of messages and replies
 */

export class Message {
    id: string; //messageId
    name: string; //title
    description: string; //body
    createdBy: string; //authoredBy
    expanded: boolean = false;
    createdOn: Date; //createdOn
    modifiedOn: Date; //lastModified
    readMessages: number;
    totalMessages: number;
    unreadMessages: number;
    read: boolean;

    siteId: string;
    forumId: string;
    topicId: string;

    replies: Message[];

    toggle() {
        this.expanded = !this.expanded;
    }
}
