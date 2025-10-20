"use client";

import React, { Suspense } from "react";
import { Card, Skeleton } from "antd";
import { FaPerson, FaPersonCircleCheck, FaPersonCircleXmark } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import ChartStatisEmployee from "./ChartStatisEmployee";
import type { PersonRow } from "./TablePerson";

const TablePerson = React.lazy(() => import("./TablePerson"));

type WorkKey = "all" | "present" | "wfh" | "leave";

export type Employee = PersonRow;

type Totals = {
  all: number;
  present: number;
  wfh: number;
  leave: number;
};

interface DashboardEmployeeProps {
  loading?: boolean;
  employees?: Employee[];
  totals?: Totals;
}

const DashboardEmployee: React.FC<DashboardEmployeeProps> = ({
  loading = false,
  employees = [],
  totals,
}) => {
  const computedTotals = React.useMemo<Totals>(() => {
    if (totals) return totals;
    const all = employees.length;
    const present = employees.filter((e) => e.work_status === "present").length;
    const wfh = employees.filter((e) => e.work_status === "wfh").length;
    const leave = employees.filter((e) => e.work_status === "leave").length;
    return { all, present, wfh, leave };
  }, [employees, totals]);

  const [activeKey, setActiveKey] = React.useState<WorkKey>("all");

  const items = [
    { key: "all" as WorkKey, title: "พนักงานทั้งหมด", value: computedTotals.all, icon: <FaPerson />, color: "#1677ff", bg: "rgba(22,119,255,0.12)", border: "rgba(22,119,255,0.35)" },
    { key: "present" as WorkKey, title: "พนักงานที่มาทำงาน", value: computedTotals.present, icon: <FaPersonCircleCheck />, color: "#52c41a", bg: "rgba(82,196,26,0.12)", border: "rgba(82,196,26,0.35)" },
    { key: "wfh" as WorkKey, title: "พนักงานที่ WFH", value: computedTotals.wfh, icon: <FaHome />, color: "#fa8c16", bg: "rgba(250,140,22,0.12)", border: "rgba(250,140,22,0.35)" },
    { key: "leave" as WorkKey, title: "พนักงานที่ลา", value: computedTotals.leave, icon: <FaPersonCircleXmark />, color: "#ff4d4f", bg: "rgba(255,77,79,0.12)", border: "rgba(255,77,79,0.35)" },
  ];

  const filterByKey = React.useCallback((list: Employee[], key: WorkKey) => {
    if (key === "all") return list;
    return list.filter((e) => e.work_status === key);
  }, []);   

  const filtered = React.useMemo(
    () => filterByKey(employees, activeKey),
    [employees, activeKey, filterByKey]
  );

  const titleByActiveKey: Record<WorkKey, string> = {
    all: "รายชื่อพนักงานทั้งหมด",
    present: "รายชื่อพนักงานที่มาทำงาน",
    wfh: "รายชื่อพนักงานที่ WFH",
    leave: "รายชื่อพนักงานที่ลา",
  };

  return (
    <>
      <div className="w-full mb-3 mt-5">
        <div className="text-2xl font-semibold text-black">Dashboard พนักงาน</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((it) => (
          <div key={it.key}>
            <Card
              className={`w-full rounded-xl transition-all cursor-pointer shadow-sm hover:-translate-y-0.5 hover:shadow-xl ${activeKey === it.key ? "ring-2" : "ring-0"}`}
              style={{
                background: it.bg,
                borderColor: it.border,
                boxShadow: "0 1px 0 rgba(0,0,0,0.02), 0 10px 24px -12px rgba(0,0,0,0.12)",
                // @ts-expect-error custom CSS var
                "--tw-ring-color": it.color,
              }}
              onClick={() => setActiveKey(it.key)}
            >
              <Skeleton active loading={loading} paragraph={false}>
                <div className="flex items-center gap-3 min-h-[68px]">
                  <div
                    className="w-14 h-14 min-w-14 rounded-full grid place-items-center text-2xl"
                    style={{ background: it.bg, color: it.color, boxShadow: `inset 0 0 0 1px ${it.border}` }}
                  >
                    {it.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-neutral-700 leading-tight mb-1.5 truncate" title={it.title}>
                      {it.title}
                    </div>
                    <div className="font-bold text-black text-[clamp(22px,2.5vw,28px)]">
                      {Intl.NumberFormat().format(it.value)}
                    </div>
                  </div>
                </div>
              </Skeleton>
            </Card>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <Card
          className="rounded-xl"
          title={titleByActiveKey[activeKey]}
          extra={<span className="text-black">ทั้งหมด {filtered.length} คน</span>}
        >
          <Suspense fallback={<div className="p-3">กำลังโหลดตาราง…</div>}>
            <TablePerson rows={filtered} loading={loading} />
          </Suspense>
        </Card>

        <div className="mt-2 lg:mt-0">
          <ChartStatisEmployee />
        </div>
      </div>
    </>   
  );
};
   
export default DashboardEmployee;
