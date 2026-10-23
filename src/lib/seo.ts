import type { Metadata } from "next";

const SITE_NAME = "Corelane";
const SITE_URL = "https://corelane.demo";
const DEFAULT_DESCRIPTION =
  "Corelane unifies bookings, billing, and support so growing teams operate from one calm control plane.";

export function createPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
}: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const isHome = title === SITE_NAME;

  return {
    title: isHome
      ? { absolute: "Corelane - Operate every lane" }
      : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: isHome ? "Corelane - Operate every lane" : `${title} · ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: isHome ? "Corelane - Operate every lane" : `${title} · ${SITE_NAME}`,
      description,
    },
  };
}
