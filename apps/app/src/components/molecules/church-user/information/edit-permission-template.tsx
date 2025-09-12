'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import styled from 'styled-components';
import { CURSOR, GRAY, MAIN, WHITE } from '@mokjang/constants';
import { PermissionTemplate } from '@mokjang/models';
import { MainText, RadioButton, SvgIcon } from '@mokjang/components';
import { useScopedI18n } from '../../../../../locales/client';
import { Svg } from '@mokjang/assets';
import {
  fetchPermissionTemplates,
  setPermissionTemplates,
} from '@/redux/reducers/filter/permission-template-filter-reducer';

const TemplateList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
  max-height: 420px; /* 필요 시 조정 */
  overflow-y: auto;
`;

const TemplateItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: row;
  padding: 20px 10px;
  gap: 10px;
  border-radius: 10px;
  background-color: ${({ $isSelected }) =>
    $isSelected ? MAIN.EXTRA_LIGHT : WHITE};
  border: ${({ $isSelected }) =>
    `1px solid ${$isSelected ? MAIN.DEFAULT : GRAY.LIGHT}`};
  cursor: pointer;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const DescriptionItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  gap: 10px;
  border-radius: 10px;
  background-color: ${MAIN.EXTRA_LIGHT};
  border: 1px solid ${MAIN.LIGHT};
`;

type EditPermissionTemplateProps = {
  selectedTemplateId: string | null;
  onClickTemplateItem: (id: string) => void;
};

const EditPermissionTemplate = ({
  selectedTemplateId,
  onClickTemplateItem,
}: EditPermissionTemplateProps) => {
  const t_description = useScopedI18n('description');
  const dispatch = useDispatch<AppDispatch>();

  const {
    permissionTemplates,
    permissionTemplateFilter,
    permissionTemplateOrderBy,
    permissionTemplateOrderDirection,
  } = useSelector((state: RootState) => state.permissionTemplateFilter);

  // 내부 상태: 페이지/로딩
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 스크롤 ref
  const scrollRef = useRef<HTMLDivElement | null>(null);

  /** 초기/필터 변경 시 첫 페이지 재로딩 */
  useEffect(() => {
    const fetchInitial = async () => {
      setIsLoading(true);
      try {
        const result = await dispatch(
          fetchPermissionTemplates({
            currentPage: 1,
          })
        );
        if (fetchPermissionTemplates.fulfilled.match(result)) {
          // 첫 페이지는 갈아끼우기
          dispatch(setPermissionTemplates(result.payload));
          setPage(1);
          // 스크롤 맨 위로
          if (scrollRef.current) scrollRef.current.scrollTop = 0;
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitial();
  }, [
    dispatch,
    permissionTemplateFilter,
    permissionTemplateOrderBy,
    permissionTemplateOrderDirection,
  ]);

  /** 바닥 도달 시 다음 페이지 로드 */
  const loadMore = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const result = await dispatch(
        fetchPermissionTemplates({
          currentPage: page + 1,
        })
      );
      if (fetchPermissionTemplates.fulfilled.match(result)) {
        const newItems: PermissionTemplate[] = result.payload || [];
        if (newItems.length > 0) {
          // 중복 제거 병합
          const existingIds = new Set(permissionTemplates.map((t) => t.id));
          const merged = [
            ...permissionTemplates,
            ...newItems.filter((t) => !existingIds.has(t.id)),
          ];
          dispatch(setPermissionTemplates(merged));
          setPage((p) => p + 1);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  /** 스크롤 이벤트 등록 */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      if (isLoading) return;
      const { scrollTop, clientHeight, scrollHeight } = el;
      if (scrollTop + clientHeight >= scrollHeight - 8) {
        // 하단 근처에서 추가 로드
        loadMore();
      }
    };

    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [isLoading, page, permissionTemplates]); // deps에 page/목록 포함

  return (
    <TemplateList>
      <ListContainer ref={scrollRef}>
        {permissionTemplates?.map((item: PermissionTemplate) => (
          <TemplateItem
            key={item.id}
            $isSelected={selectedTemplateId === item.id}
            onClick={() => onClickTemplateItem(item.id)}
          >
            <RadioButton
              isSelected={selectedTemplateId === item.id}
              isBorder={false}
              onClick={() => onClickTemplateItem(item.id)}
            />
            <ColumnContainer>
              <MainText fontSize={16} fontWeight={500} cursor={CURSOR.POINTER}>
                {item.title}
              </MainText>
              <MainText
                fontSize={14}
                fontWeight={400}
                color={GRAY.DARK}
                cursor={CURSOR.POINTER}
              >
                {item.description}
              </MainText>
            </ColumnContainer>
          </TemplateItem>
        ))}
      </ListContainer>

      {selectedTemplateId === null && (
        <DescriptionItem>
          <SvgIcon svg={Svg.ArrowRight} color={MAIN.DEFAULT} />
          <MainText fontSize={14} fontWeight={400} color={MAIN.DEFAULT}>
            {t_description('editPermissionTemplate')}
          </MainText>
        </DescriptionItem>
      )}
    </TemplateList>
  );
};

export default EditPermissionTemplate;
