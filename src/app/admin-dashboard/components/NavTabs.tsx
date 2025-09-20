import { FiBook, FiFileText, FiUser, FiUsers } from "react-icons/fi";

interface Tab {
  id: string;
  label: string;
  mobileLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NavTabs = ({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) => {
  const tabs: Tab[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      mobileLabel: "Home",
      icon: FiUsers,
    },
    {
      id: "users",
      label: "Users",
      mobileLabel: "Users",
      icon: FiUser,
    },
    {
      id: "workbooks",
      label: "Workbooks",
      mobileLabel: "Books",
      icon: FiFileText,
    },
    {
      id: "assignments",
      label: "All Assignments",
      mobileLabel: "Assignments",
      icon: FiBook,
    },
  ];

  return (
    <div className="bg-gradient-to-r from-white via-blue-50/20 to-white shadow-lg border-b border-blue-100/50 mb-6 rounded-t-lg overflow-hidden">
<div  />
      
      <div className="flex overflow-x-auto hide-scrollbar px-2 sm:px-6 bg-white/80 backdrop-blur-sm sm:justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`group relative flex items-center justify-center space-x-2 px-3 sm:px-6 py-4 text-sm font-semibold whitespace-nowrap nav-tab-transition flex-shrink-0 ${
              activeTab === tab.id
                ? "text-[#0B4073] bg-gradient-to-b from-blue-50/80 to-white/90 border-b-3 border-[#0B4073] tab-shadow"
                : "text-gray-600 hover:text-[#0B4073] hover:bg-gradient-to-b hover:from-blue-25 hover:to-transparent border-b-3 border-transparent hover:shadow-sm"
            }`}
          >
            {/* Icon container with professional styling */}
            <div className={`p-2 rounded-xl nav-tab-transition ${
              activeTab === tab.id
                ? "bg-gradient-to-br from-[#0B4073] to-[#1a5490] text-white shadow-lg scale-110"
                : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 group-hover:from-[#0B4073] group-hover:to-[#1a5490] group-hover:text-white group-hover:shadow-md group-hover:scale-105"
            }`}>
              <tab.icon className="w-4 h-4" />
            </div>
            
            {/* Text with professional typography */}
            <span className="hidden sm:inline font-semibold tracking-wide text-sm">{tab.label}</span>
            <span className="sm:hidden text-xs font-semibold tracking-wide">{tab.mobileLabel || tab.label}</span>
            
            {/* Active indicator with animation */}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r rounded-t-full animate-pulse" />
            )}
            
            {/* Hover indicator */}
            {/* <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#0B4073] to-[#1a5490] rounded-t-full group-hover:w-8 nav-tab-transition" /> */}
          </button>
        ))}
      </div>
      
      {/* Professional bottom border with gradient */}
    </div>
  );
};

export default NavTabs;
