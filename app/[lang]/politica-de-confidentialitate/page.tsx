import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalDocument } from "@/components/sections/LegalDocument";
import { getLocale } from "@/content";
import { legal } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

const doc = legal.privacy;

export const metadata: Metadata = pageMetadata(doc);

export default async function Page() {
  // Paginile legale există doar în română; linkurile din varianta în engleză duc aici, la „/…".
  if ((await getLocale()) !== "ro") notFound();

  return (
    <>
      {/* DE VERIFICAT înainte de lansare */}
      <LegalDocument doc={doc} />
    </>
  );
}
