import Order from "../models/Order.model";
import Product from "../models/Product.model";
import User from "../models/user.model";

export const getAnalyticsData = async (req, resp) => {
  try {
    const data = await getDataforAnalytics();
  } catch (error) {}
};

const getDataforAnalytics = async () => {
  const totalUser = await User.countDocuments(); // tell how many users are there
  const totalProducts = await Product.countDocuments(); // tell how many products are there

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null, // now all the data is grouped
        totalSales: {
          $sum: 1,
        }, // counts number of order
        totalRevenue: {
          $sum: "$totalAmount",
        },
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
          // coverting the time hours seconds only to date
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        sales: {
          $sum: 1,
        },
        revenue: {
          $sum: "$totalAmount",
        },
      },
    },
  ]);
  /* output 
  [
    {
        _id: "2024-05-10",
        sales: 10,
        revenue: 1000.23
    }
  ]
  */
};
