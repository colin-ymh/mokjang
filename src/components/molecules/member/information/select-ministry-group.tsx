import styled from 'styled-components';

import {
  DEFAULT_MINISTRY_GROUP,
  MinistryGroup,
} from '@/models/management/management';
import { BLACK, WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import Button from '@/components/atoms/common/button/button';
import SelectMinistryGroupItem from '@/components/atoms/member/information/select-ministry-group-item';

import ChevronLeft from '../../../../../public/svg/chevron-left.svg';
import { useI18n } from '../../../../../locales/client';
import { MinistryGroupsApi } from '@/api/management/ministry/ministry-groups.api';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useEffect, useState } from 'react';
import { getOrderedMinistryGroups } from '@/utils/ministry';

const SelectMinistryGroupContainer = styled.div`
  display: flex;
  background-color: ${WHITE};
  width: 100%;
  height: 100%;
  border-radius: 5px;
  flex-direction: column;
  z-index: 400;
  position: relative;
`;

const GoBackContainer = styled.div`
  display: flex;
  height: 30px;
  padding: 10px;
  gap: 10px;
  align-items: center;
`;

const GoBackButton = styled(ChevronLeft)`
  width: 20px;
  height: 20px;
  stroke: ${BLACK};
  stroke-width: 1px;
`;

const MinistryGroupList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  padding: 10px;
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
`;

type SelectMinistryGroupModalProps = {
  value: string | null;
  onClickSave: (group: MinistryGroup) => void;
  onClickClose: () => void;
};

const SelectMinistryGroup = ({
  value,
  onClickSave,
  onClickClose,
}: SelectMinistryGroupModalProps) => {
  const t = useI18n();
  const ministryGroupsApi = new MinistryGroupsApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  const START_GROUP: MinistryGroup = {
    id: null,
    name: t('all'),
    parentMinistryGroupId: null,
    childMinistryGroups: [],
    churchId,
    childMinistryGroupIds: [],
    ministries: [],
  };

  // 전체 그룹
  const [allMinistryGroups, setAllMinistryGroups] = useState<MinistryGroup[]>(
    []
  );

  // 현재 보고있는 그룹
  const [currentMinistryGroup, setCurrentMinistryGroup] =
    useState<MinistryGroup>(START_GROUP);

  // 현재 선택된 그룹
  const [selectedMinistryGroup, setSelectedMinistryGroup] =
    useState<MinistryGroup>(DEFAULT_MINISTRY_GROUP);

  // 보고있는 그룹 배열
  const [ministryGroups, setMinistryGroups] = useState<MinistryGroup[]>([]);

  // 부모 계층 배열
  const [parentMinistryGroups, setParentMinistryGroups] = useState<
    MinistryGroup[]
  >([]);

  // 뒤로 가기 (부모 그룹으로 올라가기)
  const onClickGoBack = () => {
    if (parentMinistryGroups.length > 0) {
      const lastMinistryGroups =
        parentMinistryGroups[parentMinistryGroups.length - 1];

      setMinistryGroups(
        lastMinistryGroups.childMinistryGroups as MinistryGroup[]
      );
      setCurrentMinistryGroup(lastMinistryGroups);

      // 부모 계층에서 해당 부모 삭제
      setParentMinistryGroups(parentMinistryGroups.slice(0, -1));
    }
  };

  // 그룹 드롭다운 닫기
  const onClose = () => {
    onClickClose();
    setParentMinistryGroups([]);
    setCurrentMinistryGroup(START_GROUP);
    setAllMinistryGroups([]);
    fetchMinistryGroups();
  };

  // 부모그룹 선택 시, 자식 그룹으로 변환
  const onClickParent = (ministryGroup: MinistryGroup) => {
    setSelectedMinistryGroup(ministryGroup);
    if (
      ministryGroup.childMinistryGroupIds.length > 0 &&
      ministryGroup.childMinistryGroups
    ) {
      setMinistryGroups(ministryGroup.childMinistryGroups);
      setCurrentMinistryGroup(ministryGroup);
      setParentMinistryGroups([
        ...parentMinistryGroups,
        getMinistryGroup(
          ministryGroup.parentMinistryGroupId,
          allMinistryGroups
        ) as MinistryGroup,
      ]);
    }
  };

  // 전체 그룹 불러오기
  const fetchMinistryGroups = () => {
    ministryGroupsApi.getMinistryGroups({ churchId }).then((response) => {
      if (response.status === 200) {
        const orderedMinistryGroups = getOrderedMinistryGroups(response.data);

        // 최상단에 "전체" 그룹을 추가
        const allMinistryGroup: MinistryGroup = {
          id: null, // 고유 ID (임의로 0으로 설정)
          name: t('all'),
          parentMinistryGroupId: null,
          childMinistryGroups: orderedMinistryGroups, // 모든 그룹을 하위 그룹으로 설정
          churchId,
          childMinistryGroupIds: [],
          ministries: [],
        };

        setAllMinistryGroups([allMinistryGroup]);
        setMinistryGroups(orderedMinistryGroups);
      }
    });
  };

  // 특정 그룹 찾기 (재귀적으로 검색)
  const getMinistryGroup = (
    ministryGroupId: string | null,
    ministryGroups: MinistryGroup[]
  ): MinistryGroup | null => {
    for (const ministryGroup of ministryGroups) {
      if (ministryGroup.id === ministryGroupId) {
        return ministryGroup; // 그룹 찾으면 즉시 반환
      }
      if (
        ministryGroup.childMinistryGroups &&
        ministryGroup.childMinistryGroups.length > 0
      ) {
        const foundMinistryGroup = getMinistryGroup(
          ministryGroupId,
          ministryGroup.childMinistryGroups
        );
        if (foundMinistryGroup) return foundMinistryGroup;
      }
    }
    return null; // 찾지 못하면 null 반환
  };

  const findMinistryGroup = (
    ministryGroupId: string | null,
    ministryGroups: MinistryGroup[]
  ): MinistryGroup | null => {
    for (const ministryGroup of ministryGroups) {
      if (ministryGroup.id === ministryGroupId) {
        return ministryGroup; // 찾으면 반환
      }
      if (
        ministryGroup.childMinistryGroups &&
        ministryGroup.childMinistryGroups.length > 0
      ) {
        const foundMinistryGroup = findMinistryGroup(
          ministryGroupId,
          ministryGroup.childMinistryGroups
        );
        if (foundMinistryGroup) return foundMinistryGroup;
      }
    }
    return null; // 못 찾으면 null 반환
  };

  useEffect(() => {
    if (value) {
      const newSelectedMinistryGroup = findMinistryGroup(
        value,
        allMinistryGroups
      );
      if (newSelectedMinistryGroup) {
        setSelectedMinistryGroup(newSelectedMinistryGroup);
      }
    } else {
      setSelectedMinistryGroup(DEFAULT_MINISTRY_GROUP);
    }
  }, [value, allMinistryGroups]);

  useEffect(() => {
    fetchMinistryGroups();
  }, []);

  return (
    <SelectMinistryGroupContainer>
      <GoBackContainer>
        <GoBackButton
          onClick={() =>
            parentMinistryGroups.length !== 0 ? onClickGoBack() : onClose()
          }
        />
        <MainText>
          {[...parentMinistryGroups, currentMinistryGroup]
            .map((parent) => parent.name)
            .join(' > ')}
        </MainText>
      </GoBackContainer>
      <MinistryGroupList>
        {ministryGroups.map((ministry) => {
          return (
            <SelectMinistryGroupItem
              key={ministry.id}
              ministry={ministry}
              onClick={() => {
                onClickParent(ministry);
              }}
              isSelected={ministry.id === selectedMinistryGroup.id}
            />
          );
        })}
      </MinistryGroupList>
      <ButtonContainer>
        <Button
          text={t('button.save')}
          onClick={() => {
            onClickSave(selectedMinistryGroup);
            onClose();
          }}
          height={30}
        />
      </ButtonContainer>
    </SelectMinistryGroupContainer>
  );
};

export default SelectMinistryGroup;
