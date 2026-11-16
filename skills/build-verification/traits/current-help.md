---
name: current-help
subject: Help text for project verification CLI commands.
requirement: When adding or changing a verification command, update its Commander description, arguments, options, and examples so --help matches the implemented behavior.
purpose: Let the user discover and understand the actual command interface without relying on stale instructions.
---

Keep examples consistent with the current command names, supported options, and
required arguments. Use generated help rather than maintaining a duplicate command
catalog in the verification skill.
