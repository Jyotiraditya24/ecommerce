import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "../../lib/axios";
import { Users, ShoppingCart, DollarSign, Package } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({
    user: 0,
    products: 0,
    sales: 0,
    revenue: 0,
  });
  const [loading, setIsLoading] = useState(true);
  const [dailySalesData, setDailySalesData] = useState([]);

  useEffect(() => {
    const getAnalyticsData = async () => {
      try {
        const response = await axios.get("/analytics");
        setAnalyticsData(response.data.data);
        setDailySalesData(response.data.graphData);
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching analytics data: ", error);
        setIsLoading(false);
      }
    };
    getAnalyticsData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-6 lg:px-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <AnalyticsCard
          title="Total Users"
          value={analyticsData.user.toLocaleString()}
          icon={Users}
          color="from-emerald-500 to-teal-700"
        />
        <AnalyticsCard
          title="Total Products"
          value={analyticsData.products.toLocaleString()}
          icon={Package}
          color="from-emerald-500 to-green-700"
        />
        <AnalyticsCard
          title="Total Sales"
          value={analyticsData.sales.toLocaleString()}
          icon={ShoppingCart}
          color="from-emerald-500 to-cyan-700"
        />
        <AnalyticsCard
          title="Total Revenue"
          value={`$${analyticsData.revenue.toLocaleString()}`}
          icon={DollarSign}
          color="from-emerald-500 to-lime-700"
        />
      </div>

      <motion.div
        className="bg-gray-900 rounded-lg p-8 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <h2 className="text-white text-xl font-bold mb-6">
          Sales and Revenue Overview For The Past 7 days
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={dailySalesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="date" stroke="#D1D5DB" />
            <YAxis yAxisId="left" stroke="#D1D5DB" />
            <YAxis yAxisId="right" orientation="right" stroke="#D1D5DB" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="sales"
              stroke="#10B981"
              strokeWidth={3}
              activeDot={{ r: 8 }}
              name="Sales"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              strokeWidth={3}
              activeDot={{ r: 8 }}
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    className={`bg-gray-800 rounded-lg p-6 shadow-lg relative overflow-hidden ${color}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex justify-between items-center">
      <div>
        <p className="text-emerald-300 text-sm mb-1 font-semibold">{title}</p>
        <h3 className="text-white text-3xl font-bold">{value}</h3>
      </div>
      <Icon className="text-emerald-400 w-12 h-12" />
    </div>
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30 z-0"></div>
  </motion.div>
);

export default AnalyticsTab;
