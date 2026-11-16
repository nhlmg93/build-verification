---
name: build-verification
description: "Build or change a project's verification skill and TypeScript CLI together with the user."
disable-model-invocation: true
---

# Build verification

Read the project's instructions and existing verification setup.

For a new setup, scaffold with the project root:

```text
node <this-skill-directory>/scripts/scaffold.mjs <project-root>
```

Dependencies remain uninstalled; agree on installation with the user.
Preserve existing verification setups and discuss conflicting traits with the user.

For both new and existing setups, **before adding or changing a capability**,
read [IMPLEMENT.md](IMPLEMENT.md) for the collaborative implementation loop.

Only the user's invocation of `/skill:verify` authorizes verification.
Building the toolbox does not authorize demonstrations or verification runs.
