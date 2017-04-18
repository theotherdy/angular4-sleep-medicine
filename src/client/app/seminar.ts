import { Tutor } from './tutor';
//import { Assignment } from './assignment';
import { Resource } from './resource';
import { Feedback } from './feedback';
import { SeminarInstance } from './seminar-instance';


export class Seminar {
    id: string;
    name: string;
    description: string;
    learningOutcomes: string;
    learningOutcomesUrl: string;
    assignmentUrl: string;
    collapsed: boolean = true; //learning objectives initially collapses
    resourcesUrl: string;  //used to point to files e.g. reading list, pdfs, etc in Resources
    linkUrl: string;
    instructionsUrl: string;  //used to point to instructions in Instructions folder
    sessionsUrl: string;  //used to point to content.html (contains seminar instances until something better)

    tutor: Tutor;
    feedback: Feedback;
    seminarInstances: SeminarInstance[];
    resources: Resource[];
    //assignments: Assignment[];
}
