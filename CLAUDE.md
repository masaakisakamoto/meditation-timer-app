# MitterTimer - Claude Code Instructions

## Goal

Ship iOS + Android releases quickly with high reliability.

## Non-negotiable rules

1. Before commit, always run:
   - npm run check
2. Prefer minimal changes over refactors.
3. Keep behavior stable for release.

## Project facts

- Expo SDK 54
- TypeScript strict
- EAS production build uses autoIncrement and appVersionSource=remote
- iOS bundleId: jp.theravada.meditation
- Android package: jp.theravada.meditation

## Common commands

- Dev server: npm run start
- Format: npm run format
- Quality gate: npm run check

## When you change anything

- If it affects release/behavior, write a short note in rag/docs/mittertimer/changelog.md (later we will add this folder)
