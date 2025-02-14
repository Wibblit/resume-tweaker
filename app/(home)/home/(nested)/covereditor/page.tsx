import CoverEditor from "@/components/coverEditor";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cover Editor",
};

export default async function CoverBuilder() {
  const session = await auth();
  //console.log(session);
  if (!session?.user) {
    redirect("/login?callbackUrl=/home/covereditor");
  }
  return <CoverEditor />;
}
