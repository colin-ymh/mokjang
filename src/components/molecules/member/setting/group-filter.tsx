import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setMemberFilter } from '@/redux/reducers/filter/member-filter-reducer';
import SelectGroupHierarchy from '@/components/organisms/group/select-group-hierarchy';
import { getGroup } from '@/utils/group';
import { setTargetGroup } from '@/redux/reducers/target/target-group-reducer';
import { DEFAULT_GROUP } from '@/models/management/management';
import styled from 'styled-components';

const GroupFilterContainer = styled.div`
  display: flex;
  padding: 20px;
  width: 100%;
  height: 100%;
  margin-bottom: 20px;
`;

type GroupFilterProps = {
  isDefaultOpen?: boolean;
  onChange?: (id: string | null) => void;
};

const GroupFilter = ({ isDefaultOpen = false, onChange }: GroupFilterProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const memberFilter = useSelector(
    (state: RootState) => state.memberFilter.memberFilter
  );
  const groups = useSelector((state: RootState) => state.church.groups);

  // 새로운 그룹을 설정
  const onChangeGroup = (groupId: string | null) => {
    if (groupId) {
      const newGroup = getGroup(groupId, groups);

      if (newGroup) {
        dispatch(setTargetGroup(newGroup));
      }
    } else {
      dispatch(setTargetGroup(DEFAULT_GROUP));
    }

    if (groupId === null) {
      dispatch(setMemberFilter({ ...memberFilter, group: [] }));
    } else if (groupId) {
      dispatch(setMemberFilter({ ...memberFilter, group: [groupId] }));
    }

    if (onChange) {
      onChange(groupId);
    }
  };

  const props = {
    isDefaultOpen,
    onChange: onChangeGroup,
    prevSelectedGroupId: memberFilter?.group[0],
  };

  return (
    <>
      <GroupFilterContainer>
        <SelectGroupHierarchy {...props} />
      </GroupFilterContainer>
    </>
  );
};

export default GroupFilter;
