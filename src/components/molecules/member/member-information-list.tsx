import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setMember } from "@/redux/reducers/member-register-reducer";
import MemberInformationListView from "@/components/molecules/member/member-information-list.view";

type MemberInformationListProps = {};

const MemberInformationList = ({}: MemberInformationListProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { member } = useSelector((state: RootState) => state.memberRegister);

  const onChangeGroup = (value: string) => {
    dispatch(setMember({ ...member, groupId: value }));
  };

  const onChangeOfficer = (value: string) => {
    dispatch(setMember({ ...member, officerId: value }));
  };

  const onChangeMinistry = (value: string) => {
    dispatch(setMember({ ...member, ministryId: value }));
  };

  const onChangeEducation = (value: string) => {
    dispatch(setMember({ ...member, educationId: value }));
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
