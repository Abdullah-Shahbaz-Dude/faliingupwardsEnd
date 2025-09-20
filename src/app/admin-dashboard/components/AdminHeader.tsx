// export default AdminHeader;
import { LOGO } from "@/config/images";
import Image from "next/image";
import { FiUser, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

// Modern Professional Header Component
const AdminHeader = ({
  user,
  onLogout,
}: {
  user: any;
  onLogout: () => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-[#0B4073] to-[#1a5490] text-white shadow-xl border-b border-[#7094B7]/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-5">
          {/* Logo and Title Section */}
          <div className="flex items-center space-x-3 sm:space-x-5 flex-1 min-w-0">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0">
              <Image src={LOGO} alt="Falling Upward" className="w-8 h-8 sm:w-12 sm:h-12" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight truncate">
                Admin Dashboard
              </h1>
              <p className="text-blue-100/80 text-xs sm:text-sm font-medium hidden sm:block">
                Manage users and workbooks
              </p>
            </div>
          </div>

          {/* Desktop User Info and Logout */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <div className="w-8 h-8 bg-[#7094B7] rounded-full flex items-center justify-center">
                <FiUser className="text-white text-sm" />
              </div>
              <span className="text-sm font-medium truncate max-w-[150px]">
                {user?.name || user?.email || "Admin"}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="px-5 py-2.5 bg-[#7094B7] hover:bg-[#5d7ba3] text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-[#7094B7]/30"
            >
              <FiUser className="inline mr-2" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white/10 backdrop-blur-sm border-t border-white/20 py-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-3 bg-white/20 rounded-full px-4 py-2 border border-white/20">
                <div className="w-8 h-8 bg-[#7094B7] rounded-full flex items-center justify-center">
                  <FiUser className="text-white text-sm" />
                </div>
                <span className="text-sm font-medium truncate max-w-[200px]">
                  {user?.name || user?.email || "Admin"}
                </span>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setIsMenuOpen(false);
                }}
                className="px-6 py-3 bg-[#7094B7] hover:bg-[#5d7ba3] text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl border border-[#7094B7]/30 w-full max-w-[200px]"
              >
                <FiUser className="inline mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;