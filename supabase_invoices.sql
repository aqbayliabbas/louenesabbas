-- =====================================================
-- FACTURES (INVOICES) TABLE
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Create enum for payment status
CREATE TYPE payment_status AS ENUM ('pending', 'advance_paid', 'work_complete_paid', 'fully_paid');

-- Create enum for invoice status
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'cancelled');

-- Create the invoices table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Invoice identification
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Client information
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_phone VARCHAR(50),
    client_address TEXT,
    
    -- Service details
    service_type VARCHAR(100) NOT NULL,
    service_description TEXT,
    
    -- Financial details
    total_amount DECIMAL(12, 2) NOT NULL,
    advance_amount DECIMAL(12, 2) GENERATED ALWAYS AS (total_amount * 0.50) STORED,
    work_complete_amount DECIMAL(12, 2) GENERATED ALWAYS AS (total_amount * 0.25) STORED,
    delivery_amount DECIMAL(12, 2) GENERATED ALWAYS AS (total_amount * 0.25) STORED,
    
    -- Payment tracking
    advance_paid BOOLEAN DEFAULT FALSE,
    advance_paid_date TIMESTAMP WITH TIME ZONE,
    work_complete_paid BOOLEAN DEFAULT FALSE,
    work_complete_paid_date TIMESTAMP WITH TIME ZONE,
    delivery_paid BOOLEAN DEFAULT FALSE,
    delivery_paid_date TIMESTAMP WITH TIME ZONE,
    
    -- Calculated paid amount (virtual column approach via view or trigger)
    amount_paid DECIMAL(12, 2) DEFAULT 0,
    
    -- Status
    payment_status payment_status DEFAULT 'pending',
    invoice_status invoice_status DEFAULT 'draft',
    
    -- Dates
    issue_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    project_start_date DATE,
    project_end_date DATE,
    
    -- Notes
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_invoices_client_name ON invoices(client_name);
CREATE INDEX idx_invoices_payment_status ON invoices(payment_status);
CREATE INDEX idx_invoices_invoice_status ON invoices(invoice_status);
CREATE INDEX idx_invoices_created_at ON invoices(created_at DESC);

-- Create a function to auto-update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create a function to update payment status based on paid flags
CREATE OR REPLACE FUNCTION update_payment_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate amount paid
    NEW.amount_paid = 0;
    IF NEW.advance_paid THEN
        NEW.amount_paid = NEW.amount_paid + (NEW.total_amount * 0.50);
    END IF;
    IF NEW.work_complete_paid THEN
        NEW.amount_paid = NEW.amount_paid + (NEW.total_amount * 0.25);
    END IF;
    IF NEW.delivery_paid THEN
        NEW.amount_paid = NEW.amount_paid + (NEW.total_amount * 0.25);
    END IF;
    
    -- Update payment status
    IF NEW.advance_paid AND NEW.work_complete_paid AND NEW.delivery_paid THEN
        NEW.payment_status = 'fully_paid';
    ELSIF NEW.advance_paid AND NEW.work_complete_paid THEN
        NEW.payment_status = 'work_complete_paid';
    ELSIF NEW.advance_paid THEN
        NEW.payment_status = 'advance_paid';
    ELSE
        NEW.payment_status = 'pending';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for payment status
CREATE TRIGGER update_invoice_payment_status
    BEFORE INSERT OR UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_payment_status();

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
    year_str VARCHAR(4);
    month_str VARCHAR(2);
    next_num INT;
BEGIN
    IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
        year_str := TO_CHAR(NOW(), 'YYYY');
        month_str := TO_CHAR(NOW(), 'MM');
        
        SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 'FA-\d{4}-\d{2}-(\d+)') AS INT)), 0) + 1
        INTO next_num
        FROM invoices
        WHERE invoice_number LIKE 'FA-' || year_str || '-' || month_str || '-%';
        
        NEW.invoice_number := 'FA-' || year_str || '-' || month_str || '-' || LPAD(next_num::TEXT, 4, '0');
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for invoice number generation
CREATE TRIGGER generate_invoice_number_trigger
    BEFORE INSERT ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION generate_invoice_number();

-- Enable Row Level Security
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth setup)
-- Allow all operations for authenticated users (admin)
CREATE POLICY "Allow all for authenticated users" ON invoices
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE invoices;

-- =====================================================
-- SAMPLE DATA (Optional - remove in production)
-- =====================================================
-- INSERT INTO invoices (client_name, client_email, service_type, service_description, total_amount, due_date)
-- VALUES 
-- ('Aurora Labs', 'contact@auroralabs.com', 'Identité Visuelle', 'Création complète de l''identité visuelle incluant logo, charte graphique et supports de communication.', 150000, CURRENT_DATE + INTERVAL '30 days');
