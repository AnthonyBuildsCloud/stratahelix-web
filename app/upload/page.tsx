// app/upload/page.tsx
import UploadClientPage from "./UploadClientPage";
import type { PackageId } from "../../types/packages";

// Helper to map whatever comes in via ?pkg=... to a valid PackageId
function normalizePackageId(raw: string | undefined): PackageId {
  const value = (raw ?? "").toLowerCase();

  switch (value) {
    case "core":
      return "core";
    case "methylation":
    case "methylation+":
    case "methylation-plus":
      return "methylation+";
    case "elite":
      return "elite";
    default:
      // anything missing or unknown defaults to the free Snapshot tier
      return "snapshot";
  }
}

// In Next 16 / React 19, searchParams on a Server Component is a **Promise**
type UploadPageProps = {
  searchParams: Promise<{ pkg?: string | string[] }>;
};

export default async function UploadPage({ searchParams }: UploadPageProps) {
  // ✅ Await the promise before touching `.pkg`
  const resolved = await searchParams;
  const raw = resolved?.pkg;

  // Next can give you either a string or string[]
  const pkgParam = Array.isArray(raw) ? raw[0] : raw;

  const initialPackage = normalizePackageId(pkgParam);

  return <UploadClientPage initialPackage={initialPackage} />;
}
