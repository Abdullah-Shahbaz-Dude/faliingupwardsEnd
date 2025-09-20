import {
  FiBook,
  FiCheckCircle,
  FiClock,
  FiEdit,
  FiEye,
  FiXCircle,
} from "react-icons/fi";


const StatusBadge = ({
  status,
}: {
  status: string;
}) => {
  // Default to 'pending' if status is undefined or empty
  const safeStatus = status || "pending";

  const badgeStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-[#D6E2EA] text-[#0B4073]",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    assigned: "bg-[#D6E2EA] text-[#0B4073]",
    in_progress: "bg-[#7094B7] text-white",
    submitted: "bg-[#0B4073] text-white",
    reviewed: "bg-green-100 text-green-800",
  };

  const icons = {
    pending: <FiClock className="mr-1" />,
    confirmed: <FiCheckCircle className="mr-1" />,
    completed: <FiCheckCircle className="mr-1" />,
    cancelled: <FiXCircle className="mr-1" />,
    assigned: <FiBook className="mr-1" />,
    in_progress: <FiEdit className="mr-1" />,
    submitted: <FiCheckCircle className="mr-1" />,
    reviewed: <FiEye className="mr-1" />,
  };

  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center ${badgeStyles[safeStatus as keyof typeof badgeStyles] || "bg-gray-100 text-gray-800"}`}
    >
      {icons[safeStatus as keyof typeof icons] || null}{" "}
      {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
    </span>
  );
};

export default StatusBadge;
