import React, { useState } from "react";
import { Product, RegionCode } from "../types";
import { motion } from "motion/react";
import { Heart, ShoppingBag, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
  regionCode: RegionCode;
  currencySymbol: string;
  onViewDetails: (product: Product) => void;
  onAddToBasket: (product: Product, size: string, withDupatta: boolean) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  regionCode,
  currencySymbol,
  onViewDetails,
  onAddToBasket,
  isWishlisted,
  onToggleWishlist
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Price formatting
  const price = product.prices[regionCode];
  const formattedPrice = isNaN(price) ? "" : price.toLocaleString();

  // Pick display image based on hover status
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] || product.images[0];

  return (
    <div
      className="group relative flex flex-col bg-white border border-[#C5A880]/15 overflow-hidden rounded-sm transition-shadow duration-300 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[3/4] bg-[#F7F5F0] overflow-hidden cursor-pointer" onClick={() => onViewDetails(product)}>
        {/* Pre-Order Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span className="text-[9px] font-sans font-medium uppercase tracking-[0.2em] bg-black text-white px-2.5 py-1 rounded-xs">
            {product.stockStatus}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all duration-300 shadow-xs group-hover:opacity-100"
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-300 ${
              isWishlisted ? "text-red-600 fill-red-600" : "text-gray-400 group-hover:text-gray-600"
            }`}
          />
        </button>

        {/* Double-Image Interactive Crossfade Hover Zoom */}
        <div className="w-full h-full relative overflow-hidden bg-white">
          {/* Back Image (Underneath) */}
          <img
            src={secondaryImage}
            alt={`${product.name} back view`}
            referrerPolicy="no-referrer"
            className={`absolute inset-0 w-full h-full object-contain bg-white transition-transform duration-700 ease-out scale-102 ${
              isHovered ? "opacity-100 scale-105" : "opacity-0"
            }`}
          />
          {/* Front Image (Top) */}
          <img
            src={primaryImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            className={`absolute inset-0 w-full h-full object-contain bg-white transition-all duration-700 ease-out ${
              isHovered ? "opacity-0 scale-105" : "opacity-100"
            }`}
          />
        </div>

        {/* Hover Action Overlay Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={isHovered ? { y: 0, opacity: 1 } : { y: 15, opacity: 0 }}
            className="flex gap-2 w-full px-3"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(product);
              }}
              className="flex-1 bg-white hover:bg-[#1C1C1C] hover:text-white text-gray-900 text-[10px] tracking-widest uppercase font-medium py-2.5 px-2 flex items-center justify-center gap-1.5 transition-colors duration-300 border border-gray-100 rounded-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Add default size "S" or trigger modal detail
                onAddToBasket(product, "M", false);
              }}
              className="flex-1 bg-[#1C1C1C] hover:bg-[#C5A880] text-white text-[10px] tracking-widest uppercase font-medium py-2.5 px-2 flex items-center justify-center gap-1.5 transition-colors duration-300 rounded-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>+ Basket</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div className="mb-2">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-sans">
            {product.fabric}
          </span>
          <h4 className="font-serif text-lg font-light text-gray-900 tracking-wide mt-1 group-hover:text-[#C5A880] transition-colors duration-300 truncate">
            {product.name}
          </h4>
          <p className="text-gray-500 text-xs mt-1 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#C5A880]/10">
          <div>
            <span className="text-xs text-gray-400 block tracking-wider uppercase">Price</span>
            <span className="font-serif text-base font-semibold text-gray-900">
              {currencySymbol} {formattedPrice}
            </span>
          </div>

          <button
            onClick={() => onViewDetails(product)}
            className="text-[10px] tracking-widest uppercase text-[#9D845F] hover:text-[#1C1C1C] font-semibold border-b border-[#C5A880] pb-0.5 transition-colors"
          >
            Customize & Shop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
