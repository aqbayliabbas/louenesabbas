-- Create contract status enum
CREATE TYPE contract_status AS ENUM ('draft', 'sent', 'signed', 'completed', 'cancelled');

-- Create contracts table
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Client Info
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_address TEXT,
    client_phone VARCHAR(50),
    
    -- Project Info
    project_name VARCHAR(255) NOT NULL,
    service_scope TEXT NOT NULL, -- Description detailed of the mission
    start_date DATE,
    end_date DATE,
    
    -- Financials
    total_amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'DZD',
    
    -- Status & Metadata
    status contract_status DEFAULT 'draft',
    signed_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to update updated_at
CREATE TRIGGER update_contracts_updated_at
    BEFORE UPDATE ON contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to generate contract number (CT-YYYY-MM-XXXX)
CREATE OR REPLACE FUNCTION generate_contract_number()
RETURNS TRIGGER AS $$
DECLARE
    year_prefix TEXT;
    month_prefix TEXT;
    sequence_number INT;
    new_number TEXT;
BEGIN
    year_prefix := to_char(NEW.created_at, 'YYYY');
    month_prefix := to_char(NEW.created_at, 'MM');
    
    -- Find the max sequence number for this month/year specific to contracts
    SELECT COALESCE(MAX(CAST(SUBSTRING(contract_number FROM 12) AS INT)), 0) + 1
    INTO sequence_number
    FROM contracts
    WHERE contract_number LIKE 'CT-' || year_prefix || '-' || month_prefix || '-%';
    
    -- Format: CT-2024-01-0001
    new_number := 'CT-' || year_prefix || '-' || month_prefix || '-' || lpad(sequence_number::TEXT, 4, '0');
    
    NEW.contract_number := new_number;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger for contract number
CREATE TRIGGER generate_contract_number_trigger
    BEFORE INSERT ON contracts
    FOR EACH ROW
    EXECUTE FUNCTION generate_contract_number();

-- Enable RLS
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Policy (Open for admin use)
CREATE POLICY "Enable all access for authenticated users" ON contracts
    FOR ALL USING (auth.role() = 'anon' OR auth.role() = 'authenticated'); -- Using anon for dev/preview ease as established

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE contracts;

-- ==========================================
-- CONTRACT CLAUSES TABLE
-- ==========================================

-- Create contract_clauses table
CREATE TABLE contract_clauses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_contract_clauses_contract_id ON contract_clauses(contract_id);

-- Enable RLS
ALTER TABLE contract_clauses ENABLE ROW LEVEL SECURITY;

-- Policy (Open for admin use)
CREATE POLICY "Enable all access for authenticated users" ON contract_clauses
    FOR ALL USING (auth.role() = 'anon' OR auth.role() = 'authenticated');

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE contract_clauses;

