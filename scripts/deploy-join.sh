#!/bin/sh

set -eu

repo_root=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
branch_name=$(git -C "$repo_root" branch --show-current)
dry_run=0

if [ "${1:-}" = "--dry-run" ]; then
  dry_run=1
  shift
fi

commit_message=${1:-}

if [ -z "$commit_message" ]; then
  echo "Usage: pnpm run deploy:join -- [--dry-run] \"your commit message\""
  exit 1
fi

if [ -z "$branch_name" ]; then
  echo "Unable to determine the current git branch."
  exit 1
fi

echo "Installing join-app dependencies if needed..."
pnpm -C "$repo_root/join-app" install

echo "Building root app..."
pnpm -C "$repo_root" build

echo "Building join-app..."
pnpm -C "$repo_root/join-app" build

echo "Staging deployable files..."
git -C "$repo_root" add \
  .figma/make/site.json \
  .gitignore \
  index.html \
  package.json \
  scripts/deploy-join.sh \
  scripts/generate-shakha-share-pages.mjs \
  src \
  public \
  dist \
  join-app/.figma/make/site.json \
  join-app/.gitignore \
  join-app/index.html \
  join-app/package.json \
  join-app/scripts/generate-shakha-share-pages.mjs \
  join-app/src \
  join-app/public \
  join-app/pnpm-lock.yaml \
  .github/prompts/deploy-join.prompt.md

if [ "$dry_run" -eq 1 ]; then
  echo "Dry run complete. These files are staged by the deploy workflow:"
  git -C "$repo_root" diff --cached --name-only
  git -C "$repo_root" reset >/dev/null
  exit 0
fi

if git -C "$repo_root" diff --cached --quiet; then
  echo "No staged changes to commit."
  exit 0
fi

echo "Creating commit..."
git -C "$repo_root" commit -m "$commit_message"

if ! git -C "$repo_root" remote get-url origin >/dev/null 2>&1; then
  echo "Committed locally, but no git remote named 'origin' is configured. Add a remote, then push: git push origin $branch_name"
  exit 2
fi

echo "Pushing to origin/$branch_name..."
git -C "$repo_root" push origin "$branch_name"

echo "Deploy workflow completed. If your hosting is connected to this branch, the site should go live after the provider finishes its deployment."