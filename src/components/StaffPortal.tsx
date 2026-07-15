import { useState, useEffect } from "react";
import { Order, Product } from "../types";
import { Check, Clipboard, Eye, Calendar, User, Phone, MapPin, DollarSign, RefreshCw, Trash2, Edit } from "lucide-react";

interface StaffPortalProps {
  regionCode: string;
}

export default function StaffPortal({ regionCode }: StaffPortalProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Status editing states
  const [editStatus, setEditStatus] = useState("");
  const [editPaymentStatus, setEditPaymentStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        // Sort descending by registration date
        setOrders(data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
    } catch (e) {
      console.error("Error loading orders", e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string) => {
    try {
      setIsUpdating(true);
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus: editStatus,
          paymentStatus: editPaymentStatus,
          trackingNumber: trackingNumber
        })
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          // Update local orders list state
          setOrders(orders.map((o) => (o.id === orderId ? result.order : o)));
          setSelectedOrder(result.order);
          alert("Order progress updated successfully!");
        }
      }
    } catch (e) {
      alert("Failed to update status.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-left border-b border-gray-100 pb-4 mb-8">
        <span className="text-[10px] text-[#9D845F] uppercase tracking-widest font-semibold block">Staff Portal & Order Desk</span>
        <h2 className="font-serif text-3xl font-light text-gray-900 mt-1">Management Desk</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Registered Orders List (5 columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-serif text-xl font-light text-gray-800">Order Registers</h3>
            <button
              onClick={fetchOrders}
              className="p-1 text-gray-400 hover:text-black transition-colors rounded-full"
              title="Refresh Registers"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center border rounded-xs text-xs text-gray-400 tracking-wider">
              Loading orders database...
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center border rounded-xs text-xs text-gray-400 tracking-wider">
              No orders registered yet. Run some test checkouts to see registers!
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2">
              {orders.map((order) => {
                const isSelected = selectedOrder?.id === order.id;
                return (
                  <div
                    key={order.id}
                    onClick={() => {
                      setSelectedOrder(order);
                      setEditStatus(order.orderStatus);
                      setEditPaymentStatus(order.paymentStatus);
                      setTrackingNumber(order.trackingNumber || "");
                    }}
                    className={`p-4 border rounded-xs cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? "border-[#C5A880] bg-[#C5A880]/5 shadow-xs"
                        : "border-gray-100 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-xs font-semibold text-gray-900">{order.orderNumber}</span>
                      <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                        {order.country}
                      </span>
                    </div>

                    <div className="text-xs text-gray-700 space-y-1">
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-gray-500">{order.items.length} designs • Total: {order.totalPrice.toLocaleString()}</p>
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                      <span className="text-[9px] uppercase font-semibold text-gray-400">
                        {new Date(order.date || "").toLocaleDateString()}
                      </span>
                      <span className="text-[10px] text-[#9D845F] font-semibold">
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Active Selected Order Detailed View (7 columns) */}
        <div className="lg:col-span-7 bg-white border border-[#C5A880]/15 p-6 rounded-xs">
          {selectedOrder ? (
            <div className="space-y-6 text-left">
              
              {/* Header block */}
              <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                <div>
                  <h4 className="font-serif text-2xl font-light text-gray-900">{selectedOrder.orderNumber}</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Registered: {new Date(selectedOrder.date || "").toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-[#C5A880]/15 text-[#9D845F] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {selectedOrder.orderStatus}
                  </span>
                </div>
              </div>

              {/* Customer information block */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xs text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-semibold">Client Contacts</span>
                  <p className="font-semibold text-gray-900 mt-1">{selectedOrder.customerName}</p>
                  <p className="text-gray-600 mt-0.5">{selectedOrder.phone}</p>
                  <p className="text-gray-600 mt-0.5">{selectedOrder.email}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-semibold">Shipping Destination</span>
                  <p className="font-semibold text-gray-900 mt-1">{selectedOrder.address}</p>
                  <p className="text-gray-600 mt-0.5">{selectedOrder.city}, {selectedOrder.state || ""}, {selectedOrder.postalCode}</p>
                  <p className="text-gray-600 mt-0.5 font-medium uppercase text-amber-800">Region Code: {selectedOrder.country}</p>
                </div>
              </div>

              {/* Items checklist */}
              <div>
                <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Ordered Outfits</h5>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-2.5 border border-gray-100 rounded-xs">
                      <div>
                        <span className="font-semibold text-gray-900 block">{item.productName}</span>
                        <span className="text-gray-500">Sizing: {item.size} • Qty: {item.quantity}</span>
                        {item.withDupatta && (
                          <span className="text-[10px] text-[#9D845F] font-semibold block mt-0.5">Includes custom dupatta</span>
                        )}
                      </div>
                      <span className="font-serif font-bold text-gray-900">
                        {item.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Couture custom measurements */}
              <div>
                <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Bespoke Custom Measurements</h5>
                {selectedOrder.customMeasurements ? (
                  <div className="grid grid-cols-3 gap-3 bg-amber-50/40 p-4 rounded-xs border border-amber-100 text-xs">
                    <div>Bust: <span className="font-semibold text-gray-900">{selectedOrder.customMeasurements.bust || "N/A"}</span></div>
                    <div>Waist: <span className="font-semibold text-gray-900">{selectedOrder.customMeasurements.waist || "N/A"}</span></div>
                    <div>Hips: <span className="font-semibold text-gray-900">{selectedOrder.customMeasurements.hips || "N/A"}</span></div>
                    <div>Shoulders: <span className="font-semibold text-gray-900">{selectedOrder.customMeasurements.shoulder || "N/A"}</span></div>
                    <div>Sleeves: <span className="font-semibold text-gray-900">{selectedOrder.customMeasurements.sleeves || "N/A"}</span></div>
                    <div>Length: <span className="font-semibold text-gray-900">{selectedOrder.customMeasurements.length || "N/A"}</span></div>
                    {selectedOrder.customMeasurements.additionalDetails && (
                      <div className="col-span-3 mt-1.5 pt-1.5 border-t border-gray-200/50 text-gray-500 italic">
                        Special Alterations: "{selectedOrder.customMeasurements.additionalDetails}"
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 italic font-light">No custom sizing supplied. Regular size chart used.</span>
                )}
              </div>

              {/* Pakistan Verification Screenshot File preview */}
              {selectedOrder.screenshotUrl && (
                <div>
                  <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Pakistan Deposit Screenshot</h5>
                  <div className="border border-gray-200 p-2 rounded-xs bg-[#FDFBF7]">
                    <img
                      src={selectedOrder.screenshotUrl}
                      alt="Local Payment slip"
                      referrerPolicy="no-referrer"
                      className="max-h-72 w-auto object-contain mx-auto border"
                    />
                  </div>
                </div>
              )}

              {/* EDIT STATUS FORM SECTION */}
              <div className="border-t border-gray-100 pt-6 space-y-4">
                <h5 className="text-xs font-semibold text-gray-900 uppercase tracking-widest font-sans">
                  Atelier Workshop Progress Control
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Couture Production Stage</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full border border-gray-200 focus:border-[#C5A880] p-2 text-xs rounded-xs outline-none bg-white"
                    >
                      <option value="Pending Atelier Verification">Pending Verification</option>
                      <option value="Measurements Confirmed">Measurements Confirmed</option>
                      <option value="In Cutting Workshop">In Cutting Workshop</option>
                      <option value="In Hand-Embroidery Stage">In Hand-Embroidery Stage</option>
                      <option value="In Sewing Workshop">In Sewing Workshop</option>
                      <option value="Quality Checked">Quality Checked</option>
                      <option value="Awaiting Remaining 50% Transfer">Awaiting Remaining 50% Transfer</option>
                      <option value="Pre-Order Dispatched">Pre-Order Dispatched</option>
                      <option value="Completed & Delivered">Completed & Delivered</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Invoice Payment Status</label>
                    <select
                      value={editPaymentStatus}
                      onChange={(e) => setEditPaymentStatus(e.target.value)}
                      className="w-full border border-gray-200 focus:border-[#C5A880] p-2 text-xs rounded-xs outline-none bg-white"
                    >
                      <option value="Pending Review">Pending Review</option>
                      <option value="50% Advance - Screenshot Uploaded">50% Advance - Screenshot Uploaded</option>
                      <option value="50% Deposit Approved">50% Deposit Approved</option>
                      <option value="100% Fully Paid">100% Fully Paid</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Carrier Tracking Number (DHL/FedEx/TCS)</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. DHL-983274291 or TCS-8492042"
                    className="w-full border border-gray-200 focus:border-[#C5A880] p-2 text-xs rounded-xs outline-none bg-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedOrder.id!)}
                  disabled={isUpdating}
                  className="w-full bg-[#1C1C1C] hover:bg-[#C5A880] text-white text-xs tracking-widest uppercase font-semibold py-2.5 rounded-xs transition-colors duration-300"
                >
                  {isUpdating ? "Saving progress to database..." : "Update Progress Ledger"}
                </button>
              </div>

            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center text-gray-400 space-y-2">
              <Clipboard className="w-12 h-12 text-gray-200" />
              <p className="text-xs tracking-wider">Select an order from the list on the left to inspect and update status.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
