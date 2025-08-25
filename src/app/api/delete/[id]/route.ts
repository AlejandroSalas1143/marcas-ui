import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/api";


export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await api.deleteMarca(Number(id));
  return NextResponse.json({ ok: true });
}
