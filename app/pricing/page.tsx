import Pricing from "@/components/LandingPage/Pricing";
import Footer from "@/components/LandingPage/Footer";
import { LandingNav } from "@/components/LandingPage/LandingNav";
import { auth } from "@/auth";

export default async function PricingPage() {
  const session = await auth();
  return (
    <div className="w-full items-center justify-center">
      <LandingNav />
      <Pricing />
      <Footer />    
    </div>
  );
}
