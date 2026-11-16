# Build Verification

Build verification tooling **with your coding agent**, one useful command at a time.

Instead of asking an agent to invent a test suite, work out what you want to
observe, agree on a small command, and build it together. The result is a
project-specific TypeScript CLI you can understand and use again.

**Experimental and opinionated.** This is a starting point for a workflow, not a
complete verification framework.

## Install

```sh
npx skills add nhlmg93/build-verification
```

For Pi, you can also place this repository at:

```text
~/.pi/agent/skills/build-verification/
```

Reload Pi, then invoke:

```text
/skill:build-verification
```

This skill is user-invoked. The documented slash commands are Pi commands; other
agents may expose skills differently.

## The workflow

1. **Scaffold.** Create the verification skill, an empty CLI project, and starter traits.
2. **Build together.** Discuss one capability and implement it when you ask.
3. **Review.** Use Traits to review the implementation's structure and help text.
4. **Use it.** Explicitly invoke the project's verify skill to run verification.

For example, you might work toward a command like:

```sh
npm --prefix .pi/skills/verify/cli run verify -- inspect-session --id example
```

That command is illustrative, **not included**. The scaffold contains no
project-specific verification commands. You decide what is worth building.

## What gets created

```text
.pi/skills/verify/
├── SKILL.md
└── cli/
    ├── AGENTS.md
    ├── package.json
    ├── tsconfig.json
    ├── oxlint.config.ts
    ├── .oxfmtrc.json
    ├── src/
    │   └── index.ts
    └── tools/
        └── anti-slop/

.agents/traits/
├── current-help.md
└── verification-structure.md
```

- **Commander.js** supplies command parsing and generated `--help`.
- **TypeScript + Node + tsx** keep the CLI in a small, ordinary project.
- **Oxfmt and Oxlint** provide formatting and linting scripts.
- **Dillon Mulroy's anti-slop** generic rules are vendored with licenses and provenance.
- **Traits** review whether help reflects behavior and the CLI follows the expected structure.

The CLI has its own `AGENTS.md` for maintenance instructions. The verify skill
stays focused on using the project tooling, not repeating how it was scaffolded.

## Scaffold directly

Requires Node.js 22 or later:

```sh
node /path/to/build-verification/scripts/scaffold.mjs /path/to/project
```

The script:

- Refuses to overwrite an existing `.pi/skills/verify/`.
- Preserves identical existing traits and stops on conflicting definitions.
- Copies a local template; it does not fetch code, install dependencies, or run checks.

Choose dependency installation with the user and use the project's package
manager and lockfile. In workspaces, include the CLI in the workspace as appropriate.

The CLI package provides `verify`, `lint`, `format`, and `format:check` scripts.
The scaffold does not invoke them.

## Traits

[Traits](https://traits.sh/) is a separate integration. Configure its tools in
your agent to use the review step; this repository does not install or configure
the Traits server.

The bundled traits are copied into the project's `.agents/traits/`:

- **current-help:** command descriptions, arguments, options, and examples match the implementation.
- **verification-structure:** keep an ordinary Commander TypeScript project beside the verify skill.

Traits review code. They cannot establish whether a user approved a change.
Collaboration belongs in [`IMPLEMENT.md`](IMPLEMENT.md), not in a code-review trait.
If the checker is unavailable, the agent is instructed to report that.

## Deliberate boundaries

- Build one capability with the user, then return to the conversation.
- Do not create tests for the verification CLI.
- Run verification only when the user invokes `/skill:verify`.
- Do not independently invent or extend the project's verification tooling.

These are agent instructions, **not a sandbox or runtime permission system**.
The workflow depends on the agent following them.

## Credits and license

The skill, scaffold, and templates are MIT licensed.

The vendored [anti-slop](https://github.com/dmmulroy/anti-slop) rules are by
Dillon Mulroy and contributors. Their MIT license, upstream revision, and nested
ESLint Stylistic notices are preserved under
[`template/cli/tools/anti-slop/`](template/cli/tools/anti-slop/).
