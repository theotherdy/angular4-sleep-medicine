import {Component, Input} from '@angular/core';
import {Message} from './message';

@Component({
    moduleId: module.id,
    selector: 'message-component',
    templateUrl: 'message.component.html',
    //styleUrls:  ['message.component.css'],
    //directives: [TreeViewComponent,FaComponent]
})

export class MessageComponent {
    @Input() messages: Array<Message>;
}
