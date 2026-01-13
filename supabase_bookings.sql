-- Create bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('google_meet', 'whatsapp')),
    contact_info VARCHAR(255) NOT NULL, -- Email for Meet, Phone for WhatsApp
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, cancelled
    client_name VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy (Open for public create)
CREATE POLICY "Enable insert for everyone" ON bookings FOR INSERT WITH CHECK (true);

-- Policy (Read for admin only - simulating public read for dev if needed, typically authenticated)
CREATE POLICY "Enable read for authenticated users" ON bookings FOR SELECT USING (auth.role() = 'anon' OR auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON bookings FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON bookings FOR DELETE USING (auth.role() = 'authenticated');
