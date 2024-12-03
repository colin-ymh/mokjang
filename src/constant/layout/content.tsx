export enum HOME_CONTENT_ID {
  HOME = "home",
}

export enum MEMBER_CONTENT_ID {
  MEMBER = "memberList",
  ADMINISTRATOR = "administratorList",
  NEW_MEMBER = "newMemberList",
}

export const getContent = (id: string) => {
  switch (id) {
    case HOME_CONTENT_ID.HOME:
      return null;
    case MEMBER_CONTENT_ID.MEMBER:
      return <div />;
    case MEMBER_CONTENT_ID.ADMINISTRATOR:
      return <div />;
    case MEMBER_CONTENT_ID.NEW_MEMBER:
      return <div />;
    default:
      return null;
  }
};
