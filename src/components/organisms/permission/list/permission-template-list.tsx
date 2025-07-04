import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchPermissionTemplates,
  setPermissionTemplates,
} from '@/redux/reducers/filter/permission-template-filter-reducer';

import PermissionTemplateListView from '@/components/organisms/permission/list/permission-template-list.view';
import {
  DEFAULT_PERMISSION_TEMPLATE,
  PermissionTemplate,
} from '@/models/permission/permission';
import { setTargetPermissionTemplate } from '@/redux/reducers/target/target-permission-template-reducer';
import { getIsWellFormedTitle } from '@/utils/check';
import { PermissionsApi } from '@/api/permissions/permissions.api';
import { CHURCH_USER_ROLE } from '@/constants/constant';
import { getOwnerPermissionTemplate } from '@/utils/permission';
import { useI18n } from '../../../../../locales/client';

type PermissionTemplateListProps = {};

const PermissionTemplateList = ({}: PermissionTemplateListProps) => {
  const permissionsApi = new PermissionsApi(false);
  const t = useI18n();
  const dispatch = useDispatch<AppDispatch>();

  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );
  const {
    permissionUnits,
    permissionTemplates,
    permissionTemplateFilter,
    permissionTemplateOrderBy,
    permissionTemplateOrderDirection,
  } = useSelector((state: RootState) => state.permissionTemplateFilter);
  const { targetPermissionTemplate } = useSelector(
    (state: RootState) => state.targetPermissionTemplate
  );

  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 상세정보 팝업 On/Off
  const [
    isPermissionTemplateInformationShown,
    setIsPermissionTemplateInformationShown,
  ] = useState<boolean>(false);

  // 수정 팝업 On/Off
  const [isEditShown, setIsEditShown] = useState<boolean>(false);

  // 서버에서 불러오는 교인 목록 페이지
  const [page, setPage] = useState<number>(1);

  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 삭제 확인 팝업
  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);

  const onClickConfirmOpen = () => {
    setIsPopupShown(true);
  };

  const onClickConfirmClose = () => {
    setIsPopupShown(false);
  };

  // 무한 스크롤로 데이터 추가 로드
  const loadPermissionTemplates = async () => {
    if (isLoading) return; // 로딩 중에는 추가 요청 방지
    setIsLoading(true);

    try {
      const result = await dispatch(
        fetchPermissionTemplates({
          currentPage: page + 1,
        })
      );
      if (fetchPermissionTemplates.fulfilled.match(result)) {
        const newPermissionTemplates: PermissionTemplate[] = result.payload;
        if (newPermissionTemplates.length > 0) {
          // 기존 데이터와 합치면서 중복 제거
          const existingIds = new Set(
            permissionTemplates.map(
              (permissionTemplate) => permissionTemplate.id
            )
          );
          const filteredNewPermissionTemplates = newPermissionTemplates.filter(
            (permissionTemplate) => !existingIds.has(permissionTemplate.id)
          );
          dispatch(
            setPermissionTemplates([
              ...permissionTemplates,
              ...filteredNewPermissionTemplates,
            ])
          );
          setPage((prev) => prev + 1); // 다음 페이지로 이동
        }
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 정보가 변경될 때, 교인들을 다시 불러오는 부분
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
          setPage(1);
        }
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    };

    fetchInitialPermissionTemplates();
  }, [
    churchId,
    permissionTemplateFilter,
    permissionTemplateOrderBy,
    permissionTemplateOrderDirection,
  ]);

  const onClickEditDone = async () => {
    try {
      // 1. 메인 심방 정보 수정
      await permissionsApi.editPermissionTemplate(
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
      );

      await permissionsApi
        .getPermissionTemplate({
          churchId,
          templateId: targetPermissionTemplate.id,
        })
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
          setTimeout(() => {
            setIsPermissionTemplateInformationShown(true);
          }, 500);
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 목록에서 업무을 선택하여 상세 페이지로 이동
  const onClickPermissionTemplateItem = async (templateId: string) => {
    try {
      let permissionTemplate: PermissionTemplate;
      if (templateId === CHURCH_USER_ROLE.OWNER) {
        permissionTemplate = getOwnerPermissionTemplate(
          t,
          churchId,
          permissionUnits
        );
      } else {
        const response = await permissionsApi.getPermissionTemplate({
          churchId,
          templateId,
        });
        permissionTemplate = response.data.data;
      }

      dispatch(
        setTargetPermissionTemplate({
          ...permissionTemplate,
          unitIds: permissionTemplate.permissionUnits.map((unit) => unit.id),
        })
      );
      setIsPermissionTemplateInformationShown(true);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 상세 페이지 종료
  const onClickClose = () => {
    setIsPermissionTemplateInformationShown(false);
    dispatch(setTargetPermissionTemplate(DEFAULT_PERMISSION_TEMPLATE));
  };

  // 삭제하기
  const onClickDelete = async () => {
    try {
      const response = await permissionsApi.deletePermissionTemplate({
        churchId,
        templateId: targetPermissionTemplate.id,
      });
      if (response.status === 200) {
        // 초기화 후 다시 로드
        setPage(1);
        const result = await dispatch(
          fetchPermissionTemplates({
            currentPage: 1,
          })
        );
        if (fetchPermissionTemplates.fulfilled.match(result)) {
          dispatch(setPermissionTemplates(result.payload));
        }
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setTargetPermissionTemplate(DEFAULT_PERMISSION_TEMPLATE));
      setIsPermissionTemplateInformationShown(false);
    }
  };

  // 수정 페이지 종료
  const onClickEditClose = () => {
    const prevPermissionTemplate = permissionTemplates.find(
      (template) => template.id === targetPermissionTemplate.id
    );
    if (prevPermissionTemplate) {
      dispatch(
        setTargetPermissionTemplate({
          ...prevPermissionTemplate,
          permissionUnits: targetPermissionTemplate.permissionUnits,
        })
      );
    }
    setIsEditShown(false);
    setTimeout(() => {
      setIsPermissionTemplateInformationShown(true);
    }, 500);
  };

  // 수정 페이지 열기
  const onClickEditOpen = () => {
    setIsPermissionTemplateInformationShown(false);
    setTimeout(() => {
      setIsEditShown(true);
    }, 500);
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
    list: {
      onClickPermissionTemplateItem,
      loadPermissionTemplates,
    },
    information: {
      isSaveEnabled,
      isPermissionTemplateInformationShown,
      isEditShown,
      isLoading,
      isPopupShown,
      onClickClose,
      onClickDelete,
      onClickConfirmOpen,
      onClickConfirmClose,
      onClickEditDone,
      onClickEditOpen,
      onClickEditClose,
    },
  };

  return (
    <>
      <PermissionTemplateListView {...props} />
    </>
  );
};

export default PermissionTemplateList;
