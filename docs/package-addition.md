# Adding a new package

every package should have a `package.json` file with at least a `name` scoped
with `@warbrokers/` and a `version`.

Example `package.json` file:

```json
{
  "name": "@warbrokers/<name>",
  "version": "0.0.0"
}
```

The main purpose of `package.json` are:

- to let turborepo know about the project's existence
- to use `package.json` scripts via yarn.

## package.json script naming convention

- `dev` - run with live reload (used for development)
- `build` - build library / app
- `start` - start the built app
- `lint` - run linters
- `clean` - remove all generated files

## Checklist

### ✅ No port collision

| Package           |           dev port           |         testing port         |
| ----------------- | :--------------------------: | :--------------------------: |
| `apps/stats-site` |             5173             |             4173             |
| `apps/wbapi`      | 5000, 4000, 4400, 4500, 5001 | 5000, 4000, 4400, 4500, 5001 |
| `apps/wbtimeline` |             3000             |             3000             |
