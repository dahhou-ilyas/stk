import SideBare from "@/components/sidebare";
import { UploadsProvider } from "@/store/uploadsContext";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="w-[100%] h-[90vh] flex flex-row">
        <UploadsProvider>
          <SideBare/>
          {children}
        </UploadsProvider>
      </div>
    );
  }