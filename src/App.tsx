import React, { useState, useEffect } from "react";
import { Product, BasketItem, Order, Review, RegionCode } from "./types";
import { REGIONS } from "./components/RegionSelection";
import { fallbackProducts, fallbackReviews } from "./staticData";

// Sub-components
import OpeningAnimation from "./components/OpeningAnimation";
import RegionSelection from "./components/RegionSelection";
import ProductCard from "./components/ProductCard";
import ProductDetails from "./components/ProductDetails";
import CheckoutFlow from "./components/CheckoutFlow";
import OrderSuccess from "./components/OrderSuccess";
import StaffPortal from "./components/StaffPortal";

// Icons from lucide-react
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  X,
  Star,
  ChevronRight,
  Shield,
  HelpCircle,
  Truck,
  RotateCcw,
  Menu,
  Instagram
} from "lucide-react";

import { motion, AnimatePresence } from "motion/react";

const REGIONAL_HERO_CONFIG: Record<RegionCode, { image: string; title: string; subtitle: string; label: string }> = {
  PK: {
    image: "/pakistan_badshahi_girl.jpg",
    title: "Handmade",
    subtitle: "Counter and Luxury Pre-order",
    label: "Multan Atelier • Pure Hand Embroidery"
  },
  AE: {
    image: "/dubai.jpg",
    title: "Dubai Atelier",
    subtitle: "Luxury Pre-order Couture",
    label: "Dubai Marina & Gulf Shipments • Secure HBL Remittance"
  },
  US: {
    image: "/usa.jpg",
    title: "USA Atelier",
    subtitle: "Premium Custom Sizing & Fit",
    label: "North America Shipments • Complete Tailoring Control"
  },
  GB: {
    image: "/london.jpg",
    title: "London Atelier",
    subtitle: "High Fashion Bespoke Couture",
    label: "London Flagship • Express Courier Shipping"
  }
};

export default function App() {
  // Opening & region selection states
  const [introActive, setIntroActive] = useState<boolean>(true);
  const [regionSelected, setRegionSelected] = useState<boolean>(false);
  const [currentRegionCode, setCurrentRegionCode] = useState<RegionCode>("PK");
  const [detectedHomeRegionCode, setDetectedHomeRegionCode] = useState<RegionCode>("PK");
  const [dismissedNotice, setDismissedNotice] = useState<boolean>(false);

  // Core navigation states
  const [currentTab, setCurrentTab] = useState<string>("home"); // home | shop | new-arrivals | custom-orders | reviews | staff-portal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutState, setCheckoutState] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Keep track of scroll position before opening product details
  const scrollPositionRef = React.useRef<number>(0);

  const handleSelectProduct = (product: Product | null, keepScroll = true) => {
    if (product) {
      if (!selectedProduct) {
        scrollPositionRef.current = window.scrollY;
      }
      window.scrollTo(0, 0);
    } else {
      if (!keepScroll) {
        scrollPositionRef.current = 0;
      }
    }
    setSelectedProduct(product);
  };

  // Restore scroll position when returning from product details
  useEffect(() => {
    if (!selectedProduct && scrollPositionRef.current > 0) {
      const timer = setTimeout(() => {
        window.scrollTo({
          top: scrollPositionRef.current,
          behavior: "instant" as ScrollBehavior
        });
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [selectedProduct]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);

  // App data state loaded from API
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);

  // Cart & Wishlist persistence (using localStorage)
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Order submission final success state
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);

  // Legal Policies Modals
  const [showPolicy, setShowPolicy] = useState<string | null>(null);

  // Custom measurement request fields for a generic bespoke enquiry
  const [customMeasurementsEnquiry, setCustomMeasurementsEnquiry] = useState({
    name: "",
    phone: "",
    dressName: "",
    notes: ""
  });

  // New review submission form state
  const [newReviewForm, setNewReviewForm] = useState({
    productName: "General Feedback",
    customerName: "",
    city: "",
    rating: 5,
    comment: ""
  });

  // Load products, reviews and storage on boot
  useEffect(() => {
    fetchProducts();
    fetchReviews();

    try {
      const storedBasket = localStorage.getItem("pret_basket");
      if (storedBasket) setBasket(JSON.parse(storedBasket));

      const storedWishlist = localStorage.getItem("pret_wishlist");
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    } catch (e) {
      console.error("Local storage sync error", e);
    }

    // Automatically detect location
    let detected: RegionCode = "PK";
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.toLowerCase();
      if (tz.includes("karachi") || tz.includes("asia/kabul") || tz.includes("lahore") || tz.includes("multan")) {
        detected = "PK";
      } else if (tz.includes("dubai") || tz.includes("asia/dubai") || tz.includes("muscat")) {
        detected = "AE";
      } else if (tz.includes("london") || tz.includes("europe/london") || tz.includes("europe/dublin")) {
        detected = "GB";
      } else if (tz.includes("america") || tz.includes("us/") || tz.includes("pacific/") || tz.includes("eastern")) {
        detected = "US";
      } else {
        const locale = navigator.language.toLowerCase();
        if (locale.includes("pk")) detected = "PK";
        else if (locale.includes("ae")) detected = "AE";
        else if (locale.includes("gb") || locale.includes("uk")) detected = "GB";
        else if (locale.includes("us")) detected = "US";
        else detected = "PK"; // Default fallback
      }
    } catch (e) {
      detected = "PK";
    }

    setDetectedHomeRegionCode(detected);

    const storedRegion = localStorage.getItem("pret_region");
    if (storedRegion) {
      setCurrentRegionCode(storedRegion as RegionCode);
      setRegionSelected(true);
    } else {
      setCurrentRegionCode(detected);
      setRegionSelected(false);
    }
  }, []);

  // Synchronize cart changes to local storage
  const syncBasket = (updatedBasket: BasketItem[]) => {
    setBasket(updatedBasket);
    try {
      localStorage.setItem("pret_basket", JSON.stringify(updatedBasket));
    } catch (e) {}
  };

  // Synchronize wishlist changes to local storage
  const syncWishlist = (updatedWishlist: string[]) => {
    setWishlist(updatedWishlist);
    try {
      localStorage.setItem("pret_wishlist", JSON.stringify(updatedWishlist));
    } catch (e) {}
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        console.warn("Backend API not ok, using premium fallback products");
        setProducts(fallbackProducts);
      }
    } catch (e) {
      console.warn("Error fetching products, using premium fallback products", e);
      setProducts(fallbackProducts);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      } else {
        setReviews(fallbackReviews);
      }
    } catch (e) {
      setReviews(fallbackReviews);
    }
  };

  // Setup current localized parameters
  const currentRegion = REGIONS[currentRegionCode];
  const currencySymbol = currentRegion.currencySymbol;

  // Add item to shopping basket
  const handleAddToBasket = (product: Product, size: string, withDupatta: boolean) => {
    // Generate unique index code for this configuration (so we don't mix sizes or dupatta preferences)
    const basketItemId = `${product.id}-${size}-${withDupatta ? "dupatta" : "regular"}`;
    
    const existingIndex = basket.findIndex((item) => item.id === basketItemId);
    
    // Resolve localized prices
    const itemPrice = product.prices[currentRegionCode] + 
      (withDupatta && product.dupattaAddon ? product.dupattaAddon.prices[currentRegionCode] : 0);

    if (existingIndex !== -1) {
      const newBasket = [...basket];
      newBasket[existingIndex].quantity += 1;
      syncBasket(newBasket);
    } else {
      const newItem: BasketItem = {
        id: basketItemId,
        product,
        size,
        withDupatta,
        quantity: 1,
        unitPrice: itemPrice
      };
      syncBasket([...basket, newItem]);
    }
    alert(`"${product.name}" (Size: ${size}) successfully added to your basket.`);
  };

  const handleUpdateBasketQuantity = (itemId: string, increment: boolean) => {
    const updated = basket
      .map((item) => {
        if (item.id === itemId) {
          const newQty = increment ? item.quantity + 1 : item.quantity - 1;
          return { ...item, quantity: newQty };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    syncBasket(updated);
  };

  const handleRemoveBasketItem = (itemId: string) => {
    syncBasket(basket.filter((item) => item.id !== itemId));
  };

  // Direct checkout purchase trigger
  const handleBuyNow = (product: Product, size: string, withDupatta: boolean) => {
    const itemPrice = product.prices[currentRegionCode] + 
      (withDupatta && product.dupattaAddon ? product.dupattaAddon.prices[currentRegionCode] : 0);

    const targetItem: BasketItem = {
      id: `${product.id}-${size}-${withDupatta ? "dupatta" : "regular"}`,
      product,
      size,
      withDupatta,
      quantity: 1,
      unitPrice: itemPrice
    };
    
    // Replace basket with this item for instant single product checkout
    syncBasket([targetItem]);
    setSelectedProduct(null);
    setCheckoutState(true);
    setCurrentTab("shop");
  };

  // Toggle wishlist items
  const handleToggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      syncWishlist(wishlist.filter((id) => id !== productId));
    } else {
      syncWishlist([...wishlist, productId]);
    }
  };

  // Submit secure order checkouts to API
  const handleOrderSubmission = async (orderPayload: Order) => {
    try {
      setIsSubmittingOrder(true);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          setSubmittedOrder(result.order);
          // Empty cart upon successful registration
          syncBasket([]);
          return;
        }
      }
    } catch (e) {
      console.warn("Order submission API error, falling back to client-side processing", e);
    }

    // Fallback local processing for Vercel / Netlify compatibility
    const fallbackOrder: Order = {
      ...orderPayload,
      id: "order-" + Date.now(),
      orderNumber: "PRET-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString(),
      orderStatus: "Pending Review",
      paymentStatus: orderPayload.country === "PK"
        ? "50% Advance - Pending Screenshot Review"
        : "100% Paid (Card/Stripe/PayPal Mock)"
    };
    setSubmittedOrder(fallbackOrder);
    syncBasket([]);
    setIsSubmittingOrder(false);
  };

  // Submit client reviews/feedback
  const handleReviewSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewForm.customerName || !newReviewForm.comment) {
      alert("Please fill in name and feedback comment.");
      return;
    }

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReviewForm)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setReviews([data.review, ...reviews]);
          setNewReviewForm({
            productName: "General Feedback",
            customerName: "",
            city: "",
            rating: 5,
            comment: ""
          });
          alert("Your valuable feedback has been recorded at our design studio. Thank you!");
          return;
        }
      }
    } catch (err) {
      console.warn("Review API error, processing locally for client compatibility", err);
    }

    const localReview: Review = {
      id: "rev-" + Date.now(),
      productName: newReviewForm.productName || "General Feedback",
      customerName: newReviewForm.customerName,
      city: newReviewForm.city || "Unknown",
      rating: Number(newReviewForm.rating),
      comment: newReviewForm.comment,
      date: new Date().toISOString()
    };
    setReviews([localReview, ...reviews]);
    setNewReviewForm({
      productName: "General Feedback",
      customerName: "",
      city: "",
      rating: 5,
      comment: ""
    });
    alert("Your valuable feedback has been recorded at our design studio. Thank you!");
  };

  // Trigger bespoke measurements enquries to WhatsApp
  const handleBespokeEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMeasurementsEnquiry.name || !customMeasurementsEnquiry.phone) {
      alert("Please supply contact details first.");
      return;
    }

    const customText = 
`🌟 *PRET STUDIO LONDON - BESPOKE MEASUREMENT ENQUIRY* 🌟
--------------------------------------------------
*NAME:* ${customMeasurementsEnquiry.name}
*WHATSAPP:* ${customMeasurementsEnquiry.phone}
*DESIGN INTEREST:* ${customMeasurementsEnquiry.dressName || "Bespoke Custom Gown"}

*CLIENT NOTES / ALTERATIONS REQUEST:*
"${customMeasurementsEnquiry.notes || "I want to arrange a detailed measurement meeting."}"
--------------------------------------------------
Please contact me to finalize custom sizing. Thank you!`;

    const encoded = encodeURIComponent(customText);
    window.open(`https://api.whatsapp.com/send?phone=923001234567&text=${encoded}`, "_blank");
  };

  // Calculate shopping basket total amount
  const basketTotal = basket.reduce((acc, curr) => acc + curr.unitPrice * curr.quantity, 0);

  // Search filter matching
  const filteredProducts = products.filter((p) => {
    const term = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.fabric.toLowerCase().includes(term)
    );
  });

  // Reset order state to browse again
  const handleResetOrder = () => {
    setSubmittedOrder(null);
    setCheckoutState(false);
    setCurrentTab("home");
  };

  // Check out early animation triggers
  if (introActive) {
    return <OpeningAnimation onComplete={() => setIntroActive(false)} />;
  }

  // Check out region selection configuration
  if (!regionSelected) {
    return (
      <RegionSelection
        onRegionSelect={(code) => {
          setCurrentRegionCode(code);
          setRegionSelected(true);
          try {
            localStorage.setItem("pret_region", code);
          } catch (e) {}
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between font-sans relative">
      
      {/* GLOBAL HEADER BAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#C5A880]/15 shadow-2xs">
        {/* Dynamic country ticker banner */}
        <div className="bg-[#1C1C1C] text-white text-[10px] tracking-[0.2em] uppercase py-2 px-4 flex justify-between items-center text-center">
          <span className="hidden md:inline">✨ HANDMADE BESPOKE COUTURE & PRE-ORDER ATELIER</span>
          <div className="mx-auto md:mx-0 flex items-center gap-3">
            <span>SHOPPING FROM: <span className="font-bold text-[#C5A880]">{currentRegion.flag} {currentRegion.name}</span></span>
            <button
              onClick={() => setRegionSelected(false)}
              className="text-[9px] underline decoration-[#C5A880] text-[#C5A880] hover:text-white transition-colors"
            >
              (SWITCH REGION)
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          
          {/* Left navigation rails */}
          <nav className="hidden lg:flex items-center gap-8 text-xs tracking-widest uppercase font-medium">
            <button
              onClick={() => { setCurrentTab("home"); handleSelectProduct(null, false); setCheckoutState(false); }}
              className={`hover:text-[#C5A880] transition-colors ${currentTab === "home" && !selectedProduct && !checkoutState ? "text-[#9D845F] font-semibold" : "text-gray-700"}`}
            >
              Home
            </button>
            <button
              onClick={() => { setCurrentTab("shop"); handleSelectProduct(null, false); setCheckoutState(false); }}
              className={`hover:text-[#C5A880] transition-colors ${currentTab === "shop" && !selectedProduct && !checkoutState ? "text-[#9D845F] font-semibold" : "text-gray-700"}`}
            >
              Collection
            </button>
            <button
              onClick={() => { setCurrentTab("new-arrivals"); handleSelectProduct(null, false); setCheckoutState(false); }}
              className={`hover:text-[#C5A880] transition-colors ${currentTab === "new-arrivals" && !selectedProduct && !checkoutState ? "text-[#9D845F] font-semibold" : "text-gray-700"}`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => { setCurrentTab("custom-orders"); handleSelectProduct(null, false); setCheckoutState(false); }}
              className={`hover:text-[#C5A880] transition-colors ${currentTab === "custom-orders" && !selectedProduct && !checkoutState ? "text-[#9D845F] font-semibold" : "text-gray-700"}`}
            >
              Custom Orders
            </button>
          </nav>

          {/* Small screen menu drawer trigger */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 hover:text-[#C5A880] text-gray-700 transition-colors focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Center Brand typography logo with elegant region flag */}
          <div
            onClick={() => { setCurrentTab("home"); handleSelectProduct(null, false); setCheckoutState(false); }}
            className="cursor-pointer text-center select-none flex items-center justify-center gap-2 md:gap-3"
          >
            <span className="text-xl md:text-2xl leading-none filter drop-shadow-sm" title={`Store Region: ${currentRegion.name}`}>
              {currentRegion.flag}
            </span>
            <div className="text-left border-l border-gray-200 pl-2 md:pl-3">
              <h1 className="font-serif text-sm md:text-lg font-light tracking-[0.25em] text-gray-900 uppercase leading-none">
                PRET STUDIO
              </h1>
              <span className="text-[8px] md:text-[9px] tracking-[0.45em] text-[#C5A880] uppercase block mt-1 leading-none">
                LONDON
              </span>
            </div>
          </div>

          {/* Right action controls */}
          <div className="flex items-center gap-3 md:gap-5 text-gray-700">
            {/* Search toggler */}
            <button
              onClick={() => setShowSearchBar(!showSearchBar)}
              className="p-1.5 hover:text-[#C5A880] transition-colors"
              title="Search Outfits"
            >
              <Search className="w-4 h-4 md:w-5 h-5" />
            </button>

            {/* Wishlist triggers */}
            <button
              onClick={() => { setCurrentTab("wishlist"); handleSelectProduct(null, false); setCheckoutState(false); }}
              className="p-1.5 hover:text-[#C5A880] transition-colors relative"
              title="Wishlist"
            >
              <Heart className={`w-4 h-4 md:w-5 h-5 ${currentTab === "wishlist" ? "text-[#9D845F] fill-[#9D845F]" : ""}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-red-600 text-[8px] text-white flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart basket triggers */}
            <button
              onClick={() => { setCurrentTab("basket"); handleSelectProduct(null, false); setCheckoutState(false); }}
              className="p-1.5 hover:text-[#C5A880] transition-colors relative"
              title="Shopping Basket"
            >
              <ShoppingBag className={`w-4 h-4 md:w-5 h-5 ${currentTab === "basket" ? "text-[#9D845F]" : ""}`} />
              {basket.length > 0 && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#9D845F] text-[8px] text-white flex items-center justify-center font-bold">
                  {basket.length}
                </span>
              )}
            </button>

            {/* Client feedback trigger tab */}
            <button
              onClick={() => { setCurrentTab("reviews"); handleSelectProduct(null, false); setCheckoutState(false); }}
              className="hidden md:inline text-xs tracking-wider uppercase font-semibold text-gray-500 hover:text-black hover:underline transition-colors decoration-[#C5A880]"
            >
              Reviews
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden border-t border-gray-100 bg-[#FDFBF7] overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-4 font-sans text-xs tracking-widest uppercase font-medium">
                <button
                  onClick={() => {
                    setCurrentTab("home");
                    handleSelectProduct(null, false);
                    setCheckoutState(false);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-2 hover:text-[#C5A880] transition-colors border-b border-gray-100/60 ${currentTab === "home" && !selectedProduct && !checkoutState ? "text-[#9D845F] font-semibold" : "text-gray-700"}`}
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setCurrentTab("shop");
                    handleSelectProduct(null, false);
                    setCheckoutState(false);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-2 hover:text-[#C5A880] transition-colors border-b border-gray-100/60 ${currentTab === "shop" && !selectedProduct && !checkoutState ? "text-[#9D845F] font-semibold" : "text-gray-700"}`}
                >
                  Collection
                </button>
                <button
                  onClick={() => {
                    setCurrentTab("new-arrivals");
                    handleSelectProduct(null, false);
                    setCheckoutState(false);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-2 hover:text-[#C5A880] transition-colors border-b border-gray-100/60 ${currentTab === "new-arrivals" && !selectedProduct && !checkoutState ? "text-[#9D845F] font-semibold" : "text-gray-700"}`}
                >
                  New Arrivals
                </button>
                <button
                  onClick={() => {
                    setCurrentTab("custom-orders");
                    handleSelectProduct(null, false);
                    setCheckoutState(false);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-2 hover:text-[#C5A880] transition-colors ${currentTab === "custom-orders" && !selectedProduct && !checkoutState ? "text-[#9D845F] font-semibold" : "text-gray-700"}`}
                >
                  Custom Orders
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Search Expandable Header block */}
        <AnimatePresence>
          {showSearchBar && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-100 bg-[#FDFBF7]"
            >
              <div className="max-w-3xl mx-auto px-4 py-5 flex items-center gap-3">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search our handmade signature prints, fabrics, or cuts (e.g. Silk, Kaftan, Blue)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm border-b border-gray-200 outline-none pb-1 focus:border-[#C5A880]"
                  autoFocus
                />
                <button
                  onClick={() => { setSearchQuery(""); setShowSearchBar(false); }}
                  className="p-1 text-gray-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>



      {/* CORE DISPLAY SWITCHER */}
      <main className="flex-1">
        
        {/* RENDER DYNAMIC SUCCESSFUL INVOICE VIEW */}
        {submittedOrder ? (
          <OrderSuccess
            order={submittedOrder}
            currencySymbol={currencySymbol}
            onReset={handleResetOrder}
          />
        ) : checkoutState ? (
          /* RENDER DIRECT REGIONAL CHECKOUT STAGE */
          <CheckoutFlow
            basketItems={basket}
            regionCode={currentRegionCode}
            currencySymbol={currencySymbol}
            totalAmount={basketTotal}
            onOrderSubmit={handleOrderSubmission}
            isSubmitting={isSubmittingOrder}
            onRegionChange={setCurrentRegionCode}
          />
        ) : selectedProduct ? (
          /* RENDER PRODUCT DEEP-DIVE STAGE */
          <ProductDetails
            product={selectedProduct}
            regionCode={currentRegionCode}
            currencySymbol={currencySymbol}
            onClose={() => handleSelectProduct(null)}
            onAddToBasket={handleAddToBasket}
            onBuyNow={handleBuyNow}
            isWishlisted={wishlist.includes(selectedProduct.id)}
            onToggleWishlist={handleToggleWishlist}
            allProducts={products}
            onSelectProduct={handleSelectProduct}
          />
        ) : (
          /* RENDER INDIVIDUAL TABS COGNATE TO NAVIGATION */
          <div>
            
            {/* TAB: HOMEPAGE GORGEOUS LAYOUT */}
            {currentTab === "home" && (
              <div className="space-y-16">
                
                {/* HERO COUTURE BANNER - SLIDE SHOW */}
                <section className="relative h-[80vh] md:h-[85vh] bg-black text-white flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0">
                    <img
                      src={REGIONAL_HERO_CONFIG[currentRegionCode].image}
                      alt={`PRET Studio London Couture Banner - ${currentRegionCode}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-60 filter contrast-[1.1] scale-102 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
                  </div>

                  <div className="relative z-10 text-center max-w-4xl px-4 flex flex-col items-center">
                    <span className="text-xs uppercase tracking-[0.55em] text-[#C5A880] mb-4 block animate-pulse">
                      {REGIONAL_HERO_CONFIG[currentRegionCode].label}
                     </span>
                    <h2 className="font-serif text-4xl md:text-7xl font-extralight tracking-wide text-white mb-6 uppercase leading-tight">
                      {REGIONAL_HERO_CONFIG[currentRegionCode].title}
                    </h2>
                    <p className="text-sm md:text-lg text-gray-200 tracking-widest font-light uppercase max-w-xl mb-10 leading-relaxed">
                      {REGIONAL_HERO_CONFIG[currentRegionCode].subtitle}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                      <button
                        onClick={() => setCurrentTab("shop")}
                        className="px-8 py-4 bg-[#C5A880] hover:bg-[#9D845F] text-white text-xs tracking-widest uppercase font-semibold transition-all duration-300 rounded-sm shadow-md"
                      >
                        Explore Collection
                      </button>
                      <button
                        onClick={() => setCurrentTab("custom-orders")}
                        className="px-8 py-4 border border-white/80 hover:bg-white hover:text-gray-900 text-white text-xs tracking-widest uppercase font-semibold transition-all duration-300 rounded-sm"
                      >
                        Bespoke Atelier Request
                      </button>
                    </div>
                  </div>
                </section>

                {/* THE ATELIER PHILOSOPHY PROSE */}
                <section className="max-w-4xl mx-auto px-4 text-center">
                  <span className="text-[10px] tracking-[0.4em] uppercase text-[#C5A880] block mb-3">Atelier Craft</span>
                  <h3 className="font-serif text-3xl font-light text-gray-900 mb-6 tracking-wide">
                    The Spirit of Craftsmanship
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed font-light">
                    At <span className="font-medium text-gray-900">PRET Studio London</span>, we create garments meant to turn heads and endure generations. Every suit is hand-patterned, hand-cut, and meticulously detailed by traditional masters. By producing exclusively on a <span className="font-medium text-gray-900">pre-order model</span>, we champion slow, sustainable luxury that honors the artisan and ensures peerless precision for your silhouette.
                  </p>
                </section>

                {/* HOMEPAGE FEATURED PRE-ORDER GRID (MAX 8 FEATURED OUTFlTS) */}
                <section className="max-w-7xl mx-auto px-4 md:px-8">
                  <div className="flex justify-between items-baseline mb-10">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-[#9D845F] font-semibold block mb-1">Couture Showcase</span>
                      <h3 className="font-serif text-2xl md:text-4xl font-light tracking-wide text-gray-900">Signature Creations</h3>
                    </div>
                    <button
                      onClick={() => setCurrentTab("shop")}
                      className="text-xs text-[#9D845F] hover:text-black border-b border-[#C5A880] pb-0.5 tracking-widest uppercase font-semibold transition-colors"
                    >
                      View All 15 Designs
                    </button>
                  </div>

                  {loadingProducts ? (
                    <div className="py-20 text-center text-xs text-gray-400 tracking-widest uppercase">
                      Gathering Handcrafted Outfits...
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {products.map((p) => (
                        <ProductCard
                          key={p.id}
                          product={p}
                          regionCode={currentRegionCode}
                          currencySymbol={currencySymbol}
                          onViewDetails={handleSelectProduct}
                          onAddToBasket={handleAddToBasket}
                          isWishlisted={wishlist.includes(p.id)}
                          onToggleWishlist={handleToggleWishlist}
                        />
                      ))}
                    </div>
                  )}
                </section>

                {/* HIGHLIGHT: HOW WE CONFIGURE THE TAILORING PROCESS */}
                <section className="bg-[#F9F6F0] py-16 border-y border-[#C5A880]/15">
                  <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-full bg-[#C5A880]/15 text-[#9D845F] flex items-center justify-center mx-auto text-sm font-semibold">1</div>
                      <h4 className="font-serif text-lg font-semibold text-gray-900">Choose Design & Sizing</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">Select from our standard sizing chart or request direct alteration tailoring for bespoke fitting.</p>
                    </div>
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-full bg-[#C5A880]/15 text-[#9D845F] flex items-center justify-center mx-auto text-sm font-semibold">2</div>
                      <h4 className="font-serif text-lg font-semibold text-gray-900">Deposit Booking</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">Book with 50% deposit (Pakistan) or secure card authorization (UAE, USA, UK) to activate stitching.</p>
                    </div>
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-full bg-[#C5A880]/15 text-[#9D845F] flex items-center justify-center mx-auto text-sm font-semibold">3</div>
                      <h4 className="font-serif text-lg font-semibold text-gray-900">WhatsApp Dispatch</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">Submit your order details directly to our design desk. Receive live video checks upon outfit completion.</p>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* TAB: SHOP COLLECTION (ALL 15 DRESSES) */}
            {currentTab === "shop" && (
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
                <div className="text-center mb-12">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A880] block mb-2">Pre-Order Couture</span>
                  <h2 className="font-serif text-3xl md:text-5xl font-light text-gray-900 tracking-wide">
                    Atelier Handcrafted Collection
                  </h2>
                  <p className="text-gray-500 text-xs md:text-sm tracking-wider max-w-md mx-auto mt-3 leading-relaxed">
                    Explore all 15 signature silk designs. Tailored by master sewists. Delivered globally in under 5 weeks.
                  </p>
                </div>

                {loadingProducts ? (
                  <div className="py-20 text-center text-xs text-gray-400 tracking-widest uppercase">
                    Loading Garments...
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="py-20 text-center text-xs text-gray-400 tracking-widest">
                    No dresses match your search criteria. Try another keyword.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        regionCode={currentRegionCode}
                        currencySymbol={currencySymbol}
                        onViewDetails={handleSelectProduct}
                        onAddToBasket={handleAddToBasket}
                        isWishlisted={wishlist.includes(p.id)}
                        onToggleWishlist={handleToggleWishlist}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: NEW ARRIVALS */}
            {currentTab === "new-arrivals" && (
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
                <div className="text-center mb-12">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A880] block mb-2">Summer Couture Drop</span>
                  <h2 className="font-serif text-3xl md:text-5xl font-light text-gray-900 tracking-wide">
                    New Arrivals
                  </h2>
                </div>

                {/* Filter and display a subset of latest items (e.g. Daisy, Lily, Dahlia etc.) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.slice(0, 6).map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      regionCode={currentRegionCode}
                      currencySymbol={currencySymbol}
                      onViewDetails={handleSelectProduct}
                      onAddToBasket={handleAddToBasket}
                      isWishlisted={wishlist.includes(p.id)}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* TAB: CUSTOM BESPOKE ATELIER ENQUIRIES */}
            {currentTab === "custom-orders" && (
              <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
                <div className="text-center mb-10">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A880] block mb-2">Bespoke Couture Tailoring</span>
                  <h2 className="font-serif text-3xl md:text-4xl font-light text-gray-900 tracking-wide">
                    Inquire Custom Sizing & Bespoke Outfits
                  </h2>
                  <p className="text-gray-500 text-xs md:text-sm tracking-wider max-w-md mx-auto mt-3 leading-relaxed">
                    Can't find your measurements, or desire a custom dress variation? Send a request directly to our lead design directors on WhatsApp.
                  </p>
                </div>

                <form onSubmit={handleBespokeEnquiry} className="bg-white border border-[#C5A880]/20 p-6 md:p-8 rounded-sm space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={customMeasurementsEnquiry.name}
                        onChange={(e) => setCustomMeasurementsEnquiry({ ...customMeasurementsEnquiry, name: e.target.value })}
                        placeholder="e.g. Sara Ahmed"
                        className="w-full border border-gray-200 focus:border-[#C5A880] p-2.5 text-xs rounded-xs outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">WhatsApp Number</label>
                      <input
                        type="tel"
                        required
                        value={customMeasurementsEnquiry.phone}
                        onChange={(e) => setCustomMeasurementsEnquiry({ ...customMeasurementsEnquiry, phone: e.target.value })}
                        placeholder="e.g. +92 321 9876543"
                        className="w-full border border-gray-200 focus:border-[#C5A880] p-2.5 text-xs rounded-xs outline-none bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Dress design of interest</label>
                    <input
                      type="text"
                      value={customMeasurementsEnquiry.dressName}
                      onChange={(e) => setCustomMeasurementsEnquiry({ ...customMeasurementsEnquiry, dressName: e.target.value })}
                      placeholder="e.g. Midnight Blue (Custom Length)"
                      className="w-full border border-gray-200 focus:border-[#C5A880] p-2.5 text-xs rounded-xs outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Describe your alterations or customization requirements</label>
                    <textarea
                      rows={4}
                      value={customMeasurementsEnquiry.notes}
                      onChange={(e) => setCustomMeasurementsEnquiry({ ...customMeasurementsEnquiry, notes: e.target.value })}
                      placeholder="e.g. I would like to request sleeves alteration and would like a custom organza dupatta base in pistachio green..."
                      className="w-full border border-gray-200 focus:border-[#C5A880] p-2.5 text-xs rounded-xs outline-none bg-white resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#1C1C1C] hover:bg-[#C5A880] text-white text-xs tracking-widest uppercase font-semibold py-3.5 rounded-xs transition-colors shadow-xs"
                  >
                    Send Bespoke Request to WhatsApp
                  </button>
                </form>
              </div>
            )}

            {/* TAB: WISHLIST SAVED ITEMS */}
            {currentTab === "wishlist" && (
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
                <div className="text-center mb-12">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A880] block mb-2">Saved Favorites</span>
                  <h2 className="font-serif text-3xl md:text-5xl font-light text-gray-900 tracking-wide">
                    Your Curated Wishlist
                  </h2>
                </div>

                {wishlist.length === 0 ? (
                  <div className="p-16 border rounded-xs text-center text-xs text-gray-400 tracking-wider">
                    Your luxury wishlist is currently empty. Star items while browsing to save them.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products
                      .filter((p) => wishlist.includes(p.id))
                      .map((p) => (
                        <ProductCard
                          key={p.id}
                          product={p}
                          regionCode={currentRegionCode}
                          currencySymbol={currencySymbol}
                          onViewDetails={setSelectedProduct}
                          onAddToBasket={handleAddToBasket}
                          isWishlisted={true}
                          onToggleWishlist={handleToggleWishlist}
                        />
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: SHOPPING BASKET SUMMARY */}
            {currentTab === "basket" && (
              <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
                <div className="text-center mb-12">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A880] block mb-2">Purchase Pending</span>
                  <h2 className="font-serif text-3xl md:text-4xl font-light text-gray-900 tracking-wide">
                    Your Shopping Basket
                  </h2>
                </div>

                {basket.length === 0 ? (
                  <div className="p-16 border rounded-xs text-center text-xs text-gray-400 tracking-wider bg-white">
                    Your basket is currently empty. Explore our collection to add handcrafted outfits.
                  </div>
                ) : (
                  <div className="space-y-6 bg-white border border-[#C5A880]/15 p-6 rounded-xs shadow-xs">
                    
                    {/* Basket items list */}
                    <div className="divide-y divide-gray-100">
                      {basket.map((item) => (
                        <div key={item.id} className="py-4 flex gap-4 text-left items-start md:items-center">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-16 h-20 object-cover bg-gray-50 rounded-xs"
                          />
                          <div className="flex-1">
                            <h4 className="font-serif text-base font-semibold text-gray-900">{item.product.name}</h4>
                            <p className="text-xs text-gray-400 mt-0.5">FABRIC: {item.product.fabric}</p>
                            <p className="text-xs text-gray-500 mt-1">SIZE: <span className="font-semibold">{item.size}</span></p>
                            {item.withDupatta && (
                              <p className="text-[11px] text-[#9D845F] font-semibold mt-1">Includes Bespoke {item.product.dupattaAddon?.name}</p>
                            )}
                          </div>

                          {/* Quantities adjuster */}
                          <div className="flex items-center gap-2 border border-gray-100 p-1 bg-[#FDFBF7] rounded-xs">
                            <button
                              onClick={() => handleUpdateBasketQuantity(item.id, false)}
                              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black font-semibold text-sm"
                            >
                              -
                            </button>
                            <span className="text-xs w-4 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateBasketQuantity(item.id, true)}
                              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black font-semibold text-sm"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="font-serif font-bold text-gray-900 block text-sm">
                              {currencySymbol} {(item.unitPrice * item.quantity).toLocaleString()}
                            </span>
                            <button
                              onClick={() => handleRemoveBasketItem(item.id)}
                              className="text-[10px] text-red-500 hover:underline mt-1.5 block font-semibold uppercase tracking-wider"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Calculated totals */}
                    <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row justify-between items-baseline gap-4">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-medium">ESTIMATED TOTAL</span>
                        <span className="font-serif text-2xl font-bold text-gray-900">
                          {currencySymbol} {basketTotal.toLocaleString()}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => setCheckoutState(true)}
                        className="w-full md:w-auto px-8 py-3.5 bg-[#1C1C1C] hover:bg-[#C5A880] text-white text-xs tracking-widest uppercase font-semibold transition-all rounded-xs shadow-xs"
                      >
                        Proceed to Secure Checkout
                      </button>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* TAB: CLIENT REVIEWS & HANDIWORK FEEDBACK */}
            {currentTab === "reviews" && (
              <div className="max-w-5xl mx-auto px-4 py-12 md:py-20 text-left">
                <div className="text-center mb-12">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A880] block mb-2">Artisan Verification</span>
                  <h2 className="font-serif text-3xl md:text-4xl font-light text-gray-900 tracking-wide">
                    Client Reviews & Feedback
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  
                  {/* Left: Feedbacks ledger (7 columns) */}
                  <div className="lg:col-span-7 space-y-6">
                    <h3 className="font-serif text-xl font-light text-gray-800">What our Clients Say</h3>
                    <div className="space-y-4">
                      {reviews.map((rev) => (
                        <div key={rev.id} className="p-5 border border-gray-100 rounded-xs bg-white space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-800">{rev.customerName}</h4>
                              <p className="text-[10px] text-gray-400 font-medium">{rev.city} • Design: {rev.productName}</p>
                            </div>
                            <div className="flex text-amber-500">
                              {Array.from({ length: rev.rating }).map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed font-light italic">
                            "{rev.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Submit your feedback form (5 columns) */}
                  <div className="lg:col-span-5 bg-white border border-[#C5A880]/15 p-6 rounded-xs">
                    <h4 className="font-serif text-lg text-gray-800 mb-4">Record Your Feedback</h4>
                    
                    <form onSubmit={handleReviewSubmission} className="space-y-4 text-xs">
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={newReviewForm.customerName}
                          onChange={(e) => setNewReviewForm({ ...newReviewForm, customerName: e.target.value })}
                          className="w-full border border-gray-200 focus:border-[#C5A880] p-2 text-xs rounded-xs outline-none bg-white"
                          placeholder="e.g. Amina K."
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">City/Location</label>
                          <input
                            type="text"
                            value={newReviewForm.city}
                            onChange={(e) => setNewReviewForm({ ...newReviewForm, city: e.target.value })}
                            className="w-full border border-gray-200 focus:border-[#C5A880] p-2 text-xs rounded-xs outline-none bg-white"
                            placeholder="e.g. Lahore / London"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Outfit Purchased</label>
                          <select
                            value={newReviewForm.productName}
                            onChange={(e) => setNewReviewForm({ ...newReviewForm, productName: e.target.value })}
                            className="w-full border border-gray-200 focus:border-[#C5A880] p-2 text-xs rounded-xs outline-none bg-white"
                          >
                            <option value="General Feedback">General Feedback</option>
                            {products.map((p) => (
                              <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Rating</label>
                        <select
                          value={newReviewForm.rating}
                          onChange={(e) => setNewReviewForm({ ...newReviewForm, rating: Number(e.target.value) })}
                          className="w-full border border-gray-200 focus:border-[#C5A880] p-2 text-xs rounded-xs outline-none bg-white"
                        >
                          <option value="5">⭐⭐⭐⭐⭐ Excellent Fit (5/5)</option>
                          <option value="4">⭐⭐⭐⭐ Fine Stitching (4/5)</option>
                          <option value="3">⭐⭐⭐ Good (3/5)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Feedback Comment</label>
                        <textarea
                          rows={4}
                          required
                          value={newReviewForm.comment}
                          onChange={(e) => setNewReviewForm({ ...newReviewForm, comment: e.target.value })}
                          placeholder="Tell us about the hand-embroidery work, fit accuracy, and packaging..."
                          className="w-full border border-gray-200 focus:border-[#C5A880] p-2 text-xs rounded-xs outline-none bg-white resize-none"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#1C1C1C] hover:bg-[#C5A880] text-white text-xs tracking-widest uppercase font-semibold py-2.5 rounded-xs transition-colors"
                      >
                        Submit Feedback
                      </button>
                    </form>
                  </div>

                </div>
              </div>
            )}

            {/* TAB: STAFF ADMINISTRATIVE CONTROL */}
            {currentTab === "staff-portal" && (
              <StaffPortal regionCode={currentRegionCode} />
            )}

          </div>
        )}

      </main>

      {/* LUXURIOUS FOOTER */}
      <footer className="bg-[#1C1C1C] text-gray-300 mt-20 border-t border-[#C5A880]/30 font-light">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 text-left">
          
          {/* Column 1: About */}
          <div className="space-y-4">
            <h4 className="font-serif text-xl tracking-[0.2em] text-[#F9F6F0] uppercase">PRET STUDIO</h4>
            <span className="text-[10px] text-[#C5A880] tracking-[0.4em] uppercase block -mt-3">LONDON</span>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              Premium quality craftsmanship, handmade custom outfits, and pre-order based luxury couture. Supporting local artisans and delivering bespoke luxury worldwide.
            </p>
            <div className="pt-2">
              <a 
                href="https://www.instagram.com/pret_studio_london/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 text-xs text-[#C5A880] hover:text-white transition-colors duration-300 bg-white/5 px-3 py-1.5 rounded-xs border border-white/10 hover:border-[#C5A880]/30"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span className="font-semibold tracking-wider">@pret_studio_london</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h5 className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">Storefront</h5>
            <ul className="text-xs space-y-2 text-gray-400 font-light">
              <li>
                <button onClick={() => { setCurrentTab("home"); setSelectedProduct(null); setCheckoutState(false); }} className="hover:text-white transition-colors">
                  Atelier Home
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentTab("shop"); setSelectedProduct(null); setCheckoutState(false); }} className="hover:text-white transition-colors">
                  Couture Collection
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentTab("custom-orders"); setSelectedProduct(null); setCheckoutState(false); }} className="hover:text-white transition-colors">
                  Custom Stitching
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentTab("reviews"); setSelectedProduct(null); setCheckoutState(false); }} className="hover:text-white transition-colors">
                  Client Reviews
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Atelier Policies */}
          <div className="space-y-3">
            <h5 className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">Workshop Policies</h5>
            <ul className="text-xs space-y-2 text-gray-400 font-light">
              <li>
                <button onClick={() => setShowPolicy("refund")} className="hover:text-white transition-colors text-left block">
                  Refund & Custom Exceptions
                </button>
              </li>
              <li>
                <button onClick={() => setShowPolicy("shipping")} className="hover:text-white transition-colors text-left block">
                  Shipping & Customs Delivery
                </button>
              </li>
              <li>
                <button onClick={() => setShowPolicy("aboutus")} className="hover:text-white transition-colors text-left block">
                  About the Artisans
                </button>
              </li>
              <li>
                <button onClick={() => setShowPolicy("faq")} className="hover:text-white transition-colors text-left block">
                  Atelier Sizing FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: staff and help */}
          <div className="space-y-3">
            <h5 className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">Staff & Customer Desk</h5>
            <p className="text-xs text-gray-400 leading-relaxed">
              Inquiries: <span className="text-[#C5A880]">ghumesa1@gmail.com</span> <br />
              Atelier Desk: <span className="text-[#C5A880]">+92 300 6302285</span>
            </p>
            <div className="pt-2">
              <button
                onClick={() => { setCurrentTab("staff-portal"); setSelectedProduct(null); setCheckoutState(false); }}
                className="text-[10px] uppercase tracking-widest bg-white/5 border border-[#C5A880]/30 hover:bg-white hover:text-black hover:border-white text-gray-300 font-semibold py-1.5 px-3 rounded-xs transition-all duration-300"
              >
                Atelier Staff Portal
              </button>
            </div>
          </div>

        </div>

        {/* Outer credit lines */}
        <div className="border-t border-[#C5A880]/15 py-6 text-center text-[10px] text-gray-500 tracking-[0.25em] flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-6 gap-4">
          <span>© {new Date().getFullYear()} PRET STUDIO LONDON. ALL RIGHTS RESERVED.</span>
          <div className="flex flex-col items-center py-2">
            <span className="text-[#C5A880] font-sans font-semibold tracking-widest text-xs uppercase">
              Website Developed by Saleh Rizwan
            </span>
            <span className="text-[8px] text-gray-400 mt-1 uppercase tracking-widest">
              Every single feature & design detail curated and handled by Saleh Rizwan
            </span>
          </div>
          <span>CURATED LUXURY HANDSTITCHED FOR PAKISTAN, UAE, USA & UK.</span>
        </div>
      </footer>

      {/* POLICY POPUP MODAL CONTROL */}
      <AnimatePresence>
        {showPolicy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FDFBF7] border border-[#C5A880]/30 max-w-xl w-full p-6 md:p-8 rounded-sm shadow-2xl relative text-left"
            >
              <button
                onClick={() => setShowPolicy(null)}
                className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Dynamic Policy rendering */}
              {showPolicy === "refund" && (
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl text-gray-900 mb-2 uppercase tracking-wide border-b border-gray-100 pb-2">Refund Policy</h3>
                  <div className="text-xs text-gray-700 space-y-3 leading-relaxed">
                    <p>At <span className="font-semibold text-gray-900">PRET Studio London</span>, each dress is completely customized and handcrafted according to your individual size preferences and specifications.</p>
                    <p className="font-semibold text-[#9D845F]">Consequently, orders cannot be returned, exchanged, or refunded once they have been approved by our design director.</p>
                    <p>If you encounter fitting defects that depart from your specified custom measurements, please contact our support team on WhatsApp within 48 hours of package receipt. We will arrange premium adjustments completely free of cost.</p>
                  </div>
                </div>
              )}

              {showPolicy === "shipping" && (
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl text-gray-900 mb-2 uppercase tracking-wide border-b border-gray-100 pb-2">Shipping & Pre-Order timelines</h3>
                  <div className="text-xs text-gray-700 space-y-3 leading-relaxed">
                    <p>We deliver our handcrafted couture pieces to Pakistan, the United Arab Emirates, the United States, and the United Kingdom via premium air couriers (DHL Express, FedEx, and TCS).</p>
                    <p><span className="font-semibold text-gray-900">Pakistan Timeline:</span> Standard stitching and hand-embroidery takes 3 to 4 weeks. Shipping across Pakistan is free of charge.</p>
                    <p><span className="font-semibold text-gray-900">International Timeline (UAE, USA, UK):</span> Stitching takes 4 to 5 weeks. Shipping costs are calculated at dispatch based on dress weights and package destinations.</p>
                    <p>Please note that any local customs, duties, or clearance fees levied by your home country's customs department are the responsibility of the recipient.</p>
                  </div>
                </div>
              )}

              {showPolicy === "aboutus" && (
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl text-gray-900 mb-2 uppercase tracking-wide border-b border-gray-100 pb-2">About the Artisans</h3>
                  <div className="text-xs text-gray-700 space-y-3 leading-relaxed">
                    <p>PRET Studio London is committed to preserving the ancient handcrafting traditions of Southern Asia. Every sequin, sitara, tilla threads, and bead is placed by hand by certified traditional embroiderers and master tailors.</p>
                    <p>By purchasing from our pre-order collections, you directly support fair wages, safe work environments, and medical welfare programs for artisan families in Lahore and Karachi workshop clusters.</p>
                    <p>We combine centuries-old craftsmanship with modern aesthetic sensibilities to deliver peerless garments that make a quiet statement of luxury.</p>
                  </div>
                </div>
              )}

              {showPolicy === "faq" && (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  <h3 className="font-serif text-2xl text-gray-900 mb-2 uppercase tracking-wide border-b border-gray-100 pb-2">Atelier Sizing FAQs</h3>
                  <div className="text-xs text-gray-700 space-y-4 leading-relaxed">
                    <div>
                      <h4 className="font-semibold text-gray-900 uppercase">Q: What fabrics are used?</h4>
                      <p className="text-gray-600 mt-1">A: We use only premium quality Shisha Silk, Korean Silk, and Tussel Silk fabrics. Detailed fabrics are specified for each product.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 uppercase">Q: Can I request sleeves on sleeveless styles?</h4>
                      <p className="text-gray-600 mt-1">A: Yes! Because our dresses are pre-ordered, you can request custom sleeve attachment and length inside the custom measurement section at checkout.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 uppercase">Q: How do I verify my advance deposit?</h4>
                      <p className="text-gray-600 mt-1">A: Simply transfer the 50% deposit amount (Pakistan only) via EasyPaisa, JazzCash, or bank transfer, and upload the screenshot slip. Our workshop staff will verify and confirm your order.</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
