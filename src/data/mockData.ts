import { Product, Order, Coupon, ShippingAddress } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Signature Utility Overshirt - Heavy Twill',
    category: 'Overshirts',
    sku: 'AT-OS-001',
    price: 3499,
    originalPrice: 4999,
    discountPercent: 30,
    rating: 4.9,
    reviewCount: 128,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Constructed from a robust 380 GSM Japanese cotton-twill. Cut in a contemporary boxy silhouette designed for seamless seasonal layering over heavy jersey or under tailored overcoats.',
    fabric: '100% Ring-spun Heavy Twill Cotton (380 GSM). Pre-shrunk finish.',
    fit: 'Relaxed boxy architectural cut with dropped shoulder seams.',
    care: 'Machine wash cold at 30°C on gentle cycle. Do not tumble dry. Warm iron inside-out.',
    colors: [
      { name: 'Matte Black', hex: '#1C1B1B' },
      { name: 'Raw Sand', hex: '#D6D2CA' },
      { name: 'Army Olive', hex: '#4A4E44' }
    ],
    sizes: [
      { size: 'S', stock: 6 },
      { size: 'M', stock: 8 },
      { size: 'L', stock: 3 },
      { size: 'XL', stock: 5 },
      { size: 'XXL', stock: 2 }
    ],
    totalStock: 24,
    isNew: true,
    isBestseller: true,
    status: 'Published',
    salesCount: 412
  },
  {
    id: 'prod-2',
    name: 'Essential Oxford Cotton Shirt',
    category: 'Shirts',
    sku: 'AT-SH-002',
    price: 2499,
    originalPrice: 3299,
    discountPercent: 24,
    rating: 4.8,
    reviewCount: 94,
    image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A benchmark wardrobe essential tailored from tightly woven pinpoint Oxford cloth with subtle mother-of-pearl effect button closures and a disciplined structured collar.',
    fabric: '100% Giza Long-Staple Cotton, 2-ply 80s weave.',
    fit: 'Tailored slim-straight fit that holds shape cleanly tucked or untucked.',
    care: 'Warm wash with like colors. Hang to dry. Steam press.',
    colors: [
      { name: 'Optic White', hex: '#FDFDFD' },
      { name: 'Ice Blue', hex: '#D8E2EC' },
      { name: 'Pale Grey', hex: '#D0D0D0' }
    ],
    sizes: [
      { size: 'S', stock: 12 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 10 },
      { size: 'XL', stock: 4 },
      { size: 'XXL', stock: 3 }
    ],
    totalStock: 44,
    isBestseller: true,
    status: 'Published',
    salesCount: 680
  },
  {
    id: 'prod-3',
    name: 'Classic Relaxed Heavyweight T-Shirt',
    category: 'T-Shirts',
    sku: 'AT-TS-003',
    price: 1499,
    originalPrice: 1999,
    discountPercent: 25,
    rating: 4.9,
    reviewCount: 215,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Substantial 260 GSM organic combed cotton jersey with high-density ribbed crewneck collar designed not to stretch or sag with repeated wear.',
    fabric: '100% Organic Combed Compact Cotton (260 GSM).',
    fit: 'Relaxed modern drop-shoulder drape with elbow-grazing sleeves.',
    care: 'Cold wash inside-out. Do not bleach. Flat air dry.',
    colors: [
      { name: 'Chalk White', hex: '#F5F5F0' },
      { name: 'Charcoal Wash', hex: '#333333' },
      { name: 'Earth Clay', hex: '#6E5D53' }
    ],
    sizes: [
      { size: 'S', stock: 18 },
      { size: 'M', stock: 24 },
      { size: 'L', stock: 16 },
      { size: 'XL', stock: 8 },
      { size: 'XXL', stock: 6 }
    ],
    totalStock: 72,
    isNew: true,
    status: 'Published',
    salesCount: 890
  },
  {
    id: 'prod-4',
    name: 'Premium Straight Fit Selvedge Jeans',
    category: 'Jeans',
    sku: 'AT-JN-004',
    price: 3499,
    originalPrice: 4499,
    discountPercent: 22,
    rating: 4.7,
    reviewCount: 78,
    image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Woven on vintage shuttle looms from 13.5 oz raw selvedge denim. Clean straight-leg architectural silhouette that matures uniquely with personal wear patterns.',
    fabric: '100% Selvedge Raw Cotton Denim (13.5 oz). Red-line selvedge ID.',
    fit: 'Mid-rise with classic straight leg opening (16.5 inches).',
    care: 'Wash inside-out in cold water after breaking in. Line dry in shade.',
    colors: [
      { name: 'Raw Indigo', hex: '#1C2938' },
      { name: 'Faded Stone', hex: '#4B5563' }
    ],
    sizes: [
      { size: 'S', stock: 5 },
      { size: 'M', stock: 7 },
      { size: 'L', stock: 4 },
      { size: 'XL', stock: 2 },
      { size: 'XXL', stock: 1 }
    ],
    totalStock: 19,
    isBestseller: true,
    status: 'Published',
    salesCount: 320
  },
  {
    id: 'prod-5',
    name: 'Essential Pleated Cargo Trousers',
    category: 'Trousers',
    sku: 'AT-TR-005',
    price: 2999,
    originalPrice: 3999,
    discountPercent: 25,
    rating: 4.8,
    reviewCount: 62,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Utilitarian refinement featuring discrete flush gusset cargo pockets, front single pleats, and an adjustable internal waist drawstring for adaptive fit.',
    fabric: '100% Compact Mercerized Cotton Chino Twill.',
    fit: 'Tapered architectural drape with clean cropped hem.',
    care: 'Machine wash 30°C. Medium iron.',
    colors: [
      { name: 'Graphite', hex: '#2B2D2F' },
      { name: 'Dark Khaki', hex: '#5E5442' }
    ],
    sizes: [
      { size: 'S', stock: 8 },
      { size: 'M', stock: 11 },
      { size: 'L', stock: 6 },
      { size: 'XL', stock: 4 }
    ],
    totalStock: 29,
    status: 'Published',
    salesCount: 280
  },
  {
    id: 'prod-6',
    name: 'Minimal Clean Bomber Jacket',
    category: 'Jackets',
    sku: 'AT-JK-006',
    price: 4999,
    originalPrice: 6999,
    discountPercent: 28,
    rating: 4.9,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Precision-tailored matte nylon shell with concealed two-way gunmetal zipper, tonal ribbed cuffs, and weather-resistant satin interior lining.',
    fabric: 'High-density Matte Technical Nylon with DWR water-repellent coating.',
    fit: 'Structured ergonomic bomber cut with subtle cropped waistband.',
    care: 'Dry clean only or cold hand wash.',
    colors: [
      { name: 'Matte Black', hex: '#111111' },
      { name: 'Deep Olive', hex: '#3B4136' }
    ],
    sizes: [
      { size: 'S', stock: 3 },
      { size: 'M', stock: 5 },
      { size: 'L', stock: 2 },
      { size: 'XL', stock: 1 }
    ],
    totalStock: 11,
    isBestseller: true,
    status: 'Published',
    salesCount: 195
  },
  {
    id: 'prod-7',
    name: 'Relaxed Pure Linen Camp Collar Shirt',
    category: 'Shirts',
    sku: 'AT-SH-007',
    price: 2799,
    originalPrice: 3699,
    discountPercent: 24,
    rating: 4.6,
    reviewCount: 54,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Woven from airy European flax with natural slub texture. Styled with a retro-modern cuban camp collar and straight vented hem for effortless warm-weather wear.',
    fabric: '100% Washed Normandy Flax Linen (160 GSM).',
    fit: 'Breezy boxy silhouette designed to be worn untucked.',
    care: 'Gentle cycle in cold water. Reshape while damp and dry flat.',
    colors: [
      { name: 'Natural Ecru', hex: '#EBE7DE' },
      { name: 'Sage Green', hex: '#879482' },
      { name: 'Navy', hex: '#1B2430' }
    ],
    sizes: [
      { size: 'S', stock: 7 },
      { size: 'M', stock: 9 },
      { size: 'L', stock: 5 },
      { size: 'XL', stock: 3 }
    ],
    totalStock: 24,
    isNew: true,
    status: 'Published',
    salesCount: 165
  },
  {
    id: 'prod-8',
    name: 'Architectural Heavyweight Hoodie',
    category: 'Jackets',
    sku: 'AT-HD-008',
    price: 3199,
    originalPrice: 4299,
    discountPercent: 25,
    rating: 4.8,
    reviewCount: 112,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Constructed from heavy 450 GSM French Terry cotton. Features a double-layer structured crossover hood without drawstrings for a stark, minimalist silhouette.',
    fabric: '100% Loopback French Terry Cotton (450 GSM).',
    fit: 'Boxy oversized fit with tight elasticated ribbed cuffs and hem.',
    care: 'Cold wash inside-out. Do not tumble dry to prevent shrinkage.',
    colors: [
      { name: 'Faded Black', hex: '#222222' },
      { name: 'Heather Grey', hex: '#A8A8A8' }
    ],
    sizes: [
      { size: 'S', stock: 8 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 7 },
      { size: 'XL', stock: 4 }
    ],
    totalStock: 31,
    status: 'Published',
    salesCount: 340
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-8942',
    customerName: 'Aarav Sharma',
    email: 'aarav.s@gmail.com',
    phone: '+91 98450 12345',
    shippingAddress: {
      fullName: 'Aarav Sharma',
      phone: '+91 98450 12345',
      addressLine: '#402, Palm Grove Heights, Indiranagar 100ft Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      type: 'Home'
    },
    items: [
      {
        product: INITIAL_PRODUCTS[1], // Oxford Shirt
        selectedColor: INITIAL_PRODUCTS[1].colors[0],
        selectedSize: 'M',
        quantity: 1
      },
      {
        product: INITIAL_PRODUCTS[0], // Twill Overshirt
        selectedColor: INITIAL_PRODUCTS[0].colors[0],
        selectedSize: 'L',
        quantity: 1
      }
    ],
    subtotal: 5998,
    discount: 2500,
    shippingFee: 0,
    total: 3498,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Pending',
    createdAt: '14 minutes ago',
    timeline: [
      { status: 'Ordered', label: 'Order Received', timestamp: 'Today, 02:45 PM', completed: true, current: false },
      { status: 'Confirmed', label: 'Payment Confirmed (UPI)', timestamp: 'Today, 02:46 PM', completed: true, current: false },
      { status: 'Packed', label: 'Packing & Quality Check', timestamp: 'Pending', completed: false, current: true },
      { status: 'Shipped', label: 'Handover to BlueDart Express', timestamp: 'Estimated Today 5 PM', completed: false, current: false },
      { status: 'Out for Delivery', label: 'Out for Delivery', timestamp: 'Estimated Tomorrow', completed: false, current: false },
      { status: 'Delivered', label: 'Delivered to Customer', timestamp: 'Estimated Oct 24', completed: false, current: false }
    ]
  },
  {
    id: 'ORD-8941',
    customerName: 'Vikramaditya Nair',
    email: 'v.nair@outlook.com',
    phone: '+91 98201 44552',
    shippingAddress: {
      fullName: 'Vikramaditya Nair',
      phone: '+91 98201 44552',
      addressLine: 'B-1402, Silver Sands Apt, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      type: 'Home'
    },
    items: [
      {
        product: INITIAL_PRODUCTS[5], // Bomber Jacket
        selectedColor: INITIAL_PRODUCTS[5].colors[0],
        selectedSize: 'L',
        quantity: 1
      }
    ],
    subtotal: 4999,
    discount: 0,
    shippingFee: 0,
    total: 4999,
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    status: 'Pending',
    createdAt: '38 minutes ago',
    timeline: [
      { status: 'Ordered', label: 'Order Received', timestamp: 'Today, 02:15 PM', completed: true, current: false },
      { status: 'Confirmed', label: 'COD Verification Passed', timestamp: 'Today, 02:18 PM', completed: true, current: false },
      { status: 'Packed', label: 'Assigned to Warehouse Bay 3', timestamp: 'Pending', completed: false, current: true },
      { status: 'Shipped', label: 'Courier Scheduled', timestamp: 'Pending', completed: false, current: false },
      { status: 'Out for Delivery', label: 'Out for Delivery', timestamp: 'Pending', completed: false, current: false },
      { status: 'Delivered', label: 'Delivered', timestamp: 'Pending', completed: false, current: false }
    ]
  },
  {
    id: 'ORD-8939',
    customerName: 'Rohan Sen',
    email: 'rohan.sen@gmail.com',
    phone: '+91 97110 88219',
    shippingAddress: {
      fullName: 'Rohan Sen',
      phone: '+91 97110 88219',
      addressLine: 'E-42, Vasant Vihar, Block E',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110057',
      type: 'Home'
    },
    items: [
      {
        product: INITIAL_PRODUCTS[3], // Selvedge Jeans
        selectedColor: INITIAL_PRODUCTS[3].colors[0],
        selectedSize: 'M',
        quantity: 1
      }
    ],
    subtotal: 3499,
    discount: 0,
    shippingFee: 0,
    total: 3499,
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    status: 'Packed',
    createdAt: '2 hours ago',
    timeline: [
      { status: 'Ordered', label: 'Order Placed', timestamp: 'Today, 12:40 PM', completed: true, current: false },
      { status: 'Confirmed', label: 'Visa Card Charged', timestamp: 'Today, 12:41 PM', completed: true, current: false },
      { status: 'Packed', label: 'Box Sealed & Invoiced', timestamp: 'Today, 01:30 PM', completed: true, current: true },
      { status: 'Shipped', label: 'Awaiting BlueDart Pickup', timestamp: 'Estimated 4:30 PM', completed: false, current: false },
      { status: 'Out for Delivery', label: 'Out for Delivery', timestamp: 'Pending', completed: false, current: false },
      { status: 'Delivered', label: 'Delivered', timestamp: 'Pending', completed: false, current: false }
    ]
  },
  {
    id: 'ORD-8938',
    customerName: 'Kabir Mehta',
    email: 'k.mehta@techcorp.in',
    phone: '+91 94401 22391',
    shippingAddress: {
      fullName: 'Kabir Mehta',
      phone: '+91 94401 22391',
      addressLine: 'Villa 18, Green Meadows, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
      type: 'Work'
    },
    items: [
      {
        product: INITIAL_PRODUCTS[2], // Relaxed T-Shirt
        selectedColor: INITIAL_PRODUCTS[2].colors[0],
        selectedSize: 'M',
        quantity: 1
      },
      {
        product: INITIAL_PRODUCTS[6], // Linen Shirt
        selectedColor: INITIAL_PRODUCTS[6].colors[0],
        selectedSize: 'L',
        quantity: 1
      }
    ],
    subtotal: 4298,
    discount: 429,
    shippingFee: 0,
    total: 3869,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Shipped',
    createdAt: '4 hours ago',
    timeline: [
      { status: 'Ordered', label: 'Order Placed', timestamp: 'Today, 10:15 AM', completed: true, current: false },
      { status: 'Confirmed', label: 'Paid via GPay', timestamp: 'Today, 10:16 AM', completed: true, current: false },
      { status: 'Packed', label: 'Dispatched from Hub', timestamp: 'Today, 11:20 AM', completed: true, current: false },
      { status: 'Shipped', label: 'In Transit with Delhivery Express', timestamp: 'Today, 01:00 PM', completed: true, current: true },
      { status: 'Out for Delivery', label: 'Out for Delivery', timestamp: 'Tomorrow', completed: false, current: false },
      { status: 'Delivered', label: 'Delivered', timestamp: 'Estimated Oct 23', completed: false, current: false }
    ]
  },
  {
    id: 'ORD-8920',
    customerName: 'Siddharth Roy',
    email: 'siddharth.roy@designco.com',
    phone: '+91 99220 55123',
    shippingAddress: {
      fullName: 'Siddharth Roy',
      phone: '+91 99220 55123',
      addressLine: 'Flat 601, Koregaon Park Plaza, Lane 5',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      type: 'Home'
    },
    items: [
      {
        product: INITIAL_PRODUCTS[5], // Bomber Jacket
        selectedColor: INITIAL_PRODUCTS[5].colors[0],
        selectedSize: 'XL',
        quantity: 1
      }
    ],
    subtotal: 4999,
    discount: 500,
    shippingFee: 0,
    total: 4499,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Delivered',
    createdAt: 'Yesterday',
    timeline: [
      { status: 'Ordered', label: 'Order Placed', timestamp: 'Yesterday, 09:10 AM', completed: true, current: false },
      { status: 'Confirmed', label: 'UPI Verified', timestamp: 'Yesterday, 09:12 AM', completed: true, current: false },
      { status: 'Packed', label: 'Packed & Dispatched', timestamp: 'Yesterday, 11:00 AM', completed: true, current: false },
      { status: 'Shipped', label: 'Shipped via Express Air', timestamp: 'Yesterday, 02:00 PM', completed: true, current: false },
      { status: 'Out for Delivery', label: 'Out for Delivery Pune Hub', timestamp: 'Today, 09:30 AM', completed: true, current: false },
      { status: 'Delivered', label: 'Delivered - Signed by Siddharth', timestamp: 'Today, 01:15 PM', completed: true, current: true }
    ]
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'ATELIER10',
    discountPercent: 10,
    minOrderValue: 999,
    description: '10% off on modern menswear collections',
    isActive: true
  },
  {
    code: 'FIRSTORDER',
    discountPercent: 15,
    minOrderValue: 1999,
    description: '15% welcome reduction for first-time purchases',
    isActive: true
  }
];

export const DEFAULT_SHIPPING_ADDRESS: ShippingAddress = {
  fullName: 'Aarav Sharma',
  phone: '+91 98450 12345',
  addressLine: '#402, Palm Grove Heights, Indiranagar 100ft Road, Near Metro Pillar 124',
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '560038',
  type: 'Home'
};
