import { Member } from '../member/member';
import { Visitation } from '../visitation/visitation';
import { Task } from '@react-dnd/asap';
import { EducationSession } from '../education/education';
export type Report = {
    id: string;
    isConfirmed: boolean;
    isRead: boolean;
    receiverId: string;
    receiver: Member;
};
export type VisitationReport = Report & {
    visitation: Visitation;
};
export type TaskReport = Report & {
    task: Task;
};
export type EducationSessionReport = Report & {
    educationId: string;
    educationTermId: string;
    educationSessionId: string;
    educationSession: EducationSession;
};
