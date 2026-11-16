import { ReportButton } from "./report-button.js";

interface ReportActionsProps {
  reportId: string;
  archived?: boolean;
}

export function ReportActions({ reportId, archived = false }: ReportActionsProps) {
  const endpoint = `/api/reports/${encodeURIComponent(reportId)}`;

  return (
    <footer aria-label="Report actions">
      <div role="group">
        <ReportButton
          label={archived ? "Archived" : "Archive report"}
          post={`${endpoint}/archive`}
          disabled={archived}
        />
        <ReportButton
          label="Delete report"
          deleteUrl={endpoint}
          confirm="Delete this report? This removes the HTML file."
        />
      </div>
    </footer>
  );
}
