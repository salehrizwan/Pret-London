import { Order, RegionCode } from "../types";
import { Check, MessageSquare, Copy, ArrowLeft, Download, ExternalLink, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

interface OrderSuccessProps {
  order: Order;
  currencySymbol: string;
  onReset: () => void;
}

export default function OrderSuccess({ order, currencySymbol, onReset }: OrderSuccessProps) {
  const [copied, setCopied] = useState(false);
  const [redirectStatus, setRedirectStatus] = useState<"pending" | "sent" | "blocked">("pending");

  // Compile beautifully-spaced plain text receipt for WhatsApp sending
  const isPakistan = order.country === "PK";
  const regionFlag = order.country === "PK" ? "🇵🇰 Pakistan" : order.country === "AE" ? "🇦🇪 UAE" : order.country === "US" ? "🇺🇸 USA" : "🇬🇧 UK";
  
  const itemsText = order.items
    .map((item) => `• ${item.quantity}x *${item.productName}* [Size: ${item.size}${item.withDupatta ? ", with Dupatta Addon" : ""}] - ${currencySymbol} ${item.price.toLocaleString()}`)
    .join("\n");

  const measurementsText = order.customMeasurements
    ? `*BESPOKE TAILORING MEASUREMENTS:*\n` +
      `• Bust: ${order.customMeasurements.bust || "Standard"}\n` +
      `• Waist: ${order.customMeasurements.waist || "Standard"}\n` +
      `• Hips: ${order.customMeasurements.hips || "Standard"}\n` +
      `• Shoulder: ${order.customMeasurements.shoulder || "Standard"}\n` +
      `• Sleeves: ${order.customMeasurements.sleeves || "Standard"}\n` +
      `• Length: ${order.customMeasurements.length || "Standard"}\n` +
      `• Alterations Note: ${order.customMeasurements.additionalDetails || "None"}\n`
    : `*TAILORING:* Standard Size Chart Fitted.\n`;

  const whatsappMessage = 
`🌟 *PRET STUDIO LONDON - LUXURY ORDER CONFIRMATION* 🌟
----------------------------------------------
*ORDER NUMBER:* \`${order.orderNumber}\`
*DATE:* ${new Date(order.date || "").toLocaleDateString()}
*CUSTOMER:* ${order.customerName}
*PHONE:* ${order.phone}
*SHIPPING ADDRESS:* ${order.address}, ${order.city}, ${order.state || ""}, ${order.postalCode || ""}
*REGION:* ${regionFlag}

*SELECTED DESIGN DESIGNS:*
${itemsText}

*TOTAL AMOUNT:* ${currencySymbol} ${order.totalPrice.toLocaleString()}
*PAYMENT MODE:* ${order.paymentMethod}
*PAYMENT STATUS:* ${order.paymentStatus}

----------------------------------------------
${measurementsText}
----------------------------------------------
${isPakistan ? "⚠️ *IMPORTANT:* Please attach the payment screenshot file you uploaded on the website along with sending this text." : ""}
Thank you for choosing PRET Studio London.`;

  const getWhatsAppUrl = () => {
    const encodedText = encodeURIComponent(whatsappMessage);
    return `https://api.whatsapp.com/send?phone=923006302285&text=${encodedText}`;
  };

  const handleSendWhatsApp = () => {
    const url = getWhatsAppUrl();
    window.open(url, "_blank", "noopener,noreferrer");
    setRedirectStatus("sent");
  };

  useEffect(() => {
    // Automatically trigger WhatsApp redirect after a short delay
    const timer = setTimeout(() => {
      try {
        const url = getWhatsAppUrl();
        const opened = window.open(url, "_blank", "noopener,noreferrer");
        if (!opened) {
          setRedirectStatus("blocked");
        } else {
          setRedirectStatus("sent");
        }
      } catch (e) {
        setRedirectStatus("blocked");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [order]);

  const handleCopyInvoice = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-16 text-center">
      {/* Visual Header Success indicator */}
      <div className="w-16 h-16 bg-[#C5A880]/15 rounded-full border border-[#C5A880] flex items-center justify-center mx-auto mb-6">
        <Check className="w-8 h-8 text-[#9D845F]" />
      </div>

      <span className="text-[10px] tracking-[0.3em] text-[#C5A880] uppercase font-semibold block mb-2">Order Confirmed</span>
      <h2 className="font-serif text-3xl md:text-4xl text-gray-900 font-light mb-4">
        Thank You for Your Order
      </h2>
      <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-md mx-auto mb-8">
        Your pre-order has been registered with our design atelier. To complete verification, please submit your invoice summary to our official WhatsApp order desk below.
      </p>

      {/* RENDER BEAUTIFIED DIGITAL INVOICE BOX */}
      <div className="bg-white border border-[#C5A880]/20 rounded-sm shadow-sm text-left p-6 md:p-8 mb-8 space-y-6">
        <div className="flex justify-between items-start border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-serif text-2xl text-gray-900 tracking-wide font-light">PRET STUDIO</h3>
            <span className="text-[10px] text-[#9D845F] tracking-widest uppercase block mt-1">LONDON</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] bg-[#C5A880]/15 text-[#9D845F] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {order.orderStatus}
            </span>
            <span className="text-xs text-gray-400 block mt-2">No. {order.orderNumber}</span>
          </div>
        </div>

        {/* Invoice Grid Details */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Client Details</span>
            <span className="font-semibold text-gray-800 block mt-1">{order.customerName}</span>
            <span className="text-gray-600 block mt-0.5">{order.phone}</span>
            <span className="text-gray-600 block mt-0.5">{order.email}</span>
          </div>
          <div>
            <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Delivery Atelier Destination</span>
            <span className="font-semibold text-gray-800 block mt-1">{regionFlag}</span>
            <span className="text-gray-600 block mt-0.5 leading-relaxed">{order.address}, {order.city}</span>
          </div>
        </div>

        {/* Items listing */}
        <div className="border-t border-gray-100 pt-4">
          <span className="text-gray-400 block uppercase tracking-wider text-[10px] mb-2">Selected Garment Details</span>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs">
                <div>
                  <span className="font-semibold text-gray-800 block">{item.productName}</span>
                  <span className="text-gray-500">Size: {item.size} • Qty: {item.quantity}</span>
                  {item.withDupatta && (
                    <span className="text-[10px] text-[#9D845F] font-semibold block mt-0.5">With custom luxury dupatta</span>
                  )}
                </div>
                <span className="font-serif font-bold text-gray-900">
                  {currencySymbol} {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tailoring details */}
        <div className="border-t border-gray-100 pt-4 text-xs">
          <span className="text-gray-400 block uppercase tracking-wider text-[10px] mb-2">Measurement Guide</span>
          {order.customMeasurements ? (
            <div className="grid grid-cols-3 gap-2 bg-[#F9F6F0] p-3 rounded-xs border border-[#C5A880]/10 text-[11px]">
              <div>Bust: <span className="font-semibold">{order.customMeasurements.bust || "N/A"}</span></div>
              <div>Waist: <span className="font-semibold">{order.customMeasurements.waist || "N/A"}</span></div>
              <div>Hips: <span className="font-semibold">{order.customMeasurements.hips || "N/A"}</span></div>
              <div>Shoulders: <span className="font-semibold">{order.customMeasurements.shoulder || "N/A"}</span></div>
              <div>Sleeves: <span className="font-semibold">{order.customMeasurements.sleeves || "N/A"}</span></div>
              <div>Length: <span className="font-semibold">{order.customMeasurements.length || "N/A"}</span></div>
              {order.customMeasurements.additionalDetails && (
                <div className="col-span-3 mt-1.5 pt-1.5 border-t border-gray-200/50 text-gray-500 italic">
                  Note: "{order.customMeasurements.additionalDetails}"
                </div>
              )}
            </div>
          ) : (
            <span className="text-gray-500 italic font-light">Custom Tailoring measurements were bypassed. Standard sizes selected.</span>
          )}
        </div>

        {/* Totals */}
        <div className="border-t border-gray-100 pt-4 flex justify-between items-baseline">
          <div>
            <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Payment Status</span>
            <span className="text-xs font-semibold text-[#9D845F] mt-1 block">{order.paymentStatus}</span>
          </div>
          <div className="text-right">
            <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Total Invoice</span>
            <span className="font-serif text-xl font-bold text-gray-900">
              {currencySymbol} {order.totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* WHATSAPP AUTOMATION STATUS BANNER & CTA BUTTONS */}
      <div className="mb-6">
        {redirectStatus === "pending" && (
          <div className="bg-[#FDFBF7] border border-amber-300 text-amber-800 text-xs py-3 px-4 rounded-sm flex items-center justify-center gap-2 animate-pulse mb-3">
            <RefreshCw className="w-4 h-4 animate-spin text-[#9D845F]" />
            <span>Connecting with design desk on WhatsApp automatically...</span>
          </div>
        )}
        {redirectStatus === "sent" && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-xs py-3 px-4 rounded-sm flex items-center justify-center gap-2 mb-3">
            <Check className="w-4 h-4 text-green-600" />
            <span>Order desk connection launched. Please hit send on WhatsApp.</span>
          </div>
        )}
        {redirectStatus === "blocked" && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs py-3 px-4 rounded-sm flex items-center justify-center gap-2 mb-3">
            <ExternalLink className="w-4 h-4 text-amber-600" />
            <span>Automatic redirect blocked by browser. Please click 'Send Order' below manually.</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleSendWhatsApp}
          className="w-full bg-[#1C1C1C] hover:bg-green-600 hover:text-white border border-[#C5A880]/30 hover:border-green-600 text-[#F9F6F0] text-sm tracking-widest uppercase font-semibold py-4 flex items-center justify-center gap-2.5 transition-all duration-300 rounded-sm shadow-md"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Send Order to WhatsApp</span>
          <ExternalLink className="w-4 h-4 text-white/50" />
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCopyInvoice}
            className="border border-gray-200 hover:border-black text-gray-700 text-xs tracking-wider uppercase font-medium py-3 rounded-sm flex items-center justify-center gap-1.5 transition-colors bg-white"
          >
            <Copy className="w-4 h-4" />
            <span>{copied ? "Copied!" : "Copy Receipt"}</span>
          </button>
          
          <button
            onClick={onReset}
            className="border border-gray-200 hover:border-black text-gray-700 text-xs tracking-wider uppercase font-medium py-3 rounded-sm flex items-center justify-center gap-1.5 transition-colors bg-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Store</span>
          </button>
        </div>
      </div>

      {isPakistan && (
        <p className="text-[11px] text-gray-400 mt-6 leading-relaxed max-w-sm mx-auto">
          * Note: Since you've chosen Pakistan region, our WhatsApp agent will check your 50% advance uploader receipt before confirming your couture production slot.
        </p>
      )}
    </div>
  );
}
