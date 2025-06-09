import styled from 'styled-components';
import { GRAY } from '@/constants/styles/color';
import ChurchUserAccountView from '@/components/molecules/church-user/information/church-user-account.view';
import { useState } from 'react';
import { ChurchUsersApi } from '@/api/church-users/church-users.api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setTargetChurchUser } from '@/redux/reducers/target/target-church-user-reducer';
import { BLANK } from '@/constants/constant';

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

type ChurchUserAccountProps = {};

const ChurchUserAccount = ({}: ChurchUserAccountProps) => {
  const churchUsersApi = new ChurchUsersApi(false);
  const dispatch = useDispatch<AppDispatch>();
  const { churchId } = useSelector((state: RootState) => state.church);
  const { targetChurchUser } = useSelector(
    (state: RootState) => state.targetChurchUser
  );

  const [isLinkPopupShown, setLinkPopupShown] = useState<boolean>(false);

  const [selectedMemberId, setSelectedMemberId] = useState<string>(BLANK);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onClickLink = () => {
    setLinkPopupShown(true);
  };

  const onClickCancelLink = () => {
    setLinkPopupShown(false);
  };

  const onClickLinkDone = async () => {
    try {
      await churchUsersApi
        .linkMember(
          { churchId, userId: targetChurchUser.userId },
          { linkMemberId: selectedMemberId }
        )
        .then((response) => {});
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const onChangeLinkMember = (memberId: string) => {
    setSelectedMemberId(memberId);
  };

  const onClickUnlink = async () => {
    try {
      await churchUsersApi
        .unlinkMember({ churchId, userId: targetChurchUser.userId })
        .then((response) => {
          const newChurchUser = response.data.data;
          dispatch(setTargetChurchUser(newChurchUser));
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const props = {
    isLinkPopupShown,
    onClickLink,
    onClickUnlink,
    onClickCancelLink,
    onChangeLinkMember,
    onClickLinkDone,
  };
  return (
    <>
      <ChurchUserAccountView {...props} />
    </>
  );
};

export default ChurchUserAccount;
