import Home from "@/components/Home/Home";
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/")
  return <Home />;
}
