import {
  LayoutDashboard,
  Factory,
  Bell,
  FileBarChart2,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-[280px] bg-[#0b1220] border-r border-cyan-500/10 p-6">
      <h1 className="text-3xl font-bold text-white mb-10">
        PLC SYSTEM
      </h1>

      <div className="space-y-3">
        <Menu icon={<LayoutDashboard />} title="Dashboard" />
        <Menu icon={<Factory />} title="Machines" />
        <Menu icon={<Bell />} title="Alerts" />
        <Menu icon={<FileBarChart2 />} title="Reports" />
        <Menu icon={<Settings />} title="Settings" />
      </div>
    </div>
  );
}

function Menu({ icon, title }) {
  return (
    <div className="h-[55px] rounded-2xl flex items-center gap-4 px-5 text-gray-300 hover:bg-cyan-500 hover:text-white transition-all cursor-pointer">
      {icon}
      {title}
    </div>
  );
}
