import { NgModule }       from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
//import { RouterModule } from '@angular/router';

import { AppComponent }   from './app.component';
import { ModyuleComponent } from './modyule.component';
import { ResourceComponent } from './resource.component';
import { AssessmentComponent } from './assessment.component';
import { ModyuleEndComponent } from './modyule-end.component';
import { ModyuleResourceComponent } from './modyule-resource.component';
import { TreeViewComponent } from './tree-view.component';
import { WeekDetailComponent } from './week-detail.component';
import { WeekComponent } from './week.component';
import { PollComponent } from './poll.component';
import { PollsComponent } from './polls.component';
import { HtmlResourceComponent } from './html-resource.component';
import { AnnouncementComponent } from './announcement.component';
import { ForumComponent } from './forum.component';
import { TopicComponent } from './topic.component';
import { ThreadComponent } from './thread.component';
import { MessageComponent } from './message.component';

import { ChartsModule } from 'ng2-charts/ng2-charts';

//import { CollapseDirective } from 'ng2-bootstrap/ng2-bootstrap';

import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';
import { TabsModule } from 'ng2-bootstrap/ng2-bootstrap';
import { AccordionModule } from 'ng2-bootstrap/ng2-bootstrap';
import { DropdownModule } from 'ng2-bootstrap/ng2-bootstrap';
import { CollapseModule } from 'ng2-bootstrap/ng2-bootstrap';

import { ResponsiveModule } from 'ng2-responsive';

//import {Ng2PageScrollModule} from 'ng2-page-scroll/ng2-page-scroll';

import { AssessmentService }     from './assessment.service';
//import { AnnouncementService }     from './announcement.service';
//import { ForumService }     from './forum.service';

import { LectureTypePipe } from './lecture-type.pipe';
import { DescriptionFormatterPipe } from './description-formatter.pipe';

import {Ng2PageScrollModule} from 'ng2-page-scroll/ng2-page-scroll';

@NgModule({
    declarations: [
        AppComponent,
        ModyuleComponent,
        ResourceComponent,
        AssessmentComponent,
        ModyuleEndComponent,
        ModyuleResourceComponent,
        ModyuleComponent,
        TreeViewComponent,
        WeekDetailComponent,
        WeekComponent,
        PollComponent,
        PollsComponent,
        HtmlResourceComponent,
        AnnouncementComponent,
        ForumComponent,
        TopicComponent,
        ThreadComponent,
        MessageComponent,
        LectureTypePipe,
        DescriptionFormatterPipe
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        ChartsModule,
        AlertModule,
        TabsModule,
        AccordionModule,
        DropdownModule,
        CollapseModule,
        ResponsiveModule,
        Ng2PageScrollModule
    ],
    providers: [
        AssessmentService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
