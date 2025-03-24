import { useEffect, useRef } from 'react';

import FamilyTableView from '@/components/atoms/member/information/family-table.view';
import { MEMBER } from '@/constants/member/member-column';
import { FamilyMember } from '@/models/member/member';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { BLANK } from '@/constants/constant';

type FamilyTableProps = {
  familyMembers: FamilyMember[];
  onClickMember: (familyMemberId: string) => void;
  onClickEdit: (member: FamilyMember) => void;
  onClickConfirmDelete: (familyMemberId: string) => void;
};

const FamilyTable = ({
  familyMembers,
  onClickMember,
  onClickEdit,
  onClickConfirmDelete,
}: FamilyTableProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { officers, groups } = useSelector((state: RootState) => state.church);

  // const [targetMember, setTargetMember] = useState<Member>(DEFAULT_MEMBER);

  // // 교인 상세정보 팝업 On/Off
  // const [isMemberInformationShown, setIsMemberInformationShown] =
  //   useState<boolean>(false);
  //
  // // 상세 페이지 종료
  // const onClickClose = () => {
  //   setIsMemberInformationShown(false);
  //   setTargetMember(DEFAULT_MEMBER);
  // };

  // 열 헤더를 눌러 정렬
  const onClickHeader = (id: MEMBER) => {};

  const onScroll = () => {};

  // 직분명 찾기
  const getOfficerTitle = (officerId: string) => {
    const title = officers.find(({ id }) => id === officerId)?.name;
    return title || BLANK;
  };

  // 그룹명 찾기
  const getGroupTitle = (groupId: string) => {
    const title = groups.find(({ id }) => id === groupId)?.name;
    return title || BLANK;
  };

  // 정렬 변경 시 스크롤을 최상단으로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);

  const props = {
    scrollRef,
    familyMembers,
    // onClickMemberItem,
    onScroll,
    onClickMember,
    getOfficerTitle,
    getGroupTitle,
    onClickHeader,
    onClickEdit,
    onClickConfirmDelete,
  };

  return (
    <>
      <FamilyTableView {...props} />
    </>
  );
};

export default FamilyTable;
