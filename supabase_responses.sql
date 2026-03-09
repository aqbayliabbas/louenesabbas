-- Create responses table for the questionnaire
CREATE TABLE IF NOT EXISTS responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT,
    mission TEXT,
    audience TEXT,
    values TEXT[],
    personality JSONB,
    positioning JSONB,
    competitors TEXT,
    emotion TEXT,
    deliverables TEXT[],
    touchpoints TEXT[],
    design_references TEXT,
    timeline TEXT,
    budget TEXT,
    email TEXT,
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable insert for anonymous users" ON responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read for everyone (dev)" ON responses FOR SELECT USING (true); -- Should ideally be admin restricted
CREATE POLICY "Enable delete for everyone (dev)" ON responses FOR DELETE USING (true);
