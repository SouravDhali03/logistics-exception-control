import {
  impactText,
  routeSearchText,
  type ExceptionCase,
  type Priority,
  type QueueStatusFilter,
} from "@/app-model";

export type InboxFilters = {
  priority: Priority | "all";
  status: QueueStatusFilter;
  search: string;
};

export const filterAndSortInboxCases = (
  cases: ExceptionCase[],
  { priority, status, search }: InboxFilters,
) => {
  const query = search.trim().toLowerCase();

  return cases
    .filter((item) => {
      const matchesSearch =
        !query ||
        [
          item.id,
          item.title,
          item.detail,
          routeSearchText(item.route),
          impactText(item.impact),
          item.owner,
        ].some((value) => value.toLowerCase().includes(query));

      return (
        matchesSearch &&
        (status === "all" ||
          (status === "active" &&
            item.status !== "closed" &&
            (!item.snoozedUntil || item.snoozedUntil <= Date.now())) ||
          (status === "resolved" && item.status === "closed")) &&
        (priority === "all" || item.priority === priority)
      );
    })
    .sort((a, b) => {
      const aClosed = a.status === "closed";
      const bClosed = b.status === "closed";
      if (aClosed !== bClosed) return aClosed ? 1 : -1;
      if (aClosed && bClosed) {
        return (b.activityAt ?? 0) - (a.activityAt ?? 0);
      }
      return a.priority.localeCompare(b.priority);
    });
};

export const paginateInboxCases = <T>(items: T[], page: number, pageSize: number) => {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const activePage = Math.min(page, pageCount);

  return {
    pageCount,
    activePage,
    items: items.slice((activePage - 1) * pageSize, activePage * pageSize),
  };
};
