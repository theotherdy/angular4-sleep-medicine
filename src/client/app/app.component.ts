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
                    //console.log(modyules);
                    this.user.role = role;

                    let rhColumn = window.parent.document.getElementById('col2of2');
                    let lhColumn = window.parent.document.getElementById('col1of2');
                    let content = window.parent.document.getElementById('content');

                    //var parentIFrame = parent.document.getElementsByTagName("IFRAME")[0];

                    //if (parentIFrame) {
                             //parentIFrame.style.height = '300px';
                    //}

                    if(content) {
                        content.style.padding = '0';
                    }
                    if(rhColumn) {
                        rhColumn.style.display = 'none';
                    }
                    if(lhColumn) {
                        lhColumn.style.width = '100%';
                        lhColumn.style.paddingRight = '0';
                        lhColumn.style.marginLeft = '0';
                    }
                    if (this.user.role !== 'maintain') {
                        let mrphsToolTitleNav:any = window.parent.document.getElementsByClassName('Mrphs-toolTitleNav')[0];
		                let toolMenuWrap = window.parent.document.getElementById('toolMenuWrap');
                        let skipNav = window.parent.document.getElementById('skipNav');
                        let selectSiteModal = window.parent.document.getElementById('selectSiteModal');
                        let parentBody = window.parent.document.body;
                        let viewAllSitesBtn: any = window.parent.document.getElementsByClassName('view-all-sites-btn')[0];
                        let mrphsSiteHierarchy: any = window.parent.document.getElementsByClassName('Mrphs-siteHierarchy')[0];
                        let portletBody: any = window.parent.document.getElementsByClassName('portletBody')[0];

                        if(content) {
                            content.style.marginTop = '0';
                        }

                        //parentBody.style.height;

                        if (mrphsToolTitleNav) {
                            mrphsToolTitleNav.style.display = 'none';
                          }
                		if (toolMenuWrap) {
                            toolMenuWrap.style.display = 'none';
                          }
                        if(skipNav) {
                            skipNav.style.display = 'none';
                        }
                        if(portletBody) {
                            portletBody.style.marginTop = '0';
                            portletBody.style.padding = '2';
                        }
                        if(viewAllSitesBtn) {
                            viewAllSitesBtn.style.display = 'inline-block';
                        }
                        if(mrphsSiteHierarchy) {
                            mrphsSiteHierarchy.style.display = 'none';
                        }
                        if(parseInt(parentBody.style.width) < 784 && selectSiteModal) {
                			selectSiteModal.style.marginTop = '-34px';
                		}
                    }
                })
            .subscribe(

            );
            /*.switchMap(modyules => this.modyuleService.getModyulesDetails(modyules))
            .map(modyules => {
                    //console.log(modyules);
                    return modyules;
                })
            .subscribe(
                modyules => {
                    //@todo - deal with research modyules seaparately otherwise if two are concurrent, not sure which one will be returned
                    //first sort returned modyules into name order
                    if (modyules.length > 0) {
                        this.noModyulesFound = false;
                    }

                    modyules.sort(this.compareByModyuleDate);

                    this.modyules = modyules;

                    let tempCurrentModyule: Modyule = modyules[0];  //now they're sorted, this should be the first one
                    let currentDate: Date = new Date();
                    for (let modyule of modyules) {
                        if(currentDate > modyule.startDate && modyule.startDate > tempCurrentModyule.startDate) {
                            tempCurrentModyule = modyule;
                        }
                    //this is the currentModyule
                    myGlobals.currentModyule = tempCurrentModyule;
                    this.selectedModyule = tempCurrentModyule;
                    }
                },
                error =>  this.errorMessage = <any>error
            );*/
        let rhColumn = window.parent.document.getElementById('col2of2');
        let lhColumn = window.parent.document.getElementById('col1of2');
        if(rhColumn) {
            rhColumn.style.display = 'none';
        }
        if(lhColumn) {
            lhColumn.style.width = '100%';
        }
    }
}
