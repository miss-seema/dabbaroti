const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const TiffinPlan = require('../models/TiffinPlan');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Subscription = require('../models/Subscription');
const Coupon = require('../models/Coupon');
const Review = require('../models/Review');
const CustomPlanRequest = require('../models/CustomPlanRequest');
const mockStore = require('./mockStore');

dotenv.config();

const seedDatabase = async () => {
  const isConnected = await connectDB();
  if (!isConnected) {
    console.log('⚡ MongoDB not available for seeding, relying on mockStore.');
    process.exit(0);
  }

  try {
    console.log('🌱 Starting Dabba Roti database seeding...');

    // Clear existing collections
    await User.deleteMany();
    await TiffinPlan.deleteMany();
    await MenuItem.deleteMany();
    await Order.deleteMany();
    await Subscription.deleteMany();
    await Coupon.deleteMany();
    await Review.deleteMany();
    await CustomPlanRequest.deleteMany();

    // Insert Users
    const createdUsers = await User.insertMany(mockStore.users);
    console.log(`✅ Seeded ${createdUsers.length} Users`);

    // Insert Plans
    const createdPlans = await TiffinPlan.insertMany(mockStore.plans);
    console.log(`✅ Seeded ${createdPlans.length} Tiffin Plans`);

    // Insert Menu Items
    const createdMenuItems = await MenuItem.insertMany(mockStore.menuItems);
    console.log(`✅ Seeded ${createdMenuItems.length} Menu Items`);

    // Insert Coupons
    const createdCoupons = await Coupon.insertMany(mockStore.coupons);
    console.log(`✅ Seeded ${createdCoupons.length} Coupons`);

    // Insert Reviews
    const createdReviews = await Review.insertMany(mockStore.reviews);
    console.log(`✅ Seeded ${createdReviews.length} Reviews`);

    // Insert Custom Plan Requests
    await CustomPlanRequest.insertMany(mockStore.customRequests);
    console.log(`✅ Seeded Custom Plan Requests`);

    // Insert Orders & Subscriptions
    await Order.insertMany(mockStore.orders);
    await Subscription.insertMany(mockStore.subscriptions);
    console.log(`✅ Seeded Sample Orders & Subscriptions`);

    console.log('🎉 Seeding successfully completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
