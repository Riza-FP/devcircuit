-- Enable Realtime for the orders table
begin;
  -- Check if publication exists, if not create it (standard supabase setup usually has it)
  -- This command adds the 'orders' table to the 'supabase_realtime' publication
  alter publication supabase_realtime add table orders;
commit;
