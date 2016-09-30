import { Component, OnInit } from '@angular/core';

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

    logoUrl = myGlobals.logoUrl[myGlobals.runtimeEnvironment];

    user: User;

    constructor(
        //private router: Router,
        //private routeParams: RouteParams,
        private userService: UserService) {
        }

    ngOnInit() {
        this.userService.getUser(this.userCurrentUrl)
            .map(user => {
                    //console.log(modyules);
                    this.user = user;
                    console.log(this.user);
                    return this.user;
                })
            .switchMap(user => this.userService.getRole(user))
            .map(role => {
                    this.user.role = role;

                    //get references to elements needed for both maintain and access users
                    let rhColumn:any = window.parent.document.getElementById('col2of2');
                    let lhColumn:any = window.parent.document.getElementById('col1of2');
                    let content:any = window.parent.document.getElementById('content');
            		let mrphsSiteHierarchy:any = window.parent.document.getElementsByClassName('Mrphs-siteHierarchy')[0];
            		let mrphsMainHeader:any = window.parent.document.getElementsByClassName('Mrphs-mainHeader')[0];
            		let mrphsToolTitleNav:any = window.parent.document.getElementsByClassName('Mrphs-toolTitleNav')[0];
            		let mrphsFooter:any = window.parent.document.getElementsByClassName('Mrphs-footer')[0];
            		let portletBody:any = window.parent.document.getElementsByClassName('portletBody')[0];
                    let parentIFrame:any = window.parent.document.getElementsByTagName("IFRAME")[0];
            		let newIFrameHeight:any;

                    if (parentIFrame) {
                        //see http://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window/11744120#11744120
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
                            newIFrameHeight = newIFrameHeight-mrphsMainHeader.clientHeight-mrphsSiteHierarchy.clientHeight-mrphsToolTitleNav.clientHeight;
                        }
                    }
                    //size iFrame
                    if (parentIFrame) {
                        parentIFrame.style.height = newIFrameHeight+'px';
                    }
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
}
