import ChurchUserPermissionView from '@/components/molecules/church-user/information/church-user-permission.view';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchPermissionTemplates,
  setPermissionTemplates,
} from '@/redux/reducers/filter/permission-template-filter-reducer';
import {
  PermissionTemplate,
  PermissionUnit,
} from '@/models/permission/permission';
import { PermissionsApi } from '@/api/permissions/permissions.api';
import { ManagersApi } from '@/api/managers/managers.api';
import { ChurchUser } from '@/models/church-user/church-user';
import { setTargetChurchUser } from '@/redux/reducers/target/target-church-user-reducer';
import { setChurchUsers } from '@/redux/reducers/filter/church-user-filter-reducer';
import { Group } from '@/models/management/management';

type ChurchUserPermissionProps = {};

const ChurchUserPermission = ({}: ChurchUserPermissionProps) => {
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

  const [isGroupPopupShown, setIsGroupPopupShown] = useState<boolean>(false);

  const [selectedGroupIds, setSelectedGroupIds] = useState<(string | null)[]>(
    []
  );

  const [selectedPermissionTemplateId, setSelectedPermissionTemplateId] =
    useState<string | null>(targetChurchUser.permissionTemplate?.id || null);

  const [selectedPermissionUnits, setSelectedPermissionUnits] = useState<
    PermissionUnit[]
  >([]);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 교회 내의 권한 유형들 불러오기
  useEffect(() => {
    const fetchInitialPermissionTemplates = async () => {
      try {
        const result = await dispatch(
          fetchPermissionTemplates({
            churchId,
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
  }, [churchId]);

  // 권한 범위 팝업 열기
  const onClickGroupPopupOpen = () => setIsGroupPopupShown(true);
  // 권한 범위 팝업 닫기
  const onClickGroupPopupClose = () => setIsGroupPopupShown(false);

  // 권한 유형 드롭다운 선택
  const onChangeTemplate = async (id: string | null) => {
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
    isGroupPopupShown,
    selectedGroupIds,
    selectedPermissionTemplateId,
    selectedPermissionUnits,
    onClickGroupPopupOpen,
    onClickGroupPopupClose,
    onChangeTemplate,
    onClickGroup,
    onClickDoneGroup,
  };
  return (
    <>
      <ChurchUserPermissionView {...props} />
    </>
  );
};

export default ChurchUserPermission;
