---
layout: post
title:  "Deep-Dive Email Delivery Analysis with Azure Communication Services (ACS) and KQL"
date:   '2026-02-10 16:00:00 -0500'
categories: azure guides communication-services acs kql troubleshooting
author: blakedrumm
thumbnail: /assets/img/posts/acs-email-delivery-kql.png
toc: true

summary: 'This post walks through an advanced KQL query that analyzes Azure Communication Services (ACS) email delivery. By joining send and status logs, the query measures delivery latency, enriches sender and recipient data, classifies bounces, and translates SMTP and enhanced SMTP status codes into clear, human-readable explanations.'

keywords: azure, communication services, acs, email, kql, smtp, troubleshooting, observability
permalink: /blog/acs-email-delivery-analysis-kql/
---

## 💡 Introduction

Email troubleshooting in **:contentReference[oaicite:0]{index=0}** can be deceptively complex.

A message may appear to be sent successfully, yet arrive late, get quarantined, bounce with minimal explanation, or fail silently due to downstream mail server policies. While ACS exposes rich diagnostics in Azure Monitor, those signals are spread across multiple tables and often require correlation to tell a complete story.

This post introduces a **production-ready KQL query** that joins ACS email send and status logs to provide a **single, enriched view of email delivery behavior** — including latency, message characteristics, sender and recipient context, and clear interpretations of SMTP and enhanced SMTP failure codes.

---

## 📩 The Problem with Raw ACS Email Logs

Out of the box, ACS email diagnostics present a few challenges:

- Send and delivery status events live in **separate tables**
- SMTP codes are numeric and often unclear without protocol knowledge
- Enhanced SMTP codes are easy to miss or misinterpret
- Message size and attachment details are not immediately obvious
- Bounce behavior (hard vs. soft) requires manual interpretation
- Correlating events across systems is difficult without message IDs

When customers ask questions like:
- *“Why did this email bounce?”*
- *“Why did delivery take 30 seconds instead of 2?”*
- *“Is this a content issue, a mailbox issue, or a policy block?”*

You need more than raw logs — you need **context**.

---

## 🔍 What This Query Does

This KQL query was built to answer those questions directly.

At a high level, it:

- Joins **send events** with **final delivery status events**
- Measures **end-to-end delivery latency**
- Enriches results with sender, recipient, and message metadata
- Classifies bounces and failures
- Translates SMTP and enhanced SMTP codes into readable explanations

All results are returned in a **single, sortable dataset**.

---

## ⚙️ Data Sources Used

The query relies on two ACS diagnostic tables:

### 1️⃣ ACSEmailSendMailOperational
Used to capture:
- Send timestamp
- Message correlation ID
- Message size (in **megabytes**, not bytes)
- Attachment count
- Recipient counts (To, Cc, Bcc, unique)

### 2️⃣ ACSEmailStatusUpdateOperational
Used to capture:
- Final delivery status
- SMTP and enhanced SMTP status codes
- Sender identity
- Failure reason and message
- Bounce classification
- Recipient mail server details
- InternetMessageId for cross-system correlation

---

## ⏱️ Delivery Latency Measurement

The query calculates delivery latency using:

- `SendTime` (from send logs)
- `FinalStatusTime` (from status logs)

It then derives:
- `DurationMilliseconds`
- `DurationSeconds`

This makes it easy to:
- Identify delayed deliveries
- Compare performance across recipient domains
- Spot transient vs. systemic delays

---

## 📦 Message Characteristics and Size Handling

One common pitfall is assuming the ACS `Size` field is reported in bytes.

**It is not.**

This query correctly treats `Size` as **megabytes (MB)** and adds:
- A `MessageSizeCategory` field:
  - Tiny (<100KB)
  - Small (100KB–1MB)
  - Medium (1–5MB)
  - Large (5–10MB)
  - Very Large (>10MB)

Combined with attachment and recipient counts, this helps identify:
- Messages that may trigger size-based rejections
- Large fan-out sends with higher delivery latency

---

## 💥 Bounce Classification

The query explicitly categorizes bounce behavior:

- **Hard Bounce** – permanent failure (invalid mailbox, policy block, etc.)
- **Soft Bounce** – temporary failure (mailbox full, throttling, transient policy)
- **Not Applicable** – delivered successfully

This makes it trivial to separate:
- Retry-worthy failures
- Permanent delivery issues
- Clean deliveries

---

## 📜 SMTP and Enhanced SMTP Code Translation

Raw SMTP codes are not very helpful on their own.

This query maps:
- Standard SMTP status codes (e.g., `550`, `554`)
- Enhanced SMTP status codes (e.g., `5.1.1`, `5.7.1`)

Into **clear, human-readable explanations**, such as:
- *“Bad destination mailbox address (recipient doesn't exist)”*
- *“Rejected by policy (SPF/DKIM/DMARC/reputation)”*
- *“Temporary network issue; retry expected”*

Delivered messages automatically show:
- `<not applicable>` for SMTP fields

This removes ambiguity and speeds up root-cause analysis.

---

## 🌐 Recipient and Server Intelligence

The query extracts and surfaces:
- Recipient domain
- Recipient mail server hostname
- InternetMessageId

This allows you to:
- Group failures by destination domain
- Identify problematic recipient mail systems
- Correlate ACS activity with external mail logs or SIEM data

---

## 🧪 When to Use This Query

This query is ideal for:

- Investigating bounced or delayed emails
- Analyzing delivery performance trends
- Supporting customer escalations
- Validating ACS email configuration
- Understanding policy-based rejections
- Building workbooks or dashboards for email observability

---

## 🧠 Final Thoughts

Azure Communication Services provides excellent email diagnostics — but the real power comes from **correlating and enriching that data**.

This KQL query turns raw ACS logs into a structured, actionable dataset that answers the questions customers actually ask:
- *What happened to my email?*
- *Why did it fail?*
- *How long did it take?*
- *Is this temporary or permanent?*

If you work with ACS Email regularly, this query is a strong foundation for troubleshooting, reporting, and long-term monitoring.

---

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/acs-email-delivery-analysis-kql/)
