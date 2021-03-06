import { Modyule } from './modyule';

/**
 * Variables that we might want anywhere - see:
 * http://stackoverflow.com/questions/36158848/what-is-the-best-way-to-declare-a-global-variable-in-angular-2-typescript
 * Include in other component, services, etc with: import myGlobals = require('./globals');
 */
export let homeSiteId: string = 'd1506490-a468-46ca-a915-417d9d11be2f';

//export let groupId: Array<string> = [];

//groupId needs to be defined like this because it has string indices for the array
interface IDictionary {
     [index: string]: any;
}
export let groupId = {} as IDictionary;

//groupId['CPD'] = '3e67b502-154a-4949-936b-584a02864f48';
//groupId['Dip'] = 'e2504d23-7a30-4c51-a148-a9f373d5679f';
//groupId['MSc'] = '8513fad8-656f-4265-9573-f00b8a781d02';

//will need to add to this for 18-20 cohort
groupId['Module_16'] = '153cbf5b-1606-4178-8205-42036665f4b4'; //all students
groupId['ResearchOne_16'] = '251e8fd1-6043-4863-b2ee-7115247c7cd7'; //just MSc
groupId['ResearchTwo_16'] = 'b30fe503-2991-40b2-b62a-f0e1c5d29123'; //just MSc
groupId['Admin_16'] = '3d8e4ac8-70e9-4a64-b42f-e632361b137c'; //all students
groupId['Module_17'] = 'b129f6a4-8d0e-453c-9f38-b8e9e83cfca1';
groupId['ResearchOne_17'] = 'c69eee43-eded-49d9-a78f-44aa26fb675c';
groupId['ResearchTwo_17'] = '879812ea-34ea-44ca-b61f-0742b55fef11';
groupId['Admin_17'] = 'f9df26fc-8d3f-41b6-8008-fdfdf03bfae1';

//console.log(groupId['Dip']['16-17']);

export let runtimeEnvironment: number = 0;
export let currentModyule: Modyule =  null;
//export let entityBrokerBaseUrl: string = 'app/'; //in WL "https://weblearn.ox.ac.uk/direct/"
export let entityBrokerBaseUrl: Array<string> = ['app/', 'https://weblearn.ox.ac.uk/direct/'];
export let baseUrlforLOs: Array<string> = ['app/', 'https://weblearn.ox.ac.uk/'];
export let baseUrlforForums: string = 'https://weblearn.ox.ac.uk/portal/tool/';
//export let entityBrokerBaseUrlForLocalOnly: string = 'http://localhost:3000/'; //search and remove on live
//export let unneededPartOfUrlForHierarchyCalls: string = 'https://weblearn.ox.ac.uk/portal/hierarchy';
export let unneededPartOfUrlForHierarchyCalls: Array<string> = [];
unneededPartOfUrlForHierarchyCalls[0] = 'https://weblearn.ox.ac.uk/portal/hierarchy';
unneededPartOfUrlForHierarchyCalls[1] = 'https://weblearn.ox.ac.uk/portal/site';
export let unneededPartOfUrlForLessonCalls: string = 'https://weblearn.ox.ac.uk/direct/';
export let unneededPartOfUrlForLOCalls: string = '/group/';

//export let courseInfoUrl: string = homeSiteId + '/Course%20Information';
//export let assessmentInfoUrl: string = homeSiteId + '/Assessment';

export let courseInfoUrl: string = '/Course%20Information';
export let assessmentInfoUrl: string = '/Assessment';

export let baseSitePath: string = '/medsci/p_g/sleep_med'; //same in WL

//export let urlToSpecifyPortal: string = 'portal-hierarchy'; //in WL = 'portal-hierarchy/site.json?portalpath='
export let urlToSpecifyPortal: Array<string> = ['portal-hierarchy', 'portal-hierarchy/site.json?portalpath='];
//export let suffixForTestingOnly: string = '.json'; //in WL = ''  ie no suffix
export let suffixForTestingOnly: Array<string> = ['.json', ''];

let wlImageUrl = 'https://weblearn.ox.ac.uk/access/content/group/'+homeSiteId+'/portal/assets/img/';

let logoImageName = 'Standard_SCNi_Logo_Reverse.png';
let logoImageUrl = wlImageUrl + logoImageName;

let scniImageName = 'scni.png';
let scniImageUrl = wlImageUrl + scniImageName;

let oxNeuroImageName = 'ndcn.png';
let oxNeuroImageUrl = wlImageUrl + oxNeuroImageName;

let oxfordImageName = 'ox_brand1_pos.gif';
let oxfordImageUrl = wlImageUrl + oxfordImageName;

let colinEspieImageName = 'colin_espie.jpeg';
let colinEspieImageUrl = wlImageUrl + colinEspieImageName;

let christopherJamesHarveyImageName = 'christopher-james_harvey.jpeg';
let christopherJamesHarveyImageUrl = wlImageUrl + christopherJamesHarveyImageName;

let marionGreenleavesImageName = 'marion_greenleaves.jpeg';
let marionGreenleavesImageUrl = wlImageUrl + marionGreenleavesImageName;

let nicolaBarclayImageName = 'nicola_barclay.jpeg';
let nicolaBarclayImageUrl = wlImageUrl + nicolaBarclayImageName;

let russellFosterImageName = 'russell_foster.jpeg';
let russellFosterImageUrl = wlImageUrl + russellFosterImageName;

let simonKyleImageName = 'simon_kyle.jpeg';
let simonKyleImageUrl = wlImageUrl + simonKyleImageName;

let sumathiSekaranImageName = 'sumathi_sekaran.jpeg';
let sumathiSekaranImageUrl = wlImageUrl + sumathiSekaranImageName;

let damionYoungImageName = 'damion_young.png';
let damionYoungImageUrl = wlImageUrl + damionYoungImageName;

export let logoUrl: Array<string> = ['assets/img/' + logoImageName, logoImageUrl];
export let scniUrl: Array<string> = ['assets/img/' + scniImageName, scniImageUrl];
export let oxNeuroUrl: Array<string> = ['assets/img/' + oxNeuroImageName, oxNeuroImageUrl];
export let oxfordUrl: Array<string> = ['assets/img/' + oxfordImageName, oxfordImageUrl];
export let colinEspieUrl: Array<string> = ['assets/img/' + colinEspieImageName, colinEspieImageUrl];
export let christopherJamesHarveyUrl: Array<string> = ['assets/img/' + christopherJamesHarveyImageName, christopherJamesHarveyImageUrl];
export let marionGreenleavesUrl: Array<string> = ['assets/img/' + marionGreenleavesImageName, marionGreenleavesImageUrl];
export let nicolaBarclayUrl: Array<string> = ['assets/img/' + nicolaBarclayImageName, nicolaBarclayImageUrl];
export let russellFosterUrl: Array<string> = ['assets/img/' + russellFosterImageName, russellFosterImageUrl];
export let simonKyleUrl: Array<string> = ['assets/img/' + simonKyleImageName, simonKyleImageUrl];
export let sumathiSekaranUrl: Array<string> = ['assets/img/' + sumathiSekaranImageName, sumathiSekaranImageUrl];
export let damionYoungUrl: Array<string> = ['assets/img/' + damionYoungImageName, damionYoungImageUrl];

export let lessonsUrl: string = 'lessons/site/'; //same in WL
export let lessonUrl: string = 'lessons/lesson/'; //same in WL
export let membershipUrl: Array<string> = ['/site/', '::site:'];
export let contentUrl: string = 'content/resources/group/'; //same in WL
export let announcementsUrl: string = 'announcement/site/'; //same in WL
export let assignmentsUrl: string = 'assignment/site/'; //same in WL
export let accessUrl: string = 'access/content/group/'; //same in WL
export let forumDirectUrl: string = 'forums/site/'; //same in WL
export let userCurrentUrl: string = 'user/current.json'; //same in WL
