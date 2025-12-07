import { Suspense } from "react";
import UploadClientPage from "./UploadClientPage";

// Optional but helpful to avoid static export issues on this route
export const dynamic = "force-dynamic";

export default function UploadPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-200">
          Preparing upload flow...
        </div>
      }
    >
      <UploadClientPage />
    </Suspense>
  );
}
