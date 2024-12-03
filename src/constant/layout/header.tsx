import MemberHeader from "@/components/organisms/member/member-header";

export enum HEADER_ID {
  HOME = "home",
  MEMBER = "member",
}

export const getHeader = (id: string) => {
  switch (id) {
    case HEADER_ID.HOME:
      return null;
    case HEADER_ID.MEMBER:
      return <MemberHeader />;
    default:
      return null;
  }
};
