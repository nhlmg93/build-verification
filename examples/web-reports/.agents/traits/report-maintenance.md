---
name: report-maintenance
subject: Maintaining the web-report example.
requirement: Keep the report's description and displayed evidence consistent with src/core/check-config.ts. Both CLI and browser actions must call that shared verification. Retain the local Pico and HTMX assets and the reusable archive/delete controls at the end of the report. Report actions must resolve the report through db.json so deleting its entry makes subsequent actions return 404.
purpose: Keep the reviewer's report accurate and runnable as the verification changes.
---

Keep the original file path and check timestamp visible. Do not present a schema
check as proof that an application runs. A rerun must update the saved HTML as
well as the browser's result. Archive records the reviewer's choice; deletion
removes the generated HTML and metadata.
