# Implement verification together

1. Ask which capability the user wants to build or change.
2. Propose one small change. Show a concrete invocation and the smallest useful
   sketch or diff; label illustrative output. Pause until the user asks you to
   implement that change.
3. Implement only that change. Never create tests for the CLI.
4. Use Traits to review the changed files against `current-help` and
   `verification-structure`. Resolve findings within the agreed change; bring
   decisions that expand its scope back to the user.
5. Present the change and any unresolved findings. Return to the conversation
   before implementing another piece.

An agreed goal or architecture is not permission to finish the toolbox.
If the Traits checker is unavailable, report the review as unavailable.
