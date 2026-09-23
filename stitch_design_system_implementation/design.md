# DESIGN.md

## Product: Men's Fashion E-commerce Platform

A complete, production-oriented men's clothing e-commerce platform with two distinct experiences:

1. **Customer storefront** — premium, editorial, image-led shopping experience.
2. **Admin console** — efficient, data-dense commerce management and analytics.

The system must feel like a real retail product rather than an AI-generated UI kit.

---

## 1. Design Principles

### Core goals

- Premium men's fashion aesthetic
- Clean, modern, masculine, trustworthy
- Mobile-first customer experience
- Desktop-first admin experience
- Strong product photography
- High conversion clarity
- Fast scanning and simple navigation
- Consistent spacing and typography
- Accessible contrast and interaction states
- Every screen designed for real implementation

### Avoid

- Generic AI dashboard aesthetics
- Excessive glassmorphism
- Excessive gradients
- Excessive rounded cards
- Random decorative shapes
- Huge unnecessary icons
- Inconsistent spacing
- Too many colors
- Fake-looking analytics
- Lorem Ipsum
- Decorative content with no functional purpose

---

# 2. Brand Direction

## Visual Personality

The brand should feel:

- Premium
- Minimal
- Contemporary
- Masculine
- Editorial
- Confident
- Approachable
- Retail-focused

The design should sit between premium fashion editorial and modern direct-to-consumer commerce.

---

# 3. Color System

Use a restrained neutral palette.

```text
Primary Background:        #FAFAF8
Surface:                   #FFFFFF
Primary Text:              #0A0A0A
Secondary Text:            #666666
Muted Text:                #8A8A8A
Border:                    #E7E7E4
Subtle Surface:            #F2F2EF
Success:                   #238636
Warning:                   #B7791F
Error:                     #C53030
Brand Accent:              #111111
```

The exact brand accent can be replaced later.

### Color rules

- Keep most of the UI neutral.
- Use the accent sparingly for primary actions and important states.
- Sale pricing may use the error/sale color.
- Never introduce random colors per component.
- Charts should remain visually restrained and easy to read.

---

# 4. Typography

Use a modern geometric or contemporary sans-serif.

Recommended hierarchy:

```text
Display:       48–72px
H1:            40–48px
H2:            28–36px
H3:            22–28px
Body Large:    17–18px
Body:          14–16px
Small:         12–13px
Caption:       11–12px
```

### Typography rules

- Strong editorial headings on customer pages.
- Compact, highly readable typography in admin pages.
- Product prices must have clear visual hierarchy.
- Avoid excessive font weights.
- Keep line lengths comfortable.
- Use consistent text casing.

---

# 5. Spacing System

Use an 8px spacing system.

```text
4px   micro spacing
8px   tight
12px  small
16px  standard
24px  comfortable
32px  section
48px  large section
64px  major section
96px  editorial spacing
```

Do not create arbitrary spacing values unless necessary.

---

# 6. Grid & Layout

## Customer

Desktop:

- Max content width: approximately 1280–1440px
- Large editorial margins
- Product grids: 4 columns
- Tablet: 3 columns
- Mobile: 2 columns

## Admin

Desktop:

- Fixed sidebar
- Flexible main content area
- Max content width around 1440px
- Dense tables and charts
- Strong section hierarchy

---

# 7. Responsive Strategy

## Customer mobile

Prioritize:

- Thumb-friendly controls
- 2-column product grid
- Sticky or easily reachable cart controls
- Bottom navigation
- Full-screen search
- Compact filters
- Large product images
- Simple checkout

Mobile bottom navigation:

```text
Home | Shop | Search | Wishlist | Account
```

## Admin mobile

- Collapsible navigation
- Responsive KPI cards
- Tables become cards where necessary
- Horizontal scrolling only when unavoidable
- Sticky primary actions
- Mobile-friendly filters
- Product forms broken into logical sections

---

# 8. Customer Navigation

Desktop header:

```text
Logo
Shop
New Arrivals
Categories
Sale
Search
Wishlist
Account
Cart
```

Mobile:

```text
Logo
Search
Wishlist
Cart
Menu
```

Navigation should remain simple and commerce-focused.

---

# 9. Customer Screens

Create a complete customer experience covering these screens:

## Home

Sections:

- Announcement bar
- Header
- Hero
- New Arrivals
- Shop by Category
- Featured Collection
- Best Sellers
- Promotional Sale Banner
- Trust / Benefits
- Newsletter
- Footer

Hero:

- Large men's fashion image
- Strong headline
- Short supporting copy
- Primary CTA: Shop Now
- Secondary CTA: Explore Collection

## Shop / Product Listing

Include:

- Breadcrumb
- Category title
- Description
- Result count
- Filters
- Sort
- Product grid

Filters:

- Category
- Size
- Color
- Price
- Discount
- Brand
- Availability
- Rating

Sort:

- Recommended
- Newest
- Popular
- Price low to high
- Price high to low
- Highest rated
- Biggest discount

## Product Card

Include:

- Product image
- Sale/New badge
- Wishlist button
- Product name
- Color
- Rating
- Current price
- Original price
- Discount
- Quick Add
- Size availability

## Product Details

Create a premium product-detail experience.

Layout:

**Left**
- Image gallery
- Thumbnail rail
- Zoom
- Multiple product images

**Right**
- Brand
- Product title
- Rating
- Review count
- Price
- Sale price
- Discount
- Color selector
- Size selector
- Size guide
- Stock state
- Quantity
- Add to Cart
- Buy Now
- Wishlist
- Delivery checker

Below:

- Description
- Material
- Fit
- Care instructions
- Size information
- Shipping
- Returns
- Reviews
- Related products
- Frequently bought together

Stock states:

```text
In Stock
Low Stock
Out of Stock
Coming Soon
```

## Search

Include:

- Search overlay
- Search suggestions
- Recent searches
- Popular searches
- Product results
- No-results state
- Recommended products

## Wishlist

Include:

- Product grid
- Move to cart
- Remove
- Stock state
- Sale state

## Cart

Include:

- Product
- Variant
- Quantity
- Price
- Remove
- Save for later
- Promo code

Order summary:

```text
Subtotal
Discount
Shipping
Tax
Total
```

## Checkout

Steps:

```text
Contact
→ Shipping Address
→ Delivery
→ Payment
→ Review
```

Payment methods:

- UPI
- Credit/Debit Card
- Net Banking
- Cash on Delivery
- Wallets / supported methods

Include order summary, delivery information, discounts, taxes, shipping and final total.

## Orders

Order confirmation:

- Success state
- Order ID
- Delivery estimate
- Products
- Total
- Address
- Continue Shopping
- Track Order

Order tracking:

```text
Ordered
Confirmed
Packed
Shipped
Out for Delivery
Delivered
```

Order history:

- Search
- Filters
- Status
- Order cards

Order detail:

- Products
- Pricing
- Payment
- Address
- Timeline
- Invoice
- Cancel
- Return
- Exchange

## Account

Sections:

- Profile
- Orders
- Wishlist
- Addresses
- Notifications
- Saved payment methods
- Support
- Settings
- Logout

## Authentication

Create:

- Login
- Sign Up
- Forgot Password
- OTP Verification
- Password Reset

## Informational Pages

Create:

- About
- Contact
- FAQ
- Shipping & Delivery
- Returns & Refunds
- Terms
- Privacy

## Collections

Create:

- Sale
- New Arrivals
- Best Sellers
- Offers
- Featured Collection
- Campaign / Collection landing page

---

# 10. Customer UI Components

Build a reusable component language:

- Buttons
- Product cards
- Price blocks
- Badges
- Chips
- Filters
- Dropdowns
- Inputs
- Selectors
- Tabs
- Accordions
- Breadcrumbs
- Modals
- Toasts
- Drawers
- Pagination
- Ratings
- Review cards
- Quantity controls
- Image galleries
- Empty states
- Skeleton loaders

### Button hierarchy

Primary:

- Solid dark
- High contrast

Secondary:

- Outlined

Tertiary:

- Text / icon only

Destructive:

- Clearly distinct
- Used only for destructive actions

---

# 11. Admin Information Architecture

Persistent sidebar:

```text
Dashboard
Products
Categories
Inventory
Orders
Customers
Discounts & Coupons
Sales & Promotions
Analytics
Reviews
Content
Banners
Notifications
Reports
Settings
```

Sidebar footer:

- Admin profile
- Store status
- Help
- Logout

Top bar:

- Global search
- Notifications
- Quick Add / Quick Action
- Admin profile

---

# 12. Admin Dashboard

The dashboard is an operational overview, not just a decorative analytics page.

## KPI cards

Show:

- Total Revenue
- Orders
- Average Order Value
- Conversion Rate
- Products Sold
- Customers
- Returning Customers
- Pending Orders

Each KPI should include:

- Current value
- Previous-period comparison
- Percentage change
- Trend indicator
- Optional sparkline

## Main dashboard sections

### Revenue

- Revenue trend
- Daily/weekly/monthly performance
- Previous-period comparison

### Orders

- Order trend
- Pending orders
- Fulfillment status

### Sales

- Sales by category
- Best-selling products
- Sales by payment method

### Customers

- New vs returning
- Customer growth
- Repeat purchase activity

### Inventory

- Low stock
- Out of stock
- Inventory value
- Fast-moving products

### Recent Orders

Columns:

```text
Order ID
Customer
Products
Amount
Payment
Status
Date
```

### Quick Actions

```text
Add Product
Create Discount
Create Sale
Add Banner
View Orders
Export Report
```

---

# 13. Advanced Analytics

Analytics should help the store owner understand what is actually happening in the business.

## Revenue Analytics

Track:

- Gross revenue
- Net revenue
- Discounts
- Refunds
- Taxes
- Shipping revenue
- Revenue trend

Filters:

- Today
- Yesterday
- 7 days
- 30 days
- 3 months
- 12 months
- Custom range

## Sales Analytics

Track:

- Orders
- Units sold
- Average order value
- Orders per customer
- Sales by category
- Sales by product
- Sales by size
- Sales by color
- Sales by price range

## Product Performance

Show:

- Best sellers
- Worst performers
- Fastest-growing products
- Slow-moving inventory
- Highest-margin products
- Frequently viewed but rarely purchased products
- Out-of-stock impact
- Low-stock products

## Customer Analytics

Show:

- New customers
- Returning customers
- Repeat purchase rate
- Customer retention
- Customer lifetime value
- Average orders per customer
- Acquisition trend
- Customer segments

Customer segments:

```text
New
Returning
VIP
At Risk
Inactive
```

## Conversion Analytics

Build a conversion funnel:

```text
Visitors
   ↓
Product Views
   ↓
Add to Cart
   ↓
Checkout Started
   ↓
Purchase Completed
```

Track:

- Visitors
- Product views
- Add-to-cart rate
- Checkout rate
- Purchase conversion
- Cart abandonment
- Checkout abandonment

## Promotion Analytics

Track:

- Coupon usage
- Discount value
- Campaign revenue
- Promotion conversion
- Best-performing campaigns
- Campaign ROI

## Traffic / Channel Analytics

Track:

- Direct
- Search
- Social
- Referral
- Paid campaigns

## Geographic Analytics

Track:

- Orders by state
- Orders by city
- Revenue by region

## Time Analytics

Track:

- Best-selling days
- Best-selling hours
- Seasonal performance

## Analytics Controls

Every major analytics area should support:

- Date range
- Product filter
- Category filter
- Customer filter
- Channel filter
- Export

Preferred chart types:

- Line chart
- Bar chart
- Area chart
- Donut chart
- Funnel
- Comparison table
- Heatmap

Avoid chart overload. Use progressive disclosure.

---

# 14. Product Management

## Product List

Columns:

```text
Image
Product
Category
Price
Stock
Variants
Sales
Status
Date
Actions
```

Actions:

- Edit
- Duplicate
- Archive
- Delete
- View
- Feature
- Put on sale

Filters:

- Search
- Category
- Status
- Stock
- Price
- Sales
- Date added

---

# 15. Add Product

Build a complete product creation interface.

## Basic Information

- Product name
- SKU
- Brand
- Category
- Subcategory
- Description

## Media

- Multiple image upload
- Main image
- Gallery
- Drag/drop
- Reorder
- Delete
- Preview

## Pricing

- Cost price
- Selling price
- Compare-at price
- Sale price
- Tax
- Discount

## Inventory

- SKU
- Stock quantity
- Low-stock threshold
- Inventory tracking
- Backorder setting

## Variants

Support:

- Size
- Color
- Fit
- Variant SKU
- Variant price
- Variant stock

Sizes:

```text
XS
S
M
L
XL
XXL
XXXL
```

## Other

- Tags
- Product badges
- Featured flag
- New arrival
- Bestseller

## SEO

- SEO title
- Meta description
- URL slug

## Publishing

```text
Draft
Published
Scheduled
Archived
```

Primary actions:

```text
Save Draft
Preview
Publish Product
```

---

# 16. Inventory Management

Dashboard KPIs:

- Inventory value
- Total units
- Low stock
- Out of stock
- Overstock

Inventory table:

```text
Product
SKU
Variant
Size
Color
Stock
Reserved
Available
Reorder Level
Status
```

Actions:

- Adjust stock
- Restock
- Bulk update
- Import
- Export

Inventory states:

```text
Healthy
Low Stock
Critical
Out of Stock
```

---

# 17. Order Management

Order table:

```text
Order ID
Customer
Date
Products
Total
Payment
Fulfillment
Status
```

Statuses:

```text
Pending
Confirmed
Packed
Shipped
Delivered
Cancelled
Returned
Refunded
```

Order detail includes:

- Customer information
- Products
- Variants
- Pricing
- Payment
- Shipping
- Address
- Timeline
- Internal notes
- Invoice
- Refund
- Return
- Status update

---

# 18. Customer Management

Customer table:

```text
Customer
Email
Phone
Orders
Total Spent
Last Purchase
Average Order Value
Customer Type
```

Customer detail:

- Profile
- Order history
- Lifetime value
- Total spending
- Average order
- Favorite categories
- Recent activity
- Refund history
- Addresses

---

# 19. Discounts & Coupons

Support:

- Percentage discount
- Fixed amount
- Buy X Get Y
- Free shipping
- Product discount
- Category discount
- Minimum order value
- Maximum discount
- Customer restrictions
- Usage limit
- Start date
- End date

Coupon states:

```text
Active
Scheduled
Expired
Disabled
```

---

# 20. Sales & Promotions

Support:

- Seasonal sale
- Flash sale
- Weekend sale
- Category sale
- Product sale
- New collection launch
- Clearance sale

Campaign fields:

- Campaign name
- Banner
- Products
- Categories
- Discount
- Start/end
- Homepage visibility
- Status

---

# 21. Reviews

Review management:

- Product
- Customer
- Rating
- Review
- Date
- Status

Actions:

- Approve
- Hide
- Delete
- Reply

Analytics:

- Average rating
- Rating distribution
- Most-reviewed products
- Products with declining ratings

---

# 22. Content Management

Admin should be able to manage:

- Hero banner
- Promotional banners
- Homepage sections
- Featured products
- Collections
- Best sellers
- New arrivals
- Sale sections
- Announcement bar
- Footer content

Actions:

- Add section
- Edit
- Reorder
- Enable/disable
- Preview
- Schedule

---

# 23. Banner Management

Banner list:

```text
Image
Title
CTA
Placement
Status
Start Date
End Date
```

Banner editor:

- Desktop image
- Mobile image
- Heading
- Subtitle
- CTA
- Link
- Position
- Schedule
- Visibility

---

# 24. Notifications

Notification types:

- New order
- Payment received
- Low stock
- Out of stock
- Return request
- Refund request
- New customer
- New review
- System alert

Actions:

- Mark read
- Mark unread
- Filter
- Clear

---

# 25. Reports

Reports:

- Sales
- Revenue
- Products
- Inventory
- Customers
- Tax
- Discounts
- Refunds

Every report should support:

- Date filters
- Export CSV
- Export PDF
- Print

---

# 26. Settings

## Store

- Store name
- Logo
- Contact information
- Address
- Currency
- Timezone

## Shipping

- Zones
- Rates
- Free-shipping threshold
- Estimated delivery

## Payments

- Payment methods
- COD
- Online payment configuration

## Taxes

- Tax rules
- Tax rates

## Notifications

- Email alerts
- Order alerts
- Inventory alerts

## Admin Users

- Add admin
- Roles
- Permissions

## Security

- Password
- 2FA
- Sessions
- Login activity

---

# 27. Required UI States

Never design only the ideal state.

Include:

- Loading
- Skeleton
- Empty
- Success
- Error
- Confirmation
- Delete confirmation
- Unsaved changes
- Offline
- No search results
- No products
- No orders
- No customers
- Out of stock
- Low stock
- Invalid coupon
- Expired coupon
- Payment failure
- Checkout failure

Use clear human microcopy.

---

# 28. Product & Commerce Data

Use realistic fictional data.

Example products:

```text
Essential Oxford Shirt
Classic Relaxed T-Shirt
Premium Straight Fit Jeans
Signature Overshirt
Essential Cargo Trousers
Minimal Bomber Jacket
Heavyweight Hoodie
Premium Linen Shirt
```

Use prices in Indian Rupees:

```text
₹1,499
₹1,999
₹2,499
₹3,499
```

Use realistic discounts:

```text
10%
20%
30%
40%
```

Analytics data should contain believable values and trends rather than random-looking numbers.

---

# 29. Interaction Flows

## Customer

```text
Home
→ Category
→ Product
→ Select Variant
→ Add to Cart
→ Cart
→ Checkout
→ Payment
→ Confirmation
→ Tracking
```

## Admin

```text
Login
→ Dashboard
→ Products
→ Add Product
→ Save / Publish
→ Inventory
→ Orders
→ Order Detail
→ Customers
→ Analytics
→ Reports
```

Major navigation elements should be clickable and logically connected in the prototype.

---

# 30. Accessibility

- WCAG-conscious contrast
- Keyboard-friendly controls
- Visible focus states
- Adequate touch target sizes
- Clear error messages
- Avoid color-only status communication
- Meaningful labels for icons
- Alt-text-ready image structure
- Readable text at mobile sizes

---

# 31. Image Direction

Use realistic men's fashion imagery.

Categories:

- Shirts
- T-shirts
- Jeans
- Trousers
- Jackets
- Hoodies
- Overshirts
- Co-ords
- Traditional men's wear
- Accessories

Customer pages should be strongly image-led.

Admin should use smaller thumbnails to preserve information density.

---

# 32. Customer vs Admin Density

## Customer

Prioritize:

- Visual storytelling
- Product imagery
- Spacious layout
- Simple decisions
- Strong CTAs
- Minimal friction

## Admin

Prioritize:

- Data visibility
- Speed
- Filtering
- Bulk actions
- Tables
- Status information
- Analytics
- Operational workflows

Do not force the same visual density on both experiences.

---

# 33. Design Quality Bar

Every screen must satisfy these questions:

1. Is the primary action obvious?
2. Can a user understand the page within a few seconds?
3. Is information grouped logically?
4. Does the screen work on mobile where relevant?
5. Are prices, stock and statuses easy to scan?
6. Does it look like the same brand as every other screen?
7. Could a developer realistically implement it?
8. Are loading, empty and error states considered?

The result should feel like a cohesive, launch-ready men's clothing commerce platform rather than a collection of disconnected mockups.

---

# 34. Final Design Requirement

Generate the entire product as one coherent design system.

The storefront should communicate **premium men's fashion**.

The admin should communicate **control, clarity and business intelligence**.

The analytics experience should go beyond vanity metrics and help the owner understand:

- What is selling
- What is not selling
- Where revenue is coming from
- Which products need restocking
- Which customers are returning
- Where shoppers drop out
- Which campaigns generate sales
- Which categories and variants perform best
- How the business changes over time

Use realistic sample data, consistent components, strong hierarchy, responsive layouts, and complete application states throughout.
