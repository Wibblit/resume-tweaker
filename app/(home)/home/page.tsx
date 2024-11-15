import Home from "@/components/Home/Home";
import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user) return <div>Loading</div>;

  return <Home />;
}
