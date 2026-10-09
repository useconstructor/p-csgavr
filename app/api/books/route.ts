import { db } from '@/lib/db';

export async function GET() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pendiente',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  const { rows } = await db.execute('SELECT * FROM books ORDER BY created_at DESC');

  if (rows.length === 0) {
    await db.execute({
      sql: 'INSERT INTO books (title, author, status) VALUES (?, ?, ?)',
      args: ['Cien años de soledad', 'Gabriel García Márquez', 'Leído']
    });
    await db.execute({
      sql: 'INSERT INTO books (title, author, status) VALUES (?, ?, ?)',
      args: ['El quijote', 'Miguel de Cervantes', 'Pendiente']
    });
    await db.execute({
      sql: 'INSERT INTO books (title, author, status) VALUES (?, ?, ?)',
      args: ['Rayuela', 'Julio Cortázar', 'Pendiente']
    });
    const { rows: seededRows } = await db.execute('SELECT * FROM books ORDER BY created_at DESC');
    return Response.json(seededRows);
  }

  return Response.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pendiente',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  await db.execute({
    sql: 'INSERT INTO books (title, author, status) VALUES (?, ?, ?)',
    args: [body.title, body.author, body.status || 'Pendiente']
  });

  return Response.json({ ok: true });
}
