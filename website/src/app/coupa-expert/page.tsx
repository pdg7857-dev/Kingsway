import { PlatformAuthority, platformMetadata } from "@/components/site/platform-authority";

export const metadata = platformMetadata("coupa");

export default function Page() {
  return <PlatformAuthority slug="coupa" />;
}
