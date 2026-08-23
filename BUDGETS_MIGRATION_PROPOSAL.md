# SQL Migration Proposal: Budget Management Tables

## Overview
This migration adds budget tracking capabilities to the Finance application. It creates two new tables with full Row-Level Security (RLS) policies.

---

## Complete SQL Migration

```sql
-- ============================================================================
-- NEW TABLE: budgets
-- Purpose: Store monthly budget limits for each user
-- ============================================================================

CREATE TABLE public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  monthly_limit NUMERIC(12, 2) NOT NULL,
  current_month TEXT NOT NULL, -- Format: 'YYYY-MM' (e.g., '2026-08')
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT budgets_monthly_limit_nonnegative CHECK (monthly_limit >= 0),
  CONSTRAINT budgets_month_format_check CHECK (current_month ~ '^\d{4}-\d{2}$'),
  CONSTRAINT budgets_user_month_key UNIQUE (user_id, current_month)
);

-- Index for fast lookups by user and month
CREATE INDEX budgets_user_id_month_idx ON public.budgets (user_id, current_month DESC);

-- Enable RLS
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own budgets
CREATE POLICY "Users can select their own budgets"
  ON public.budgets FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

-- RLS Policy: Users can only insert their own budgets
CREATE POLICY "Users can insert their own budgets"
  ON public.budgets FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- RLS Policy: Users can only update their own budgets
CREATE POLICY "Users can update their own budgets"
  ON public.budgets FOR UPDATE
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- RLS Policy: Users can only delete their own budgets
CREATE POLICY "Users can delete their own budgets"
  ON public.budgets FOR DELETE
  USING ((SELECT auth.uid()) = user_id);


-- ============================================================================
-- OPTIONAL TABLE: category_budgets
-- Purpose: Store category-specific budget limits for each user per month
-- (Can be added later if needed for category-level budget tracking)
-- ============================================================================

CREATE TABLE public.category_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  category_id UUID NOT NULL,
  budget_limit NUMERIC(12, 2) NOT NULL,
  current_month TEXT NOT NULL, -- Format: 'YYYY-MM' (e.g., '2026-08')
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Foreign key to categories with composite key validation
  CONSTRAINT category_budgets_category_owner_fk
    FOREIGN KEY (category_id, user_id)
    REFERENCES public.categories (id, user_id)
    ON DELETE CASCADE,
  
  -- Constraints
  CONSTRAINT category_budgets_limit_nonnegative CHECK (budget_limit >= 0),
  CONSTRAINT category_budgets_month_format_check CHECK (current_month ~ '^\d{4}-\d{2}$'),
  CONSTRAINT category_budgets_user_category_month_key UNIQUE (user_id, category_id, current_month)
);

-- Indexes for fast lookups
CREATE INDEX category_budgets_user_id_month_idx ON public.category_budgets (user_id, current_month DESC);
CREATE INDEX category_budgets_category_id_idx ON public.category_budgets (category_id);

-- Enable RLS
ALTER TABLE public.category_budgets ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own category budgets
CREATE POLICY "Users can select their own category budgets"
  ON public.category_budgets FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

-- RLS Policy: Users can only insert their own category budgets
CREATE POLICY "Users can insert their own category budgets"
  ON public.category_budgets FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- RLS Policy: Users can only update their own category budgets
CREATE POLICY "Users can update their own category budgets"
  ON public.category_budgets FOR UPDATE
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- RLS Policy: Users can only delete their own category budgets
CREATE POLICY "Users can delete their own category budgets"
  ON public.category_budgets FOR DELETE
  USING ((SELECT auth.uid()) = user_id);
```

---

## What This Migration Creates

### **1. `budgets` Table** (Primary)

**Columns:**
| Column | Type | Purpose | Notes |
|--------|------|---------|-------|
| `id` | UUID | Unique identifier | Auto-generated |
| `user_id` | UUID | Links to auth.users | Cascades on user deletion |
| `monthly_limit` | NUMERIC(12,2) | Budget ceiling for the month | ₹0.00 to ₹999,999,999.99 |
| `current_month` | TEXT | Month identifier | Format: YYYY-MM (e.g., '2026-08') |
| `created_at` | TIMESTAMPTZ | Creation timestamp | Auto-set to current time |
| `updated_at` | TIMESTAMPTZ | Last modification | Auto-set to current time |

**Constraints:**
- `monthly_limit >= 0` (no negative budgets)
- `current_month` follows YYYY-MM format (regex validation)
- Unique constraint on `(user_id, current_month)` - one budget per user per month
- Automatic cascade delete when user is deleted

**Indexes:**
- `budgets_user_id_month_idx` - Fast lookup by user and month

**RLS Policies:**
- ✅ SELECT: Users see only their own budgets
- ✅ INSERT: Users can only create budgets for themselves
- ✅ UPDATE: Users can only modify their own budgets
- ✅ DELETE: Users can only delete their own budgets

---

### **2. `category_budgets` Table** (Optional - Can be Enabled Later)

**Use Case:** If you want to set individual budgets for specific categories (e.g., "Food: ₹3,000", "Transport: ₹1,500")

**Columns:**
| Column | Type | Purpose | Notes |
|--------|------|---------|-------|
| `id` | UUID | Unique identifier | Auto-generated |
| `user_id` | UUID | Links to auth.users | Cascades on user deletion |
| `category_id` | UUID | Links to categories | Cascades when category deleted |
| `budget_limit` | NUMERIC(12,2) | Budget for this category | ₹0.00 to ₹999,999,999.99 |
| `current_month` | TEXT | Month identifier | Format: YYYY-MM |
| `created_at` | TIMESTAMPTZ | Creation timestamp | Auto-set |
| `updated_at` | TIMESTAMPTZ | Last modification | Auto-set |

**Constraints:**
- `budget_limit >= 0` (no negative budgets)
- `current_month` follows YYYY-MM format
- Composite foreign key to `(category_id, user_id)` in categories table
- Unique constraint on `(user_id, category_id, current_month)` - one budget per user per category per month

**Indexes:**
- `category_budgets_user_id_month_idx` - Fast lookup by user and month
- `category_budgets_category_id_idx` - Fast lookup by category

**RLS Policies:** Same as budgets table (all 4 operations restricted to user's own data)

---

## What Will Change in the Application

### **Database Level:**
✅ Two new tables added (RLS enabled by default)
✅ New indexes created for performance
✅ Foreign key constraints maintain data integrity
✅ No existing tables modified
✅ No existing data deleted or modified
✅ Automatic user deletion cascades (as with existing tables)

### **No Breaking Changes:**
❌ Existing `expenses` table: **Unchanged**
❌ Existing `categories` table: **Unchanged**
❌ Existing `auth.users` table: **Unchanged**
❌ Existing RLS policies: **Unchanged**
❌ Authentication logic: **Unchanged**
❌ Data access patterns: **Unchanged**

---

## How It Will Be Used in the Application

### **Frontend Usage Example:**

```typescript
// Create/update a budget for current month
const { data, error } = await supabase
  .from('budgets')
  .upsert({
    user_id: user.id,
    monthly_limit: 10000,
    current_month: '2026-08' // Current month
  })
  .select();

// Get this month's budget
const { data: budget } = await supabase
  .from('budgets')
  .select('*')
  .eq('user_id', user.id)
  .eq('current_month', '2026-08')
  .single();

// Calculate spent amount (from existing expenses table)
const spent = expenses
  .filter(exp => new Date(exp.date).toISOString().slice(0, 7) === '2026-08')
  .reduce((sum, exp) => sum + exp.amount, 0);

// Calculate remaining
const remaining = budget.monthly_limit - spent;
```

---

## Security & Compliance

✅ **RLS Enabled:** All policies enforce user isolation  
✅ **No Service Role Keys:** Frontend uses anon key only  
✅ **No Sensitive Data:** Budget amounts are user-controlled, not sensitive  
✅ **Cascade Deletion:** User data automatically cleaned up  
✅ **No Data Migration Needed:** Tables are new, no data loss  
✅ **Backward Compatible:** Existing queries unaffected  

---

## Implementation Notes

1. **Month Format:** Using `TEXT` with regex validation (`YYYY-MM`) instead of `DATE` for easier monthly grouping in queries
2. **Computed "Spent":** The `spent` amount is **calculated in queries**, not stored as a column (avoids sync issues)
3. **Optional Category Budgets:** Included in migration but frontend can be implemented later without breaking anything
4. **Timezone Handling:** `TIMESTAMPTZ` ensures timezone-aware timestamps (follows existing table pattern)

---

## Ready to Apply?

This migration:
- ✅ Is **non-destructive** (adds only, modifies nothing)
- ✅ Follows **existing schema patterns**
- ✅ Maintains **full RLS security**
- ✅ Is **fully backward compatible**
- ✅ Includes **performance indexes**

**Proceed with execution?** 🚀
