import { SignIn } from "@/components/auth/SignIn";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    return redirect("/home");
  }
  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4`}
    >
      <SignIn />
    </div>
  );
}
