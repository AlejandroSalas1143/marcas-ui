import { api } from "@/lib/api";
import Step3 from "@/app/registro-marca/(steps)/step-3/Step3";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function EditStep3Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (Number.isNaN(id)) notFound();

  const marca = await api.getMarca(id).catch(() => null);
  if (!marca) notFound();

  return (
    <Step3
      initial={marca}
      mode="edit"
      basePath={`/registro-marca/${id}/edit`}
    />
  );
}