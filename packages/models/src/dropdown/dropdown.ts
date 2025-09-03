import { DropdownValueType } from '@mokjang/app/src/components/atoms/common/dropdown/dropdown-item';

export type MemberDropdownValueType = DropdownValueType & {
  profileImage?: string;
  age?: number;
};
