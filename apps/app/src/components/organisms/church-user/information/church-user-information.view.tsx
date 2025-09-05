import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import React from 'react';
import { Button, MainText } from '../../../../../../../packages/components/src';
import { getFormattedDate } from '@mokjang/utils';
import { GRAY, MAIN, WHITE } from '../../../../../../../packages/constants/src';
import { getPermissionScopeTitle } from '@/utils/permission';
import { CHURCH_USER_ROLE } from '@mokjang/constants';
import PermissionUnitList from '@/components/molecules/permission/information/permission-unit-list';
import DeleteWarningButton from '@/components/atoms/common/button/delete-warning-button';
import MemberProfilePopupButton from '@/components/molecules/common/button/member-profile-popup-button';

const InformationContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 20px;
  gap: 10px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  height: 30px;
`;

const LineContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  height: 50px;

  border-bottom: 1px solid ${GRAY.LIGHT};
  &:last-child {
    border-bottom: none;
  }
`;

const MemberContainer = styled.div`
  display: flex;
  border: 1px solid ${MAIN.LIGHT};
  background-color: ${MAIN.EXTRA_LIGHT};
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
`;

const BoxContainer = styled.div`
  display: flex;
  padding: 10px;
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export type ChurchUserInformationViewProps = {
  isMy?: boolean;
  isManager: boolean;
  onClickEditTemplateOpen: () => void;
  onClickLink: () => void;
  onClickGroupPopupOpen: () => void;
  onClickConfirmOpen: () => void;
};

const ChurchUserInformationView = ({
  isMy,
  isManager,
  onClickEditTemplateOpen,
  onClickLink,
  onClickGroupPopupOpen,
  onClickConfirmOpen,
}: ChurchUserInformationViewProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_warning = useScopedI18n('warning');
  const { targetChurchUser } = useSelector(
    (state: RootState) => state.targetChurchUser
  );

  const isOwner = isMy || targetChurchUser.role === CHURCH_USER_ROLE.OWNER;

  const { permissionUnits, permissionTemplates } = useSelector(
    (state: RootState) => state.permissionTemplateFilter
  );

  return (
    <InformationContainer>
      {/* 연결된 교인 정보*/}
      <LabelContainer>
        <TitleContainer>
          <MainText fontSize={16} fontWeight={600}>
            {t('linkedMember')}
          </MainText>
          {!isOwner && (
            <Button
              width={'auto'}
              text={t_button('edit')}
              borderColor={MAIN.LIGHT}
              backgroundColor={WHITE}
              color={MAIN.DEFAULT}
              height={30}
              onClick={onClickLink}
            />
          )}
        </TitleContainer>
        <MemberContainer>
          <MemberProfilePopupButton
            member={targetChurchUser.member}
            isOfficerShown={true}
          />
        </MemberContainer>
      </LabelContainer>

      {/* 권한 그룹 */}
      <LabelContainer>
        <TitleContainer>
          <MainText fontSize={16} fontWeight={600}>
            {t('permissionTemplate')}
          </MainText>
          {!isOwner && (
            <Button
              width={'auto'}
              text={t_button('edit')}
              borderColor={MAIN.LIGHT}
              backgroundColor={WHITE}
              color={MAIN.DEFAULT}
              height={30}
              onClick={onClickEditTemplateOpen}
            />
          )}
        </TitleContainer>
        <LineContainer>
          <MainText fontSize={14} fontWeight={400} color={GRAY.SEMI_DARK}>
            {t('permissionTemplate')}
          </MainText>
          <MainText fontSize={14} fontWeight={500}>
            {isOwner
              ? t(CHURCH_USER_ROLE.OWNER)
              : targetChurchUser?.permissionTemplate?.title}
          </MainText>
        </LineContainer>
        <LineContainer>
          <MainText fontSize={14} fontWeight={400} color={GRAY.SEMI_DARK}>
            {t('description')}
          </MainText>
          <MainText fontSize={14} fontWeight={400} color={GRAY.DARK}></MainText>
        </LineContainer>
      </LabelContainer>
      {/* 권한 범위 */}
      <LabelContainer>
        <TitleContainer>
          <MainText fontSize={16} fontWeight={600}>
            {t('permissionScope')}
          </MainText>
          {!isOwner && (
            <Button
              width={'auto'}
              text={t_button('edit')}
              borderColor={MAIN.LIGHT}
              backgroundColor={WHITE}
              color={MAIN.DEFAULT}
              height={30}
              onClick={onClickGroupPopupOpen}
            />
          )}
        </TitleContainer>
        <LineContainer>
          <MainText fontSize={14} fontWeight={400} color={GRAY.SEMI_DARK}>
            {t('permissionScope')}
          </MainText>
          <MainText fontSize={14} fontWeight={400}>
            {isOwner
              ? t('all')
              : getPermissionScopeTitle(t, targetChurchUser.permissionScopes)}
          </MainText>
        </LineContainer>
      </LabelContainer>
      {/* 세부 권한 */}
      <LabelContainer>
        <TitleContainer>
          <MainText fontSize={16} fontWeight={600}>
            {t('header.permissionUnit')}
          </MainText>
        </TitleContainer>
        <PermissionUnitList
          selectedUnitIds={permissionUnits.map((unit) => unit.id)}
          isEditable={false}
        />
      </LabelContainer>

      {/* 계정 상태 */}
      <LabelContainer>
        <TitleContainer>
          <MainText fontSize={16} fontWeight={600}>
            {t('header.account')}
          </MainText>
        </TitleContainer>
        <LineContainer>
          <MainText fontSize={14} fontWeight={400} color={GRAY.SEMI_DARK}>
            {t('joinedAt')}
          </MainText>
          <MainText fontSize={14} fontWeight={500}>
            {getFormattedDate(targetChurchUser.joinedAt)}
          </MainText>
        </LineContainer>
        <LineContainer>
          <MainText fontSize={14} fontWeight={400} color={GRAY.SEMI_DARK}>
            {t('description')}
          </MainText>
          <MainText fontSize={14} fontWeight={400} color={GRAY.DARK}></MainText>
        </LineContainer>
      </LabelContainer>

      {/* 관리자 삭제  */}
      <BoxContainer>
        <DeleteWarningButton
          description={t_warning(isMy ? 'leaveManager' : 'deleteManager')}
          buttonText={t_button(isMy ? 'leaveManager' : 'deleteManager')}
          onClick={onClickConfirmOpen}
        />
      </BoxContainer>
    </InformationContainer>
  );
};

export default ChurchUserInformationView;
