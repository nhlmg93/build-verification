# Build verification

Build a TypeScript CLI with your coding agent for repeatable, automated verification.

Turn what you and your agent know about the project into commands that exercise
its behavior and report what happened. Future agents can reuse those commands
instead of reconstructing the process each time. The aim is to improve reliability
and reduce the tokens spent rediscovering how to verify the project.

Use this skill to create the CLI and maintain it as the project changes. You and
the agent decide what to build, one command at a time.

This workflow is experimental.

## Install

```sh
npx skills add nhlmg93/build-verification
```

For a manual Pi installation, place this repository at
`~/.pi/agent/skills/build-verification/`. Run `/reload`, then invoke:

```text
/skill:build-verification
```

The slash commands in this README are for Pi. If you use another agent, ask it to
adapt the skill's paths, invocation syntax, and tool integrations.

## Build and maintain verification

For a new setup, the agent creates an empty CLI project and a project-local verify
skill. For an existing setup, it works on the files already there.

Discuss a command's purpose, what it should do, and how to interpret its output.
The agent implements the change when you ask, then uses Traits to review the code.
It returns to the conversation before adding another capability.

When you want to run verification, invoke the project's skill:

```text
/skill:verify
```

The CLI starts without project-specific commands. For example, you might build
an `inspect-session` command and run it with:

```sh
npm --prefix .pi/skills/verify/cli run verify -- inspect-session --id example
```

This command is an example, not part of the template. Once you have added commands,
use the CLI's `--help` to discover their arguments and options.

## Generated files

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

The CLI uses Commander.js for command parsing and `--help`, and tsx to run
TypeScript on Node. Its package scripts include `verify`, `lint`, `format`, and
`format:check`. Oxlint uses Dillon Mulroy's vendored anti-slop rules. Oxfmt handles
formatting.

`cli/AGENTS.md` contains maintenance instructions. The project verify skill
documents how to use the commands and interpret their results.

## Run the scaffold directly

With Node.js 22 or later:

```sh
node /path/to/build-verification/scripts/scaffold.mjs /path/to/project
```

The script copies local templates. It refuses to overwrite an existing verify
setup or conflicting trait definitions. It leaves identical traits in place.
It does not download code, install dependencies, or run checks.

Agree on dependency installation with your agent. Use your project's package
manager and lockfile. If the project uses a workspace, decide whether to add the
CLI to it.

## Configure Traits

Configure [Traits](https://traits.sh/) in your agent to use the review step.
This repository does not install or configure the Traits server.

The scaffold copies two traits into `.agents/traits/`:

- `current-help` requires command descriptions, arguments, options, and examples
  to match the implementation.
- `verification-structure` defines the CLI's directory structure and tooling.

Traits review code. They cannot determine whether you approved a change.
[`IMPLEMENT.md`](IMPLEMENT.md) tells the agent how to build each change with you.
If the checker is unavailable, the agent reports that.

## Agent instructions

The skill instructs the agent to build one capability with you at a time, keep
the verification tooling within that agreed scope, and run verification only
when you invoke `/skill:verify`. It also prohibits tests for the CLI itself.

These instructions are not runtime permission controls. They depend on the agent
following them.

## Credits and license

Ideas from Potato, creator of pstack, and [Dillon Mulroy](https://github.com/dmmulroy) inspired this
workflow. [Crosshatch Labs](https://github.com/crosshatch/traits) built
[Traits](https://traits.sh/), which provides the code review used here.

The skill, scaffold, and templates are MIT licensed.

The vendored [anti-slop](https://github.com/dmmulroy/anti-slop) rules are by
Dillon Mulroy and contributors. Their license, upstream revision, and nested
ESLint Stylistic notices are in
[`template/cli/tools/anti-slop/`](template/cli/tools/anti-slop/).
