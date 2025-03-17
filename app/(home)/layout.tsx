import { auth } from "@/auth";
import InnerLayout from "./HomePageInnerLayout"; 
import { Metadata } from "next";
import { cookies } from "next/headers";
import { prisma } from "@/prisma";
import { cache } from "react";

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
export const revalidate = 3600;
const getCreditsData = cache(async (userId: string) => {
  console.log('db fetch')
  const res = await prisma.userAssets.findUnique({
    where : {
      userId: userId,
    }
  })
  return res;
})

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const cookieStore =  cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  const creditsData = await getCreditsData(session?.user?.id!);

  return <InnerLayout session={session} creditsData={creditsData} defaultOpen={defaultOpen}>{children}</InnerLayout>;
}
