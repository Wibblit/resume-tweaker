import Home from "@/components/Home/Home";
import { redirect } from "next/navigation";

export default function HomePage() {
  console.log("reach to home page now we will be redirected")
  redirect("/")
  return <Home />;
}
