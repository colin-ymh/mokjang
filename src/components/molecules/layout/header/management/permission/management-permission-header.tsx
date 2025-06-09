import ManagementPermissionHeaderView from '@/components/molecules/layout/header/management/permission/management-permission-header.view';
import { usePageRouter } from '@/utils/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { PermissionsApi } from '@/api/permissions/permissions.api';

import { DEFAULT_PERMISSION_TEMPLATE } from '@/models/permission/permission';
import { getIsWellFormedTitle } from '@/utils/check';
import { setTargetPermissionTemplate } from '@/redux/reducers/target/target-permission-template-reducer';
import { setPermissionTemplates } from '@/redux/reducers/filter/permission-template-filter-reducer';

type ManagementPermissionHeaderProps = {};

const ManagementPermissionHeader = ({}: ManagementPermissionHeaderProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = usePageRouter();
  const { permissionTemplates } = useSelector(
    (state: RootState) => state.permissionTemplateFilter
  );

  const { targetPermissionTemplate } = useSelector(
    (state: RootState) => state.targetPermissionTemplate
  );
  const churchId = useSelector((state: RootState) => state.church.churchId);

  const permissionsApi = new PermissionsApi(false);

  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);

  const [isAddPermissionTemplateOpened, setIsAddPermissionTemplateOpened] =
    useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 헤더 탭바 이벤트
  const onClickHeaderBar = (id: string) => {
    router.push(`/main/permission/${id}`);
  };

  const onClickAddPermissionTemplate = () => {
    setIsAddPermissionTemplateOpened(true);
    dispatch(
      setTargetPermissionTemplate({
        ...DEFAULT_PERMISSION_TEMPLATE,
        id: 'TEMP',
      })
    );
  };

  const onClickCloseModal = () => {
    setIsAddPermissionTemplateOpened(false);
    dispatch(setTargetPermissionTemplate(DEFAULT_PERMISSION_TEMPLATE));
  };

  const onClickSavePermissionTemplate = async () => {
    try {
      await permissionsApi
        .createPermissionTemplate(
          { churchId },
          {
            title: targetPermissionTemplate.title,
            unitIds: targetPermissionTemplate.unitIds,
          }
        )
        .then((response) => {
          const tempPermissionTemplate = response.data.data;

          permissionsApi
            .getPermissionTemplate({
              churchId,
              templateId: tempPermissionTemplate.id,
            })
            .then((response) => {
              const newPermissionTemplate = response.data.data;

              const newPermissionTemplates = [
                ...permissionTemplates,
                newPermissionTemplate,
              ];
              dispatch(setPermissionTemplates(newPermissionTemplates));
            });
        });
      setIsAddPermissionTemplateOpened(false);
      dispatch(setTargetPermissionTemplate(DEFAULT_PERMISSION_TEMPLATE));
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  useEffect(() => {
    if (!getIsWellFormedTitle(targetPermissionTemplate.title)) {
      setIsSaveEnabled(false);
      return;
    }
    setIsSaveEnabled(true);
  }, [targetPermissionTemplate]);

  const props = {
    isSaveEnabled,
    isAddPermissionTemplateOpened,
    onClickHeaderBar,
    onClickAddPermissionTemplate,
    onClickCloseModal,
    onClickSavePermissionTemplate,
  };

  return (
    <>
      <ManagementPermissionHeaderView {...props} />
    </>
  );
};
export default ManagementPermissionHeader;
