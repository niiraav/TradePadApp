-- payments: payment records, one row per payment recorded
CREATE TABLE payments (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id              uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  type                text NOT NULL CHECK (type IN (
                        'deposit',       -- upfront deposit at booking
                        'balance',       -- remaining balance after deposit
                        'full'           -- full payment, no deposit
                      )),
  method              text NOT NULL CHECK (method IN (
                        'cash', 'bank_transfer', 'other'
                      )),
  method_description  text,             -- free text for method='other'
  amount              numeric(10,2) NOT NULL,
  recorded_at         timestamptz NOT NULL DEFAULT now(),
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_job_id ON payments(job_id);

-- RLS: users can only access payments via their own jobs
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments: own via job" ON payments
  USING (EXISTS (
    SELECT 1 FROM jobs WHERE jobs.id = payments.job_id AND jobs.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM jobs WHERE jobs.id = payments.job_id AND jobs.user_id = auth.uid()
  ));
