export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow md:pt-0 ">{children}</main>
    </div>
  );
}
