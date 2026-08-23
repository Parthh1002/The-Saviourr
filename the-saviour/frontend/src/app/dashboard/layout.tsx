export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark-dashboard min-h-[calc(100vh-4rem)] w-full bg-background text-foreground flex flex-col">
      {children}
    </div>
  );
}
