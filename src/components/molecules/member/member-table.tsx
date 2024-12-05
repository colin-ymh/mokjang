import React, { useEffect, useState } from "react";
import styled from "styled-components";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { GRAY, WHITE } from "@/constants/styles/color";
import { MembersApi } from "@/api/members.api";
import { useMemberTableHeader } from "@/hooks/table/table-header";
import { Member } from "@/models/member/member";

const TableContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th,
  td {
    border: 1px solid ${GRAY.DEFAULT};
    padding: 8px;
    background-color: ${WHITE};
  }

  th {
    font-weight: bold;
    background-color: ${GRAY.BACKGROUND};
  }
`;

const MemberTable = () => {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const membersApi = new MembersApi(false);
    membersApi
      .getMembers({ churchId: "1" })
      .then((response) => setMembers(response.data.data));
  }, []);

  const table = useReactTable({
    data: members,
    columns: useMemberTableHeader(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <TableContainer>
      <StyledTable>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getSortedRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default MemberTable;
