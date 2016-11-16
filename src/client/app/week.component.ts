//import { Component, Input, OnChanges, OnInit, SimpleChange, NgZone, ChangeDetectorRef} from '@angular/core';
import { Component, Input, OnChanges, OnInit, SimpleChange} from '@angular/core';

//import { FaComponent } from 'angular2-fontawesome/components';

//import {CORE_DIRECTIVES} from '@angular/common';
//import { TAB_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';
import { Observable }     from 'rxjs/Observable';

import { Modyule } from './modyule';
import { Week } from './week';
import { WeekService } from './week.service';
//import { WeekDetailComponent } from './week-detail.component';
//import { ModyuleEndComponent } from './modyule-end.component';

@Component({
    moduleId: module.id,
    selector: 'weeks-component',
    templateUrl: 'week.component.html',
    //directives: [ModyuleEndComponent,WeekDetailComponent,TAB_DIRECTIVES, CORE_DIRECTIVES,FaComponent],
    //changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls:  ['week.component.css'],
    providers: [WeekService]
})

export class WeekComponent implements OnChanges, OnInit {
    @Input() modyule: Modyule;
    //@Input() isExtraSmall: boolean;

    error: any;
    errorMessage: string;

    //windowWidth: number;
    //isExtraSmall: boolean = false;

    weeksObservable: Observable<Week[]>;

    //myNgZone:NgZone;
    //myChangeDetectorRef: ChangeDetectorRef;


    constructor(
        private weekService: WeekService,
        //private ngZone:NgZone,
        //private ref: ChangeDetectorRef
    ) {
        //this.myNgZone = ngZone;
        //this.myChangeDetectorRef = ref;
            //see http://stackoverflow.com/questions/35527559/angular2-get-window-width-onresize
            //gets width of window so I can switch between mobile and desktop layout of weeks
            //let that = this;
            /*ngZone.run(() => {
                let w:any = window.parent;
                let d:any = window.parent.document;
                let e:any = d.documentElement;
                let g:any = d.getElementsByTagName('body')[0];
                this.windowWidth = w.innerWidth|| e.clientWidth|| g.clientWidth;
                //this.windowWidth = window.innerWidth;
                if(this.windowWidth < 768) {
                    this.isExtraSmall = true;
                } else {
                    this.isExtraSmall = false;
                }
                //ref.detectChanges();
            });*/
            //todo - commented out chnage on window resize because of error
            //when you go small then big, then small then big again
            /*window.onresize = (e) =>
                {
                    ngZone.run(() => {
                        let w:any = window.parent;
                        let d:any = window.parent.document;
                        let e:any = d.documentElement;
                        let g:any = d.getElementsByTagName('body')[0];
                        this.windowWidth = w.innerWidth|| e.clientWidth|| g.clientWidth;
                        //this.windowWidth = window.innerWidth;
                        if(this.windowWidth < 768) {
                            this.isExtraSmall = true;
                        } else {
                            this.isExtraSmall = false;
                        }
                    });
                };*/
    }

    ngOnInit() {
        /*this.myNgZone.run(() => {
            let w:any = window.parent;
            let d:any = window.parent.document;
            let e:any = d.documentElement;
            let g:any = d.getElementsByTagName('body')[0];
            this.windowWidth = w.innerWidth|| e.clientWidth|| g.clientWidth;
            //this.windowWidth = window.innerWidth;
            if(this.windowWidth < 768) {
                this.isExtraSmall = true;
            } else {
                this.isExtraSmall = false;
            }
            this.myChangeDetectorRef.detectChanges();
            //ref.detectChanges();
        });*/

        /*window.onresize = (e) =>
            {
                this.myNgZone.run(() => {
                    let w:any = window.parent;
                    let d:any = window.parent.document;
                    let e:any = d.documentElement;
                    let g:any = d.getElementsByTagName('body')[0];
                    this.windowWidth = w.innerWidth|| e.clientWidth|| g.clientWidth;
                    //this.windowWidth = window.innerWidth;
                    this.myChangeDetectorRef.detectChanges();
                    if(this.windowWidth < 768) {
                        this.isExtraSmall = true;
                    } else {
                        this.isExtraSmall = false;
                    }
                    this.myChangeDetectorRef.detectChanges();
                });
            };
            */
    }

    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
        //console.log(changes);
        if(changes['modyule'] !== undefined) {  //as it will be when this is called at component init
        //if(modyule !== undefined){  //as it will be when this is called at component init
            //var activeWeekSet = false;
            //go and get week data for this modyule
            //if(this.modyule.weeks === undefined || this.modyule.weeks.length == 0 ){  //only update if we don't already have the data
                this.updateWeek(this.modyule);
            //}
        }
    }

    /*weekClicked(event:any) {
        event.preventDefault();
        let target = event.target || event.srcElement || event.currentTarget;
        let hrefFull = target.attributes.href.nodeValue;
        let href = hrefFull.substring(1); //remove #
        //let el = document.getElementById(href);
        //let rect = el.getBoundingClientRect();
        this.smoothScroll(href, 60);
    }*/

    private updateWeek = (newModyule: Modyule) => {
        //go and get week data for this modyule
        this.weeksObservable = this.weekService.getWeeks(newModyule.siteUrl)
            .map(weeks => {
                //console.log(weeks);
                return weeks;
            })
            .switchMap(weeks => this.weekService.getWeeksDetails(weeks))
            //.publishReplay(1) //cache latest results see:
            // http://www.syntaxsuccess.com/viewarticle/caching-with-rxjs-observables-in-angular-2.0
            .map(
                weeks => {
                    //first sort them into name order
                    let activeWeekSet = false;
                    //weeks.sort(this.compareByWeekName);
                    weeks.sort(this.compareByStartDate);
                    this.modyule.weeks = weeks;
                    //let startDateOfThisWeek = new Date(this.modyule.startDate.getTime());  //get date value not reference to original

                    let possibleActiveWeek: String;

                    for(var week of this.modyule.weeks){
                        let startDateOfThisWeek = new Date(week.startDate.getTime());
                        let startDateOfNextWeek: Date = new Date(startDateOfThisWeek.getTime());
                        startDateOfNextWeek.setDate(startDateOfNextWeek.getDate() + 7);
                        //week.startDate = new Date(startDateOfThisWeek.getTime());
                        week.endDate = new Date(startDateOfNextWeek.getTime());
                        //console.log(startDateOfThisWeek,startDateOfNextWeek);
                        let currentDate: Date = new Date();
                        if(currentDate >= startDateOfThisWeek) {
                            if(currentDate <= startDateOfNextWeek) {
                                //this is the current Week, where curent date inside week dates
                                week.active = true;
                                activeWeekSet = true;
                            } else {
                                //this could be the week which is current (with gaps between weeeks)
                                //because weeks sorted, this will be the last which starts before currentDate - assign below
                                possibleActiveWeek = week.name;
                            }
                        }
                        //startDateOfThisWeek = startDateOfNextWeek;
                        week.modyule = this.modyule;
                    }
                    if(!activeWeekSet) {
                        //let's find our possibleActiveWeek
                        if(possibleActiveWeek) {
                            let foundWeek = this.modyule.weeks.find((week:any)=> {
                                return week.name === possibleActiveWeek;
                            });
                            if(foundWeek) {
                                foundWeek.active = true;
                            } else {
                                this.modyule.weeks[0].active = true;
                            }
                        } else {
                            this.modyule.weeks[0].active = true;
                        }
                    }
                return weeks;
                }
            );
    }

    /*private compareByWeekName(weekA: Week,weekB: Week): number {
        //sort function to naturally sort strings: http://stackoverflow.com/a/38641281/2235210
        return weekA.name.localeCompare(weekB.name, undefined, {numeric: true, sensitivity: 'base'});
    }*/

    private compareByStartDate(weekA: Week,weekB: Week): number {
        //sort function to naturally sort strings: http://stackoverflow.com/a/38641281/2235210
        return weekA.startDate.getTime() - weekB.startDate.getTime();
    }

    /*
    * Note smooth scrolling handler below same as in app.component.ts - combine
    */

    /*private currentYPosition() {
        // Firefox, Chrome, Opera, Safari
        if (self.pageYOffset) return self.pageYOffset;
        // Internet Explorer 6 - standards mode
        if (document.documentElement && document.documentElement.scrollTop)
            return document.documentElement.scrollTop;
        // Internet Explorer 6, 7 and 8
        if (document.body.scrollTop) return document.body.scrollTop;
        return 0;
    }

    private elmYPosition(eID:string) {
        var elm = document.getElementById(eID);
        var y = elm.offsetTop;
        var node:any = elm;
        while (node.offsetParent && node.offsetParent !== document.body) {
            node = node.offsetParent;
            y += node.offsetTop;
        } return y;
    }

    private smoothScroll(eID: string, offset: number) {
        var startY = this.currentYPosition();
        var stopY = this.elmYPosition(eID)-offset;
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 20) {
            scrollTo(0, stopY);
            return true;
        }
        var speed = Math.round(distance / 50);
        if (speed >= 15) speed = 15;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 20;
        if (stopY > startY) {
            for ( var i=startY; i<stopY; i+=step ) {
                setTimeout('window.scrollTo(0, '+leapY+')', timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            }
            return true;
        }
        for ( var i=startY; i>stopY; i-=step ) {
            setTimeout('window.scrollTo(0, '+leapY+')', timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }
        return false;
    }*/

}
