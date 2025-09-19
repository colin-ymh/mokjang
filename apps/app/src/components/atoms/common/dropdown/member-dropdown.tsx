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
import { MembersApi } from '@/api/members/members.api';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { BLANK } from '@mokjang/constants';
import { getTrimmedString } from '@mokjang/utils';
import { AxiosResponse } from 'axios';
import { ManagersApi } from '@/api/managers/managers.api';
import { ChurchUser } from '@mokjang/models';
import MemberDropdownView from '@/components/atoms/common/dropdown/member-dropdown.view';
import { InputProps } from '@mokjang/components';
import { MemberDropdownType } from './member-dropdown-item';

export type MultiMemberDropdownProps = InputProps & {
  ref?: RefObject<HTMLInputElement>;
  values: MemberDropdownType[];
  onChangeValues?: (values: any[]) => void;
  isEditable?: boolean;
  backgroundBlur?: boolean;
  enterKeyHint?: string;
  placeholder?: string;
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

    const [isOpened, setIsOpened] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(0);
    const [items, setItems] = useState<MemberDropdownType[]>([]);
    const focusedIndexRef = useRef(0);

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

    const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
      const newMemberName = getTrimmedString(event.target.value);
      setSearchText(newMemberName);
    };

    const onKeyDownHandler = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === 229) return;
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
      [isOpened, items, values, isEditable]
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
                  (manager: ChurchUser) => ({
                    value: manager.member.id,
                    title: manager.member.name,
                    profileImage: manager.member.profileImageUrl,
                    officer: manager.member.officer?.name,
                  })
                );

                setItems(newMemberItems);
                setFocusedIndex(0);
                focusedIndexRef.current = 0;
              });
          } else {
            // ✅ getSimpleMembers -> getSimpleMembersV2 로 변경
            membersApi
              .getSimpleMembersV2({
                churchId,
                limit: 10, // 기존 take: 10 대응
                name: searchText,
                // cursor 미사용(드롭다운 1회 조회), 필요시 추가 가능
              })
              .then((response: AxiosResponse) => {
                const members = response.data.data ?? [];
                const newMemberItems: MemberDropdownType[] = members.map(
                  (member: any) => ({
                    value: member.id,
                    title: member.name,
                    profileImage: member.profileImageUrl,
                    officer: member.officer?.name,
                  })
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText, churchId, isManager]);

    useEffect(() => {
      if (!isEditable) setSearchText(BLANK);
    }, [isEditable]);

    const onClickBackground = () => setIsOpened(false);

    const viewProps = {
      ref,
      items,
      searchText,
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
