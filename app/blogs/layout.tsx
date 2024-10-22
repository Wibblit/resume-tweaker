import { LandingNav } from "@/components/LandingNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingNav />
      <main className="flex-grow md:pt-0 ">{children}</main>
    </div>
  );
}
