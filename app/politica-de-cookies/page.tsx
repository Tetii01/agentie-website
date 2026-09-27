import type { Metadata } from "next";
import { LegalDocument } from "@/components/sections/LegalDocument";
import { legal } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

const doc = legal.cookies;

export const metadata: Metadata = pageMetadata(doc);

export default function Page() {
  return (
    <>
      {/* DE VERIFICAT înainte de lansare */}
      <LegalDocument doc={doc} />
    </>
  );
}
