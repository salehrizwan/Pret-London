import React, { useState, useRef } from "react";
import { Product, RegionCode } from "../types";
import { X, Heart, ShoppingBag, Eye, ShieldCheck, Ruler, Calendar, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProductDetailsProps {
  product: Product;
  regionCode: RegionCode;
  currencySymbol: string;
  onClose: () => void;
  onAddToBasket: (product: Product, size: string, withDupatta: boolean) => void;
  onBuyNow: (product: Product, size: string, withDupatta: boolean) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

export default function ProductDetails({
  product,
  regionCode,
  currencySymbol,
  onClose,
  onAddToBasket,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
  allProducts,
  onSelectProduct
}: ProductDetailsProps) {
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [withDupatta, setWithDupatta] = useState<boolean>(false);
  const [showSizeChart, setShowSizeChart] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 0, y: 0 });
  const [sizingTab, setSizingTab] = useState<"standard" | "kaftan">("standard");

  const imageRef = useRef<HTMLImageElement>(null);

  // Zoom Event Handlers (Magnifying glass effect for luxury embroidery inspection)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomCoords({ x, y });
  };

  // Pricing calculations (incorporate dupatta addon)
  const basePrice = product.prices[regionCode];
  const dupattaPrice = product.dupattaAddon && withDupatta ? product.dupattaAddon.prices[regionCode] : 0;
  const totalPrice = basePrice + dupattaPrice;

  // Filter similar products for "You May Also Like"
  const similarProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-white min-h-screen">
      {/* Detail Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        
        {/* Back navigation */}
        <button
          onClick={onClose}
          className="mb-8 flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#9D845F] hover:text-black transition-colors duration-300 font-medium"
        >
          <X className="w-4 h-4" />
          <span>Back to Collection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
          
          {/* LEFT: Multi-Image Showcase with Luxury Hover Zoom (5 columns) */}
          <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4">
            
            {/* Active Display Stage with Zoom */}
            <div
              className="flex-1 bg-white relative overflow-hidden rounded-xs border border-[#C5A880]/10 aspect-[3/4] cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                ref={imageRef}
                src={activeImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-contain bg-white transition-transform duration-100 ${
                  isZoomed ? "scale-150" : "scale-100"
                }`}
                style={
                  isZoomed
                    ? { transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%` }
                    : undefined
                }
              />
              
              {/* Overlay Prompt */}
              <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[9px] tracking-widest uppercase px-2.5 py-1 pointer-events-none rounded-xs">
                {isZoomed ? "Zoom Active" : "Hover to Inspect Craftsmanship"}
              </div>
            </div>

            {/* Thumbnails list */}
            <div className="flex md:flex-col gap-3 justify-start overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-20 md:w-20 md:h-28 flex-shrink-0 border bg-white overflow-hidden rounded-xs transition-all duration-300 ${
                    activeImage === img ? "border-[#C5A880] ring-1 ring-[#C5A880]/40" : "border-gray-200"
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-contain bg-white" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>

          </div>

          {/* RIGHT: High-End Interactive Details Configurator (5 columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Product Category & Brand */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#9D845F] font-sans uppercase tracking-[0.25em]">
                  {product.category}
                </span>
                <span className="text-[10px] bg-[#C5A880]/15 text-[#9D845F] px-2 py-0.5 uppercase tracking-widest font-semibold rounded-xs">
                  {product.stockStatus}
                </span>
              </div>

              {/* Title & Price */}
              <h1 className="font-serif text-3xl md:text-4xl font-light text-gray-900 tracking-wide mt-2 mb-4">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-2xl font-serif font-semibold text-gray-900">
                  {currencySymbol} {totalPrice.toLocaleString()}
                </span>
                {withDupatta && (
                  <span className="text-xs text-gray-400">
                    (Includes {product.dupattaAddon?.name})
                  </span>
                )}
              </div>

              {/* Product Short and Long description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Artisan Detail Matrix (Bespoke Specs) */}
              <div className="border-y border-[#C5A880]/15 py-4 my-6 space-y-3">
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <span className="text-gray-400 font-medium uppercase tracking-wider">Fabric</span>
                  <span className="col-span-3 text-gray-800 font-light">{product.fabric}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <span className="text-gray-400 font-medium uppercase tracking-wider">Embroidery</span>
                  <span className="col-span-3 text-gray-800 font-light">{product.embroidery}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <span className="text-gray-400 font-medium uppercase tracking-wider">Stitching</span>
                  <span className="col-span-3 text-gray-800 font-light">{product.stitching}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <span className="text-gray-400 font-medium uppercase tracking-wider">Instructions</span>
                  <span className="col-span-3 text-gray-800 font-light">{product.careInstructions}</span>
                </div>
              </div>

              {/* Size Configuration Area */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Select Sizing</span>
                  <button
                    onClick={() => setShowSizeChart(true)}
                    className="text-xs text-[#9D845F] hover:text-black flex items-center gap-1 border-b border-[#C5A880]/40 pb-0.5 uppercase tracking-wider transition-colors"
                  >
                    <Ruler className="w-3..5 h-3.5" />
                    <span>View Sizing Chart</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  {product.availableSizes.filter((sz) => sz !== "XS").map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`w-10 h-10 md:w-12 md:h-12 border text-xs tracking-widest uppercase transition-all duration-300 rounded-xs flex items-center justify-center font-medium ${
                        selectedSize === sz
                          ? "border-black bg-[#1C1C1C] text-white"
                          : "border-gray-200 hover:border-[#C5A880] text-gray-600 bg-white"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dupatta Addon Configurator */}
              {product.dupattaAddon && (
                <div className="mb-8">
                  <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold block mb-3">
                    Bespoke Add-Ons
                  </span>
                  
                  <div
                    onClick={() => setWithDupatta(!withDupatta)}
                    className={`border p-4 rounded-xs cursor-pointer transition-all duration-300 flex items-start gap-3 ${
                      withDupatta
                        ? "border-[#C5A880] bg-[#C5A880]/5"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="mt-0.5">
                      <div className={`w-4 h-4 border rounded-xs flex items-center justify-center transition-colors ${
                        withDupatta ? "bg-[#1C1C1C] border-[#1C1C1C]" : "border-gray-300 bg-white"
                      }`}>
                        {withDupatta && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                          Include {product.dupattaAddon.name}
                        </h4>
                        <span className="text-xs font-serif font-bold text-[#9D845F]">
                          + {currencySymbol} {product.dupattaAddon.prices[regionCode].toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                        {product.dupattaAddon.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline & Delivery Notes */}
              <div className="bg-[#F9F6F0] border border-[#C5A880]/10 p-4 rounded-xs mb-8 flex gap-3 items-start">
                <Calendar className="w-5 h-5 text-[#9D845F] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
                    Pre-Order Production Timeline
                  </h4>
                  <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                    Estimated delivery time: <span className="font-semibold text-gray-900">{product.deliveryTime[regionCode]}</span>. Each dress is completely handmade and custom-sewn.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="flex flex-col gap-3 pt-6 border-t border-gray-100">
              <div className="flex gap-4">
                {/* Add to Basket */}
                <button
                  onClick={() => onAddToBasket(product, selectedSize, withDupatta)}
                  className="flex-1 border border-black hover:border-[#1C1C1C] text-gray-900 hover:bg-gray-50 text-xs md:text-sm tracking-widest uppercase font-semibold py-4 flex items-center justify-center gap-2 transition-all duration-300 rounded-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Basket</span>
                </button>

                {/* Wishlist toggle */}
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className="px-4 border border-gray-200 hover:border-[#C5A880] rounded-sm flex items-center justify-center transition-colors duration-300"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "text-red-600 fill-red-600" : "text-gray-400 hover:text-gray-600"}`} />
                </button>
              </div>

              {/* Buy Now (Triggers Direct Checkout) */}
              <button
                onClick={() => onBuyNow(product, selectedSize, withDupatta)}
                className="w-full bg-[#1C1C1C] hover:bg-[#C5A880] text-white text-xs md:text-sm tracking-widest uppercase font-semibold py-4 transition-all duration-300 rounded-sm shadow-xs animate-pulse"
              >
                Confirm Pre-Order
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 uppercase tracking-widest mt-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                <span>Handmade Craftsmanship Guaranteed</span>
              </div>
            </div>

          </div>

        </div>

        {/* RELATED DESIGNS SECTION: "You May Also Like" */}
        <div className="mt-20 pt-12 border-t border-[#C5A880]/15">
          <div className="text-center mb-10">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] block mb-2">Complements Your Style</span>
            <h2 className="font-serif text-2xl md:text-3xl font-light tracking-wide text-gray-900">
              You May Also Like
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProduct(p);
                  setActiveImage(p.images[0]);
                  setWithDupatta(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group cursor-pointer flex flex-col bg-white border border-[#C5A880]/10 overflow-hidden rounded-xs"
              >
                <div className="aspect-[3/4] bg-[#F7F5F0] overflow-hidden relative">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>
                <div className="p-3 text-center">
                  <h4 className="font-serif text-base text-gray-900 group-hover:text-[#C5A880] transition-colors truncate">
                    {p.name}
                  </h4>
                  <span className="text-xs text-[#9D845F] font-semibold block mt-1">
                    {currencySymbol} {p.prices[regionCode].toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SIZING CHART POPUP MODAL */}
      <AnimatePresence>
        {showSizeChart && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#C5A880]/30 max-w-2xl w-full p-6 md:p-8 rounded-sm shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowSizeChart(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-serif text-2xl text-gray-900 tracking-wide mb-2 uppercase">
                Sizing Guide
              </h3>
              <p className="text-gray-500 text-xs tracking-wider uppercase mb-6 pb-2 border-b border-gray-100">
                All measurements are in inches. Standard Regular Fitting.
              </p>

              {/* Tab Selector */}
              <div className="flex border-b border-gray-200 mb-6 gap-4">
                <button
                  onClick={() => setSizingTab("standard")}
                  className={`py-2 px-1 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                    sizingTab === "standard"
                      ? "border-[#C5A880] text-[#9D845F]"
                      : "border-transparent text-gray-400 hover:text-black"
                  }`}
                >
                  Standard Tops & Trousers
                </button>
                <button
                  onClick={() => setSizingTab("kaftan")}
                  className={`py-2 px-1 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                    sizingTab === "kaftan"
                      ? "border-[#C5A880] text-[#9D845F]"
                      : "border-transparent text-gray-400 hover:text-black"
                  }`}
                >
                  Kaftan Sizing
                </button>
              </div>

              {sizingTab === "standard" ? (
                <div className="space-y-6">
                  {/* Tops Table */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]"></span>
                      Standard Garment Measurements for Tops (Inches)
                    </h4>
                    <div className="overflow-x-auto border border-gray-100 rounded-xs">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-150 text-[#9D845F] uppercase tracking-wider">
                            <th className="p-3 font-semibold">Size</th>
                            <th className="p-3 font-semibold">Shoulder</th>
                            <th className="p-3 font-semibold">Bust</th>
                            <th className="p-3 font-semibold">Armhole Straight</th>
                            <th className="p-3 font-semibold">Sleeve Length (Full)</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-700 font-light">
                          <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 font-semibold text-gray-900">S</td>
                            <td className="p-3">14</td>
                            <td className="p-3">19</td>
                            <td className="p-3">9</td>
                            <td className="p-3">21</td>
                          </tr>
                          <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 font-semibold text-gray-900">M</td>
                            <td className="p-3">15</td>
                            <td className="p-3">21</td>
                            <td className="p-3">10</td>
                            <td className="p-3">21</td>
                          </tr>
                          <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 font-semibold text-gray-900">L</td>
                            <td className="p-3">15.5</td>
                            <td className="p-3">22</td>
                            <td className="p-3">10.5</td>
                            <td className="p-3">21.5</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="p-3 font-semibold text-gray-900">XL</td>
                            <td className="p-3">16</td>
                            <td className="p-3">24</td>
                            <td className="p-3">11.5</td>
                            <td className="p-3">22</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Trousers Table */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]"></span>
                      Trouser (Inches)
                    </h4>
                    <div className="overflow-x-auto border border-gray-100 rounded-xs">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-150 text-[#9D845F] uppercase tracking-wider">
                            <th className="p-3 font-semibold">Size</th>
                            <th className="p-3 font-semibold">Length</th>
                            <th className="p-3 font-semibold">Waist</th>
                            <th className="p-3 font-semibold">Thigh</th>
                            <th className="p-3 font-semibold">Bottom</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-700 font-light">
                          <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 font-semibold text-gray-900">S</td>
                            <td className="p-3">36</td>
                            <td className="p-3">25</td>
                            <td className="p-3">23</td>
                            <td className="p-3">6</td>
                          </tr>
                          <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 font-semibold text-gray-900">M</td>
                            <td className="p-3">36</td>
                            <td className="p-3">27</td>
                            <td className="p-3">25</td>
                            <td className="p-3">6</td>
                          </tr>
                          <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 font-semibold text-gray-900">L</td>
                            <td className="p-3">37</td>
                            <td className="p-3">30</td>
                            <td className="p-3">28</td>
                            <td className="p-3">7</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="p-3 font-semibold text-gray-900">XL</td>
                            <td className="p-3">37</td>
                            <td className="p-3">33</td>
                            <td className="p-3">30</td>
                            <td className="p-3">7.5</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Kaftan Sizing Table */}
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]"></span>
                    Approximate Kaftan Measurement (Inches)
                  </h4>
                  <div className="overflow-x-auto border border-gray-100 rounded-xs">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-150 text-[#9D845F] uppercase tracking-wider">
                          <th className="p-3 font-semibold">Measurement</th>
                          <th className="p-3 font-semibold">Small</th>
                          <th className="p-3 font-semibold">Medium</th>
                          <th className="p-3 font-semibold">Large</th>
                          <th className="p-3 font-semibold">XL</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700 font-light">
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3 font-semibold text-gray-900">Length</td>
                          <td className="p-3">50</td>
                          <td className="p-3">50</td>
                          <td className="p-3">52</td>
                          <td className="p-3">52</td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3 font-semibold text-gray-900">Chest</td>
                          <td className="p-3">22</td>
                          <td className="p-3">24</td>
                          <td className="p-3">26</td>
                          <td className="p-3">27</td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3 font-semibold text-gray-900">Sleeves</td>
                          <td className="p-3">21</td>
                          <td className="p-3">22</td>
                          <td className="p-3">23</td>
                          <td className="p-3">23</td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3 font-semibold text-gray-900">Arm Hole</td>
                          <td className="p-3">9</td>
                          <td className="p-3">10</td>
                          <td className="p-3">11</td>
                          <td className="p-3">11</td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3 font-semibold text-gray-900">Sleeve Opening</td>
                          <td className="p-3">9</td>
                          <td className="p-3">10</td>
                          <td className="p-3">11</td>
                          <td className="p-3">11</td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3 font-semibold text-gray-900">Shoulder</td>
                          <td className="p-3">14.5</td>
                          <td className="p-3">15.5</td>
                          <td className="p-3">16.5</td>
                          <td className="p-3">17.5</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="p-3 font-semibold text-gray-900">Daaman</td>
                          <td className="p-3">31</td>
                          <td className="p-3">31</td>
                          <td className="p-3">31</td>
                          <td className="p-3">31</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="bg-[#F9F6F0] p-4 rounded-xs text-[11px] text-gray-600 leading-relaxed mt-6 border border-[#C5A880]/15">
                <span className="font-semibold uppercase text-gray-900 block mb-1">Bespoke Fitting Note</span>
                PRET Studio clothing is custom handcrafted for you. If you require unique alterations or custom sizes, you can configure your exact body measurements inside the Checkout screen.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
