import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <main className="lg:ml-[260px] pb-20 lg:pb-0">
        <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 md:py-10">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
