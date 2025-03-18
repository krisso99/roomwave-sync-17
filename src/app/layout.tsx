
import { Toaster } from "@/components/ui/toaster";
import "@/index.css";

export const metadata = {
  title: "RoomWave Sync",
  description: "Property management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
