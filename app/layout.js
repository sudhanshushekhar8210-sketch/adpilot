import "./globals.css";

export const metadata = {
  title: "AdPilot - Meta Ads Automation",
  description: "Create and manage Meta advertisements from one simple dashboard.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}