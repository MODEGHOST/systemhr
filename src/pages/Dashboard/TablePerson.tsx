"use client";
import React from "react";
import { Button, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { MdPersonSearch } from "react-icons/md";

export type PersonRow = {
  id: string | number;
  fullname: string;
  department?: string;
  role?: string;
  work_status: "present" | "wfh" | "leave" | string;
  start_job?: string | Date;
};

type Props = {
  rows?: PersonRow[];
  loading?: boolean;
  onView?: (row: PersonRow) => void;
};

const STATUS: Record<string, { color: string; label: string }> = {
  present: { color: "green", label: "มาทำงาน" },
  wfh: { color: "orange", label: "WFH" },
  leave: { color: "red", label: "ลา" },
};

const TablePerson: React.FC<Props> = ({ rows = [], loading = false, onView }) => {
  const columns = React.useMemo<ColumnsType<PersonRow>>(
    () => [
      { title: "ชื่อ-สกุล", dataIndex: "fullname", key: "fullname", ellipsis: true },
      { title: "แผนก", dataIndex: "department", key: "department", ellipsis: true },
      { title: "บทบาท", dataIndex: "role", key: "role", ellipsis: true },
      {
        title: "สถานะ",
        dataIndex: "work_status",
        key: "work_status",
        render: (v: PersonRow["work_status"]) => {
          const m = STATUS[String(v)] ?? { color: "default", label: String(v) };
          return <Tag color={m.color}>{m.label}</Tag>;
        },
      },
      {
        title: "วันเริ่มงาน",
        dataIndex: "start_job",
        key: "start_job",
        render: (v: PersonRow["start_job"]) => {
          if (!v) return "-";
          const d = typeof v === "string" || typeof v === "number" ? new Date(v) : v;
          if (isNaN(d.getTime())) return String(v ?? "-");
          return d.toLocaleDateString("th-TH");
        },
      },
      {
        title: "การทำงาน",
        key: "action",
        fixed: "right",
        width: 80,
        render: (_: unknown, row: PersonRow) => (
          <Button type="text" onClick={() => onView?.(row)} icon={<MdPersonSearch size={18} />} />
        ),
      },
    ],
    [onView]
  );

  return (
    <Table<PersonRow>
      rowKey="id"
      loading={loading}
      columns={columns}
      dataSource={rows}
      pagination={{ pageSize: 10, showSizeChanger: true }}
    />
  );
};

export default React.memo(TablePerson);
