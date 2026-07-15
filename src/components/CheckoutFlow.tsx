import React, { useState, useRef } from "react";
import { Order, BasketItem, RegionCode } from "../types";
import { CreditCard, UploadCloud, ChevronRight, CheckCircle, Smartphone, MapPin, Sparkles, Scale } from "lucide-react";
import { REGIONS } from "./RegionSelection";

interface CheckoutFlowProps {
  basketItems: BasketItem[];
  regionCode: RegionCode;
  currencySymbol: string;
  totalAmount: number;
  onOrderSubmit: (orderData: Order) => Promise<void>;
  isSubmitting: boolean;
  onRegionChange?: (code: RegionCode) => void;
}

export default function CheckoutFlow({
  basketItems,
  regionCode,
  currencySymbol,
  totalAmount: initialTotalAmount,
  onOrderSubmit,
  isSubmitting,
  onRegionChange
}: CheckoutFlowProps) {
  // Main form fields
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Pakistan payment channel fields
  const [pkPaymentChannel] = useState<"EasyPaisa" | "JazzCash" | "Bank Transfer">("Bank Transfer");
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState<string>("");

  // International payment states
  const [intlPaymentChannel] = useState<"card" | "paypal" | "applepay">("card");
  const [cardNumber] = useState("");
  const [cardExpiry] = useState("");
  const [cardCvv] = useState("");

  // Optional Custom Tailoring Measurements
  const [isCustomTailored, setIsCustomTailored] = useState(false);
  const [bust, setBust] = useState("");
  const [waist, setWaist] = useState("");
  const [hips, setHips] = useState("");
  const [shoulder, setShoulder] = useState("");
  const [sleeves, setSleeves] = useState("");
  const [dressLength, setDressLength] = useState("");
  const [customNotes, setCustomNotes] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to resolve localized price for an item
  const getBasketItemPrice = (item: BasketItem) => {
    const basePrice = item.product.prices[regionCode] !== undefined ? item.product.prices[regionCode] : item.product.prices["PK"];
    const dupattaPrice = (item.withDupatta && item.product.dupattaAddon)
      ? (item.product.dupattaAddon.prices[regionCode] !== undefined ? item.product.dupattaAddon.prices[regionCode] : item.product.dupattaAddon.prices["PK"])
      : 0;
    return basePrice + dupattaPrice;
  };

  const totalAmount = basketItems.reduce((acc, curr) => acc + (getBasketItemPrice(curr) * curr.quantity), 0);

  // Shipping Fee calculation based on user requests
  let shippingFee = 0;
  if (regionCode === "GB") {
    shippingFee = 30;
  } else if (regionCode === "AE") {
    shippingFee = 110;
  } else if (regionCode === "US") {
    shippingFee = 95;
  } else if (regionCode === "PK") {
    shippingFee = 0;
  }

  const isPakistan = regionCode === "PK";
  const grandTotal = totalAmount + shippingFee;
  const requiredPaymentRate = isPakistan ? 0.5 : 1.0;
  const paymentRequiredAmount = (totalAmount * requiredPaymentRate) + (isPakistan ? 0 : shippingFee);

  // File upload change handler
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !email || !phone || !address || !city) {
      alert("Please fill in all core billing and delivery details.");
      return;
    }

    if (!screenshotPreview) {
      alert(isPakistan 
        ? "Please upload your 50% advance bank transfer receipt to proceed." 
        : "Please upload your international bank transfer/remittance receipt to proceed."
      );
      return;
    }

    const orderItems = basketItems.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      size: item.size,
      quantity: item.quantity,
      withDupatta: item.withDupatta,
      price: getBasketItemPrice(item)
    }));

    const orderPayload: Order = {
      customerName,
      email,
      phone,
      country: regionCode,
      address,
      city,
      state,
      postalCode,
      items: orderItems,
      totalPrice: grandTotal,
      paymentMethod: "Direct Bank Transfer (HBL)",
      paymentStatus: isPakistan ? "50% Advance - Screenshot Uploaded" : "100% Full Payment - Screenshot Uploaded",
      orderStatus: "Pending Atelier Verification",
      screenshotUrl: screenshotPreview || undefined,
      customMeasurements: isCustomTailored ? {
        bust,
        waist,
        hips,
        shoulder,
        sleeves,
        length: dressLength,
        additionalDetails: customNotes
      } : undefined
    };

    onOrderSubmit(orderPayload);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-16">
      
      {/* DIRECT REGION & CURRENCY SELECTOR */}
      <div className="mb-8 bg-[#FDFBF7] border border-[#C5A880]/30 p-5 rounded-xs text-left">
        <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#9D845F] font-semibold mb-3">
          Select Delivery & Currency Region
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(["PK", "AE", "US", "GB"] as const).map((code) => {
            const reg = REGIONS[code];
            const isSelected = regionCode === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => onRegionChange?.(code)}
                className={`flex items-center justify-between p-3 border transition-all rounded-xs text-left ${
                  isSelected
                    ? "border-[#9D845F] bg-[#1C1C1C] text-white shadow-xs"
                    : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl leading-none">{reg.flag}</span>
                  <div className="overflow-hidden">
                    <span className="text-xs font-semibold block uppercase tracking-wider truncate">{reg.name}</span>
                    <span className="text-[10px] text-gray-400 font-light block mt-0.5">{reg.currency} ({reg.currencySymbol})</span>
                  </div>
                </div>
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#C5A880] shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        
        {/* LEFT FORM: Core billing, Custom sizing, Payments (8 columns) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
          
          {/* SECTION 1: Customer info */}
          <div className="bg-white border border-[#C5A880]/15 p-6 rounded-xs">
            <h3 className="font-serif text-xl text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#C5A880]/10 flex items-center justify-center text-xs font-serif text-[#9D845F]">1</span>
              <span>Delivery & Shipping Information</span>
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full border border-gray-200 focus:border-[#C5A880] p-2.5 text-sm rounded-xs outline-none bg-white transition-colors"
                    placeholder="e.g. Amina Khan"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Contact Number (WhatsApp Preferred) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-200 focus:border-[#C5A880] p-2.5 text-sm rounded-xs outline-none bg-white transition-colors"
                    placeholder="e.g. +92 300 1234567 or +44 ..."
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 focus:border-[#C5A880] p-2.5 text-sm rounded-xs outline-none bg-white transition-colors"
                  placeholder="e.g. amina@example.com"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Complete Shipping Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-gray-200 focus:border-[#C5A880] p-2.5 text-sm rounded-xs outline-none bg-white transition-colors"
                  placeholder="House, Street, Area name..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-gray-200 focus:border-[#C5A880] p-2.5 text-sm rounded-xs outline-none bg-white transition-colors"
                    placeholder="Lahore / Dubai / London"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">State / Province</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full border border-gray-200 focus:border-[#C5A880] p-2.5 text-sm rounded-xs outline-none bg-white transition-colors"
                    placeholder="e.g. Punjab / England"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">ZIP / Postal Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full border border-gray-200 focus:border-[#C5A880] p-2.5 text-sm rounded-xs outline-none bg-white transition-colors"
                    placeholder="e.g. 54000 / SW1A 1AA"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Custom Couture Measurements (Optional) */}
          <div className="bg-white border border-[#C5A880]/15 p-6 rounded-xs">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <h3 className="font-serif text-xl text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#C5A880]/10 flex items-center justify-center text-xs font-serif text-[#9D845F]">2</span>
                <span>Bespoke Custom Fitting (Optional)</span>
              </h3>
              
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsCustomTailored(!isCustomTailored)}>
                <span className="text-xs text-[#9D845F] font-medium tracking-wide uppercase">Configure Fitting</span>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${isCustomTailored ? "bg-[#9D845F]" : "bg-gray-200"}`}>
                  <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.25 transition-all ${isCustomTailored ? "right-0.5" : "left-0.5"}`}></div>
                </div>
              </div>
            </div>

            {isCustomTailored ? (
              <div className="space-y-4">
                <p className="text-xs text-[#9D845F] leading-relaxed flex items-center gap-1.5 font-light bg-[#C5A880]/5 p-3 rounded-xs border border-[#C5A880]/15">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Provide your custom sizing specifications. Our master tailors will hand-cut and customize the dress according to these exact guidelines. Leave any fields blank to use your standard chosen size.</span>
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Bust (inches)</label>
                    <input
                      type="text"
                      placeholder="e.g. 36"
                      value={bust}
                      onChange={(e) => setBust(e.target.value)}
                      className="w-full border border-gray-200 focus:border-[#C5A880] p-2 text-sm rounded-xs outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Waist (inches)</label>
                    <input
                      type="text"
                      placeholder="e.g. 29"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      className="w-full border border-gray-200 focus:border-[#C5A880] p-2 text-sm rounded-xs outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Hips (inches)</label>
                    <input
                      type="text"
                      placeholder="e.g. 39"
                      value={hips}
                      onChange={(e) => setHips(e.target.value)}
                      className="w-full border border-gray-200 focus:border-[#C5A880] p-2 text-sm rounded-xs outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Shoulder Width (inches)</label>
                    <input
                      type="text"
                      placeholder="e.g. 14"
                      value={shoulder}
                      onChange={(e) => setShoulder(e.target.value)}
                      className="w-full border border-gray-200 focus:border-[#C5A880] p-2 text-sm rounded-xs outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Sleeves Length (inches)</label>
                    <input
                      type="text"
                      placeholder="e.g. 21"
                      value={sleeves}
                      onChange={(e) => setSleeves(e.target.value)}
                      className="w-full border border-gray-200 focus:border-[#C5A880] p-2 text-sm rounded-xs outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Dress Length (inches)</label>
                    <input
                      type="text"
                      placeholder="e.g. 46"
                      value={dressLength}
                      onChange={(e) => setDressLength(e.target.value)}
                      className="w-full border border-gray-200 focus:border-[#C5A880] p-2 text-sm rounded-xs outline-none bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Additional Alterations / Styling requests</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Please increase sleeve hem embroidery, or shorten slit by 2 inches..."
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    className="w-full border border-gray-200 focus:border-[#C5A880] p-2.5 text-sm rounded-xs outline-none bg-white resize-none"
                  ></textarea>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                Standard fitting selected. If you wish to send specific body measurements for a custom cut, toggle the switch above.
              </p>
            )}
          </div>

          {/* SECTION 3: Secure Direct Bank Transfer Verification */}
          <div className="bg-white border border-[#C5A880]/15 p-6 rounded-xs space-y-6">
            <h3 className="font-serif text-xl text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#C5A880]/10 flex items-center justify-center text-xs font-serif text-[#9D845F]">3</span>
              <span>Secure Direct Bank Transfer</span>
            </h3>

            {/* Price breakdown summary card */}
            <div className="bg-[#1C1C1C] text-white p-5 rounded-xs border border-[#C5A880]/30 space-y-4">
              <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
                <div>
                  <span className="text-[9px] tracking-[0.25em] text-[#C5A880] uppercase block">Atelier Sizing & Policy</span>
                  <h4 className="font-serif text-base font-light mt-0.5">
                    {isPakistan ? "50% Advance Booking Deposit Required" : "100% Full Pre-Order Payment Required"}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] block text-white/50 uppercase">PAYABLE NOW</span>
                  <span className="font-serif text-xl font-semibold text-[#D4AF37]">
                    {currencySymbol} {paymentRequiredAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Quick totals breakdown */}
              <div className="text-xs space-y-1.5 text-gray-300 font-light">
                <div className="flex justify-between">
                  <span>Outfits Subtotal:</span>
                  <span className="font-mono">{currencySymbol} {totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping & Handling Fee:</span>
                  <span className="font-mono">{shippingFee > 0 ? `${currencySymbol} ${shippingFee}` : "Free"}</span>
                </div>
                <div className="flex justify-between text-white font-normal pt-1.5 border-t border-white/5">
                  <span>Grand Total Order Cost:</span>
                  <span className="font-mono">{currencySymbol} {grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Official HBL Bank Transfer Details Box */}
            <div className="bg-[#FDFBF7] p-5 border border-[#C5A880]/20 rounded-xs space-y-3.5 text-left">
              <div className="bg-[#C5A880]/10 border border-[#C5A880]/20 p-2.5 rounded-xs text-[10px] text-[#9D845F] uppercase tracking-wider font-semibold">
                Official Bank Account - 100% Secure Direct
              </div>
              <div className="text-xs space-y-2 text-gray-700">
                <p className="flex justify-between border-b border-gray-150 pb-1.5">
                  <span className="text-gray-400">Bank Name:</span> 
                  <span className="font-semibold text-gray-900">Habib Bank Limited (HBL)</span>
                </p>
                <p className="flex justify-between border-b border-gray-150 pb-1.5">
                  <span className="text-gray-400">Account Title:</span> 
                  <span className="font-semibold text-gray-900">Ghumesa Saad</span>
                </p>
                <p className="flex justify-between border-b border-gray-150 pb-1.5">
                  <span className="text-gray-400">Account Number:</span> 
                  <span className="font-semibold text-gray-900">12667900578803</span>
                </p>
                <p className="flex justify-between border-b border-gray-150 pb-1.5">
                  <span className="text-gray-400">Bank Country:</span> 
                  <span className="font-semibold text-gray-900">Pakistan</span>
                </p>
                <p className="flex justify-between border-b border-gray-150 pb-1.5">
                  <span className="text-gray-400">International IBAN Number:</span> 
                  <span className="font-semibold text-gray-900">PK74HABB0012667900578803</span>
                </p>
              </div>

              <div className="pt-2 text-[10px] text-gray-500 leading-relaxed italic border-t border-gray-150">
                <strong>International Transfer Instruction:</strong> Since the destination bank account is located in Pakistan, please make sure to specify <strong>Pakistan</strong> as the recipient country when initiating your wire transfer or international remittance (such as through standard bank transfer, Wise, Remitly, etc.).
              </div>
            </div>

            {/* Screenshot Verification File Uploader */}
            <div className="space-y-3">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest block text-left">
                Upload Payment Screenshot / Transfer Receipt (Required) *
              </span>
              
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#C5A880]/30 hover:border-[#C5A880] p-6 text-center cursor-pointer bg-[#FDFBF7] transition-all rounded-xs flex flex-col items-center justify-center gap-2"
              >
                <UploadCloud className="w-8 h-8 text-[#9D845F]" />
                <span className="text-xs text-gray-600 font-medium">Click to select screenshot or drag & drop</span>
                <span className="text-[10px] text-gray-400">PNG, JPG, or PDF up to 5MB</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleScreenshotChange}
                />
              </div>

              {/* Screenshot Thumbnail Preview */}
              {screenshotPreview && (
                <div className="p-3 bg-[#C5A880]/5 border border-[#C5A880]/20 rounded-xs flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img src={screenshotPreview} alt="Slip thumbnail" className="w-12 h-16 object-contain bg-white border border-gray-150 rounded-xs shrink-0" referrerPolicy="no-referrer" />
                    <div className="truncate text-left">
                      <span className="text-xs font-semibold text-gray-800 block truncate">{screenshotName}</span>
                      <span className="text-[10px] text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Checked & Loaded
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setScreenshotPreview(null); setScreenshotName(""); }}
                    className="text-xs text-red-600 font-semibold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Secure Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-[#1C1C1C] hover:bg-[#C5A880] text-white text-xs md:text-sm tracking-widest uppercase font-semibold py-4 transition-all duration-300 rounded-xs flex items-center justify-center gap-2 shadow-xs ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <span>Verifying and compiling Atelier order...</span>
            ) : (
              <>
                <span>Confirm Order & Prepare Invoice</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* RIGHT INVOICE BAR: Basket summaries, items descriptions, policy rules (4 columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#C5A880]/15 p-6 rounded-xs">
            <h4 className="font-serif text-lg text-gray-900 pb-3 mb-4 border-b border-gray-100">
              Your Selection Summary
            </h4>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {basketItems.map((item) => (
                <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-16 object-contain bg-white rounded-xs border border-gray-100"
                  />
                  <div className="flex-1 text-left">
                    <h5 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">{item.product.name}</h5>
                    <p className="text-[10px] text-gray-400 mt-0.5">SIZE: {item.size} • QTY: {item.quantity}</p>
                    {item.withDupatta && (
                      <p className="text-[9px] text-[#9D845F] font-medium mt-0.5">With {item.product.dupattaAddon?.name}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-serif font-bold text-gray-900">
                      {currencySymbol} {(getBasketItemPrice(item) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations summaries */}
            <div className="pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal ({basketItems.length} items)</span>
                <span className="font-medium text-gray-900">{currencySymbol} {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Standard Express Shipping</span>
                <span className="font-medium text-gray-900">
                  {shippingFee > 0 ? `${currencySymbol} ${shippingFee}` : "Complimentary (Free)"}
                </span>
              </div>
              <div className="flex justify-between text-base font-serif font-semibold text-gray-900 pt-4 border-t border-gray-100">
                <span>Total Amount Due</span>
                <span>{currencySymbol} {grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Legal policy summaries */}
          <div className="bg-[#F9F6F0] border border-[#C5A880]/15 p-5 rounded-xs space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-gray-900 font-semibold flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#9D845F]" />
              <span>Couture Production Policies</span>
            </h4>
            
            <ul className="text-[11px] text-gray-600 space-y-2.5 leading-relaxed list-disc list-inside">
              <li>
                <span className="font-semibold text-gray-900">Custom Handiwork:</span> Every PRET Studio outfit is custom sewn and decorated entirely by hand.
              </li>
              <li>
                <span className="font-semibold text-gray-900">Payment Terms:</span> {isPakistan ? "50% advance deposit is required. Remaining 50% payable upon outfit readiness check and tracking confirmation." : "100% full advance payment is required for international delivery."}
              </li>
              <li>
                <span className="font-semibold text-gray-900">Refund/Cancellation:</span> Because these designs are custom-made according to bespoke measurements and pre-orders, orders cannot be cancelled or refunded after confirmation.
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
