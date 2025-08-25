"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

type Crumb = { href?: string; label: string };

type Props = {
  items?: Crumb[];
  prefixItems?: Crumb[];
  labelMap?: Record<string, string>;
  separator?: React.ReactNode;
  className?: string;
};

function humanize(segment: string) {
  // paso 1: "step-1" -> "Step 1", "nuevo-registro" -> "Nuevo registro"
  const withSpaces = segment.replace(/-/g, " ");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

function defaultLabelFor(segment: string) {
  // Si es número, deja igual; si no, humaniza
  if (/^\d+$/.test(segment)) return segment;
  return humanize(segment);
}

export default function Breadcrumb({
  items,
  prefixItems,
  labelMap,
  separator = <span className="text-zinc-400">/</span>,
  className = "",
}: Props) {
  const pathname = usePathname();

  const autoItems = React.useMemo<Crumb[]>(() => {
    if (!pathname) return [];
    const parts = pathname
      .split("?")[0]
      .split("#")[0]
      .split("/")
      .filter(Boolean);

    let acc = "";
    return parts
      .filter((seg) => !/^\d+$/.test(seg))
      .map((seg, i, arr) => {
        acc += `/${seg}`;
        const isLast = i === arr.length - 1;
        const isEdit = seg.toLowerCase() === "edit";


        const mapped =
          labelMap?.[seg] ??
          (seg.startsWith("step-") ? `Paso ${seg.split("step-")[1]}` : defaultLabelFor(seg));

        return {
          label: mapped,
          href: !isLast && !isEdit ? acc : undefined,

        };
      });
  }, [pathname, labelMap]);


  const finalItems = React.useMemo(
    () => [...(prefixItems ?? []), ...(items ?? autoItems)],
    [prefixItems, items, autoItems]
  );

  if (finalItems.length === 0) return null;

  return (
    <nav className={`text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-zinc-500">
        {finalItems.map((item, idx) => {
          const isLast = idx === finalItems.length - 1;
          return (
            <React.Fragment key={`${item.label}-${idx}`}>
              <li className={isLast ? "font-medium text-zinc-900" : ""}>
                {item.href && !isLast ? (
                  <Link href={item.href} className="hover:text-rose-500 transition">
                    {item.label}
                  </Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </li>
              {!isLast && <li aria-hidden="true">{separator}</li>}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
