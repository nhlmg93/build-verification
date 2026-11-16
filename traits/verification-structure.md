---
name: verification-structure
subject: Project verification CLI structure.
requirement: Keep the verification skill at .pi/skills/verify/SKILL.md and its Commander.js CLI as a TypeScript project in the adjacent cli/ directory, with package.json, tsconfig.json, and source under src/. Run it with Node and tsx. Keep verification traits in .agents/traits/. Use the project's package manager and lockfile.
purpose: Keep verification projects consistent and discoverable without prescribing their project-specific capabilities.
---

Organize source into modules when useful rather than forcing everything into one
file. Keep the skill's operational instructions consistent with the actual CLI.
Never create tests for the CLI.
