import styled from 'styled-components';
import MemberProfile from '../../../atoms/member/member-profile';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { MainText } from '../../../atoms/common/text/main-text';
import Button from '../../../atoms/common/button/button';
import { GRAY, WHITE } from '../../../../constants/styles/color';
import { getFormattedDate } from '../../../../utils/format';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import LinkMemberUser from '../../join-request/link-member-user';
import CustomPopup from '../../../atoms/common/popup/custom-popup';
import React from 'react';

const AccountContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const RowContainer = styled.div`
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

type ChurchUserAccountViewProps = {
  isLinkPopupShown: boolean;
  onClickLink: () => void;
  onClickUnlink: () => void;
  onClickCancelLink: () => void;
  onChangeLinkMember: (memberId: string) => void;
  onClickLinkDone: () => void;
};

const ChurchUserAccountView = ({
  isLinkPopupShown,
  onClickLink,
  onClickUnlink,
  onClickCancelLink,
  onChangeLinkMember,
  onClickLinkDone,
}: ChurchUserAccountViewProps) => {
  const { targetChurchUser } = useSelector(
    (state: RootState) => state.targetChurchUser
  );
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_title = useScopedI18n('title');
  return (
    <AccountContainer>
      <RowContainer>
        {targetChurchUser?.member ? (
          <MemberProfile member={targetChurchUser.member} />
        ) : (
          <MainText>{t('linkedMemberUndefined')}</MainText>
        )}
        {targetChurchUser?.member ? (
          <Button
            text={t_button('unlinkMemberInformation')}
            height={30}
            width={120}
            backgroundColor={WHITE}
            color={GRAY.SEMI_DARK}
            borderColor={GRAY.SEMI_LIGHT}
            onClick={onClickUnlink}
          />
        ) : (
          <Button
            text={t_button('linkMemberInformation')}
            height={30}
            width={120}
            onClick={onClickLink}
          />
        )}
      </RowContainer>
      <RowContainer>
        <MainText>{t('joinedAt')}</MainText>
        <MainText>{getFormattedDate(targetChurchUser.joinedAt)}</MainText>
      </RowContainer>
      <RowContainer>
        <MainText>{t('lastLogin')}</MainText>
        <MainText>{}</MainText>
      </RowContainer>
      {/* 교인 연결 팝업 */}
      <CustomPopup
        isShow={isLinkPopupShown}
        onClickCancel={onClickCancelLink}
        width={400}
        height={600}
        headerTitle={t_title('linkMemberUser')}
        doneText={t_button('link')}
        onClickDone={onClickLinkDone}
      >
        <LinkMemberUser onChangeLinkMember={onChangeLinkMember} />
      </CustomPopup>
    </AccountContainer>
  );
};

export default ChurchUserAccountView;
