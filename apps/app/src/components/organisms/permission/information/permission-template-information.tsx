import React, { useEffect, useState } from 'react';
import PermissionTemplateInformationView from './permission-template-information.view';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import {
  fetchPermissionManagers,
  setPermissionManagers,
  setPermissionTemplates,
} from '../../../../redux/reducers/filter/permission-template-filter-reducer';
import { BLANK, CHURCH_USER_ROLE } from '../../../../constants/constant';
import ConfirmPopup from '@/components/atoms/common/popup/error-popup';
import { useScopedI18n } from '../../../../../locales/client';
import { setTargetPermissionTemplate } from '@/redux/reducers/target/target-permission-template-reducer';
import {
  ACTION,
  DOMAIN,
  PermissionTemplate,
} from '@/models/permission/permission';
import { getIsWellFormedTitle } from '@/utils/check';
import { PermissionsApi } from '@/api/permissions/permissions.api';
import { CustomPopup } from '@mokjang/components';
import EditPermissionTemplate from '@/components/organisms/permission/edit/edit-permission-template';

type PermissionTemplateInformationProps = {
  onClickDelete: () => void;
};

const PermissionTemplateInformation = ({
  onClickDelete,
}: PermissionTemplateInformationProps) => {
  const t_title = useScopedI18n('title');
  const t_popup = useScopedI18n('popup');
  const t_button = useScopedI18n('button');

  const dispatch = useDispatch<AppDispatch>();
  const permissionsApi = new PermissionsApi(false);

  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );

  const { targetPermissionTemplate } = useSelector(
    (state: RootState) => state.targetPermissionTemplate
  );
  const { permissionTemplates } = useSelector(
    (state: RootState) => state.permissionTemplateFilter
  );

  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);

  // 수정 팝업 On/Off
  const [isEditShown, setIsEditShown] = useState<boolean>(false);

  const [isEditUnit, setIsEditUnit] = useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onClickEditUnitOpen = () => {
    setIsEditUnit(true);
  };

  const onClickEditUnitClose = () => {
    fetchPermissionTemplate();
    setIsEditUnit(false);
  };

  const onChangeUnits = (unitIds: string[]) => {
    dispatch(
      setTargetPermissionTemplate({
        ...targetPermissionTemplate,
        permissionUnits: unitIds.map((id) => {
          return { id, domain: DOMAIN.MEMBER, action: ACTION.READ };
        }),
      })
    );
  };

  const onClickUnitSave = async () => {
    try {
      await permissionsApi
        .editPermissionTemplate(
          {
            churchId,
            templateId: targetPermissionTemplate.id,
          },
          {
            unitIds: targetPermissionTemplate.permissionUnits.map((unit) =>
              unit.id.toString()
            ),
          }
        )
        .then(async (response) => {
          const newPermissionTemplate: PermissionTemplate = response.data.data;

          const newPermissionTemplates = permissionTemplates.map((v) => {
            return v.id !== newPermissionTemplate.id
              ? v
              : newPermissionTemplate;
          });

          dispatch(setPermissionTemplates(newPermissionTemplates));
          dispatch(setTargetPermissionTemplate(newPermissionTemplate));

          setIsEditUnit(false);
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const fetchPermissionTemplate = async () => {
    if (targetPermissionTemplate.id && targetPermissionTemplate.id !== BLANK) {
      try {
        const response = await permissionsApi.getPermissionTemplate({
          churchId,
          templateId: targetPermissionTemplate.id,
        });

        const newPermissionTemplate: PermissionTemplate = response.data.data;
        dispatch(setTargetPermissionTemplate(newPermissionTemplate));
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    }
  };

  useEffect(() => {
    if (
      targetPermissionTemplate.id &&
      targetPermissionTemplate.id !== CHURCH_USER_ROLE.OWNER
    ) {
      fetchPermissionTemplate();
      dispatch(
        fetchPermissionManagers({
          templateId: targetPermissionTemplate.id,
        })
      );
    } else {
      dispatch(setPermissionManagers([]));
    }
  }, [targetPermissionTemplate.id]);

  // 삭제 확인 팝업
  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);

  const onClickConfirmOpen = () => {
    setIsPopupShown(true);
  };

  const onClickConfirmClose = () => {
    setIsPopupShown(false);
  };

  const onClickEditDone = async () => {
    try {
      // 1. 메인 심방 정보 수정
      await permissionsApi
        .editPermissionTemplate(
          {
            churchId,
            templateId: targetPermissionTemplate.id,
          },
          {
            title: permissionTemplates
              .map((template) => template.title)
              .includes(targetPermissionTemplate.title)
              ? undefined
              : targetPermissionTemplate.title,
            unitIds: targetPermissionTemplate.unitIds || undefined,
          }
        )
        .then(async (response) => {
          const newPermissionTemplate: PermissionTemplate = response.data.data;

          const newPermissionTemplates = permissionTemplates.map((v) => {
            return v.id !== newPermissionTemplate.id
              ? v
              : newPermissionTemplate;
          });

          dispatch(setPermissionTemplates(newPermissionTemplates));
          dispatch(setTargetPermissionTemplate(newPermissionTemplate));

          setIsEditShown(false);
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 수정 페이지 종료
  const onClickEditClose = () => {
    fetchPermissionTemplate();
    setIsEditShown(false);
  };

  // 수정 페이지 열기
  const onClickEditOpen = () => {
    setIsEditShown(true);
  };

  useEffect(() => {
    setIsPopupShown(false);
  }, [targetPermissionTemplate]);

  useEffect(() => {
    if (!getIsWellFormedTitle(targetPermissionTemplate.title)) {
      setIsSaveEnabled(false);
      return;
    }

    setIsSaveEnabled(true);
  }, [targetPermissionTemplate]);

  const props = {
    isEditShown,
    isEditUnit,
    onClickEditOpen,
    onClickEditUnitOpen,
    onClickEditUnitClose,
    onChangeUnits,
    onClickUnitSave,
    onClickConfirmOpen,
  };

  return (
    <>
      <PermissionTemplateInformationView {...props} />

      {/* 삭제 확인 팝업 */}
      <ConfirmPopup
        title={t_popup('deletePermissionTemplateTitle')}
        body={t_popup('deletePermissionTemplateBody')}
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

      {/* 수정 팝업 */}
      <CustomPopup
        isShow={isEditShown}
        onClickCancel={onClickEditClose}
        width={500}
        height={400}
        headerTitle={t_title('editPermissionTemplate')}
        onClickDone={onClickEditDone}
        doneDisabled={!isSaveEnabled}
        cancelText={t_button('cancel')}
        doneText={t_button('save')}
      >
        <EditPermissionTemplate />
      </CustomPopup>
    </>
  );
};

export default PermissionTemplateInformation;
