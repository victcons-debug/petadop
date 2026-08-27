import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between border-b pb-4">
        <h1 className="text-xl font-bold">Panel</h1>
        <Link href="/dashboard/nuevo" className="text-sm text-brand-600 hover:underline">
          + Publicar mascota
        </Link>
      </div>
      {children}
    </div>
  );
}
