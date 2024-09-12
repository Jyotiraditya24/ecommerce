import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";
import User from "../models/user.model.js";

export const getAnalyticsData = async (req, resp) => {
  try {
    const data = await getDataforAnalytics();
    const graphData = await getGraphData();
    resp.status(200).json({ data, graphData });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    resp.status(500).json({ error: "Error fetching analytics data" });
  }
};

const getDataforAnalytics = async () => {
  const totalUser = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const { totalSales, totalRevenue } = salesData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };

  return {
    user: totalUser,
    products: totalProducts,
    sales: totalSales,
    revenue: totalRevenue,
  };
};

const getGraphData = async () => {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  const dailySalesData = await getDailySalesData(startDate, endDate);
  return dailySalesData;
};

const getDailySalesData = async (startDate, endDate) => {
  const dailySalesData = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        sales: { $sum: 1 },
        revenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const dateArray = getDatesInRange(startDate, endDate);

  return dateArray.map((date) => {
    const foundData = dailySalesData.find((item) => item._id === date);
    return {
      date,
      sales: foundData?.sales || 0,
      revenue: foundData?.revenue || 0,
    };
  });
};

const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]); // Ensuring date formatting
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};
