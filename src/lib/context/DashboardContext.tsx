// import { createContext, useContext } from "react";
// import { User, Appointment, Workbook } from "../types/adminDashboard";

// export interface DashboardState {
//   user: User | null;
//   users: User[];
//   appointments: Appointment[];
//   workbooks: Workbook[];
//   setUser: (user: User | null) => void;
//   setUsers: (users: User[]) => void;
//   setAppointments: (appointments: Appointment[]) => void;
//   setWorkbooks: (workbooks: Workbook[]) => void;
// }

// const DashboardContext = createContext<DashboardState | undefined>(undefined);

// export const useDashboard = () => {
//   const context = useContext(DashboardContext);
//   if (!context)
//     throw new Error("useDashboard must be used within DashboardProvider");
//   return context;
// };

// export default DashboardContext;
