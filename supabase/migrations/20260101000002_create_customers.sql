-- customers: one row per customer Dave has dealt with
CREATE TABLE customers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name        text NOT NULL,
  phone       text NOT NULL,
  address     text,                              -- plain text, nullable; postcode lookup Phase 2
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_customers_user_id ON customers(user_id);

-- RLS: users can only read/write their own customers
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "customers: own records" ON customers
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
