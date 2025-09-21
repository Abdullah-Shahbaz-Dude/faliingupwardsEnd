
import { FiBook, FiUser } from "react-icons/fi";
import Image from "next/image";
import { LOGO } from "@/config/images";

// TypeScript Interface
interface User {
  _id: string;
  name: string;
  workbooks?: string[];
  isCompleted?: boolean;
  completedAt?: string;
  dashboardExpired?: boolean;
}

const Header = ({ user }: { user: User | null }) => (
  <header className="bg-gradient-to-r from-[#0B4073] via-[#0f4d84] to-[#1a5490] text-white shadow-2xl border-b border-[#7094B7]/30 relative overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-48 -translate-y-48"></div>
    
    <div className="container mx-auto px-6 relative z-10">
      <div className="flex justify-between items-center py-6">
        <div className="flex items-center space-x-6">
          <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center  ">
            <Image
              src={LOGO}
              alt="Falling Upward"
              width={56}
              height={56}
             
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              My Dashboard
            </h1>
            <p className="text-blue-100/90 text-base font-medium mt-1 flex items-center">
              <FiBook className="mr-2 text-sm" aria-hidden="true" />
              Track your learning progress
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4 bg-white/15 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/30 shadow-lg hover:bg-white/20 transition-all duration-300">
            <div className="w-10 h-10 bg-gradient-to-br from-[#7094B7] to-[#5a7ba8] rounded-xl flex items-center justify-center shadow-inner">
              <FiUser className="text-white text-lg" aria-hidden="true" />
            </div>
            <div>
              <span className="text-base font-semibold block">{user?.name || "User"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
