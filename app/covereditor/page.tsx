import CoverEditor from "@/components/coverEditor";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CoverBuilder() {
  const session = await auth();
  console.log(session);
  if (!session?.user) {
    redirect("/login?callbackUrl=/covereditor");
  }
  return <CoverEditor />;
}
