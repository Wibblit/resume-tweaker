export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <main className="">{children}</main>
    </div>
  );
}
