import { Order, Product, StoreSettings } from '../types';

export function formatWhatsAppOrderMessage(order: Order, settings: StoreSettings): string {
  const itemsText = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.name}* (x${item.quantity}) - ৳${(item.price * item.quantity).toLocaleString()}${
          item.color ? ` [Color: ${item.color}]` : ''
        }${item.size ? ` [Size: ${item.size}]` : ''}`
    )
    .join('\n');

  const paymentMethodLabel = {
    bkash: `bKash (TrxID: ${order.paymentDetails.trxId || 'N/A'}, From: ${order.paymentDetails.senderNumber || 'N/A'})`,
    nagad: `Nagad (TrxID: ${order.paymentDetails.trxId || 'N/A'}, From: ${order.paymentDetails.senderNumber || 'N/A'})`,
    rocket: `Rocket (TrxID: ${order.paymentDetails.trxId || 'N/A'}, From: ${order.paymentDetails.senderNumber || 'N/A'})`,
    cod: 'Cash on Delivery (COD)',
  }[order.paymentMethod];

  return `*🛍️ NEW ORDER - ${settings.storeName.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━━━
📋 *Order ID:* \`${order.id}\`
👤 *Customer:* ${order.customerName}
📞 *Phone:* ${order.phone}${order.alternatePhone ? ` / ${order.alternatePhone} (বিকল্প)` : ''}
📍 *Address:* ${order.fullAddress}, ${order.district}, ${order.division}
${order.notes ? `📝 *Note:* ${order.notes}\n` : ''}━━━━━━━━━━━━━━━━━━━━━━
🛒 *ORDER ITEMS:*
${itemsText}
━━━━━━━━━━━━━━━━━━━━━━
💵 *Subtotal:* ৳${order.subtotal.toLocaleString()}
🚚 *Delivery:* ৳${order.deliveryFee.toLocaleString()} (${order.division.toLowerCase() === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})
${order.discount > 0 ? `🏷️ *Discount:* -৳${order.discount.toLocaleString()}\n` : ''}💰 *TOTAL AMOUNT: ৳${order.total.toLocaleString()}*
💳 *Payment:* ${paymentMethodLabel}
━━━━━━━━━━━━━━━━━━━━━━
📅 Date: ${new Date(order.createdAt).toLocaleString()}
🔍 Track at: https://mhbdmart.com/track/${order.id}

Thank you for choosing ${settings.storeName}! 🇧🇩`;
}

export function toInternationalBdPhone(phone: string): string {
  const clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('880')) return clean;
  if (clean.startsWith('0')) return `88${clean}`;
  return `880${clean}`;
}

export function getWhatsAppOrderUrl(order: Order, settings: StoreSettings): string {
  const message = formatWhatsAppOrderMessage(order, settings);
  const waNumber = toInternationalBdPhone(settings.whatsappNumber);
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppProductInquiryUrl(product: Product, settings: StoreSettings): string {
  const waNumber = toInternationalBdPhone(settings.whatsappNumber);
  const message = `Hello ${settings.storeName}, I am interested in purchasing:\n\n*${product.name}*\nPrice: ৳${product.price.toLocaleString()}\nSKU: ${product.sku}\nLink: https://mhbdmart.com/product/${product.id}\n\nPlease let me know if it is available in stock. Thank you!`;
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppCustomerStatusUpdateUrl(order: Order, settings: StoreSettings): string {
  const internationalPhone = toInternationalBdPhone(order.phone);

  const statusLabels: Record<string, string> = {
    pending: 'Order Received & Pending Verification',
    processing: 'Confirmed & Being Packed',
    shipped: `Dispatched with ${order.courierName || 'Courier Partner'}${order.courierTrackingCode ? ` (Tracking: ${order.courierTrackingCode})` : ''}`,
    delivered: 'Successfully Delivered! Enjoy your purchase.',
    cancelled: 'Order has been cancelled.',
  };

  const message = `Dear *${order.customerName}*,\n\nYour order *#${order.id}* from *${settings.storeName}* has been updated:\n\n📦 *Status:* ${statusLabels[order.status] || order.status.toUpperCase()}\n💰 *Total Amount:* ৳${order.total.toLocaleString()}\n\nTrack your order anytime: https://mhbdmart.com/track/${order.id}\n\nFor queries, reply to this chat or call ${settings.phone}.`;

  return `https://wa.me/${internationalPhone}?text=${encodeURIComponent(message)}`;
}

