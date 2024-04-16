import SideBare from "@/components/sidebare";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="w-[100%] h-[90vh] flex flex-row">
        <SideBare/>
        {children}
      </div>
    );
  }