import UploadClientPage, { PackageId } from "./UploadClientPage";

// Tell Next.js this route is dynamic and shouldn't be statically prerendered
export const dynamic = "force-dynamic";

type UploadPageProps = {
  searchParams: { pkg?: string };
};

export default function UploadPage({ searchParams }: UploadPageProps) {
  const rawPkg = searchParams.pkg as PackageId | undefined;

  const validIds: PackageId[] = ["snapshot", "core", "methylation-plus", "elite"];

  const initialPackage: PackageId = validIds.includes(rawPkg ?? "snapshot")
    ? (rawPkg as PackageId)
    : "snapshot";

  return <UploadClientPage initialPackage={initialPackage} />;
}
