import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY } from '@/constants/styles/color';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { Group, GroupRole } from '@/models/management/management';
import { useCallback, useEffect, useState } from 'react';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import EditGroup from '@/components/molecules/management/group/edit-group';
import { GroupRolesApi } from '@/api/management/group/group-roles.api';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ToastPopup from '@/components/atoms/common/popup/toast-popup';

const GroupInformationContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const ListTypeHeader = styled.div`
  display: flex;
  width: 100%;
  height: 40px;
  background-color: ${GRAY.SIDE_BAR};
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const GroupContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
  gap: 5px;
`;

const RowContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  padding: 0 10px;
`;

const InformationContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  width: 100%;

  &:hover {
    background-color: ${GRAY.LIGHT};
  }
`;

const TitleContainer = styled.div`
  display: flex;
  width: 100px;
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 10px;
`;

type GroupInformationProps = {
  group: Group;
};

const GroupInformation = ({ group }: GroupInformationProps) => {
  const t = useI18n();
  const t_popup = useScopedI18n('popup');
  const t_header = useScopedI18n('header');
  const groupRolesApi = new GroupRolesApi(false);
  const { churchId } = useSelector((state: RootState) => state.church);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  // 그룹 역할 상태 관리
  const [roles, setRoles] = useState<GroupRole[]>([]);
  const [isModalShown, setIsModalShown] = useState<boolean>(false);
  const [isToastShown, setIsToastShown] = useState<boolean>(false);

  // 그룹 정보 수정 모달 열기
  const onClickOpen = () => setIsModalShown(true);
  const onClickClose = () => setIsModalShown(false);

  // 서버에서 역할 불러오기
  const fetchRoles = useCallback(async () => {
    if (churchId && group.id) {
      try {
        const response = await groupRolesApi.getGroupRoles({
          churchId,
          groupId: String(group.id),
        });
        setRoles(response.data);
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    }
  }, [churchId, group.id, groupRolesApi]);

  // 그룹 ID 변경 시 역할 데이터 가져오기
  useEffect(() => {
    fetchRoles();
  }, [group]);

  return (
    <GroupInformationContainer>
      {/* 그룹 상세 헤더 */}
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t_header('groupInformation')}</MainText>
      </ListTypeHeader>
      <GroupContentContainer>
        {/* 그룹명 */}
        <RowContainer>
          <InformationContainer onClick={onClickOpen}>
            <TitleContainer>
              <MainText color={GRAY.DARK}>{t('groupName')}</MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>{group.name}</MainText>
            </ContentContainer>
          </InformationContainer>
        </RowContainer>

        {/* 그룹 역할 */}
        <RowContainer>
          <InformationContainer onClick={onClickOpen}>
            <TitleContainer>
              <MainText color={GRAY.DARK}>{t('groupRole')}</MainText>
            </TitleContainer>
            <ContentContainer>
              {roles.map((role) => (
                <MainText key={role.id}>{role.role}</MainText>
              ))}
            </ContentContainer>
          </InformationContainer>
        </RowContainer>
      </GroupContentContainer>

      {/* 그룹 수정 모달 */}
      <CustomPopup
        isShow={isModalShown}
        onClickClose={onClickClose}
        width={30}
        height={70}
        isPercentage={true}
      >
        <EditGroup
          group={group}
          roles={roles}
          onClickClose={onClickClose}
          setIsToastShown={setIsToastShown}
        />
      </CustomPopup>

      {isToastShown && (
        <ToastPopup
          setIsShow={setIsToastShown}
          text={t_popup('saveComplete')}
        />
      )}
    </GroupInformationContainer>
  );
};

export default GroupInformation;
