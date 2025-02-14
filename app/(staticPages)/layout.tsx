import Footer from "@/components/LandingPage/Footer";
import { LandingNav } from "@/components/LandingPage/LandingNav";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <LandingNav />
                <main>
                    {children}
                </main>
            <Footer />
        </div>
    );
}
