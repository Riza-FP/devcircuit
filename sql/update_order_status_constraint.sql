-- Drop the old constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Add the new constraint with all statuses
ALTER TABLE orders ADD CONSTRAINT orders_status_check
CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled', 'cancellation_requested'));

-- Optionally add a comment
COMMENT ON CONSTRAINT orders_status_check ON orders IS 'Allowed statuses: pending, paid, shipped, delivered, cancelled, cancellation_requested';
