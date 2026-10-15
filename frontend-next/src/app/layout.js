import "./globals.css";
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://gulberggreens.com.pk",
  ),
  // Sirf aakhri sahara: jis page ka apna title/description na ho, us par ye aayega.
  title: "Gulberg Greens Islamabad",
  description:
    "Gulberg Greens Islamabad, a CDA-approved gated community by IBECHS on Gulberg Expressway.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="overflow-x-clip antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}