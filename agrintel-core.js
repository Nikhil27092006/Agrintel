/**
 * AgriIntel — Decision Engine Core
 * ---------------------------------------------------------------
 * Clean separation between UI, business logic, mock data and API
 * services. Every function returns a Promise so real backends
 * (Weather API, Mandi price API, ML yield model, price forecast
 * model, cost & risk engines) can be swapped in without touching
 * any UI component.
 *
 * Replace the body of each function with a `fetch(...)` call to
 * plug in a live source. UI code never reads raw data directly.
 */
(function (global) {
  'use strict';

  /* ============================================================
   * MOCK DATA STORE
   * ============================================================ */
  const DB = {
    crops: {
      onion: {
        name: 'Onion',
        icon: 'circle',
        yieldMin: 90,
        yieldMax: 95,
        yield: 92,
        revenue: 152000,
        cost: 74000,
        profit: 78000,
        risk: 'Medium',
        confidence: 84,
        suitability: ['Suitable for black soil', 'Favorable weather outlook', 'Strong expected market price', 'Moderate production cost', 'Better risk-adjusted profit'],
        description: 'Onion currently provides the strongest risk-adjusted opportunity based on your soil, the near-term weather outlook, historical market prices and estimated production costs.'
      },
      tomato: {
        name: 'Tomato', icon: 'trip_origin', yieldMin: 210, yieldMax: 230, yield: 220,
        revenue: 138000, cost: 82000, profit: 56000, risk: 'High', confidence: 72,
        suitability: ['Good in sandy-loam soils', 'Sensitive to heavy rainfall', 'Strong but volatile market', 'High input requirement'],
        description: 'Tomato has high revenue potential but elevated price volatility and input costs raise its risk profile.'
      },
      soybean: {
        name: 'Soybean', icon: 'grass', yieldMin: 18, yieldMax: 22, yield: 20,
        revenue: 92000, cost: 48000, profit: 44000, risk: 'Low', confidence: 89,
        suitability: ['Excellent for black soil', 'Low input requirement', 'Stable minimum support price', 'Moderate market demand'],
        description: 'Soybean is a safe, low-input option with stable returns — ideal if you want dependable but modest profit.'
      },
      wheat: {
        name: 'Wheat', icon: 'grass', yieldMin: 38, yieldMax: 44, yield: 41,
        revenue: 78000, cost: 42000, profit: 36000, risk: 'Low', confidence: 91,
        suitability: ['Good in alluvial soil', 'Guaranteed MSP support', 'Low production risk'],
        description: 'Wheat offers the most predictable outcome with government price support, at the cost of lower absolute profit.'
      },
      cotton: {
        name: 'Cotton', icon: 'flaky', yieldMin: 14, yieldMax: 18, yield: 16,
        revenue: 125000, cost: 88000, profit: 37000, risk: 'High', confidence: 68,
        suitability: ['Needs deep black soil', 'High pest pressure this season', 'Strong export-linked prices'],
        description: 'Cotton is capital-intensive with high pest risk this season; profitability depends heavily on weather.'
      },
      maize: {
        name: 'Maize', icon: 'eco', yieldMin: 55, yieldMax: 65, yield: 60,
        revenue: 84000, cost: 46000, profit: 38000, risk: 'Low', confidence: 87,
        suitability: ['Works well across soils', 'Short duration crop', 'Growing feed & ethanol demand'],
        description: 'Maize gives steady mid-range returns with strong industrial demand growth.'
      },
      rice: {
        name: 'Rice', icon: 'water_drop', yieldMin: 48, yieldMax: 56, yield: 52,
        revenue: 80000, cost: 50000, profit: 30000, risk: 'Medium', confidence: 85,
        suitability: ['Needs assured irrigation', 'Heavy water consumer', 'Good MSP support'],
        description: 'Rice is reliable where irrigation is assured, but water availability on your farm is a constraint.'
      },
      potato: {
        name: 'Potato', icon: 'circle', yieldMin: 180, yieldMax: 220, yield: 200,
        revenue: 110000, cost: 72000, profit: 38000, risk: 'High', confidence: 74,
        suitability: ['Good in loose alluvial soil', 'Cold storage dependent', 'Price swings at harvest'],
        description: 'Potato margins depend heavily on post-harvest storage and market timing.'
      },
      chickpea: {
        name: 'Chickpea', icon: 'eco', yieldMin: 14, yieldMax: 18, yield: 16,
        revenue: 72000, cost: 38000, profit: 34000, risk: 'Low', confidence: 90,
        suitability: ['Low water requirement', 'Improves soil nitrogen', 'Stable pulse demand'],
        description: 'Chickpea is a dependable low-risk pulse crop well suited to rain-fed farming.'
      }
    },

    market: {
      onion: {
        name: 'Onion',
        price: 1850,            // ₹ / quintal
        change7d: 6.4,
        change30d: 11.8,
        expectedLow: 1750,
        expectedHigh: 2150,
        unit: '₹/q',
        history: [1620, 1640, 1610, 1655, 1680, 1665, 1705, 1720, 1700, 1735, 1750, 1740, 1770, 1795, 1780, 1810, 1800, 1830, 1850],
        forecast: [1865, 1885, 1900, 1925, 1945, 1970, 1990, 2015, 2035, 2050],
        forecastFrom: 18
      },
      tomato: {
        name: 'Tomato', price: 1850, change7d: -3.2, change30d: 4.1,
        expectedLow: 1600, expectedHigh: 2100, unit: '₹/q'
      },
      soybean: {
        name: 'Soybean', price: 4650, change7d: 2.1, change30d: 5.4,
        expectedLow: 4450, expectedHigh: 5000, unit: '₹/q'
      },
      wheat: {
        name: 'Wheat', price: 2450, change7d: 0.4, change30d: 1.2,
        expectedLow: 2400, expectedHigh: 2625, unit: '₹/q'
      },
      cotton: {
        name: 'Cotton', price: 7200, change7d: -1.1, change30d: -3.0,
        expectedLow: 6900, expectedHigh: 7600, unit: '₹/q'
      },
      maize: {
        name: 'Maize', price: 2180, change7d: 1.6, change30d: 3.8,
        expectedLow: 2100, expectedHigh: 2350, unit: '₹/q'
      }
    },

    weather: {
      current: { temp: 28, condition: 'Partly cloudy', humidity: 82, rainfall: 30, wind: 12, feelsLike: 29 },
      forecast: [
        { day: 'Mon', icon: 'partly_cloudy_day', hi: 32, lo: 24, rain: 20 },
        { day: 'Tue', icon: 'rainy', hi: 30, lo: 23, rain: 60 },
        { day: 'Wed', icon: 'rainy', hi: 29, lo: 22, rain: 70 },
        { day: 'Thu', icon: 'partly_cloudy_day', hi: 31, lo: 23, rain: 30 },
        { day: 'Fri', icon: 'wb_sunny', hi: 34, lo: 24, rain: 10 },
        { day: 'Sat', icon: 'wb_sunny', hi: 35, lo: 25, rain: 5 },
        { day: 'Sun', icon: 'cloud', hi: 33, lo: 25, rain: 15 }
      ],
      risk: {
        overall: 'Medium',
        factors: [
          { label: 'Rainfall', level: 'Medium', score: 55 },
          { label: 'Temperature', level: 'Low', score: 25 },
          { label: 'Water Stress', level: 'Low', score: 30 },
          { label: 'Pest Risk', level: 'Medium', score: 50 }
        ]
      }
    },

    risk: {
      overall: 'Medium',
      confidence: 84,
      breakdown: [
        { label: 'Price Risk', score: 32 },
        { label: 'Weather Risk', score: 21 },
        { label: 'Yield Risk', score: 27 },
        { label: 'Cost Risk', score: 20 }
      ],
      watch: [
        { text: 'Market price falls below ₹1,600/q', impact: 'Price Risk' },
        { text: 'Yield falls below 75 q/acre', impact: 'Yield Risk' },
        { text: 'Heavy rainfall during harvest', impact: 'Weather Risk' },
        { text: 'Fertilizer cost increases more than 10%', impact: 'Cost Risk' }
      ]
    },

    selling: {
      action: 'WAIT',
      current: 1850,
      expected: 2050,
      upside: 10.8,
      confidence: 76,
      window: '10–14 days',
      message: 'AgriIntel recommends waiting 10–14 days before selling because current market momentum suggests a potential 8–12% upside.'
    },

    scenarios: {
      best: { label: 'Best Case', profit: 105000, note: 'Strong demand + good yields (95 q @ ₹2,050/q)' },
      expected: { label: 'Expected Case', profit: 78000, note: 'Baseline yield of 92 q @ ₹1,650/q' },
      worst: { label: 'Worst Case', profit: 42000, note: 'Soft demand + lower yield (75 q @ ₹1,550/q)' }
    }
  };

  const DEFAULT_FARM = {
    village: 'Nagpur', district: 'Nagpur', state: 'Maharashtra', country: 'India',
    area: 5, unit: 'Acre',
    soil: 'Black Soil', ph: 7.1, nitrogen: 52, phosphorus: 24, potassium: 38, organicCarbon: 0.6,
    irrigation: 'Drip', water: 'Medium', previousCrop: 'Soybean',
    crop: 'onion', cropChoice: 'recommended',
    seedBudget: 12000, fertilizerBudget: 25000, labour: 'Medium', machinery: ['Tractor'], transportation: 'Own vehicle'
  };

  /* ============================================================
   * HELPERS
   * ============================================================ */
  function latency(ms) { return new Promise(function (r) { setTimeout(r, ms || 350); }); }
  function clone(obj) { return JSON.parse(JSON.stringify(obj)); }
  function cropByKey(key) { return DB.crops[key] || null; }
  function marketByCrop(key) { return DB.market[key] || DB.market.onion; }

  /* ============================================================
   * PUBLIC SERVICES
   * ============================================================ */
  const AgriIntel = {

    /** Mock: farm record persisted by the onboarding flow. */
    saveFarm(farm) {
      try { localStorage.setItem('agrintelFarm', JSON.stringify(Object.assign({}, DEFAULT_FARM, farm))); } catch (e) { /* ignore */ }
    },

    getFarm() {
      try {
        const raw = localStorage.getItem('agrintelFarm');
        return Object.assign({}, DEFAULT_FARM, raw ? JSON.parse(raw) : {});
      } catch (e) { return clone(DEFAULT_FARM); }
    },

    /** All crops available for analysis. */
    getCrops() {
      return clone(DB.crops);
    },

    getCropOptions() {
      return Object.keys(DB.crops).map(function (k) { return { key: k, name: DB.crops[k].name, icon: DB.crops[k].icon }; });
    },

    /** Weather intelligence. */
    getWeatherData() {
      return latency().then(function () { return clone(DB.weather); });
    },

    /** Current + forecast market data for a crop. */
    getMarketPrices(cropKey) {
      return latency().then(function () {
        const m = marketByCrop(cropKey);
        const out = clone(m);
        out.forecast = out.forecast || DB.market.onion.forecast;
        out.history = out.history || DB.market.onion.history;
        out.forecastFrom = out.forecastFrom || DB.market.onion.forecastFrom;
        return out;
      });
    },

    /** Recommended crop + reasons, driven by the farm profile. */
    getCropRecommendation(farmData) {
      return latency().then(function () {
        const crop = cropByKey('onion');
        return {
          cropKey: 'onion',
          crop: clone(crop),
          confidence: 84,
          explanation: 'Based on your soil, weather outlook, historical market prices and estimated production costs, onion currently provides the strongest risk-adjusted opportunity.',
          summary: 'Expected onion yield: 90–95 q/acre, giving an estimated profit of ₹55K–₹96K depending on market conditions.'
        };
      });
    },

    /** Yield estimate with a defensible range. */
    getYieldPrediction(cropKey, farmData) {
      return latency().then(function () {
        const c = cropByKey(cropKey) || cropByKey('onion');
        return { crop: c.name, yieldMin: c.yieldMin, yieldMax: c.yieldMax, yield: c.yield, unit: 'q/acre' };
      });
    },

    /** Revenue / cost / profit model. */
    getProfitAnalysis(cropKey, farmData) {
      return latency().then(function () {
        const c = cropByKey(cropKey) || cropByKey('onion');
        return {
          crop: c.name,
          revenue: c.revenue, cost: c.cost, profit: c.profit,
          unit: '/acre', range: c.yieldMin + '–' + c.yieldMax + ' q/acre'
        };
      });
    },

    /** Risk breakdown + trigger watchlist. */
    getRiskAnalysis(cropKey) {
      return latency().then(function () {
        return clone(DB.risk);
      });
    },

    /** When to sell guidance. */
    getSellRecommendation(cropKey) {
      return latency().then(function () {
        return clone(DB.selling);
      });
    },

    /** Full comparison table. */
    getCropComparison() {
      return latency().then(function () {
        const keys = ['onion', 'tomato', 'soybean', 'wheat', 'cotton', 'maize'];
        return keys.map(function (k) {
          const c = cropByKey(k);
          return { key: k, name: c.name, revenue: c.revenue, cost: c.cost, profit: c.profit, risk: c.risk, confidence: c.confidence };
        });
      });
    },

    /** Profit scenarios. */
    getProfitScenarios() {
      return latency().then(function () { return clone(DB.scenarios); });
    },

    /** Raw mock store (for debugging / future API wiring). */
    getMockData() {
      return clone(DB);
    }
  };

  global.AgriIntel = AgriIntel;
})(window);
