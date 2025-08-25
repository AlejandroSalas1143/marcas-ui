// app/api/delete/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/api";

export async function DELETE(_req: NextRequest, context: { params: { id?: string } }) {
  const params = await context.params;
  const idStr = params?.id;
  const idNum = Number(idStr);

  if (!idStr || Number.isNaN(idNum)) {
    return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });
  }

  try {
    await api.deleteMarca(idNum);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const errorMessage =
      typeof err === "object" && err !== null && "message" in err
        ? (err as { message?: string }).message
        : undefined;
    return NextResponse.json(
      { ok: false, error: errorMessage ?? "No se pudo eliminar" },
      { status: 500 }
    );
  }
}
