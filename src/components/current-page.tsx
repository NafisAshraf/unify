"use client";

import { usePathname } from "next/navigation";

const CurrentPage = () => {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const lastSegment = segments[segments.length - 1];

  const currentPage =
    lastSegment === "admin"
      ? "Dashboard"
      : lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);

  return currentPage;
};

export default CurrentPage;
