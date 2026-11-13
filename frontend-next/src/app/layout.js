
import "./globals.css";
import Script from "next/script";
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
  // Har page par default "index, follow". Property description pages
  // apni setting (noindex, nofollow) khud lagate hain, jo isko badal deti hai.
  robots: {
    index: true,
    follow: true,
  },
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
               <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-E2HT2RKLDH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'G-E2HT2RKLDH');
          `}
        </Script>

        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
