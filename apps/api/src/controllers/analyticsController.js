import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Obtener analytics generales
export const getOverviewAnalytics = async (req, res) => {
  try {
    const { from, to } = req.query;
    const storeId = req.storeId;

    // Construir filtro de fechas
    const dateFilter = {};
    if (from) dateFilter.$gte = new Date(from);
    if (to) dateFilter.$lte = new Date(to);

    const matchStage = { storeId };
    if (Object.keys(dateFilter).length > 0) {
      matchStage.createdAt = dateFilter;
    }

    // Total de órdenes
    const totalOrders = await Order.countDocuments(matchStage);

    // Ingresos totales
    const revenueResult = await Order.aggregate([
      { $match: matchStage },
      { $group: { _id: null, totalRevenue: { $sum: "$totals.total" } } }
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // Producto más vendido
    const topProductResult = await Order.aggregate([
      { $match: matchStage },
      { $unwind: "$items" },
      { $group: { 
        _id: "$items.productId", 
        productName: { $first: "$items.productName" },
        totalQty: { $sum: "$items.quantity" },
        totalRevenue: { $sum: "$items.total" }
      }},
      { $sort: { totalQty: -1 } },
      { $limit: 1 }
    ]);
    const topProduct = topProductResult[0] || null;

    // Distribución por canal
    const channelBreakdown = await Order.aggregate([
      { $match: matchStage },
      { $group: { 
        _id: "$channel", 
        count: { $sum: 1 },
        revenue: { $sum: "$totals.total" }
      }},
      { $sort: { count: -1 } }
    ]);

    // Calcular porcentajes
    const totalChannelOrders = channelBreakdown.reduce((sum, item) => sum + item.count, 0);
    const channelPercentages = {};
    channelBreakdown.forEach(item => {
      channelPercentages[item._id] = totalChannelOrders > 0 
        ? Math.round((item.count / totalChannelOrders) * 100) 
        : 0;
    });

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        topProduct: topProduct ? {
          name: topProduct.productName,
          qty: topProduct.totalQty,
          revenue: topProduct.totalRevenue
        } : null,
        channelBreakdown: channelPercentages
      }
    });

  } catch (error) {
    console.error('Error en getOverviewAnalytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener top productos
export const getTopProductsAnalytics = async (req, res) => {
  try {
    const { from, to, limit = 10 } = req.query;
    const storeId = req.storeId;

    const dateFilter = {};
    if (from) dateFilter.$gte = new Date(from);
    if (to) dateFilter.$lte = new Date(to);

    const matchStage = { storeId };
    if (Object.keys(dateFilter).length > 0) {
      matchStage.createdAt = dateFilter;
    }

    const topProducts = await Order.aggregate([
      { $match: matchStage },
      { $unwind: "$items" },
      { $group: { 
        _id: "$items.productId", 
        name: { $first: "$items.productName" },
        qty: { $sum: "$items.quantity" },
        revenue: { $sum: "$items.total" },
        avgPrice: { $avg: "$items.price" }
      }},
      { $sort: { qty: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.status(200).json({
      success: true,
      data: topProducts
    });

  } catch (error) {
    console.error('Error en getTopProductsAnalytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener órdenes por día
export const getOrdersByDayAnalytics = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const storeId = req.storeId;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const ordersByDay = await Order.aggregate([
      {
        $match: {
          storeId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          count: { $sum: 1 },
          revenue: { $sum: "$totals.total" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day"
            }
          },
          count: 1,
          revenue: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: ordersByDay
    });

  } catch (error) {
    console.error('Error en getOrdersByDayAnalytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener estadísticas por canal
export const getChannelStatsAnalytics = async (req, res) => {
  try {
    const { from, to } = req.query;
    const storeId = req.storeId;

    const dateFilter = {};
    if (from) dateFilter.$gte = new Date(from);
    if (to) dateFilter.$lte = new Date(to);

    const matchStage = { storeId };
    if (Object.keys(dateFilter).length > 0) {
      matchStage.createdAt = dateFilter;
    }

    const channelStats = await Order.aggregate([
      { $match: matchStage },
      { $group: { 
        _id: "$channel", 
        count: { $sum: 1 },
        revenue: { $sum: "$totals.total" },
        avgOrderValue: { $avg: "$totals.total" }
      }},
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: channelStats
    });

  } catch (error) {
    console.error('Error en getChannelStatsAnalytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
