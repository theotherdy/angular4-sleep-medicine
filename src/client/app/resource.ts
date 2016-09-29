export class Resource {
    id: string;
    name: string;
    description: string;
    url: string;
    fileType: string;
    expanded: boolean = false;
    contentUrl: string;
    children: Resource[];

    toggle() {
        this.expanded = !this.expanded;
    }
}
