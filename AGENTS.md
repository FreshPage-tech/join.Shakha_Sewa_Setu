# figma-make-app

React + Vite + Tailwind CSS project running inside Figma Make.

## Development Server

A Vite development server is **always running** on `$PORT` (default 8443). You don't need to start it manually.

- Preview URL: The user can access the running app through the preview panel
- Hot reload: Changes to source files are reflected immediately

## Key Files

- `src/App.tsx` - Main application component
- `src/main.tsx` - React entry point
- `src/index.css` - Global styles and Tailwind CSS import
- `package.json` - Dependencies and scripts
- `vite.config.ts` - Vite configuration
- `.mise.toml` - Toolchain versions (Node.js, pnpm)

## Styling

This project uses **Tailwind CSS v4** for styling. Use Tailwind utility classes directly in JSX. Tailwind is loaded via the Vite plugin — no PostCSS config needed.

## Project History Recorder agent responsibility

For every task that changes this repository, the working agent must maintain the root `Project_History.md`. This applies to all subdirectories, including `join-app`. This is a persistent agent responsibility, not a background file watcher.

- Read the history before making changes. Record the user's request faithfully; do not invent earlier requests or results.
- Add an entry for each distinct request or meaningful change, including features, bug fixes, UI, data, configuration, dependencies, documentation, tests, deployments, removals, and reversions. Group related edits within one task; do not log every keystroke or create recursive entries for history updates.
- Organize entries by actual work date (`YYYY-MM-DD`, America/New_York) and category. Use stable IDs (`PH-YYYYMMDD-NNN`) and maintain the category index.
- Each entry must include: category, status, what the user asked, previous behavior/problem, changes made, outcome, affected files, validation, and remaining work. For bug fixes, also record the root cause when known, or explicitly say it is unknown.
- Add an In progress entry while working when practical. Before the final response, update it to Completed, Partially completed, Blocked, or Reverted with the actual outcome. If work spans dates, append a dated follow-up referencing the original ID.
- Keep the feature inventory current when capabilities are added, changed, or removed. Distinguish source inspection from tested behavior and deployed behavior.
- Preserve previous entries. Append dated corrections or follow-ups instead of rewriting historical outcomes. Current task status and the current feature inventory may be updated in place.
- Never claim a test passed or a deployment happened without evidence. Record checks not run and the reason. Do not attribute pre-existing working-tree changes to the current task.
- Do not store credentials, tokens, private registration details, or other sensitive personal data in the history. Summarize relevant requests with sensitive values removed.
- Update the history as part of authorized work without asking for separate permission, and mention the update briefly in the final response.
