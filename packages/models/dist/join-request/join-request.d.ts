import { JOIN_REQUEST_STATUS } from '@mokjang/constants';
import { User } from '../user/user';
export type JoinRequest = {
    id: string;
    churchId: string;
    status: JOIN_REQUEST_STATUS;
    userId: string;
    user: User;
    createdAt: string;
    updatedAt: string;
};
export declare const DEFAULT_JOIN_REQUEST: JoinRequest;
