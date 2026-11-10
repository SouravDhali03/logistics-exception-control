import { useMemo, useState } from "react";
import {
  type ExceptionCase,
  type Priority,
  type QueueStatusFilter,
} from "@/app-model";
import { filterAndSortInboxCases, paginateInboxCases } from "@/inbox-utils";

export function useInboxState(cases: ExceptionCase[]) {
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [statusFilter, setStatusFilter] =
    useState<QueueStatusFilter>("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const visibleCases = useMemo(
    () =>
      filterAndSortInboxCases(cases, {
        priority: priorityFilter,
        status: statusFilter,
        search: searchQuery,
      }),
    [cases, priorityFilter, searchQuery, statusFilter],
  );
  const pagination = useMemo(
    () => paginateInboxCases(visibleCases, page, 10),
    [page, visibleCases],
  );

  return {
    priorityFilter,
    setPriorityFilter,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    visibleCases,
    pageSize: 10,
    ...pagination,
  };
}
