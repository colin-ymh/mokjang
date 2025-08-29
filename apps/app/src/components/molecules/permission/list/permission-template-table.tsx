import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import {
  setPermissionTemplateOrderBy,
  setPermissionTemplateOrderDirection,
} from '../../../../redux/reducers/filter/permission-template-filter-reducer';

import PermissionTemplateTableView from './permission-template-table.view';
import { PERMISSION_TEMPLATE } from '../../../../constants/column/permission-column';
import { ORDER_DIRECTION } from '../../../../constants/constant';

export type PermissionTemplateTableProps = {
  onClickPermissionTemplateItem: (permissionTemplateId: string) => void;
  loadPermissionTemplates: () => Promise<void>;
};

const PermissionTemplateTable = ({
  onClickPermissionTemplateItem,
  loadPermissionTemplates,
}: PermissionTemplateTableProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    permissionTemplates,
    permissionTemplateFilter,
    permissionTemplateOrderBy,
    permissionTemplateOrderDirection,
  } = useSelector((state: RootState) => state.permissionTemplateFilter);

  // 열 헤더를 눌러 정렬
  const onClickHeader = (id: PERMISSION_TEMPLATE) => {
    let newOrderBy = id;

    if (newOrderBy !== permissionTemplateOrderBy) {
      dispatch(setPermissionTemplateOrderBy(newOrderBy));
      dispatch(setPermissionTemplateOrderDirection(ORDER_DIRECTION.ASC));
    } else {
      dispatch(
        setPermissionTemplateOrderDirection(
          permissionTemplateOrderDirection === ORDER_DIRECTION.ASC
            ? ORDER_DIRECTION.DESC
            : ORDER_DIRECTION.ASC
        )
      );
    }
  };

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

      // 스크롤이 최하단에 도달했는지 확인
      if (scrollTop + clientHeight >= scrollHeight) {
        loadPermissionTemplates(); // 데이터를 추가로 로드
      }
    }
  };

  // 정렬 변경 시 스크롤을 최상단으로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [
    permissionTemplateOrderBy,
    permissionTemplateOrderDirection,
    permissionTemplateFilter,
  ]);

  const props = {
    permissionTemplates,
    onClickHeader,
    onClickPermissionTemplateItem,
    scrollRef,
    onScroll,
  };

  return (
    <>
      <PermissionTemplateTableView {...props} />
    </>
  );
};

export default PermissionTemplateTable;
