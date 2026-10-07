---
name: kysely-migration-generator
description: >-
  Translates a Mermaid erDiagram into a Kysely database migration. Triggers when the user requests a Kysely migration for an existing ERD or schema.
---

- **Entities $\rightarrow$ Tables:** Map Mermaid entities to snake_case table names (e.g., `USERS` $\rightarrow$ `users`).
- **Keys & Columns:** Convert `PK` attributes to auto-generating IDs/UUIDs and `FK` attributes to `.references().onDelete('cascade')`.
- **Cardinalities:** Correctly map `||--o{` (one-to-many) and `||--o|` (one-to-one with unique constraints).
- **File Output:** Write the generated TypeScript migration to `src/db/migrations/<timestamp>_<migration_name>.ts`.
- **Structure:** Enforce exports for both `up(db: Kysely<any>)` and `down(db: Kysely<any>)` functions. The `down` function must drop tables in reverse dependency order.