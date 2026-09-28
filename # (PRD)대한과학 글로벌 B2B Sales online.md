# [PRD] DAIHAN Scientific Global B2B Product Exploration & Smart RFQ Portal
> **Document Version:** v2.0 (Final Architecture & Acceptance Criteria)  
> **Target System:** Mobile-First Responsive Web + PWA (Progressive Web App)  
> **Cost Objective:** $0 ~ Ultra-low monthly fixed infrastructure cost  
> **Development Scope:** Full-scope unified launch from Day 1  
> **Target Products:** DAIHAN Scientific 2026 Full Catalog & 2026 New Launches  
---
## 1. System Overview & Core Objectives
### 1.1 Project Summary
DAIHAN Scientific Global B2B Portal is a specialized product discovery and Request for Quote (RFQ) platform engineered for global distributors, regional dealers, and laboratory researchers worldwide.
### 1.2 Core Problem Statements & Business Goals
1. **Zero Specification Error:** Eliminate buyer confusion and configuration mistakes regarding laboratory equipment parameters (Voltage: 230V vs 120V, Plug types, chamber capacity, bundled accessories). Buyers must have 100% confidence in all technical specs before submitting an RFQ.
2. **Ultra-Fast Sales Response:** Automate internal pipelines to achieve instant notification to sales reps upon RFQ receipt, bypassing time-zone delays.
3. **Data Assetization & Lead CRM:** Automatically capture, tag, and structure buyer inquiries into Google Sheets and real-time BI dashboards.
4. **Global Partner Routing:** Collect precise buyer location data (Country & City) to route inquiries to the nearest authorized DAIHAN distributor.
---
## 2. Infrastructure & Cost Architecture ($0 ~ Low-Cost Stack)
The system MUST be built on free-tier / ultra-low-cost modern cloud services to ensure $0 fixed monthly server costs:
* **Front-end Hosting & Global CDN:** Cloudflare Pages or Vercel (Free Tier, global 100+ edge locations).
* **Backend / API Layer:** Cloudflare Workers, Vercel Serverless Functions, or Google Apps Script (GAS) Webhooks (Free Tier).
* **Primary Database:** Supabase or Firebase Free Tier (Encrypted PostgreSQL / NoSQL primary datastore).
* **Operations Database (Secondary Sync):** Google Sheets API (Real-time 2-way operational sync).
* **Real-time Notifications:** 
  * Telegram Bot API (100% Free, instant group/channel push).
  * Kakao Alimtalk (Business notification for Korean phone numbers, ~15 KRW/msg).
* **Analytics / BI:** Google Looker Studio (100% Free real-time dashboard).
---
## 3. Non-Functional Requirements (NFR)
### 3.1 Performance
* **First Contentful Paint (FCP):** < 1.0s globally (via Edge CDN caching).
* **Largest Contentful Paint (LCP):** < 1.8s globally.
* **PWA Offline Support:** Core 2026 catalog pages and product datasheets cached for offline review on tablets.
### 3.2 Security & Compliance
* **Data Encryption:** 100% HTTPS / TLS 1.3 enforced.
* **Price Masking:** Prices (digits) must NEVER be exposed in front-end network payloads (API responses) for unauthenticated users.
* **Anti-Spam:** Invisible reCAPTCHA v3 or Honeypot protection on all RFQ submission endpoints.
* **GDPR Compliance:** Mandatory explicit checkbox for privacy policy and marketing opt-in for international buyers.
### 3.3 Usability & Accessibility (a11y)
* **Touch Targets:** Minimum 48x48px on mobile/tablet screens.
* **i18n Architecture:** 100% English interface at launch, with all UI text strings extracted into JSON dictionary (`en.json`) for zero-effort future localization (Spanish, Chinese, etc.).
---
## 4. User Roles & Access Control Policy
| Role | Access Level | Permissions & Business Logic |
| :--- | :--- | :--- |
| **Guest / Potential Buyer** | Non-authenticated (Public) | - 100% open access to 2026 catalog, technical sheets, and 3D/drawings.<br>- **Price is 100% HIDDEN** (`Request for Quote` only).<br>- Mandatory RFQ fields: `Company`, `Country (Required)`, `City (Required)`, `Email (Required)`, `Role/Application`.<br>- **Mandatory Notice on RFQ Form:**<br>  > *"Your inquiry will be promptly handled by the nearest authorized DAIHAN distributor/partner."*<br>- Auto-generates guest tracking account upon RFQ submission. |
| **Authorized Global Agent** | Pre-approved Member Login | - Pre-registered by HQ ➔ Forced password reset on first login.<br>- **Display contract supply price / discount rate (%) upon login**.<br>- 1-Click re-quote from past RFQ history.<br>- Direct bulk download of CE/ISO certificates and marketing assets. |
| **Sales Admin** | Back-office / Notifications | - Receives instant Kakao Alimtalk + Telegram Bot push notifications.<br>- Accesses clean structured spec data to reply via corporate email (Outlook). |
---
## 5. Front-End UX & Multi-Path Search Architecture


                 [Buyer Enters Portal]
                             │
 ┌───────────────────────────┼───────────────────────────┐
 ▼                           ▼                           ▼
[Path 1: Category] [Path 2: Application] [Path 3: Direct/New]

Heating/Drying - Bio / Cell Culture - Direct Model Search
Stirring / Shaking - Chemical Synthesis - 2026 New Launches
Autoclaves / Freezers - Viscosity / Temp Range - Spec Parameter Filter └───────────────────────────┬───────────────────────────┘ ▼ [Single Final Spec Confirmation Sheet] ├─ 1. Fixed Base Specs: "I Acknowledge" Checkbox (Required) ├─ 2. Variable Options: Voltage (230V/120V) & Plug Type Selection ├─ 3. Bundled Accessories: Checked Compatible Parts Only └─ 4. Freight Notice: "Calculated upon final packing confirmation" ▼ [Add to Cart ➔ Submit RFQ]


---
## 6. End-to-End System Flowchart (Front-end to Back-end)
```mermaid
flowchart TD
    subgraph Frontend_Buyer ["1. Buyer Front-End Experience"]
        A["Buyer Enters Portal (Responsive / PWA)"] --> B{"3-Path Discovery"}
        B -->|Path 1| B1["Category Tree"]
        B -->|Path 2| B2["Research Application"]
        B -->|Path 3| B3["Model No / 2026 New"]
        B1 --> C["Final Spec Confirmation Sheet"]
        B2 --> C
        B3 --> C
        C --> C_Check["Acknowledge Base Spec + Select Voltage/Plug"]
        C_Check --> D["Submit RFQ (Country & City Mandatory)"]
    end
    subgraph Backend_Automation ["2. Automated Backend Pipeline"]
        D --> E["Primary DB (Supabase/Firebase) Persistent Store"]
        E --> F["Buyer Email: Auto-confirmation & Nearest Agent Notice"]
        E --> G["Google Sheets API: Real-time Row Insert"]
        G --> H1["Kakao Alimtalk: Instant Push to Sales Rep (+82)"]
        G --> H2["Telegram Bot: Instant Push to Sales Channel"]
        H1 --> I["Sales Rep Checks Structured Spec & Replies via Outlook"]
        H2 --> I
    end
    subgraph CRM_Analytics ["3. CRM & Intelligence"]
        G --> J["Buyer Email History Auto-aggregation"]
        G --> K["Auto-tagging: [Region_Distributor] vs [End-user]"]
        G --> L["Google Looker Studio: Real-time Live Dashboard"]
    end
7. Definition of Done (DoD) & Acceptance Test Criteria
The AI Developer / Engine must verify that ALL of the following 4 core test suites pass before concluding implementation:

Test Suite 1: Product Search & Error-Prevention UI
 All 3 search paths (Category, Application, Direct Model) properly navigate to the standardized Final Spec Confirmation Sheet.
 The [Add to RFQ / Cart] button is DISABLED until the buyer checks the "I have verified base specifications" checkbox.
 Selected Voltage (230V vs 120V) and Plug Type (Type C, G, B) are accurately preserved in the cart payload.
Test Suite 2: RFQ Form Validation & Routing Notice
 Form submission fails with inline validation if Country, City, Company Name, or Email is empty or invalid.
 The RFQ screen and auto-reply email clearly display the official notice: "Your inquiry will be promptly handled by the nearest authorized DAIHAN distributor/partner."
Test Suite 3: End-to-End Multi-Channel Notification Pipeline
 Submitting an RFQ triggers an atomic insert into the primary database and creates a new row in Google Sheets within 2 seconds.
 Both Kakao Alimtalk and Telegram Bot simultaneously deliver the notification containing: Buyer Country, City, Company, Requested Model Number(s), Voltage, and Quantity.
 Buyer receives an auto-confirmation email with an attached/embedded summary of the requested specs.
Test Suite 4: Price Masking & Role-based Pricing
 For unauthenticated sessions, zero price values exist in HTML DOM and network JSON responses.
 Logging in as an authorized Agent renders the custom discount percentage and baseline supply price.