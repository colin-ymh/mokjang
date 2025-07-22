import React from 'react';
import MemberInformationHeaderView from '@/components/molecules/member/information/header/member-information-header.view';

type MemberInformationHeaderProps = {
  memberContentId: string;
  onClickItem: (id: string) => void;
};

const MemberInformationHeader = ({
  memberContentId,
  onClickItem,
}: MemberInformationHeaderProps) => {
  const props = {
    memberContentId,
    onClickItem,
  };

  return (
    <>
      <MemberInformationHeaderView {...props} />
    </>
  );
};

export default MemberInformationHeader;
