import { Modyule } from './modyule';

/**
 * Variables that we might want anywhere - see:
 * http://stackoverflow.com/questions/36158848/what-is-the-best-way-to-declare-a-global-variable-in-angular-2-typescript
 * Include in other component, services, etc with: import myGlobals = require('./globals');
 */
export let homeSiteId: string = 'd1506490-a468-46ca-a915-417d9d11be2f';

export let runtimeEnvironment: number = 0;
export let currentModyule: Modyule =  null;
//export let entityBrokerBaseUrl: string = 'app/'; //in WL "https://weblearn.ox.ac.uk/direct/"
export let entityBrokerBaseUrl: Array<string> = ['app/', 'https://weblearn.ox.ac.uk/direct/'];
export let baseUrlforLOs: Array<string> = ['app/', 'https://weblearn.ox.ac.uk/'];
//export let entityBrokerBaseUrlForLocalOnly: string = 'http://localhost:3000/'; //search and remove on live
//export let unneededPartOfUrlForHierarchyCalls: string = 'https://weblearn.ox.ac.uk/portal/hierarchy';
export let unneededPartOfUrlForHierarchyCalls: Array<string> = [];
unneededPartOfUrlForHierarchyCalls[0] = 'https://weblearn.ox.ac.uk/portal/hierarchy';
unneededPartOfUrlForHierarchyCalls[1] = 'https://weblearn.ox.ac.uk/portal/site';
export let unneededPartOfUrlForLessonCalls: string = 'https://weblearn.ox.ac.uk/direct/';
export let unneededPartOfUrlForLOCalls: string = '/group/';

export let courseInfoUrl: string = homeSiteId + '/Course%20Information';
export let assessmentInfoUrl: string = homeSiteId + '/Assessment';
export let baseSitePath: string = '/medsci/p_g/sleep_med'; //same in WL

//export let urlToSpecifyPortal: string = 'portal-hierarchy'; //in WL = 'portal-hierarchy/site.json?portalpath='
export let urlToSpecifyPortal: Array<string> = ['portal-hierarchy', 'portal-hierarchy/site.json?portalpath='];
//export let suffixForTestingOnly: string = '.json'; //in WL = ''  ie no suffix
export let suffixForTestingOnly: Array<string> = ['.json', ''];

let wlImageName = 'Standard_SCNi_Logo_Reverse.png';
let wlImageUrl = 'https://weblearn.ox.ac.uk/access/content/group/'+homeSiteId+'/portal/assets/img/' + wlImageName;
export let logoUrl: Array<string> = ['assets/img/' + wlImageName, wlImageUrl];

export let lessonsUrl: string = 'lessons/site/'; //same in WL
export let lessonUrl: string = 'lessons/lesson/'; //same in WL
export let membershipUrl: Array<string> = ['/site/', '::site:'];
export let contentUrl: string = 'content/resources/group/'; //same in WL
export let announcementsUrl: string = 'announcement/site/'; //same in WL
export let accessUrl: string = 'access/content/group/'; //same in WL
export let forumDirectUrl: string = 'forums/site/'; //same in WL
export let userCurrentUrl: string = 'user/current.json'; //same in WL
