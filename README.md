# MSME Collect

> **"Turn unpaid invoices into evidence-ready action."**  
> *Alternative tagline: "From scattered documents to confident payment follow-ups."*

**FIRST COMMIT — BHARAT BUILDS TOUR 2026 (WeMakeDevs × AWS)**  
*Problem Statement: Finance — MSME Collect*

---

## 🚀 Overview

Small firms waste hundreds of hours manually assembling Purchase Orders, Invoices, Delivery Proofs, Bank Payment Records, and Email Correspondence when payments are delayed.

**MSME Collect** is an intelligent evidence-readiness and payment follow-up layer built natively on **Amazon Web Services (AWS)**. It extracts structured fields using **Amazon Textract**, detects cross-document discrepancies (such as partial shipments), evaluates evidence readiness scores, and generates context-aware payment follow-up emails via **Amazon Bedrock**.

---

## ✨ Key Features

- 🛡️ **Evidence Readiness Score (0–100%)**: Evaluates completion of the required 4-document checklist (PO, Invoice, Delivery Proof, Correspondence).
- 🔍 **AWS Textract Document Intelligence**: Automatically parses line items, quantities, total amounts, dates, and PO numbers from PDF uploads.
- 🤖 **Amazon Bedrock Evidence Reasoning**: Performs field-level comparison (e.g. 100 PO chairs ordered ↔ 100 invoiced ↔ 80 delivered -> 20 units discrepancy alert).
- ✉️ **AI Payment Follow-Up Generator**: Crafts context-aware follow-up email drafts with customized tone profiles (Polite & Firm, Reconciled Partial Billing, Formal Legal Notice).
- 📊 **Evidence Command Center (Dashboard)**: Dynamic KPI tracking for Outstanding, Overdue, Evidence Ready, and AI Attention Center alerts.
- ⚡ **Interactive AWS Architecture Canvas**: Live visualization of data flow across Amplify, Cognito, API Gateway, Lambda, S3, Textract, Bedrock, and DynamoDB.
- 🎨 **Visual Language & Floating Signature**: Futuristic Glassmorphism UI with floating animated PO cards, invoices, delivery receipts, and glowing AI connection nodes.
- 🔐 **Dual Database & Auth Adapter**: Operates locally in **DEMO MODE** (with intelligent rule-based fallback) and seamlessly connects to production AWS services when credentials are provided.

---

## 🏗️ AWS Cloud Architecture

```
React (Vite + Tailwind) 
  ↓
AWS Amplify Cloud Hosting
  ↓
Amazon Cognito (JWT & Google IdP)
  ↓
Amazon API Gateway
  ↓
AWS Lambda Functions
  ↓
├── Amazon S3 (Document Preservation) ──→ Amazon Textract (OCR Extraction)
├── Amazon Bedrock (AI Evidence Reasoning & Follow-up Draft)
└── Amazon DynamoDB / MongoDB (Audit Trail & Workspace Persistence)
```

---

## 🎬 3-Minute Hackathon Demo Scenario (ABC Furniture)

1. **Problem Statement**: Small businesses chase payments without verified evidence.
2. **Dashboard Command Center**: Overview of total outstanding, overdue invoices, and AI Attention Center.
3. **Inspect Overdue Invoice `INV-2026-1001`**: Customer XYZ Enterprises billed ₹50,000 for 100 chairs.
4. **Evidence Inspector**: Side-by-side document preview (PO #PO-8820: 100 chairs ↔ Invoice: 100 chairs ↔ POD: 80 chairs).
5. **AI Discrepancy Detection**: Amazon Bedrock flags **20 units difference** and recommends a reconciled billing update.
6. **Follow-Up Generation**: One-click AI follow-up email generation customized for partial delivery reconciliation.
7. **AWS Architecture Canvas**: Live interactive serverless node topology.

---

## 🛠️ Quick Start & Local Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed     # Populates ABC Furniture & XYZ Enterprises hackathon scenario data
npm run dev      # Starts API server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Starts web app on http://localhost:5173
```

### 4. Credentials
- **Demo Owner**: `demo@msmecollect.com` / `password123`
- **Demo Accountant**: `accountant@msmecollect.com` / `password123`

---

## ⚙️ Environment Variables

### Backend `.env`
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/msme_collect
JWT_SECRET=your_jwt_super_secret_key_change_in_production
JWT_EXPIRES_IN=7d

# AWS Configuration (Optional for DEMO MODE fallback)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
COGNITO_USER_POOL_ID=
COGNITO_CLIENT_ID=
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_AWS_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=
VITE_COGNITO_CLIENT_ID=
```

---

## 📄 Documentation Sitemap

- [`docs/architecture.md`](file:///c:/Users/1casa/OneDrive/Desktop/MSME%20Collect-2/docs/architecture.md): Deep dive into serverless architecture and multi-cloud adapters.
- [`docs/aws-setup.md`](file:///c:/Users/1casa/OneDrive/Desktop/MSME%20Collect-2/docs/aws-setup.md): Complete AWS setup guide for Textract, Bedrock, S3, Cognito, and DynamoDB.
- [`docs/aws-migration.md`](file:///c:/Users/1casa/OneDrive/Desktop/MSME%20Collect-2/docs/aws-migration.md): MongoDB to Amazon DynamoDB migration blueprint.
- [`docs/demo-script.md`](file:///c:/Users/1casa/OneDrive/Desktop/MSME%20Collect-2/docs/demo-script.md): Step-by-step 3-minute hackathon presentation script.
- [`docs/testing.md`](file:///c:/Users/1casa/OneDrive/Desktop/MSME%20Collect-2/docs/testing.md): Verification and testing guide.

---
*Built for First Commit — Bharat Builds Tour 2026 by WeMakeDevs & AWS.*
