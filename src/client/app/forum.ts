import { Topic } from './topic';

/**
 * Represents a forum
 *
 */

export class Forum {
    id: string;  //id
    name: string; //title
    description: string; //shortDescription
    readMessages: number;
    totalMessages: number;
    unreadMessages: number;
    siteId: string;

    topics: Topic[];
}
