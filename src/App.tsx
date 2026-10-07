import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import CinematicBackground from "@/components/layout/CinematicBackground";
import Home from "@/pages/Home";
import CNG from "@/pages/CNG";
import CNGGenerator from "@/pages/CNGGenerator";
import Solar from "@/pages/Solar";
import Generators from "@/pages/Generators";
import HybridEnergy from "@/pages/HybridEnergy";
import EnergyAudit from "@/pages/EnergyAudit";
import Maintenance from "@/pages/Maintenance";
import Industries from "@/pages/Industries";
import About from "@/pages/About";
import CaseStudies from "@/pages/CaseStudies";
import Fuel from "@/pages/Fuel";
import TrackProject from "@/pages/TrackProject";
import Quote from "@/pages/Quote";
import Contact from "@/pages/Contact";
import CustomerPortal from "@/pages/CustomerPortal";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <CinematicBackground />
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cng" element={<CNG />} />
          <Route path="/cng/vehicle-conversion" element={<CNG />} />
          <Route path="/cng/fleet-conversion" element={<CNG />} />
          <Route path="/cng/generator-conversion" element={<CNGGenerator />} />
          <Route path="/generators" element={<Generators />} />
          <Route path="/fuel" element={<Fuel />} />
          <Route path="/diesel-supply" element={<Fuel />} />
          <Route path="/solar" element={<Solar />} />
          <Route path="/battery-storage" element={<Solar />} />
          <Route path="/hybrid-energy" element={<HybridEnergy />} />
          <Route path="/energy-audit" element={<EnergyAudit />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/about" element={<About />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/track" element={<TrackProject />} />
          <Route path="/my-project" element={<TrackProject />} />
          <Route path="/portal" element={<CustomerPortal />} />
          <Route path="/my-smartfix" element={<CustomerPortal />} />
          <Route path="/customer-portal" element={<CustomerPortal />} />
          <Route path="/request-quote" element={<Quote />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <FloatingActions />
      <Toaster position="bottom-right" theme="dark" richColors />
    </BrowserRouter>
  );
}
