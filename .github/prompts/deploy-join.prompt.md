---
description: "Build root and join-app, stage deploy files, commit, and push the current branch. Use when the user says deploy join, push to git, or take the site live."
---

Commit message: ${input:commitMessage:Commit message for this deployment}

Run the repository deploy workflow with this sequence:

1. Run `pnpm run deploy:join -- "${input:commitMessage}"` from the repository root.
2. Report whether the root build and join-app build succeeded.
3. Report whether the commit was created and whether the push succeeded.
4. If push fails because no `origin` remote is configured, explain that clearly and show the exact next command needed.

Do not stage or commit `node_modules`.