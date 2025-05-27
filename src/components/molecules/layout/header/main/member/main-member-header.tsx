import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import MainMemberHeaderView from '@/components/molecules/layout/header/main/member/main-member-header.view';
import {
  DEFAULT_MEMBER,
  setMember,
} from '@/redux/reducers/member-register-reducer';
import { DummyApi } from '@/api/dummy.api';
import {
  fetchMembers,
  setMembers,
} from '@/redux/reducers/filter/member-filter-reducer';
import { usePageRouter } from '@/utils/router';
import { useI18n } from '../../../../../../../locales/client';

type MainMemberHeaderProps = {};

const MainMemberHeader = ({}: MainMemberHeaderProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { churchId, groups } = useSelector((state: RootState) => state.church);
  const t = useI18n();
  const dummyApi = new DummyApi(false);
  const router = usePageRouter();

  // 교인 등록하기 on/off
  const [isRegisterShown, setIsRegisterShown] = useState<boolean>(false);

  // 모바일 그룹 필터 버튼
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

  // 교인 등록하기 팝업 닫기
  const onClickClose = () => {
    dispatch(setMember(DEFAULT_MEMBER));
    setIsRegisterShown(false);
  };

  // 교인 등록하기 팝업 띄우기
  const onClickRegisterMemberButton = () => {
    setIsRegisterShown(true);
  };

  // 모달 열기
  const onClickGroupButton = () => {
    setIsModalOpened(true);
  };

  // 모달 닫기
  const onDismissModal = () => {
    setIsModalOpened(false);
  };

  // 헤더 탭바 이벤트
  const onClickHeaderBar = (id: string) => {
    router.push(`/main/member/${id}`);
  };

  // 테스트 교인 생성
  const onClickDummyMembers = async () => {
    dummyApi.createDummyMembers({ churchId }).then(() => {
      dispatch(fetchMembers({ churchId, currentPage: 1 })).then((result) => {
        if (fetchMembers.fulfilled.match(result)) {
          dispatch(setMembers(result.payload));
        }
      });
    });
  };

  // (모바일) 선택된 그룹 이름
  const [selectedGroupName, setSelectedGroupName] = useState<string>(t('all'));

  const onClickNewGroup = (groupId: string | null) => {
    if (groupId === null) {
      setSelectedGroupName(t('all'));
    } else {
      const targetGroup = groups.find((g) => g.id === groupId);

      if (targetGroup) {
        setSelectedGroupName(targetGroup.name);
      }
    }
    setIsModalOpened(false);
  };

  const props = {
    isModalOpened,
    isRegisterShown,
    setIsRegisterShown,
    onClickClose,
    onClickRegisterMemberButton,
    onClickHeaderBar,
    onClickDummyMembers,
    onClickGroupButton,
    onDismissModal,
    selectedGroupName,
    onClickNewGroup,
  };

  return (
    <>
      <MainMemberHeaderView {...props} />
    </>
  );
};
export default MainMemberHeader;
