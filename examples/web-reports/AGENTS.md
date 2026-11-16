# Maintain this example

Build changes together with the user. Use the local `report-maintenance` trait
to review changes.

Keep verification execution in `src/core/`. CLI parsing and HTTP handlers call
the same function. Report JSX lives in `src/reports/`, reusable controls in
`src/components/`, and generated HTML in `www/`.

Never create tests for this CLI. Run verification only when the user asks.
