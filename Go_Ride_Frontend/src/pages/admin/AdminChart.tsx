/* eslint-disable @typescript-eslint/no-explicit-any */
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useGetAdminReportQuery, useGetAllUsersQuery, useGetAllRidesQuery } from '@/redux/features/admin/admin.api';

export default function AdminChart() {
  useGetAdminReportQuery({});
  const { data: usersData } = useGetAllUsersQuery({});
  const { data: ridesData } = useGetAllRidesQuery({});
  
  const users = usersData?.data || [];
  const rides = ridesData?.data || [];
  
  // Generate chart data from real data
  const getMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    return months.map((month, index) => {
      const monthUsers = users.filter((user: any) => {
        const userDate = new Date(user.createdAt);
        return userDate.getMonth() === index && userDate.getFullYear() === currentYear;
      }).length;
      
      const monthRides = rides.filter((ride: any) => {
        const rideDate = new Date(ride.createdAt);
        return rideDate.getMonth() === index && rideDate.getFullYear() === currentYear;
      }).length;
      
      return {
        name: month,
        users: monthUsers,
        rides: monthRides
      };
    });
  };
  
  const data = getMonthlyData();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="users" fill="#2a0ea6" name="New Users" />
        <Bar dataKey="rides" fill="#b848c2" name="Rides" />
      </BarChart>
    </ResponsiveContainer>
  );
}