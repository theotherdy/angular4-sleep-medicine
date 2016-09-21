import { Tutor } from './tutor';

export class SeminarInstance {
    id: string;
    name: string;
    description: string;
    url: string;

    tutor: Tutor;
    seminarInstances: SeminarInstance[];
}
