interface ReportButtonProps {
  label: string;
  post?: string;
  deleteUrl?: string;
  confirm?: string;
  disabled?: boolean;
}

export function ReportButton(props: ReportButtonProps) {
  return (
    <button
      type="button"
      hx-post={props.post}
      hx-delete={props.deleteUrl}
      hx-confirm={props.confirm}
      hx-target="closest footer"
      hx-swap="outerHTML"
      disabled={props.disabled}
    >
      {props.label}
    </button>
  );
}
