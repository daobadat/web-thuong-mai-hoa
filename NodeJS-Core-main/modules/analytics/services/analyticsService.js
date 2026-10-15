"use strict";

const { Order, OrderItem, Product, ProductTranslation, ProductImage, Sequelize } = require("models");
const { Op } = Sequelize;
const logger = require("utils/logger");

// 60-second in-memory cache
const cache = new Map();
const CACHE_TTL_MS = 60 * 1000;

// Valid orders for revenue & top products
const VALID_REVENUE_STATUSES = [
  "delivered",
  "confirmed",
  "processing",
  "ready_for_delivery",
  "out_for_delivery",
];

function isOrderValidForRevenue(order) {
  const statusOk = VALID_REVENUE_STATUSES.includes(order.status);
  const paymentOk = order.payment_status === "paid" || order.status === "delivered";
  return statusOk && paymentOk;
}

// Largest remainder percentage distributor (1 decimal precision)
function distributePercentages(items, key = "count") {
  const sum = items.reduce((acc, it) => acc + (it[key] || 0), 0);
  if (sum === 0) {
    return items.map((it) => ({ ...it, percentage: 0 }));
  }

  const rawPercentages = items.map((it) => {
    const raw = ((it[key] || 0) / sum) * 1000;
    const floor = Math.floor(raw);
    const remainder = raw - floor;
    return { it, floor, remainder };
  });

  const currentTotal = rawPercentages.reduce((acc, r) => acc + r.floor, 0);
  const diff = 1000 - currentTotal;

  // Sort indices by remainder descending
  const sorted = [...rawPercentages].sort((a, b) => b.remainder - a.remainder);
  for (let i = 0; i < diff; i++) {
    sorted[i % sorted.length].floor += 1;
  }

  return rawPercentages.map((r) => ({
    ...r.it,
    percentage: Number((r.floor / 10).toFixed(1)),
  }));
}

// Clean district/city extractor from Vietnamese address
function extractRegion(address) {
  if (!address || typeof address !== "string") return "Khác";

  const parts = address
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length === 0) return "Khác";

  // Check for district token (Quận, Huyện, Thị xã...)
  const districtPart = parts.find((p) =>
    /^(quận|huyện|thị xã|thị trấn)\s+/i.test(p)
  );
  if (districtPart) {
    return districtPart;
  }

  // Check for city / province token (TP., Thành phố, Tỉnh...)
  const cityPart = parts.find((p) =>
    /^(tp\.|thành phố|tỉnh)\s+/i.test(p)
  );
  if (cityPart) {
    return cityPart;
  }

  // Fallback to second-to-last or last part
  if (parts.length >= 2) {
    return parts[parts.length - 2];
  }
  return parts[0].slice(0, 25);
}

const analyticsService = {
  clearCache: () => {
    cache.clear();
    logger.info("[Analytics] Cache invalidated");
  },

  getStats: async ({ months = 6, lang = "vi" }) => {
    const cacheKey = `${months}_${lang}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // 1. Build calendar month list (N months)
    const monthList = [];
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const monthKey = `${y}-${String(m).padStart(2, "0")}`;
      const label = lang === "ko" ? `${m}월` : `T${m}`;
      monthList.push({
        month: monthKey,
        label,
        year: y,
        monthNum: m,
        revenue: 0,
        orders: 0,
        isCurrentMonth: i === 0,
      });
    }

    const currentStartDate = new Date(
      monthList[0].year,
      monthList[0].monthNum - 1,
      1,
      0,
      0,
      0,
      0
    );
    const currentEndDate = new Date(
      currentYear,
      currentMonth + 1,
      0,
      23,
      59,
      59,
      999
    );

    const prevEndDate = new Date(currentStartDate.getTime() - 1);
    const prevStartDate = new Date(
      monthList[0].year,
      monthList[0].monthNum - 1 - months,
      1,
      0,
      0,
      0,
      0
    );

    // 2. Query Orders for Current & Previous period
    const allOrders = await Order.findAll({
      where: {
        created_at: {
          [Op.between]: [prevStartDate, currentEndDate],
        },
      },
      attributes: [
        "id",
        "status",
        "payment_status",
        "total_amount",
        "delivery_address",
        "created_at",
      ],
      raw: true,
    });

    const currentOrders = [];
    const prevOrders = [];

    allOrders.forEach((o) => {
      const createdAt = new Date(o.created_at);
      if (createdAt >= currentStartDate && createdAt <= currentEndDate) {
        currentOrders.push(o);
      } else if (createdAt >= prevStartDate && createdAt <= prevEndDate) {
        prevOrders.push(o);
      }
    });

    // 3. Compute KPI metrics
    const calcKPI = (orders) => {
      const totalOrders = orders.length;
      const validOrders = orders.filter(isOrderValidForRevenue);
      const completedOrders = validOrders.length;
      const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;
      const revenue = validOrders.reduce(
        (sum, o) => sum + Number(o.total_amount || 0),
        0
      );
      const cancelRate = totalOrders
        ? Number(((cancelledOrders / totalOrders) * 100).toFixed(1))
        : 0;

      return {
        revenue,
        totalOrders,
        completedOrders,
        cancelRate,
      };
    };

    const curKPI = calcKPI(currentOrders);
    const prevKPI = calcKPI(prevOrders);

    const calcDelta = (cur, prev) => {
      if (prev === 0 || prev == null) return null;
      return Number((((cur - prev) / prev) * 100).toFixed(1));
    };

    const delta = {
      revenue: calcDelta(curKPI.revenue, prevKPI.revenue),
      totalOrders: calcDelta(curKPI.totalOrders, prevKPI.totalOrders),
      completedOrders: calcDelta(curKPI.completedOrders, prevKPI.completedOrders),
      cancelRate: calcDelta(curKPI.cancelRate, prevKPI.cancelRate),
    };

    // 4. Monthly Revenue (Current Period)
    const validCurrentOrders = currentOrders.filter(isOrderValidForRevenue);
    validCurrentOrders.forEach((o) => {
      const d = new Date(o.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const found = monthList.find((m) => m.month === key);
      if (found) {
        found.revenue += Number(o.total_amount || 0);
        found.orders += 1;
      }
    });

    const monthlyRevenue = monthList.map((m) => ({
      month: m.month,
      label: m.label,
      revenue: Math.round(m.revenue),
      orders: m.orders,
      isCurrentMonth: m.isCurrentMonth,
    }));

    // 5. Top 5 Products sold in current period (from valid orders)
    const validOrderIds = validCurrentOrders.map((o) => o.id);
    let topProducts = [];

    if (validOrderIds.length > 0) {
      const orderItems = await OrderItem.findAll({
        where: {
          order_id: { [Op.in]: validOrderIds },
        },
        include: [
          {
            model: Product,
            as: "product",
            include: [
              {
                model: ProductTranslation,
                as: "translations",
                required: false,
              },
              {
                model: ProductImage,
                as: "images",
                required: false,
              },
            ],
          },
        ],
      });

      const productAgg = new Map();
      orderItems.forEach((item) => {
        const pId = item.product_id;
        const qty = Number(item.quantity) || 1;
        const subtotal = Number(item.subtotal) || 0;

        if (!productAgg.has(pId)) {
          const product = item.product;
          let name = item.product_name_snapshot;
          if (product && product.translations) {
            const tr =
              product.translations.find((t) => t.language_code === lang) ||
              product.translations.find((t) => t.language_code === "vi") ||
              product.translations[0];
            if (tr && tr.name) name = tr.name;
          }

          let img =
            "https://images.unsplash.com/photo-1680563094046-5d846e2c59d1?w=200&h=200&fit=crop";
          if (product && product.images && product.images.length > 0) {
            const primary =
              product.images.find((im) => im.is_primary) || product.images[0];
            if (primary && primary.url) img = primary.url;
          }

          productAgg.set(pId, {
            id: pId,
            name,
            img,
            sold: 0,
            revenue: 0,
          });
        }

        const entry = productAgg.get(pId);
        entry.sold += qty;
        entry.revenue += subtotal;
      });

      topProducts = Array.from(productAgg.values())
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 5);
    }

    // 6. Regional Distribution (Top 5 + "Khác")
    const regionMap = new Map();
    validCurrentOrders.forEach((o) => {
      const region = extractRegion(o.delivery_address);
      regionMap.set(region, (regionMap.get(region) || 0) + 1);
    });

    const sortedRegions = Array.from(regionMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    let regionItems = [];
    if (sortedRegions.length > 5) {
      const top5 = sortedRegions.slice(0, 5);
      const otherCount = sortedRegions
        .slice(5)
        .reduce((sum, r) => sum + r.count, 0);
      regionItems = [
        ...top5,
        { name: lang === "ko" ? "기타" : "Khác", count: otherCount },
      ];
    } else {
      regionItems = sortedRegions;
    }

    const regions = distributePercentages(regionItems, "count");

    // 7. Order Status Distribution (All statuses in current period)
    const STATUS_MAP = {
      delivered: { vi: "Hoàn thành", ko: "완료", color: "#22c55e" },
      confirmed: { vi: "Đã xác nhận", ko: "주문 확인", color: "#3b82f6" },
      processing: { vi: "Đang xử lý", ko: "처리 중", color: "#6366f1" },
      ready_for_delivery: { vi: "Sẵn sàng giao", ko: "배달 준비", color: "#8b5cf6" },
      out_for_delivery: { vi: "Đang giao", ko: "배달 중", color: "#f59e0b" },
      pending: { vi: "Chờ thanh toán", ko: "결제 대기", color: "#eab308" },
      cancelled: { vi: "Đã huỷ", ko: "취소됨", color: "#ef4444" },
      refunded: { vi: "Hoàn tiền", ko: "환불됨", color: "#6b7280" },
    };

    const statusMap = new Map();
    currentOrders.forEach((o) => {
      const st = o.status || "pending";
      statusMap.set(st, (statusMap.get(st) || 0) + 1);
    });

    const statusItems = Array.from(statusMap.entries()).map(([status, count]) => {
      const meta = STATUS_MAP[status] || {
        vi: status,
        ko: status,
        color: "#8B4A5C",
      };
      return {
        status,
        label: meta[lang] || meta.vi,
        color: meta.color,
        count,
      };
    });

    statusItems.sort((a, b) => b.count - a.count);
    const orderStatuses = distributePercentages(statusItems, "count");

    const result = {
      period: {
        months,
        startDate: currentStartDate.toISOString(),
        endDate: currentEndDate.toISOString(),
      },
      kpi: {
        current: curKPI,
        previous: prevKPI,
        delta,
      },
      monthlyRevenue,
      topProducts,
      regions,
      orderStatuses,
    };

    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  },
};

module.exports = analyticsService;
