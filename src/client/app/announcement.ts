export class Announcement {
    id: string;
    name: string;
    description: string;
    createdBy: string;
    expanded: boolean = false;
    createdOn: Date;

    toggle() {
        this.expanded = !this.expanded;
    }
}
