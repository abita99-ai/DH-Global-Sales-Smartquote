-- ============================================================================
-- DAIHAN Scientific Global B2B Sales Online - Supabase PostgreSQL Schema
-- Architecture Version: v2.0
-- Cost Objective: Free-Tier Compatible ($0 Infra Stack)
-- ============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Products Master Table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'DH-FON-050'
    model_no VARCHAR(128) NOT NULL, -- e.g. 'ThermoStable™ FON-50'
    cat_no VARCHAR(64) NOT NULL UNIQUE, -- e.g. 'DH.WON05050'
    name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL, -- 'heating', 'stirring', 'autoclaves', 'freezers'
    category_name VARCHAR(128) NOT NULL,
    applications TEXT[] NOT NULL DEFAULT '{}', -- ARRAY['bio', 'chemical', 'pharma']
    is_2026_new BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    description TEXT,
    specs JSONB NOT NULL DEFAULT '{}', -- Dynamic technical specs
    list_price_usd NUMERIC(10, 2), -- Hidden from unauthenticated sessions
    base_cbm VARCHAR(32), -- e.g. '0.38 CBM'
    gross_weight VARCHAR(32), -- e.g. '52 kg'
    lead_time VARCHAR(64) DEFAULT '2-3 Weeks',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Product Voltage & Plug Options Table
CREATE TABLE IF NOT EXISTS product_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id VARCHAR(64) REFERENCES products(id) ON DELETE CASCADE,
    option_type VARCHAR(32) NOT NULL, -- 'VOLTAGE' or 'PLUG'
    option_code VARCHAR(32) NOT NULL, -- 'V230', 'V120', 'PLUG-C', 'PLUG-G'
    option_label VARCHAR(128) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE
);

-- 4. Compatible Certified Accessories Table
CREATE TABLE IF NOT EXISTS product_accessories (
    id VARCHAR(64) PRIMARY KEY, -- 'ACC-FON-SH01'
    product_id VARCHAR(64) REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    part_no VARCHAR(64) NOT NULL,
    price_usd NUMERIC(10, 2),
    is_active BOOLEAN DEFAULT TRUE
);

-- 5. Authorized Agents (Pre-approved Distributors)
CREATE TABLE IF NOT EXISTS authorized_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    country VARCHAR(128) NOT NULL,
    city VARCHAR(128) NOT NULL,
    discount_rate NUMERIC(5, 2) NOT NULL DEFAULT 35.00, -- e.g. 38.00%
    partner_tier VARCHAR(64) DEFAULT 'Gold Certified Partner',
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. RFQ Master Submissions Table
CREATE TABLE IF NOT EXISTS rfq_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_no VARCHAR(64) UNIQUE NOT NULL, -- e.g. 'RFQ-20260927-4821'
    buyer_company VARCHAR(255) NOT NULL,
    buyer_email VARCHAR(255) NOT NULL,
    buyer_country VARCHAR(128) NOT NULL, -- Mandatory for routing
    buyer_city VARCHAR(128) NOT NULL,    -- Mandatory for routing
    buyer_role VARCHAR(128),
    target_delivery VARCHAR(128),
    special_notes TEXT,
    assigned_agent_id UUID REFERENCES authorized_agents(id) ON DELETE SET NULL,
    status VARCHAR(32) DEFAULT 'PENDING' NOT NULL, -- 'PENDING', 'QUOTE_SENT', 'COMPLETED', 'CANCELLED'
    google_sheets_synced BOOLEAN DEFAULT FALSE,
    telegram_notified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. RFQ Line Items Table
CREATE TABLE IF NOT EXISTS rfq_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id UUID REFERENCES rfq_requests(id) ON DELETE CASCADE,
    product_id VARCHAR(64) REFERENCES products(id),
    model_no VARCHAR(128) NOT NULL,
    cat_no VARCHAR(64) NOT NULL,
    selected_voltage VARCHAR(64) NOT NULL, -- e.g. '230V, 50/60Hz'
    selected_plug VARCHAR(64) NOT NULL,    -- e.g. 'Type C'
    selected_accessories TEXT[] DEFAULT '{}',
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    is_spec_verified BOOLEAN DEFAULT TRUE NOT NULL
);

-- 8. Row Level Security (RLS) Policies (Price Masking Enforcement)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfq_requests ENABLE ROW LEVEL SECURITY;

-- Public can read products, but price is computed or masked via API view
CREATE POLICY "Public Read Access Products" 
ON products FOR SELECT USING (true);

-- Anonymous users can INSERT RFQ, but cannot read others' RFQs
CREATE POLICY "Public Insert RFQ" 
ON rfq_requests FOR INSERT WITH CHECK (true);

-- Agents can only view their assigned RFQs
CREATE POLICY "Agent View Assigned RFQs" 
ON rfq_requests FOR SELECT USING (
    auth.uid() = assigned_agent_id
);
