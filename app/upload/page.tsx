import { Suspense } from "react";
import UploadClientPage from "./UploadClientPage";

type PackageId = "snapshot" | "core" | "methylation" | "elite";

type UploadPageProps = {
  searchParams?: {
    pkg?: string | string[];
  };
};

export default function UploadPage({ searchParams }: UploadPageProps) {
  const pkgParam = searchParams?.pkg;

  let initialPackage: PackageId = "snapshot";

  if (pkgParam === "core" || pkgParam === "methylation" || pkgParam === "elite") {
    initialPackage = pkgParam;
  }

  return (
    <Suspense
      fallback={
        <div className="text-slate-300 p-8">
          Loading upload flow…
        </div>
      }
    >
      <UploadClientPage initialPackage={initialPackage} />
    </Suspense>
  );
}
