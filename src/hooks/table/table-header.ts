import { useI18n } from "../../../locales/client";
import { ColumnDef } from "@tanstack/react-table";
import { Member } from "@/models/member/member";
import { MEMBER } from "@/constants/member/member-column";

export const useMemberTableHeader = () => {
  const t = useI18n();

  const columns: ColumnDef<Member>[] = [
    {
      accessorKey: MEMBER.PROFILE_IMAGE,
      header: t(MEMBER.PROFILE_IMAGE),
    },
    {
      accessorKey: MEMBER.NAME,
      header: t(MEMBER.NAME),
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
      accessorKey: MEMBER.BAPTISM,
      header: t(MEMBER.BAPTISM),
      enableSorting: true,
      sortingFn: "auto",
    },
    {
      accessorKey: MEMBER.OFFICER,
      header: t(MEMBER.OFFICER),
      enableSorting: true,
      sortingFn: "auto",
    },
    {
      accessorKey: MEMBER.GROUP,
      header: t(MEMBER.GROUP),
      enableSorting: true,
      sortingFn: "auto",
    },
    {
      accessorKey: MEMBER.MINISTRY,
      header: t(MEMBER.MINISTRY),
      enableSorting: true,
      sortingFn: "auto",
    },
    {
      accessorKey: MEMBER.EDUCATION,
      header: t(MEMBER.EDUCATION),
      enableSorting: true,
      sortingFn: "auto",
    },
    {
      accessorKey: MEMBER.VEHICLE_NUMBER,
      header: t(MEMBER.VEHICLE_NUMBER),
      enableSorting: true,
      sortingFn: "auto",
    },
  ];

  return columns;
};
