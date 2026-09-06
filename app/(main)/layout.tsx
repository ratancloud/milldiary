import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

const mainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      {/* Hide footer on mobile, show on desktop */}
      <div className="hidden md:block">
        <Footer />
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default mainLayout;
