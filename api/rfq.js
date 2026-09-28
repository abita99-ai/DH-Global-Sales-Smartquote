// ============================================================================
// Vercel Serverless Function: /api/rfq
// Handles Real-time RFQ Submission, Google Sheets Sync & Telegram Bot Dual-Push
// ============================================================================

export default async function handler(req, res) {
  // Set CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const payload = req.body;
    const { rfqNo, buyer, items, userType, telegramConfig, googleSheetUrl } = payload;

    // 1. Determine Telegram Credentials (from Env or Test Config)
    const botToken = telegramConfig?.botToken || process.env.TELEGRAM_BOT_TOKEN;
    const chatId = telegramConfig?.chatId || process.env.TELEGRAM_CHAT_ID;
    const sheetWebhook = googleSheetUrl || process.env.GOOGLE_SHEET_WEBHOOK_URL;

    let telegramResult = { status: 'SKIPPED', message: 'No Telegram credentials configured' };
    let googleSheetResult = { status: 'SKIPPED', message: 'No Google Sheet webhook configured' };

    // 2. Dispatch to Telegram Bot API if configured
    if (botToken && chatId) {
      const isAgent = userType === 'AUTHORIZED_AGENT';
      const userTag = isAgent ? '🏢 [AUTHORIZED AGENT RFQ]' : '👤 [POTENTIAL BUYER RFQ]';
      
      const itemsText = items.map((item, idx) => {
        return `  ${idx + 1}. *${item.modelNo}* (Cat. ${item.catNo})\n     └ Qty: *${item.qty}* | Volt: \`${item.voltage === 'V230' ? '230V, 50/60Hz' : '120V, 60Hz'}\` | Plug: \`${item.plug}\``;
      }).join('\n');

      const message = 
        `🚨 *${userTag}* 🚨\n\n` +
        `📋 *RFQ Ref:* \`${rfqNo}\`\n` +
        `📍 *Location:* ${buyer.city}, *${buyer.country}*\n` +
        `🏢 *Company / Org:* ${buyer.company}\n` +
        `📧 *Buyer Email:* \`${buyer.email}\`\n` +
        `💼 *Role / Type:* ${buyer.role || 'N/A'}\n` +
        `🔑 *Account Type:* ${isAgent ? 'Authorized Agent (Discount Applied)' : 'Potential Customer (Price Masked)'}\n\n` +
        `🔬 *Requested Equipment Specs:*\n${itemsText}\n\n` +
        `💬 *Special Notes:* ${buyer.notes || 'None'}\n\n` +
        `⚡ *Action Required:* Route to Nearest Representative or Reply via Outlook Quotation Template.`;

      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
          })
        });
        const tgJson = await tgRes.json();
        if (tgJson.ok) {
          telegramResult = { status: 'SUCCESS', message: 'Telegram notification delivered to chat ' + chatId };
        } else {
          telegramResult = { status: 'FAILED', error: tgJson.description };
        }
      } catch (tgErr) {
        telegramResult = { status: 'ERROR', error: tgErr.message };
      }
    }

    // 3. Dispatch to Google Sheets Apps Script Webhook if configured
    if (sheetWebhook) {
      try {
        const sheetRes = await fetch(sheetWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        googleSheetResult = { status: 'SUCCESS', message: 'Google Sheet row appended via Webhook' };
      } catch (sheetErr) {
        googleSheetResult = { status: 'ERROR', error: sheetErr.message };
      }
    }

    return res.status(200).json({
      success: true,
      rfqNo,
      timestamp: new Date().toISOString(),
      userType,
      telegram: telegramResult,
      googleSheets: googleSheetResult,
      serverMessage: 'RFQ processed by Vercel Serverless Gateway'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
