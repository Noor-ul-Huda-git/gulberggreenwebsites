import "./globals.css";
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";

export const metadata = {
  title: "Properties for Sale & Rent in Gulberg Greens Islamabad",
  description:
    "Find properties for sale and rent in Gulberg Greens Islamabad including plots, houses, farmhouses, flats, shops, and offices.",
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