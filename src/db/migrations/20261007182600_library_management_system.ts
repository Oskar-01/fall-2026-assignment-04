import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // 1. Create borrowers table (linked 1:1 with existing users)
  await db.schema
    .createTable('borrowers')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) =>
      col.references('users.id').onDelete('cascade').notNull().unique()
    )
    .addColumn('card_number', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('phone', 'varchar(50)')
    .addColumn('registered_at', 'timestamp', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .execute();

  // 2. Create authors table
  await db.schema
    .createTable('authors')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('bio', 'text')
    .execute();

  // 3. Create genres table
  await db.schema
    .createTable('genres')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('description', 'text')
    .execute();

  // 4. Create books table (references authors and genres)
  await db.schema
    .createTable('books')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('isbn', 'varchar(50)', (col) => col.notNull().unique())
    .addColumn('author_id', 'integer', (col) =>
      col.references('authors.id').onDelete('cascade').notNull()
    )
    .addColumn('genre_id', 'integer', (col) =>
      col.references('genres.id').onDelete('cascade').notNull()
    )
    .addColumn('published_year', 'integer')
    .addColumn('total_copies', 'integer', (col) => col.defaultTo(1).notNull())
    .addColumn('available_copies', 'integer', (col) => col.defaultTo(1).notNull())
    .execute();

  // 5. Create loans table (references borrowers and books)
  await db.schema
    .createTable('loans')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('borrower_id', 'integer', (col) =>
      col.references('borrowers.id').onDelete('cascade').notNull()
    )
    .addColumn('book_id', 'integer', (col) =>
      col.references('books.id').onDelete('cascade').notNull()
    )
    .addColumn('loan_date', 'timestamp', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .addColumn('due_date', 'timestamp', (col) => col.notNull())
    .addColumn('return_date', 'timestamp')
    .addColumn('status', 'varchar(50)', (col) => col.defaultTo('active').notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop tables in reverse dependency order
  await db.schema.dropTable('loans').execute();
  await db.schema.dropTable('books').execute();
  await db.schema.dropTable('genres').execute();
  await db.schema.dropTable('authors').execute();
  await db.schema.dropTable('borrowers').execute();
}
