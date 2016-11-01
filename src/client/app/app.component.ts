//import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Component, OnInit, enableProdMode } from '@angular/core';
//import { Component, OnInit, NgZone } from '@angular/core';

enableProdMode();

import { UserService }     from './user.service';
import { User }     from './user';

import myGlobals = require('./globals');

@Component({
    moduleId: module.id,
    selector: 'my-app',
    styleUrls:  ['app.component.css'],
    templateUrl: 'app.component.html',
    providers: [UserService]
})

export class AppComponent implements OnInit {
    title = 'Sleep Medicine';
    ebBase = myGlobals.entityBrokerBaseUrl[myGlobals.runtimeEnvironment];
    resourcesUrl = this.ebBase + myGlobals.contentUrl + myGlobals.courseInfoUrl + '.json?depth=3';
    assessmentUrl = this.ebBase + myGlobals.contentUrl + myGlobals.assessmentInfoUrl + '.json?depth=3';
    announcementsUrl = this.ebBase + myGlobals.announcementsUrl + myGlobals.homeSiteId + '.json?n=20&d=60';
    userCurrentUrl = this.ebBase + myGlobals.userCurrentUrl;
    siteId = myGlobals.homeSiteId;

    //urls for images
    logoUrl = myGlobals.logoUrl[myGlobals.runtimeEnvironment];
    scniUrl = myGlobals.scniUrl[myGlobals.runtimeEnvironment];
    oxNeuroUrl = myGlobals.oxNeuroUrl[myGlobals.runtimeEnvironment];
    oxfordUrl = myGlobals.oxfordUrl[myGlobals.runtimeEnvironment];
    colinEspieUrl = myGlobals.colinEspieUrl[myGlobals.runtimeEnvironment];
    christopherJamesHarveyUrl = myGlobals.christopherJamesHarveyUrl[myGlobals.runtimeEnvironment];
    marionGreenleavesUrl = myGlobals.marionGreenleavesUrl[myGlobals.runtimeEnvironment];
    nicolaBarclayUrl = myGlobals.nicolaBarclayUrl[myGlobals.runtimeEnvironment];
    russellFosterUrl = myGlobals.russellFosterUrl[myGlobals.runtimeEnvironment];
    simonKyleUrl = myGlobals.simonKyleUrl[myGlobals.runtimeEnvironment];
    sumathiSekaranUrl = myGlobals.sumathiSekaranUrl[myGlobals.runtimeEnvironment];
    damionYoungUrl = myGlobals.damionYoungUrl[myGlobals.runtimeEnvironment];

    modyuleTypeResearch = 'research';
    modyuleTypeLearning = 'learning';

    public isCollapsed: boolean = true;

    user: User;

    //isExtraSmall:boolean = false;

    //myNgZone:NgZone;

    //ref: ChangeDetectorRef;

    constructor(
        //private router: Router,
        //private routeParams: RouteParams,
        //private changeDetectorRef: ChangeDetectorRef)
        private userService: UserService,
        //private ngZone:NgZone
        ) {
            //this.ref = changeDetectorRef;
            //this.myNgZone = ngZone;

        }

    ngOnInit() {
        this.userService.getUser(this.userCurrentUrl)
            .map(user => {
                    //console.log(modyules);
                    this.user = user;
                    return this.user;
                })
            .switchMap(user => this.userService.getGroup (user, 'CPD'))
            .map(user => {
                    this.user.isCPD = user.isCPD;
                    return this.user;
                })
            .switchMap(user => this.userService.getGroup (user, 'Dip'))
            .map(user => {
                    this.user.isDip = user.isDip;
                    return this.user;
                })
            .switchMap(user => this.userService.getGroup (user, 'MSc'))
            .map(user => {
                    this.user.isMSc = user.isMSc;
                    return this.user;
                })
            .switchMap(user => this.userService.getRole(user))
            .map(role => {
                    this.user.role = role;

                    console.log(this.user);

                    //get references to elements needed for both maintain and access users
                    let rhColumn:any = window.parent.document.getElementById('col2of2');
                    let lhColumn:any = window.parent.document.getElementById('col1of2');
                    let content:any = window.parent.document.getElementById('content');
            		let mrphsSiteHierarchy:any = window.parent.document.getElementsByClassName('Mrphs-siteHierarchy')[0];
            		let mrphsMainHeader:any = window.parent.document.getElementsByClassName('Mrphs-mainHeader')[0];
            		let mrphsToolTitleNav:any = window.parent.document.getElementsByClassName('Mrphs-toolTitleNav')[0];
            		let mrphsFooter:any = window.parent.document.getElementsByClassName('Mrphs-footer')[0];
            		let portletBody:any = window.parent.document.getElementsByClassName('portletBody')[0];

                    let parentIFrame:any;
                    let iFrames:any = window.parent.document.getElementsByTagName('IFRAME');
                    for (let iFrame of iFrames) {
                        if(iFrame.id !== 'map') {
                            parentIFrame = iFrame;  //poor way to get this iFrame
                            break;
                        }
                    }

                    //let parentIFrame:any = window.parent.document.getElementsByTagName('IFRAME')[0];
                    let newIFrameHeight:any;

                    if (parentIFrame) {
                        //see http://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window
            			let w:any = window.parent;
            			let d:any = window.parent.document;
            			let e:any = d.documentElement;
            			let g:any = d.getElementsByTagName('body')[0];
            			newIFrameHeight = w.innerHeight|| e.clientHeight|| g.clientHeight;
                    }
                    if (content) {
                      content.style.padding = '0';
                    }
                    if (rhColumn) {
                      rhColumn.style.display = 'none';
                    }
                    if (lhColumn) {
                      lhColumn.style.width = '100%';
                      //this.ref.detectChanges();
                      lhColumn.style.paddingRight = '0';
                      lhColumn.style.marginLeft = '0';
                    }
            		if (portletBody) {
                      portletBody.style.marginTop = '0px';
                      portletBody.style.padding = '0px';
                    }
                    if (this.user.role !== 'maintain') {
                        let toolMenuWrap:any = window.parent.document.getElementById('toolMenuWrap');
                        let skipNav:any = window.parent.document.getElementById('skipNav');
                        let selectSiteModal:any = window.parent.document.getElementById('selectSiteModal');
                        let parentBody:any = window.parent.document.body;
                        let viewAllSitesBtn:any = window.parent.document.getElementsByClassName('view-all-sites-btn')[0];
                        if (content) {
                            content.style.marginTop = '0';
                        }
                        if (mrphsToolTitleNav) {
                            mrphsToolTitleNav.style.display = 'none';
                        }
                        if (toolMenuWrap) {
                            toolMenuWrap.style.display = 'none';
                        }
                        if (skipNav) {
                            skipNav.style.display = 'none';
                        }
                        if (viewAllSitesBtn) {
                            viewAllSitesBtn.style.display = 'inline-block';
                        }
                        if (mrphsSiteHierarchy) {
                            mrphsSiteHierarchy.style.display = 'none';
                        }
                        if (mrphsFooter) {
                            mrphsFooter.style.display = 'none';
                        }
                        if (parseInt(parentBody.style.width) < 784 && selectSiteModal) {
                            selectSiteModal.style.marginTop = '-34px';
                        }
                        //now work out iframe height for access users
                        if (parentIFrame) {
                            newIFrameHeight = (newIFrameHeight-mrphsMainHeader.clientHeight);
                        }
                    } else {
                        //now work out iframe height for maintain users
                        if (parentIFrame) {
                            newIFrameHeight = newIFrameHeight-mrphsMainHeader.clientHeight-mrphsSiteHierarchy.clientHeight;
                            newIFrameHeight = newIFrameHeight-mrphsToolTitleNav.clientHeight;
                        }
                    }
                    //size iFrame
                    if (parentIFrame) {
                        parentIFrame.style.height = newIFrameHeight+'px';
                    }

                    /*this.myNgZone.run(() => {
                        let w:any = window.parent;
                        let d:any = window.parent.document;
                        let e:any = d.documentElement;
                        let g:any = d.getElementsByTagName('body')[0];
                        let windowWidth = w.innerWidth|| e.clientWidth|| g.clientWidth;
                        //this.windowWidth = window.innerWidth;
                        if(windowWidth < 768) {
                            this.isExtraSmall = true;
                        } else {
                            this.isExtraSmall = false;
                        }
                        //ref.detectChanges();
                    });*/
                })
            .subscribe();

        //let rhColumn = window.parent.document.getElementById('col2of2');
        //let lhColumn = window.parent.document.getElementById('col1of2');
        //if(rhColumn) {
        //    rhColumn.style.display = 'none';
        //}
        //if(lhColumn) {
        //    lhColumn.style.width = '100%';
        //}
    }

    /*
    * Note smooth scrolling handler below same as in week.component.ts - combine
    */

    navClicked(event:any) {
        event.preventDefault();
        let target = event.target || event.srcElement || event.currentTarget;
        let hrefFull = target.attributes.href.nodeValue;
        let href = hrefFull.substring(1); //remove #
        //let el = document.getElementById(href);
        //let rect = el.getBoundingClientRect();
        this.smoothScroll(href, 60);
    }

    currentYPosition() {
        // Firefox, Chrome, Opera, Safari
        if (self.pageYOffset) return self.pageYOffset;
        // Internet Explorer 6 - standards mode
        if (document.documentElement && document.documentElement.scrollTop)
            return document.documentElement.scrollTop;
        // Internet Explorer 6, 7 and 8
        if (document.body.scrollTop) return document.body.scrollTop;
        return 0;
    }

    elmYPosition(eID:string) {
        var elm = document.getElementById(eID);
        var y = elm.offsetTop;
        var node:any = elm;
        while (node.offsetParent && node.offsetParent !== document.body) {
            node = node.offsetParent;
            y += node.offsetTop;
        } return y;
    }

    smoothScroll(eID: string, offset: number) {
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
        var timer = 0;
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
    }
}
