// In-memory persistent data store for graceful fallback when local MongoDB is not running
const bcrypt = require('bcryptjs');

const mockStore = {
  users: [
    {
      _id: '665000000000000000000001',
      name: 'Dabba Roti Admin',
      email: 'admin@dabbaroti.com',
      password: bcrypt.hashSync('Admin@123', 10),
      phone: '+91 7055711006',
      role: 'admin',
      addresses: [
        {
          _id: '665000000000000000000091',
          street: '104, Royal Food Hub, Scheme No 54',
          area: 'Vijay Nagar',
          city: 'Mohali',
          pincode: '452010',
          landmark: 'Near C21 Mall',
          isDefault: true
        }
      ],
      createdAt: new Date('2026-01-01')
    },
    {
      _id: '665000000000000000000002',
      name: 'Aarav Sharma',
      email: 'customer@dabbaroti.com',
      password: bcrypt.hashSync('User@123', 10),
      phone: '+91 91234 56789',
      role: 'customer',
      addresses: [
        {
          _id: '665000000000000000000092',
          street: 'Flat 402, Shanti Heights, AB Road',
          area: 'Geeta Bhawan',
          city: 'Mohali',
          pincode: '452001',
          landmark: 'Opposite State Bank',
          isDefault: true
        }
      ],
      createdAt: new Date('2026-02-15')
    }
  ],

  plans: [
    {
      _id: '665000000000000000000101',
      title: 'Weekly 2-Meal Plan (Lunch & Dinner)',
      type: 'weekly',
      mealsPerDay: 2,
      price: 1199,
      durationDays: 7,
      description: 'Ideal for busy working professionals and students needing wholesome lunch and dinner every day of the week.',
      features: [
        '7 Days coverage (Monday through Sunday)',
        'Choice of Lunch (12:30 PM) & Dinner (7:30 PM)',
        '4 Fresh Ghee Phulkas + Dal + Sabzi + Rice + Salad',
        'Hot stainless steel insulated tiffin or sealed bio-box',
        '1 Day pause flexibility with 2-hour notice'
      ],
      includedMeals: ['lunch', 'dinner'],
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      isPopular: false,
      badge: 'Bestseller Weekly',
      isActive: true
    },
    {
      _id: '665000000000000000000102',
      title: 'Weekly 3-Meal All-Day Plan',
      type: 'weekly',
      mealsPerDay: 3,
      price: 1599,
      durationDays: 7,
      description: 'Complete daily nutritional support including warm breakfast, hearty lunch, and nutritious homestyle dinner.',
      features: [
        '7 Days all-inclusive breakfast, lunch & dinner',
        'Breakfast: Poha, Upma, Parathas or Idli Sambar',
        '4 Rotis, Seasonal Veg, Dal Tadka, Jeera Rice & Sweet',
        'Free weekend dessert add-on',
        'Doorstep delivery at your preferred schedule'
      ],
      includedMeals: ['breakfast', 'lunch', 'dinner'],
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
      isPopular: true,
      badge: 'Full Day Care',
      isActive: true
    },
    {
      _id: '665000000000000000000103',
      title: 'Monthly 2-Meal Plan (Lunch & Dinner)',
      type: 'monthly',
      mealsPerDay: 2,
      price: 3500, // Exact prompt requirement: Two meals per day: ₹3,500
      durationDays: 30,
      description: 'Our flagship monthly subscription. Enjoy pure, homestyle, hygienic lunch and dinner delivered twice daily without cooking worries.',
      features: [
        '30 Days of hassle-free hot home-cooked meals',
        'Two hearty meals: Lunch (12:00-1:30 PM) & Dinner (7:30-9:00 PM)',
        'Daily rotational menu (Over 30 distinct homestyle recipes)',
        '₹3,500 all-inclusive subscription with free delivery',
        'Pause and resume anytime up to 4 days per month',
        'Special Sunday feast and dessert included'
      ],
      includedMeals: ['lunch', 'dinner'],
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
      isPopular: true,
      badge: 'Most Popular (₹3,500)',
      isActive: true
    },
    {
      _id: '665000000000000000000104',
      title: 'Monthly 3-Meal Complete Nutrition Plan',
      type: 'monthly',
      mealsPerDay: 3,
      price: 4500, // Exact prompt requirement: Three meals per day: ₹4,500
      durationDays: 30,
      description: 'Total daily food independence! Fresh morning breakfast, delicious lunch, and wholesome dinner 30 days a month.',
      features: [
        '30 Full days: Breakfast + Lunch + Dinner',
        'Wholesome breakfast (Poha, Methi Thepla, Aloo Paratha, etc.)',
        'Full thali lunch & light nourishing dinner',
        'Special price: ₹4,500 per month (Only ₹50 per meal!)',
        'Complimentary weekly sweets & buttermilk',
        'Easy pause and restart via customer dashboard'
      ],
      includedMeals: ['breakfast', 'lunch', 'dinner'],
      image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80',
      isPopular: false,
      badge: 'Best Value (₹4,500)',
      isActive: true
    }
  ],

  menuItems: [
    {
      _id: '665000000000000000000201',
      name: 'Indori Poha with Sev & Jalebi',
      category: 'breakfast',
      description: 'Steamed flattened rice cooked with fennel, mustard seeds, turmeric, topped with ratlami sev, pomegranate and fresh coriander.',
      price: 60,
      isVeg: true,
      dietaryTags: ['Classic', 'Low Calorie'],
      calories: 280,
      portion: 'Plate with 2 Jalebis',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
      dayOfWeek: ['Monday', 'Wednesday', 'Friday', 'Daily'],
      isAvailable: true
    },
    {
      _id: '665000000000000000000202',
      name: 'Homestyle Stuffed Aloo & Paneer Paratha',
      category: 'breakfast',
      description: 'Two golden whole wheat griddled parathas served with churned white butter, homemade curd, and tangy mango pickle.',
      price: 85,
      isVeg: true,
      dietaryTags: ['High Energy', 'North Indian'],
      calories: 420,
      portion: '2 Parathas + Curd + Butter',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
      dayOfWeek: ['Tuesday', 'Thursday', 'Saturday'],
      isAvailable: true
    },
    {
      _id: '665000000000000000000203',
      name: 'Royal Shahi Paneer & Dal Tadka Thali',
      category: 'lunch',
      description: 'Soft cottage cheese cubes in rich tomato-cashew gravy, yellow dal tadka, 4 phulkas, steamed basmati rice, salad and pickle.',
      price: 150,
      isVeg: true,
      dietaryTags: ['Protein Rich', 'Chef Special'],
      calories: 580,
      portion: 'Standard 4-Compartment Dabba',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      dayOfWeek: ['Daily'],
      isAvailable: true
    },
    {
      _id: '665000000000000000000204',
      name: 'Desi Aloo Gobi & Dal Fry Meal',
      category: 'lunch',
      description: 'Fresh cauliflower and potatoes cooked with cumin and ginger, slow-simmered dal fry, 4 phulkas with desi ghee, jeera rice.',
      price: 130,
      isVeg: true,
      dietaryTags: ['Homestyle', 'Light & Healthy'],
      calories: 490,
      portion: 'Standard 4-Compartment Dabba',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
      dayOfWeek: ['Monday', 'Wednesday', 'Friday'],
      isAvailable: true
    },
    {
      _id: '665000000000000000000205',
      name: 'Palak Corn & Panchmel Dal Dabba',
      category: 'dinner',
      description: 'Creamy spinach gravy with sweet golden corn kernels, nutritious 5-lentil dal, 4 soft tawa rotis, fragrant vegetable pulao.',
      price: 140,
      isVeg: true,
      dietaryTags: ['Iron Rich', 'Nutritious'],
      calories: 460,
      portion: 'Standard 4-Compartment Dabba',
      image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80',
      dayOfWeek: ['Daily'],
      isAvailable: true
    },
    {
      _id: '665000000000000000000206',
      name: 'Paneer Bhurji & Rajma Masala Night Box',
      category: 'dinner',
      description: 'Scrambled paneer tossed with peppers and onions, slow-cooked Kashmiri rajma gravy, 4 rotis, steamed rice and cooling raita.',
      price: 160,
      isVeg: true,
      dietaryTags: ['High Protein', 'Sunday Special'],
      calories: 540,
      portion: 'Standard 4-Compartment Dabba',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      dayOfWeek: ['Tuesday', 'Thursday', 'Sunday'],
      isAvailable: true
    },
    {
      _id: '665000000000000000000207',
      name: 'Extra Ghee Phulkas (Set of 3)',
      category: 'addon',
      description: 'Freshly griddled 100% whole wheat rotis brushed with pure desi cow ghee.',
      price: 30,
      isVeg: true,
      dietaryTags: ['Pure Wheat', 'Desi Ghee'],
      calories: 180,
      portion: '3 Pieces',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
      dayOfWeek: ['Daily'],
      isAvailable: true
    },
    {
      _id: '665000000000000000000208',
      name: 'Masala Chaas (Spiced Buttermilk)',
      category: 'addon',
      description: 'Refreshing churned yogurt cooler with roasted cumin, mint, green chilli, and rock salt.',
      price: 25,
      isVeg: true,
      dietaryTags: ['Digestive', 'Probiotic'],
      calories: 60,
      portion: '250 ml Bottle',
      image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
      dayOfWeek: ['Daily'],
      isAvailable: true
    },
    {
      _id: '665000000000000000000209',
      name: 'Hot Gulab Jamun (2 pcs)',
      category: 'addon',
      description: 'Melt-in-mouth milk solid dumplings dipped in aromatic rose cardamom sugar syrup.',
      price: 40,
      isVeg: true,
      dietaryTags: ['Sweet Treat'],
      calories: 220,
      portion: '2 Pieces in Bowl',
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
      dayOfWeek: ['Daily'],
      isAvailable: true
    }
  ],

  customRequests: [
    {
      _id: '665000000000000000000301',
      user: '665000000000000000000002',
      name: 'Aarav Sharma',
      email: 'customer@dabbaroti.com',
      phone: '+91 91234 56789',
      startDate: new Date('2026-12-01'),
      endDate: new Date('2026-12-21'),
      totalDays: 21,
      mealsPerDay: 2,
      selectedMeals: ['lunch', 'dinner'],
      selectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      dietaryType: 'Veg',
      spiceLevel: 'Mild',
      addOns: [{ name: 'Masala Chaas', price: 25, quantity: 1 }],
      specialInstructions: 'Please make food with minimal oil and less spice, no extra salt.',
      deliveryAddress: {
        street: 'Flat 402, Shanti Heights, AB Road',
        area: 'Geeta Bhawan',
        city: 'Mohali',
        pincode: '452001',
        landmark: 'Opposite State Bank'
      },
      estimatedPrice: 3200,
      approvedPrice: 3100,
      status: 'approved',
      adminNotes: 'Special low-oil diabetic request accepted. Discount applied for 3 weeks.',
      createdAt: new Date('2026-11-18')
    }
  ],

  orders: [
    {
      _id: '665000000000000000000401',
      orderNumber: 'DR-ORD-2026-1001',
      user: '665000000000000000000002',
      items: [
        {
          itemType: 'plan',
          name: 'Monthly 2-Meal Plan (Lunch & Dinner)',
          type: 'monthly',
          price: 3500,
          quantity: 1,
          startDate: new Date('2026-11-20'),
          endDate: new Date('2026-12-20'),
          durationDays: 30,
          mealsPerDay: 2,
          selectedMeals: ['lunch', 'dinner'],
          addOns: []
        }
      ],
      deliveryAddress: {
        name: 'Aarav Sharma',
        phone: '+91 91234 56789',
        street: 'Flat 402, Shanti Heights, AB Road',
        area: 'Geeta Bhawan',
        city: 'Mohali',
        pincode: '452001',
        landmark: 'Opposite State Bank'
      },
      deliverySlot: {
        breakfast: '07:30 AM - 08:30 AM',
        lunch: '12:00 PM - 01:30 PM',
        dinner: '07:30 PM - 09:00 PM'
      },
      deliveryInstructions: 'Ring bell and place on shoe rack outside door.',
      subtotal: 3500,
      deliveryFee: 0,
      discount: 350,
      couponCode: 'DABBA10',
      totalAmount: 3150,
      paymentMethod: 'razorpay',
      paymentStatus: 'paid',
      razorpayOrderId: 'order_test_9921',
      razorpayPaymentId: 'pay_test_8812',
      orderStatus: 'confirmed',
      createdAt: new Date('2026-11-19')
    }
  ],

  subscriptions: [
    {
      _id: '665000000000000000000501',
      subscriptionNumber: 'SUB-DR-2026-0042',
      user: '665000000000000000000002',
      order: '665000000000000000000401',
      planTitle: 'Monthly 2-Meal Plan (Lunch & Dinner)',
      planType: 'monthly',
      mealsPerDay: 2,
      selectedMeals: ['lunch', 'dinner'],
      startDate: new Date('2026-11-20'),
      endDate: new Date('2026-12-20'),
      totalDays: 30,
      remainingDays: 29,
      deliveryAddress: {
        street: 'Flat 402, Shanti Heights, AB Road',
        area: 'Geeta Bhawan',
        city: 'Mohali',
        pincode: '452001',
        landmark: 'Opposite State Bank'
      },
      deliverySlot: {
        lunch: '12:00 PM - 01:30 PM',
        dinner: '07:30 PM - 09:00 PM'
      },
      status: 'active',
      pauseHistory: [],
      createdAt: new Date('2026-11-19')
    }
  ],

  coupons: [
    {
      _id: '665000000000000000000601',
      code: 'DABBA10',
      discountPercent: 10,
      maxDiscount: 500,
      minOrderAmount: 1000,
      validUntil: new Date('2027-12-31'),
      isActive: true
    },
    {
      _id: '665000000000000000000602',
      code: 'TASTE20',
      discountPercent: 20,
      maxDiscount: 700,
      minOrderAmount: 2500,
      validUntil: new Date('2027-12-31'),
      isActive: true
    },
    {
      _id: '665000000000000000000603',
      code: 'FIRSTMEAL',
      discountPercent: 15,
      maxDiscount: 350,
      minOrderAmount: 500,
      validUntil: new Date('2027-12-31'),
      isActive: true
    }
  ],

  reviews: [
    {
      _id: '665000000000000000000701',
      name: 'Priya Joshi',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      comment: 'Dabba Roti saved my work-life balance! The rotis are as soft and warm as mom makes them, and the dal tadka has zero excess oil. Subscribed to the monthly 2-meal plan.',
      planName: 'Monthly 2-Meal Plan',
      isApproved: true,
      createdAt: new Date('2026-11-10')
    },
    {
      _id: '665000000000000000000702',
      name: 'Vikram Malhotra',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      comment: 'The monthly ₹3,500 plan is incredible value. Delivered punctually at 12:45 PM every day to my office. Packaging is clean, food is piping hot!',
      planName: 'Monthly 2-Meal Plan (₹3,500)',
      isApproved: true,
      createdAt: new Date('2026-11-12')
    },
    {
      _id: '665000000000000000000703',
      name: 'Sneha Patel',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      comment: 'I customized my subscription for 5 days a week without onions and garlic (Jain meal). The team approved it quickly and the taste has been outstanding!',
      planName: 'Custom 5-Day Jain Plan',
      isApproved: true,
      createdAt: new Date('2026-11-14')
    }
  ]
};

module.exports = mockStore;
