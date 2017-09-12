export class User {
    id: string = '';
    name: string = '';
    firstName: string = '';
    lastName: string = '';
    oxfordUsername: string = '';
    role: string = '';
    
    isCPD: boolean = false;
    isDip: boolean = false;
    isMSc: boolean = false;
    
    researchOneCohort: number = 0; //0, 16 (16-18), 17 (17-19), 18 (18-20)
    researchTwoCohort: number = 0;
    moduleCohort: number = 0;
    adminCohort: number = 0;
}
