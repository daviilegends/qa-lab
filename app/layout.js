import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { AccountProvider } from "@/context/AccountContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const headingFont = Poppins({
  variable: "--font-heading",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata = {
  title: "MiniCommerce QA Lab",
  description: "A dummy e-commerce app for practicing Playwright QA automation.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <AccountProvider>
            <CartProvider>
              <Header />
              <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
              <Footer />
            </CartProvider>
          </AccountProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
