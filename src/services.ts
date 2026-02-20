import { Product } from './types';
import { AnalyticsService, formatCurrency } from './utils';

// --- MOCK PRODUCT DATA --- //
export const PRODUCTS: Product[] = [
    { id: 1, name: 'Sona Masoori Rice', priceINR: 5800, image: 'https://images.unsplash.com/photo-1586201375765-c124a275f05b?q=80&w=400&auto=format&fit=crop', description: 'Premium quality, aged Sona Masoori rice. Perfect for daily meals.' },
    { id: 2, name: 'Broken White Rice', priceINR: 3200, image: 'https://images.unsplash.com/photo-1512103869192-1f3f96f02d4d?q=80&w=400&auto=format&fit=crop', description: 'Economical choice for porridges and traditional dishes.' },
    { id: 3, name: 'Jai Sri Ram Premium Rice', priceINR: 6900, image: 'https://images.unsplash.com/photo-1589578228257-ca6418837a53?q=80&w=400&auto=format&fit=crop', description: 'Aromatic and flavorful, ideal for special occasions.' },
    { id: 4, name: 'Extra-Long Grain Basmati', priceINR: 11500, image: 'https://images.unsplash.com/photo-1603202976788-b43a504a5a5c?q=80&w=400&auto=format&fit=crop', description: 'The finest Basmati for biryani and pulao, aged for 2 years.' },
];

// --- EMAIL SERVICE (SIMULATED) --- //
export const EmailService = (() => {
    const sendOrderConfirmation = async (customerDetails: any, order: any) => {
        const emailBody = `
Dear ${customerDetails.name},

Thank you for your order with MKRM Rice!

We've successfully received your order #${order.id}, placed on ${order.date}.

Here is a summary of your order:
${order.items.map((item: any) => `- ${item.quantity} x ${item.name} (${formatCurrency(item.priceINR)})`).join('\n')}

Subtotal: ${formatCurrency(order.subtotal)}
Taxes (18% GST): ${formatCurrency(order.taxes)}
Total: ${formatCurrency(order.total)}

Shipping to:
${customerDetails.name}
${customerDetails.address}
${customerDetails.city}, ${customerDetails.state} ${customerDetails.zip}
India

Your order is being processed and will be shipped within 2 business days. You will receive another email with tracking information once it ships.

We appreciate your business!

Sincerely,
The MKRM Rice Team
`;
        await AnalyticsService.sendEvent({
            type: 'EMAIL_SENT',
            emailType: 'ORDER_CONFIRMATION',
            recipient: customerDetails.email,
            orderId: order.id,
            emailBody,
        });

        console.log("--- SIMULATED EMAIL SENT ---");
        console.log(`To: ${customerDetails.email}`);
        console.log(`Subject: Your MKRM Rice Order Confirmation #${order.id}`);
        console.log(emailBody);
        console.log("--- END SIMULATED EMAIL ---");
    };
    return { sendOrderConfirmation };
})();
