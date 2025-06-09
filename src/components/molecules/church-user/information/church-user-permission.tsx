import styled from 'styled-components';
import { GRAY } from '@/constants/styles/color';
import ChurchUserPermissionView from '@/components/molecules/church-user/information/church-user-permission.view';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { BLANK } from '@/constants/constant';
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

const PermissionContainer = styled.div`
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
    useState<string>(targetChurchUser.permissionTemplate?.id || BLANK);

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
  const onChangeTemplate = async (id: string) => {
    try {
      await managersApi
        .assignPermissionTemplate(
          { churchId, managerId: targetChurchUser.memberId },
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
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const getPermissionUnits = async () => {
    try {
      const response = await permissionsApi.getPermissionTemplate({
        churchId,
        templateId: selectedPermissionTemplateId,
      });

      const newPermissionTemplate: PermissionTemplate = response.data.data;
      return newPermissionTemplate.permissionUnits;
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  useEffect(() => {
    getPermissionUnits().then((units) => {
      if (units) {
        setSelectedPermissionUnits(units);
      }
    });
  }, [selectedPermissionTemplateId]);

  const onChangeSelectedGroupIds = (ids: (string | null)[]) => {
    setSelectedGroupIds(ids);
  };

  const onClickDoneGroup = () => {};

  const props = {
    isGroupPopupShown,
    selectedGroupIds,
    selectedPermissionTemplateId,
    selectedPermissionUnits,
    onClickGroupPopupOpen,
    onClickGroupPopupClose,
    onChangeTemplate,
    onChangeSelectedGroupIds,
    onClickDoneGroup,
  };
  return (
    <>
      <ChurchUserPermissionView {...props} />
    </>
  );
};

export default ChurchUserPermission;
