import { Attachment } from './attachment';

export class Announcement {
    id: string;
    name: string;
    description: string;
    createdBy: string;
    expanded: boolean = false;
    createdOn: Date;

    attachments: Attachment[];

    toggle() {
        this.expanded = !this.expanded;
    }
}
