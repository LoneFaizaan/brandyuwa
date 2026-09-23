import React from 'react';
import { useStore } from '../../context/StoreContext';

export const InvoiceModal: React.FC = () => {
  const { activeInvoiceOrder, setActiveInvoiceOrder } = useStore();

  if (!activeInvoiceOrder) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-4 sm:p-6 md:p-10 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-white border border-border rounded-sm shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Modal Action Bar */}
        <div className="p-3 bg-neutral-900 text-white flex justify-between items-center print:hidden">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
            <span>Commercial Invoice & Packing Slip</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 text-xs font-semibold rounded flex items-center space-x-1"
            >
              <span className="material-symbols-outlined text-[14px]">print</span>
              <span>Print / PDF</span>
            </button>
            <button
              onClick={() => setActiveInvoiceOrder(null)}
              className="text-white/80 hover:text-white p-1"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-6 sm:p-8 space-y-6 text-black bg-white" id="printable-invoice">
          {/* Company & Invoice Header */}
          <div className="flex justify-between items-start border-b border-neutral-300 pb-5">
            <div>
              <h1 className="text-xl font-bold tracking-tight uppercase">ATELIER RETAIL</h1>
              <p className="text-[11px] text-neutral-500 uppercase tracking-widest mt-0.5">Architectural Menswear Studio</p>
              <p className="text-xs text-neutral-600 mt-2 leading-tight">
                88 Indiranagar 100ft Road, HAL 2nd Stage<br />
                Bengaluru, Karnataka 560038, India<br />
                GSTIN: 29AABCU9603R1ZM | CIN: U74999KA2024PTC188210
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-neutral-100 text-neutral-900 text-[10px] font-bold px-2 py-1 uppercase tracking-wider border border-neutral-200">
                Original for Recipient
              </span>
              <h2 className="text-sm font-bold mt-2 uppercase tracking-wide">TAX INVOICE</h2>
              <p className="text-xs font-mono mt-0.5 text-neutral-700">INV-2026-{activeInvoiceOrder.id}</p>
              <p className="text-xs text-neutral-500 mt-0.5">Order Ref: #{activeInvoiceOrder.id}</p>
              <p className="text-xs text-neutral-500">Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Customer / Consignee Address */}
          <div className="grid grid-cols-2 gap-4 text-xs border-b border-neutral-200 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">
                Billed & Shipped To:
              </span>
              <p className="font-bold text-neutral-900">{activeInvoiceOrder.shippingAddress.fullName}</p>
              <p className="text-neutral-600 leading-relaxed mt-0.5">
                {activeInvoiceOrder.shippingAddress.addressLine}<br />
                {activeInvoiceOrder.shippingAddress.city}, {activeInvoiceOrder.shippingAddress.state} - {activeInvoiceOrder.shippingAddress.pincode}<br />
                Phone: {activeInvoiceOrder.phone}<br />
                Email: {activeInvoiceOrder.email}
              </p>
            </div>
            <div className="bg-neutral-50 p-3 border border-neutral-200 rounded-xs space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-neutral-500">Payment Mode:</span>
                <span className="font-bold uppercase">{activeInvoiceOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Payment Status:</span>
                <span className="font-bold text-emerald-700 uppercase">{activeInvoiceOrder.paymentStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Fulfillment Status:</span>
                <span className="font-bold text-neutral-800 uppercase">{activeInvoiceOrder.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Dispatch Partner:</span>
                <span className="font-bold">BlueDart Express Air</span>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-neutral-100 text-neutral-700 uppercase text-[10px] tracking-wider border-y border-neutral-300">
                  <th className="py-2 px-2">#</th>
                  <th className="py-2 px-2">Item Description</th>
                  <th className="py-2 px-2">SKU</th>
                  <th className="py-2 px-2 text-center">Size</th>
                  <th className="py-2 px-2 text-center">Qty</th>
                  <th className="py-2 px-2 text-right">Price</th>
                  <th className="py-2 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {activeInvoiceOrder.items.map((item, idx) => (
                  <tr key={idx} className="text-neutral-800">
                    <td className="py-2 px-2 text-neutral-400 font-mono">{idx + 1}</td>
                    <td className="py-2 px-2 font-medium">
                      {item.product.name}
                      <span className="block text-[10px] text-neutral-500">Color: {item.selectedColor.name}</span>
                    </td>
                    <td className="py-2 px-2 font-mono text-[11px] text-neutral-600">{item.product.sku}</td>
                    <td className="py-2 px-2 text-center font-bold">{item.selectedSize}</td>
                    <td className="py-2 px-2 text-center tabular-nums">{item.quantity}</td>
                    <td className="py-2 px-2 text-right tabular-nums">₹{item.product.price.toLocaleString('en-IN')}</td>
                    <td className="py-2 px-2 text-right font-bold tabular-nums">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="tabular-nums">₹{activeInvoiceOrder.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {activeInvoiceOrder.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount Applied</span>
                  <span className="tabular-nums">-₹{activeInvoiceOrder.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Express Shipping</span>
                <span>{activeInvoiceOrder.shippingFee === 0 ? 'FREE' : `₹${activeInvoiceOrder.shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Integrated GST (12% Included)</span>
                <span className="tabular-nums">₹{Math.round(activeInvoiceOrder.total * 0.12).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-neutral-900 border-t border-neutral-300 pt-2">
                <span>Grand Total</span>
                <span className="tabular-nums">₹{activeInvoiceOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer declaration */}
          <div className="border-t border-neutral-200 pt-4 flex justify-between items-end text-[10px] text-neutral-500">
            <div>
              <p className="font-semibold text-neutral-700">Terms & Conditions:</p>
              <p>1. Goods once sold can be exchanged or returned within 14 days of delivery.</p>
              <p>2. Computer generated document, requires no physical signature.</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-neutral-800 uppercase">For Atelier Retail Pvt Ltd</p>
              <p className="mt-4 border-t border-neutral-400 pt-1">Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
