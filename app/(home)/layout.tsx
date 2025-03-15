import { auth } from "@/auth";
import InnerLayout from "./HomePageInnerLayout"; 
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  title: {
    default: "Home",
    template: "%s | ResumeTweaker",
  },
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return <InnerLayout session={session} defaultOpen={defaultOpen} >{children}</InnerLayout>;
}
