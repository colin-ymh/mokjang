import { useI18n } from "../../../locales/client";
import { ColumnDef } from "@tanstack/react-table";
import { Member } from "@/models/member/member";
import { MEMBER } from "@/constants/member/member-column";

export const useMemberTableHeader = () => {
  const t = useI18n();

  const columns: ColumnDef<Member>[] = [
    {
      accessorKey: MEMBER.NAME,
      header: t(MEMBER.NAME),
      enableSorting: true,
      sortingFn: "auto",
    },
    {
      accessorKey: MEMBER.MOBILE_PHONE,
      header: t(MEMBER.MOBILE_PHONE),
      enableSorting: true,
      sortingFn: "auto",
    },
    {
      accessorKey: MEMBER.GENDER,
      header: t(MEMBER.GENDER),
      enableSorting: true,
      sortingFn: "auto",
    },
    {
      accessorKey: MEMBER.BIRTH,
      header: t(MEMBER.BIRTH),
      enableSorting: true,
      sortingFn: "auto",
    },

    {
      accessorKey: MEMBER.OCCUPATION,
      header: t(MEMBER.OCCUPATION),
      enableSorting: true,
      sortingFn: "auto",
    },
    {
      accessorKey: MEMBER.ADDRESS,
      header: t(MEMBER.ADDRESS),
      enableSorting: true,
      sortingFn: "auto",
    },
  ];

  return columns;
};
