import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";

export default function MainLayout({ children }) {
  return (
    <div
      className="
        flex
        min-h-screen
        bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.14),transparent_30rem),radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_28rem),linear-gradient(135deg,#050816_0%,#07111f_45%,#0a1024_100%)]
        text-white
      "
    >
      <Sidebar />

      <div className="min-w-0 flex-1 overflow-auto">
        <div className="p-4 pb-28 sm:p-5 md:p-6 md:pb-6">
          <Header />
          {children}
        </div>
      </div>
    </div>
  );
}
