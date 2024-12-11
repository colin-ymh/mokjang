import MemberInformationListView from "@/components/molecules/member/member-information-list.view";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setMember } from "@/redux/reducers/member-register-reducer";

type MemberInformationListProps = {};

const MemberInformationList = ({}: MemberInformationListProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { member } = useSelector((state: RootState) => state.memberRegister);

  const onChangeGroup = (value: string) => {
    dispatch(setMember({ ...member, group: value }));
  };

  const onChangeOfficer = (value: string) => {
    dispatch(setMember({ ...member, officer: value }));
  };

  const onChangeMinistry = (value: string) => {
    dispatch(setMember({ ...member, ministry: value }));
  };

  const onChangeEducation = (value: string) => {
    dispatch(setMember({ ...member, education: value }));
  };

  const props = {
    onChangeGroup,
    onChangeOfficer,
    onChangeMinistry,
    onChangeEducation,
  };

  return (
    <>
      <MemberInformationListView {...props} />
    </>
  );
};

export default MemberInformationList;
