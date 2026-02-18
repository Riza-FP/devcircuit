-- Add cancellation_reason column to orders table
ALTER TABLE orders 
ADD COLUMN cancellation_reason text;

-- Add comment
COMMENT ON COLUMN orders.cancellation_reason IS 'Reason provided by customer for cancellation request';
