# Verification CLI

Build and change capabilities together with the user, one piece at a time.
Implement the change they request, then return to the conversation before adding more.

Use Traits to review changes against the project's verification traits in
`.agents/traits/`.

Keep command syntax discoverable through Commander `--help`. Document agreed
prerequisites, execution boundaries, and evidence interpretation in the adjacent
`SKILL.md`, rather than duplicating a command catalog.

Agree on dependency installation with the user and use the project's package
manager and lockfile.

Use the configured Oxfmt and Oxlint scripts for formatting and linting.
Oxlint applies the vendored generic anti-slop rules in `tools/anti-slop/`.
Keep `oxlint` and `@oxlint/plugins` pinned to the same exact version.
Preserve vendored licenses and local customizations when updating the rules.

Never create tests for the CLI.
Only the user's invocation of `/skill:verify` authorizes verification.
