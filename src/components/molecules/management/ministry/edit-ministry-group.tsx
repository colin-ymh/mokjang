import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import {
  DEFAULT_MINISTRY,
  Ministry,
  MinistryGroup,
} from '@/models/management/management';
import { getFormattedTitle } from '@/utils/format';
import { BLANK } from '@/constants/constant';
import { getIsWellFormedTitle } from '@/utils/check';
import { MinistriesApi } from '@/api/management/ministry/ministries.api';
import { MinistryGroupsApi } from '@/api/management/ministry/ministry-groups.api';
import EditMinistryGroupView from '@/components/molecules/management/ministry/edit-ministry-group.view';
import ToastPopup from '@/components/atoms/common/popup/toast-popup';
import { DESTRUCTIVE } from '@/constants/styles/color';
import { useScopedI18n } from '../../../../../locales/client';

type EditMinistryGroupProps = {
  ministryGroup: MinistryGroup;
  ministries: Ministry[];
  onClickClose: () => void;
  fetchMinistryGroups: () => void;
  setIsToastShown: Dispatch<SetStateAction<boolean>>;
};

const EditMinistryMinistryGroup = ({
  ministryGroup,
  ministries,
  onClickClose,
  fetchMinistryGroups,
  setIsToastShown,
}: EditMinistryGroupProps) => {
  const t_popup = useScopedI18n('popup');
  const ministryGroupMinistriesApi = new MinistriesApi(false);
  const ministryGroupsApi = new MinistryGroupsApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const newMinistryRef = useRef<HTMLInputElement>(null);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);

  // 변경될 이름
  const [newName, setNewName] = useState<string>(ministryGroup.name);

  // 새로 추가될 역할 이름
  const [newMinistryName, setNewMinistryName] = useState<string>(BLANK);

  // 선택된 역할
  const [selectedMinistry, setSelectedMinistry] =
    useState<Ministry>(DEFAULT_MINISTRY);

  // 임시 역할 배열
  const [newMinistries, setNewMinistries] = useState<Ministry[]>(ministries);

  // 이름 변경 시 이벤트
  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setNewName(getFormattedTitle(event.target.value));
  };

  // 새 역할 이름 변경 시 이벤트
  const onChangeNewMinistryName = (event: ChangeEvent<HTMLInputElement>) => {
    setNewMinistryName(getFormattedTitle(event.target.value));
  };

  // 새 역할 임시 저장
  const onClickSaveNewMinistry = () => {
    if (newMinistries.every((m) => m.name !== newMinistryName)) {
      setNewMinistries([
        ...newMinistries,
        {
          name: newMinistryName,
          id: new Date().getTime().toString(),
          churchId: new Date().getTime().toString(),
          ministryGroupId: new Date().getTime().toString(),
          membersCount: 0,
        },
      ]);
      setNewMinistryName(BLANK);
    } else {
      setIsPopupShown(true);
    }
  };

  // 저장하기
  const onClickSave = async () => {
    try {
      // 이름 변경
      if (ministryGroup.name !== newName) {
        await ministryGroupsApi.editMinistryGroup(
          { churchId, ministryGroupId: ministryGroup.id as string },
          { name: newName }
        );
      }

      // 삭제된 역할
      const deletedMinistries = ministries.filter((prevMinistry) =>
        newMinistries.every((newMinistry) => newMinistry.id !== prevMinistry.id)
      );

      // 수정된 역할
      const updatedMinistries = newMinistries.filter((newMinistry) =>
        ministries.some(
          (prevMinistry) =>
            prevMinistry.id === newMinistry.id &&
            prevMinistry.name !== newMinistry.name
        )
      );

      // 추가된 역할
      const addedMinistries = newMinistries.filter((newMinistry) =>
        ministries.every((prevMinistry) => prevMinistry.id !== newMinistry.id)
      );

      // 삭제 작업
      await Promise.all(
        deletedMinistries.map((ministry) =>
          ministryGroupMinistriesApi.deleteMinistry({
            churchId,
            ministryId: ministry.id,
          })
        )
      );

      // 수정 작업
      await Promise.all(
        updatedMinistries.map((ministry) =>
          ministryGroupMinistriesApi.editMinistry(
            {
              churchId,
              ministryId: ministry.id,
            },
            { name: ministry.name }
          )
        )
      );

      // 추가 작업
      await Promise.all(
        addedMinistries.map((ministry) =>
          ministryGroupMinistriesApi.createMinistry(
            { churchId },
            {
              name: ministry.name,
              ministryGroupId: (ministryGroup.id as string) || '0',
            }
          )
        )
      );

      // 상태 초기화 및 리렌더링
      fetchMinistryGroups();
      onClickClose();
      setNewMinistries([]);
      setSelectedMinistry(DEFAULT_MINISTRY);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsToastShown(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.isComposing) {
        return;
      }

      if (e.key === 'Enter') {
        if (newMinistryRef.current) {
          if (getIsWellFormedTitle(newMinistryName)) {
            onClickSaveNewMinistry();
          } else {
            newMinistryRef.current.blur();
          }
        }
      } else if (e.key === 'Escape') {
        if (newMinistryRef.current) {
          newMinistryRef.current.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClickSaveNewMinistry]);

  const props = {
    newMinistryRef,
    newName,
    newMinistryName,
    ministries: newMinistries,
    selectedMinistryId: selectedMinistry.id,
    setMinistries: setNewMinistries,
    setSelectedMinistry,
    onChangeName,
    onChangeNewMinistryName,
    onClickSave,
    onClickSaveNewMinistry,
  };
  return (
    <>
      <EditMinistryGroupView {...props} />
      {isPopupShown && (
        <ToastPopup
          text={t_popup('duplicatedMinistry')}
          setIsShow={setIsPopupShown}
          backgroundColor={DESTRUCTIVE.DEFAULT}
        />
      )}
    </>
  );
};

export default EditMinistryMinistryGroup;
