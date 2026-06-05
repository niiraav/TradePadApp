-- line_items: invoice/quote line items, belong to a job, ordered by sort_order
CREATE TABLE line_items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id          uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  description     text NOT NULL,
  amount          numeric(10,2) NOT NULL,        -- always has amount; no TBC items in MVP
  sort_order      integer NOT NULL DEFAULT 0,
  added_on_site   boolean NOT NULL DEFAULT false, -- true if added during In Progress
  created_at      timestamptz NOT NULL DEFAULT now()
  -- No updated_at: line items are immutable; remove and re-add to change
);

CREATE INDEX idx_line_items_job_id ON line_items(job_id);

-- RLS: users can only access line items via their own jobs
ALTER TABLE line_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "line_items: own via job" ON line_items
  USING (EXISTS (
    SELECT 1 FROM jobs WHERE jobs.id = line_items.job_id AND jobs.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM jobs WHERE jobs.id = line_items.job_id AND jobs.user_id = auth.uid()
  ));
