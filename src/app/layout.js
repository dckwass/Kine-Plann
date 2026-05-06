import "./globals.css";

export const metadata = {
  title: "Kiné Behandlungsplaner",
  description: "KI-gestützter Heimübungsplaner für Physiotherapie-Patienten",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
