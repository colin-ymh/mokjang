import GroupFilterView from "@/components/molecules/layout/group-filter.view";
import { GroupsApi } from "@/api/settings/groups.api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { Group } from "@/models/setting/group";
import { setMemberFilter } from "@/redux/reducers/member-filter-reducer";
import { BLANK } from "@/constants/constant";

const GroupFilter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const groupsApi = new GroupsApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const memberFilter = useSelector(
    (state: RootState) => state.memberFilter.memberFilter,
  );

  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(BLANK);

  // 그룹 정렬
  const getOrderedGroups = (groups: Group[]) => {
    // 그룹을 id로 매핑하여 빠르게 찾을 수 있도록 맵 생성
    const groupMap = new Map<number, Group>();
    for (const group of groups) {
      groupMap.set(parseInt(group.id), { ...group, childGroups: [] }); // 복사본 생성
    }

    // 최상위 그룹을 담을 배열
    const topLevelGroups: Group[] = [];

    for (const group of groups) {
      if (group.parentGroupId === null) {
        // 부모가 없는 그룹은 최상위 그룹에 추가
        topLevelGroups.push(groupMap.get(parseInt(group.id))!);
      } else {
        // 부모가 있는 그룹은 부모의 childGroups 에 추가
        const parentGroup = groupMap.get(parseInt(group.parentGroupId));
        if (parentGroup?.childGroups) {
          parentGroup.childGroups.push(groupMap.get(parseInt(group.id))!);
        }
      }
    }

    return topLevelGroups;
  };

  // 교회 정보를 통해 소그룹들 불러오기
  useEffect(() => {
    if (churchId) {
      groupsApi.getGroups({ churchId }).then((response) => {
        if (response.status === 200) {
          setGroups(getOrderedGroups(response.data));
        }
      });
    }
  }, [churchId]);

  // 새로운 그룹을 설정
  const onClickGroup = (id: string) => {
    setSelectedGroupId(id);
  };

  // 그룹이 변경되면 교인 목록에 적용
  useEffect(() => {
    if (selectedGroupId) {
      dispatch(setMemberFilter({ ...memberFilter, group: [selectedGroupId] }));
    }
  }, [selectedGroupId]);

  // 그룹이 변경되면 교인 목록에 적용
  useEffect(() => {
    if (memberFilter.group.length === 0) {
      setSelectedGroupId(BLANK);
    }
  }, [memberFilter.group]);

  const props = {
    groups,
    selectedGroupId,
    onClickGroup,
  };
  return (
    <>
      <GroupFilterView {...props} />
    </>
  );
};

export default GroupFilter;
