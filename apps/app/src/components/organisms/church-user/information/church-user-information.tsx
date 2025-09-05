import React, { useEffect, useState } from 'react';
import ChurchUserInformationView, {
  ChurchUserInformationViewProps,
} from './church-user-information.view';
import { setTargetChurchUser } from '@/redux/reducers/target/target-church-user-reducer';
import { ChurchUsersApi } from '@/api/church-users/church-users.api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { BLANK } from '@mokjang/constants';
import { CustomPopup } from '@mokjang/components';
import LinkMemberUser from '@/components/molecules/join-request/link-member-user';
import { useScopedI18n } from '../../../../../locales/client';
import { PermissionTemplate, PermissionUnit } from '@mokjang/models';
import {
  fetchPermissionTemplates,
  setPermissionTemplates,
} from '@/redux/reducers/filter/permission-template-filter-reducer';
import { ChurchUser } from '@mokjang/models';
import { setChurchUsers } from '@/redux/reducers/filter/church-user-filter-reducer';
import { Group } from '@mokjang/models';
import { PermissionsApi } from '@/api/permissions/permissions.api';
import { ManagersApi } from '@/api/managers/managers.api';
import PermissionRange from '@/components/atoms/church-user/information/permission-range';
import EditPermissionTemplate from '@/components/molecules/church-user/information/edit-permission-template';
import ConfirmPopup from '@/components/atoms/common/popup/error-popup';

type ChurchUserInformationProps = {
  isMy?: boolean;
  isManager: boolean;
  onClickDelete: () => void;
};

const ChurchUserInformation = ({
  isMy,
  isManager,
  onClickDelete,
}: ChurchUserInformationProps) => {
  const t_title = useScopedI18n('title');
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');

  const churchUsersApi = new ChurchUsersApi(false);
  const permissionsApi = new PermissionsApi(false);
  const managersApi = new ManagersApi(false);

  const dispatch = useDispatch<AppDispatch>();
  const { churchId } = useSelector((state: RootState) => state.church);
  const { targetChurchUser } = useSelector(
    (state: RootState) => state.targetChurchUser
  );
  const { churchUsers } = useSelector(
    (state: RootState) => state.churchUserFilter
  );

  const [isEditTemplateShown, setIsEditTemplateShown] =
    useState<boolean>(false);

  const [isLinkPopupShown, setLinkPopupShown] = useState<boolean>(false);

  const [selectedMemberId, setSelectedMemberId] = useState<string>(BLANK);

  const [isGroupPopupShown, setIsGroupPopupShown] = useState<boolean>(false);

  const [selectedGroupIds, setSelectedGroupIds] = useState<(string | null)[]>(
    []
  );

  const [selectedPermissionTemplateId, setSelectedPermissionTemplateId] =
    useState<string | null>(targetChurchUser.permissionTemplate?.id || null);

  const [selectedPermissionUnits, setSelectedPermissionUnits] = useState<
    PermissionUnit[]
  >([]);

  // 삭제 확인 팝업
  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onClickConfirmOpen = () => {
    setIsPopupShown(true);
  };

  const onClickConfirmClose = () => {
    setIsPopupShown(false);
  };

  const onClickTemplateItem = (id: string) => {
    if (id === selectedPermissionTemplateId) {
      setSelectedPermissionTemplateId(null);
    } else {
      setSelectedPermissionTemplateId(id);
    }
  };

  const onClickEditTemplateOpen = () => {
    setIsEditTemplateShown(true);
  };
  const onClickEditTemplateClose = () => {
    setIsEditTemplateShown(false);
    setSelectedPermissionTemplateId(targetChurchUser?.permissionTemplate?.id);
  };

  const onClickLink = () => {
    setLinkPopupShown(true);
  };

  const onClickCancelLink = () => {
    setLinkPopupShown(false);
  };

  const onClickLinkDone = async () => {
    try {
      await churchUsersApi.unlinkMember({
        churchId,
        churchUserId: targetChurchUser.id,
      });

      await churchUsersApi
        .linkMember(
          { churchId, churchUserId: targetChurchUser.id },
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

  // 교회 내의 권한 유형들 불러오기
  useEffect(() => {
    const fetchInitialPermissionTemplates = async () => {
      try {
        const result = await dispatch(
          fetchPermissionTemplates({
            currentPage: 1,
          })
        );
        if (fetchPermissionTemplates.fulfilled.match(result)) {
          dispatch(setPermissionTemplates(result.payload));
        }
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    };

    fetchInitialPermissionTemplates();
  }, []);

  // 권한 범위 팝업 열기
  const onClickGroupPopupOpen = () => setIsGroupPopupShown(true);
  // 권한 범위 팝업 닫기
  const onClickGroupPopupClose = () => {
    setIsGroupPopupShown(false);
    setSelectedGroupIds(
      targetChurchUser.permissionScopes.map((scope) => scope.group?.id || null)
    );
  };

  // 권한 유형 드롭다운 선택
  const onClickSaveTemplate = async (id: string | null) => {
    try {
      if (id) {
        await managersApi
          .assignPermissionTemplate(
            { churchId, churchUserId: targetChurchUser.id },
            {
              permissionTemplateId: id,
            }
          )
          .then((response) => {
            const newChurchUser: ChurchUser = response.data.data;
            dispatch(setTargetChurchUser(newChurchUser));

            const newChurchUsers = churchUsers.map((churchUser) => {
              if (churchUser.id === newChurchUser.id) {
                return newChurchUser;
              } else {
                return churchUser;
              }
            });
            dispatch(setChurchUsers(newChurchUsers));
            setSelectedPermissionTemplateId(id);
          });
      } else {
        await managersApi
          .unassignPermissionTemplate({
            churchId,
            churchUserId: targetChurchUser.id,
          })
          .then((response) => {
            const newChurchUser: ChurchUser = response.data.data;
            dispatch(setTargetChurchUser(newChurchUser));

            const newChurchUsers = churchUsers.map((churchUser) => {
              if (churchUser.id === newChurchUser.id) {
                return newChurchUser;
              } else {
                return churchUser;
              }
            });
            dispatch(setChurchUsers(newChurchUsers));
            setSelectedPermissionTemplateId(id);
          });
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const getPermissionUnits = async () => {
    if (selectedPermissionTemplateId) {
      try {
        const response = await permissionsApi.getPermissionTemplate({
          churchId,
          templateId: selectedPermissionTemplateId,
        });

        const newPermissionTemplate: PermissionTemplate = response.data.data;
        return newPermissionTemplate.permissionUnits;
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    }
  };

  useEffect(() => {
    getPermissionUnits().then((units) => {
      if (units) {
        setSelectedPermissionUnits(units);
      }
    });
  }, [selectedPermissionTemplateId]);

  const onClickDoneGroup = async () => {
    try {
      const isAllGroups = selectedGroupIds.includes(null);
      const groupIds = selectedGroupIds.filter((groupId) => groupId !== null);
      const response = await managersApi.editPermissionScopes(
        {
          churchId,
          churchUserId: targetChurchUser.id,
        },
        {
          isAllGroups,
          groupIds,
        }
      );
      const newChurchUser = response.data;
      dispatch(setTargetChurchUser(newChurchUser));
      const newChurchUsers = churchUsers.map((churchUser) => {
        if (churchUser.id === targetChurchUser.id) return newChurchUser;
        else return churchUser;
      });
      dispatch(setChurchUsers(newChurchUsers));

      setIsGroupPopupShown(false);

      setSelectedGroupIds(
        targetChurchUser.permissionScopes.map(
          (scope) => scope.group?.id || null
        )
      );
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const getGroupIds = (group: Group): string[] => {
    // 재귀적으로 현재 그룹과 모든 하위 그룹의 ID를 수집
    let collectedIds: string[] = [group.id as string]; // 본인 그룹의 ID 추가
    if (group.childGroups && group.childGroups.length > 0) {
      group.childGroups.forEach((child) => {
        collectedIds = collectedIds.concat(getGroupIds(child)); // 하위 그룹의 자식들도 재귀적으로 추가
      });
    }
    return collectedIds;
  };

  // 새로운 그룹을 설정
  const onClickGroup = (group: Group) => {
    let newSelectedGroupIds: (string | null)[];

    if (selectedGroupIds.includes(group.id)) {
      // 선택 해제
      newSelectedGroupIds = selectedGroupIds.filter((id) => id !== group.id);
    } else {
      // 선택 추가
      const childIdsToRemove = getGroupIds(group);

      newSelectedGroupIds = [
        ...selectedGroupIds.filter(
          (id) => !childIdsToRemove.includes(id ?? '')
        ),
        group.id,
      ];
    }

    setSelectedGroupIds(newSelectedGroupIds);
  };

  useEffect(() => {
    setIsGroupPopupShown(false);
    setSelectedGroupIds(
      targetChurchUser.permissionScopes.map((scope) => scope.group?.id || null)
    );
  }, [targetChurchUser.id]);

  const props = {
    isMy,
    isManager,
    onClickEditTemplateOpen,
    onClickLink,
    onClickGroupPopupOpen,
    onClickConfirmOpen,
  } as ChurchUserInformationViewProps;

  return (
    <>
      <ChurchUserInformationView {...props} />

      {/* 삭제 확인 팝업 */}
      <ConfirmPopup
        title={t_popup('deleteChurchUserTitle')}
        body={t_popup('deleteChurchUserBody')}
        buttonNum={2}
        isShow={isPopupShown}
        onClickLeftButton={onClickConfirmClose}
        onClickRightButton={() => {
          onClickDelete();
          onClickConfirmClose();
        }}
        leftButtonText={t_button('cancel')}
        rightButtonText={t_button('delete')}
      />

      {/* 교인 연결 팝업 */}
      <CustomPopup
        isShow={isLinkPopupShown}
        onClickCancel={onClickCancelLink}
        width={500}
        height={850}
        headerTitle={t_title('linkMemberUser')}
        doneText={t_button('link')}
        onClickDone={onClickLinkDone}
      >
        <LinkMemberUser
          prevMember={targetChurchUser.member}
          onChangeLinkMember={onChangeLinkMember}
        />
      </CustomPopup>

      {/* 그룹 선택 팝업 */}
      <CustomPopup
        isShow={isGroupPopupShown}
        onClickCancel={onClickGroupPopupClose}
        width={500}
        height={600}
        onClickDone={onClickDoneGroup}
        doneText={t_button('save')}
        isHeaderShown={false}
      >
        <PermissionRange
          selectedGroupIds={selectedGroupIds}
          onClickGroup={onClickGroup}
        />
      </CustomPopup>

      {/* 권한그룹 선택 팝업 */}
      <CustomPopup
        isShow={isEditTemplateShown}
        onClickCancel={onClickEditTemplateClose}
        width={500}
        height={600}
        onClickDone={() => onClickSaveTemplate(selectedPermissionTemplateId)}
        doneText={t_button('save')}
        headerTitle={t_title('editPermissionTemplate')}
      >
        <EditPermissionTemplate
          selectedTemplateId={selectedPermissionTemplateId}
          onClickTemplateItem={onClickTemplateItem}
        />
      </CustomPopup>
    </>
  );
};

export default ChurchUserInformation;
