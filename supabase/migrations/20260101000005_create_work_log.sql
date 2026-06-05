-- work_log: audit trail for a job, Dave's diary, immutable (append-only)
CREATE TABLE work_log (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id        uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  type          text NOT NULL CHECK (type IN (
                  'note',             -- Dave added a text note
                  'charge',           -- Dave added a charge (links to line_item)
                  'status_change',    -- Job moved to a new status
                  'customer_notified',-- Dave sent "running late" message
                  'running_late'      -- Dave tapped "Running Late" button
                )),
  description   text NOT NULL,         -- human-readable log text
  amount        numeric(10,2),         -- only for type='charge'
  line_item_id  uuid REFERENCES line_items(id), -- only for type='charge'
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_work_log_job_id ON work_log(job_id);

-- RLS: users can only read work_log via their own jobs (append-only, no UPDATE/DELETE policy)
ALTER TABLE work_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "work_log: own via job" ON work_log
  USING (EXISTS (
    SELECT 1 FROM jobs WHERE jobs.id = work_log.job_id AND jobs.user_id = auth.uid()
  ));
