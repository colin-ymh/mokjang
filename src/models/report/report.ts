import { Member } from '@/models/member/member';
import { Visitation } from '@/models/visitation/visitation';
import { Task } from '@react-dnd/asap';
import { EducationSession } from '@/models/education/education';

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
