import { Tutor } from './tutor';
import { Assignment } from './assignment';
import { Resource } from './resource';
import { Feedback } from './feedback';
import { SeminarInstance } from './seminar-instance';


export class Seminar {
    id: string;
    name: string;
    description: string;
    learningOutcomes: string;
    learningOutcomesUrl: string;
    collapsed: boolean = true; //learning objectives initially collapses
    resourcesUrl: string;  //used to point to files e.g. reading list, pdfs, etc in Resources
    linkUrl: string;
    instructionsUrl: string;  //used to point to instructions in Instructions folder

    tutor: Tutor;
    feedback: Feedback;
    seminarInstances: SeminarInstance[];
    resources: Resource[];
    assignments: Assignment[];
}
