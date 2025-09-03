'use client';

import React, {
  ChangeEvent,
  forwardRef,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { InputProps } from '../input/main-input';
import MemberDropdownView from './member-dropdown.view';
import { getTrimmedString } from '@/utils/format';
import { AxiosResponse } from 'axios';
import { GetMembersResponse, MembersApi } from '@/api/members/members.api';
import { BLANK } from '@/constants/constant';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { MemberDropdownType } from './member-dropdown-item';
import { ManagersApi } from '@/api/managers/managers.api';
import { ChurchUser } from '@/models/church-user/church-user';

export type MultiMemberDropdownProps = InputProps & {
  ref?: RefObject<HTMLInputElement>;

  /** 선택된 값 배열 */
  values: MemberDropdownType[];
  onChangeValues?: (values: any[]) => void;

  /** UI 옵션 */
  isEditable?: boolean;
  backgroundBlur?: boolean;
  enterKeyHint?: string;
  placeholder?: string;

  /** 스타일 */
  borderColor?: string;
  width?: number;
  height?: number;
  backgroundColor?: string;

  isSingle?: boolean;
  isManager?: boolean;
};

const MemberDropdown = forwardRef<HTMLInputElement, MultiMemberDropdownProps>(
  (
    {
      values,
      onChangeValues,
      backgroundBlur = false,
      isEditable = true,
      enterKeyHint = 'enter',
      placeholder,
      borderColor,
      backgroundColor,
      width,
      height,
      disabled,
      isSingle = false,
      isManager = false,
      ...inputProps
    },
    ref
  ) => {
    const membersApi = new MembersApi(false);
    const managersApi = new ManagersApi(false);
    const { churchId } = useSelector((state: RootState) => state.church);

    /* ---------------- 상태 ---------------- */
    const [isOpened, setIsOpened] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(0);
    const [items, setItems] = useState<MemberDropdownType[]>([]);

    const focusedIndexRef = useRef(0);

    /* 선택 변경 ---------------------------------------------------- */
    const addValue = (v: MemberDropdownType) => {
      if (isSingle) {
        onChangeValues?.([v]);
      } else {
        if (values.every((prev) => prev.value !== v.value)) {
          const newArr = [...values, v];
          onChangeValues?.(newArr);
        }
      }
      setSearchText(BLANK);
      setIsOpened(false);
    };

    const removeValue = (v: MemberDropdownType) => {
      if (!isEditable) return;
      onChangeValues?.(values.filter((x) => x !== v));
    };

    /* 검색 입력 ---------------------------------------------------- */
    const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
      const newMemberName = getTrimmedString(event.target.value);
      setSearchText(newMemberName);
    };

    /* 키보드 ------------------------------------------------------- */
    const onKeyDownHandler = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === 229) return;

        if (
          e.key === 'Backspace' &&
          searchText === '' &&
          values.length &&
          isEditable
        ) {
          e.preventDefault();
          removeValue(values[values.length - 1]); // 마지막 chip 제거
        }
        if (!isOpened) return;
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setFocusedIndex((p) => {
            const n = (p + 1) % items.length;
            focusedIndexRef.current = n;
            return n;
          });
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setFocusedIndex((p) => {
            const n = (p + items.length - 1) % items.length;
            focusedIndexRef.current = n;
            return n;
          });
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const cur = items[focusedIndexRef.current];
          if (cur) addValue(cur);
          if (isSingle) setIsOpened(false);
        } else if (e.key === 'Escape') {
          setIsOpened(false);
        }
      },
      [isOpened, items, searchText, values, isEditable]
    );

    useEffect(() => {
      if (items.length > 0) setIsOpened(true);
    }, [items]);

    useEffect(() => {
      const timer = setTimeout(() => {
        if (searchText) {
          if (isManager) {
            managersApi
              .getManagers({
                churchId,
                name: searchText,
                page: 1,
                take: 5,
              })
              .then((response: AxiosResponse) => {
                const managers = response.data.data;
                const newMemberItems: MemberDropdownType[] = managers.map(
                  (manager: ChurchUser) => {
                    return {
                      value: manager.member.id,
                      title: manager.member.name,
                      profileImage: manager.member.profileImageUrl,
                      officer: manager.member.officer?.name,
                    };
                  }
                );

                setItems(newMemberItems);
                setFocusedIndex(0);
                focusedIndexRef.current = 0;
              });
          } else {
            membersApi
              .getSimpleMembers({
                churchId,
                name: searchText,
                page: 1,
                take: 10,
              })
              .then((response: AxiosResponse) => {
                const members: GetMembersResponse[] = response.data.data;
                const newMemberItems: MemberDropdownType[] = members.map(
                  (member) => {
                    return {
                      value: member.id,
                      title: member.name,
                      profileImage: member.profileImageUrl,
                      officer: member.officer?.name,
                    };
                  }
                );

                setItems(newMemberItems);
                setFocusedIndex(0);
                focusedIndexRef.current = 0;
              });
          }
        } else {
          setItems([]);
        }
      }, 300);
      return () => clearTimeout(timer);
    }, [searchText]);

    useEffect(() => {
      if (!isEditable) setSearchText(BLANK);
    }, [isEditable]);

    /* 배경 클릭 */
    const onClickBackground = () => setIsOpened(false);

    /* props 묶음 → View */
    const viewProps = {
      ref,
      items,
      searchText: searchText,
      values,
      isOpened,
      focusedIndex,
      isEditable,
      enterKeyHint,
      placeholder,
      borderColor,
      width,
      height,
      backgroundColor,
      disabled,
      /* handlers */
      setIsOpened,
      addValue,
      removeValue,
      onChangeInput,
      onKeyDownHandler,
      backgroundBlur,
      onClickBackground,
    };

    return (
      <>
        <MemberDropdownView {...viewProps} {...inputProps} />
      </>
    );
  }
);

export default MemberDropdown;
