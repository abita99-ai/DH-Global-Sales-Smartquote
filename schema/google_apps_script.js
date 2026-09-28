/**
 * ============================================================================
 * DAIHAN Scientific Global B2B Sales Online - Google Apps Script (GAS) Webhook
 * Automated Google Sheet Row Insertion + Telegram Bot Real-time Push Notification
 * ============================================================================
 */

// Configuration Constants
const TELEGRAM_BOT_TOKEN = "YOUR_TELEGRAM_BOT_TOKEN"; // Telegram @BotFather Token
const TELEGRAM_CHAT_ID = "YOUR_SALES_CHAT_ID";        // Telegram Channel or Group Chat ID
const SHEET_NAME = "RFQ_Master_Ledger";

/**
 * Webhook POST Endpoint for Supabase / Web Front-end
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // 1. Insert Row into Google Sheets
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) 
                  || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    const submittedAt = data.submittedAt || new Date().toISOString();
    const rfqNo = data.rfqNo;
    const company = data.buyer.company;
    const email = data.buyer.email;
    const country = data.buyer.country;
    const city = data.buyer.city;
    const role = data.buyer.role || "N/A";
    const notes = data.buyer.notes || "";
    
    // Format Items Summary
    const itemsSummary = data.items.map(item => {
      return `[${item.modelNo}] (Qty: ${item.qty}, Volt: ${item.voltage}, Plug: ${item.plug})`;
    }).join("\n");

    // Google Sheet Master Column Structure:
    // [1] Date | [2] RFQ No | [3] Status | [4] Country | [5] City | [6] Company | [7] Email | [8] Role | [9] Requested Items | [10] Notes | [11] Sales Rep Quote Date
    sheet.appendRow([
      submittedAt,
      rfqNo,
      "PENDING",       // Status
      country,
      city,
      company,
      email,
      role,
      itemsSummary,
      notes,
      ""               // Sales Rep Reply Timestamp (Updated after Outlook response)
    ]);

    // 2. Dispatch Instant Telegram Bot Notification
    sendTelegramNotification(data);

    return ContentService.createTextOutput(JSON.stringify({
      status: "SUCCESS",
      rfqNo: rfqNo,
      message: "Row inserted and Telegram notified successfully."
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "ERROR",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Send Formatted Markdown Push Message to Telegram Channel/Group
 */
function sendTelegramNotification(payload) {
  const itemsText = payload.items.map((item, idx) => {
    return `  ${idx + 1}. *${item.modelNo}* (Cat. ${item.catNo})\n     └ Qty: *${item.qty}* | Volt: \`${item.voltage}\` | Plug: \`${item.plug}\``;
  }).join("\n");

  const message = 
    `🚨 *[NEW GLOBAL RFQ RECEIVED]* 🚨\n\n` +
    `📋 *RFQ Ref:* \`${payload.rfqNo}\`\n` +
    `📍 *Location:* ${payload.buyer.city}, *${payload.buyer.country}*\n` +
    `🏢 *Company:* ${payload.buyer.company}\n` +
    `📧 *Buyer Email:* \`${payload.buyer.email}\`\n` +
    `💼 *Role:* ${payload.buyer.role || "N/A"}\n\n` +
    `🔬 *Requested Equipment Specs:*\n${itemsText}\n\n` +
    `💬 *Notes:* ${payload.buyer.notes || "None"}\n\n` +
    `⚡ *Action Required:* Check Google Sheets & Reply via Outlook Quotation Template.`;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const postOptions = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "Markdown"
    })
  };

  UrlFetchApp.fetch(url, postOptions);
}
