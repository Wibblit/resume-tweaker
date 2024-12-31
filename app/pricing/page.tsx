import Pricing from "@/components/LandingPage/Pricing";
import { auth } from "@/auth";

export default async function PricingPage() {
  const session = await auth();
  return (
    <div className="w-full items-center justify-center">
      <Pricing />
    </div>
  );
}
