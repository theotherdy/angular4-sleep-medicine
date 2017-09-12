import { Lecture } from './lecture';
import { Seminar } from './seminar';
import { Modyule } from './modyule';


export class Week {
    siteId: string;
    siteUrl: string;
    //weekUrl: string;  //end of url to this week's resources
    startDate: Date;
    endDate: Date;
    name: string;
    active: boolean;
    resourcesUrl: string;  //could be used to point to files in Resources

    modyule: Modyule;
    
    cohort: number; //which cohort is the students in for this week in this module 16, 16 or 18

    lectures: Lecture[];
    seminars: Seminar[];
    supplementaries: Lecture[];
}
