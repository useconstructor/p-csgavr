import { db } from '@/lib/db';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  if (body.status) {
    await db.execute({
      sql: 'UPDATE books SET status = ? WHERE id = ?',
      args: [body.status, id]
    });
  }

  const { rows } = await db.execute({
    sql: 'SELECT * FROM books WHERE id = ?',
    args: [id]
  });

  return Response.json(rows[0] ?? null);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await db.execute({
    sql: 'DELETE FROM books WHERE id = ?',
    args: [id]
  });

  return Response.json({ ok: true });
}
