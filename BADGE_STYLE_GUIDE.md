# Badge Style Guide

## Overview
This guide shows how to use consistent badge/button UI styles across the entire project with proper color variations.

## Available Badge Components

### 1. StatusBadge Component
Used for status indicators (Low, Medium, High, Active, Pending, etc.)

```jsx
import StatusBadge from './StatusBadge';

// Usage
<StatusBadge status="low" />        // Red/Orange
<StatusBadge status="medium" />     // Orange
<StatusBadge status="high" />       // Green
<StatusBadge status="pending" />    // Blue
<StatusBadge status="completed" />  // Green
```

### 2. Badge Component
Used for general labels (quantities, locations, suppliers, etc.)

```jsx
import Badge from './Badge';

// Usage with variants
<Badge variant="blue">{value}</Badge>
<Badge variant="green">{value}</Badge>
<Badge variant="orange">{value}</Badge>
<Badge variant="red">{value}</Badge>
<Badge variant="purple">{value}</Badge>
<Badge variant="cyan">{value}</Badge>
<Badge variant="teal">{value}</Badge>
<Badge variant="gray">{value}</Badge>
```

### 3. CategoryBadge Component
Used for product categories (A, B, C)

```jsx
import CategoryBadge from './CategoryBadge';

// Usage
<CategoryBadge category="A" />  // Blue
<CategoryBadge category="B" />  // Orange
<CategoryBadge category="C" />  // Green
```

## Color Scheme

### Blue (Info/Primary)
- **Use for:** Product IDs, General info, Pending status, Category A
- **Colors:** `#dbeafe` background, `#1e40af` text, `#bfdbfe` border

### Green (Success/High)
- **Use for:** High stock, Completed orders, Active status, Category C
- **Colors:** `#d1fae5` background, `#065f46` text, `#a7f3d0` border

### Orange (Warning/Medium)
- **Use for:** Medium stock, Low stock warnings, Category B
- **Colors:** `#fef3c7` background, `#92400e` text, `#fde68a` border

### Red (Danger/Critical)
- **Use for:** Very low stock, Cancelled orders, Critical alerts
- **Colors:** `#fee2e2` background, `#991b1b` text, `#fecaca` border

### Purple
- **Use for:** Quantities, Special items
- **Colors:** `#f3e8ff` background, `#6b21a8` text, `#e9d5ff` border

### Cyan
- **Use for:** Locations, Tracking info
- **Colors:** `#cffafe` background, `#155e75` text, `#a5f3fc` border

### Teal
- **Use for:** Suppliers, Vendors
- **Colors:** `#ccfbf1` background, `#115e59` text, `#99f6e4` border

### Gray
- **Use for:** Inactive, N/A, Default
- **Colors:** `#f3f4f6` background, `#374151` text, `#e5e7eb` border

## Usage Examples by Component

### Products Component
```jsx
<Badge variant="purple">{product.quantity}</Badge>
<CategoryBadge category={product.category} />
<StatusBadge status={product.quantity > 50 ? 'high' : 'low'} />
```

### Stock Component
```jsx
<Badge variant="purple">{stock.availableStock}</Badge>
<Badge variant="cyan">{stock.location}</Badge>
<Badge variant="teal">{stock.supplier}</Badge>
<StatusBadge status={getStockStatus(stock.quantity)} />
```

### Orders/Income Component
```jsx
<Badge variant="blue">{order.orderId}</Badge>
<Badge variant="green">${order.amount}</Badge>
<StatusBadge status={order.status} />
```

### Shipments Component
```jsx
<Badge variant="cyan">{shipment.trackingNumber}</Badge>
<Badge variant="teal">{shipment.courier}</Badge>
<StatusBadge status={shipment.status} />
```

### Customers Component
```jsx
<Badge variant="blue">{customer.customerId}</Badge>
<Badge variant="green">{customer.totalOrders}</Badge>
<StatusBadge status={customer.isActive ? 'active' : 'inactive'} />
```

## Best Practices

1. **Consistency:** Use the same color for the same type of data across all components
2. **Limit Colors:** Stick to the 8 defined colors (blue, green, orange, red, purple, cyan, teal, gray)
3. **Meaningful Colors:** 
   - Green = positive/high/success
   - Red = negative/low/danger
   - Orange = warning/medium
   - Blue = info/neutral
4. **Component Choice:**
   - Use `StatusBadge` for status indicators
   - Use `Badge` for data labels
   - Use `CategoryBadge` for categories

## Quick Reference Table

| Data Type | Component | Variant/Status | Color |
|-----------|-----------|----------------|-------|
| Stock Status | StatusBadge | low/medium/high | Red/Orange/Green |
| Quantity | Badge | purple | Purple |
| Location | Badge | cyan | Cyan |
| Supplier | Badge | teal | Teal |
| Category A | CategoryBadge | A | Blue |
| Category B | CategoryBadge | B | Orange |
| Category C | CategoryBadge | C | Green |
| Order Status | StatusBadge | pending/completed | Blue/Green |
| Amount | Badge | green | Green |
| ID/Code | Badge | blue | Blue |
| Inactive | Badge | gray | Gray |
