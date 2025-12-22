
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";


const mainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default mainLayout;
