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
import TransparentBackground from '@/components/atoms/common/etc/transparent-background';
import { InputProps } from '@/components/atoms/common/input/main-input';
import MultiMemberDropdownView from '@/components/atoms/common/dropdown/multi-member-dropdown.view';
import { getTrimmedString } from '@/utils/format';
import { AxiosResponse } from 'axios';
import { GetMembersResponse, MembersApi } from '@/api/members/members.api';
import { BLANK } from '@/constants/constant';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { MemberDropdownType } from '@/components/atoms/common/dropdown/member-dropdown-item';
import { UserMembersApi } from '@/api/user-members/user-members.api';

export type MultiMemberDropdownProps = InputProps & {
  ref?: RefObject<HTMLInputElement>;

  /** 선택된 값 배열 */
  values: MemberDropdownType[];
  onChangeValues?: (values: any[]) => void;

  /** UI 옵션 */
  isEditable?: boolean;
  reverseDirection?: boolean;
  backgroundBlur?: boolean;
  enterKeyHint?: string;
  placeholder?: string;

  /** 스타일 */
  borderColor?: string;
  width?: number;
  height?: number;
  backgroundColor?: string;

  isSingle?: boolean;
  isUserMember?: boolean;
};

const MultiMemberDropdown = forwardRef<
  HTMLInputElement,
  MultiMemberDropdownProps
>(
  (
    {
      values,
      onChangeValues,
      backgroundBlur = false,
      reverseDirection = false,
      isEditable = true,
      enterKeyHint = 'enter',
      placeholder,
      borderColor,
      backgroundColor,
      width,
      height,
      disabled,
      isSingle = false,
      isUserMember = false,
      ...inputProps
    },
    ref
  ) => {
    const membersApi = new MembersApi(false);
    const userMembersApi = new UserMembersApi(false);
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
      if (searchText) {
        if (isUserMember) {
          userMembersApi
            .getUserMembers({
              churchId,
              name: searchText,
              page: 1,
              take: 5,
            })
            .then((response: AxiosResponse) => {
              const members: GetMembersResponse[] = response.data.data;
              const newMemberItems: MemberDropdownType[] = members.map(
                (member) => {
                  return { value: member.id, title: member.name };
                }
              );

              setItems(newMemberItems);
              setFocusedIndex(0);
              focusedIndexRef.current = 0;
            });
        } else {
          membersApi
            .getMembers({
              churchId,
              name: searchText,
              page: 1,
              take: 5,
            })
            .then((response: AxiosResponse) => {
              const members: GetMembersResponse[] = response.data.data;
              const newMemberItems: MemberDropdownType[] = members.map(
                (member) => {
                  return { value: member.id, title: member.name };
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
      reverseDirection,
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
    };

    return (
      <>
        <TransparentBackground
          isOpened={isOpened}
          blur={backgroundBlur}
          onClick={onClickBackground}
        />
        <MultiMemberDropdownView {...viewProps} {...inputProps} />
      </>
    );
  }
);

export default MultiMemberDropdown;
