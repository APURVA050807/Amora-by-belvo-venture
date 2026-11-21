import React from 'react';
import {
  ArrowRight,
  Check,
  Copy,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import type { ShortlistItem } from '../types';
import { buildWhatsAppUrl } from '../data/products';

interface ShortlistDrawerProps {
  isOpen: boolean;
  items: ShortlistItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onSendBulkToQuoteForm: () => void;
}

export const ShortlistDrawer: React.FC<ShortlistDrawerProps> = ({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearAll,
  onSendBulkToQuoteForm,
}) => {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasBulkItems = items.some((i) => i.isBulkOnly);
  const estimatedSubtotal = items.reduce(
    (sum, item) => sum + item.unitPriceEstimate * item.quantity,
    0
  );

  const consolidatedBrief = [
    `Hello Amora.co! Here is my consolidated Shortlist / Quote Tray enquiry:`,
    '',
    ...items.map((item, idx) => {
      const details = [
        `${idx + 1}. ${item.name} — Qty: ${item.quantity} ${item.isBulkOnly ? '(MOQ 30+ Bulk)' : '(Personal / No MOQ)'}`,
        item.customText ? `   Text: "${item.customText}"` : null,
        item.accentColor ? `   Accent: ${item.accentColor}` : null,
        item.finish ? `   Finish: ${item.finish}` : null,
        item.artworkName ? `   Artwork: ${item.artworkName}` : null,
        item.notes ? `   Notes: ${item.notes}` : null,
      ].filter(Boolean);
      return details.join('\n');
    }),
    '',
    `Indicative Studio Subtotal: ~₹${estimatedSubtotal.toLocaleString('en-IN')}`,
    `Please share final availability, digital proofs, and delivery timeline!`,
  ].join('\n');

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(consolidatedBrief);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback ignored
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#3B0D27]/45 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortlist-drawer-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md h-full bg-[#FDFBF7] shadow-2xl border-l border-[#EBDCE4] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[#EBDCE4] bg-[#FAF5EE]">
          <div>
            <p className="text-xs text-[#6E5D66]">Consolidated Enquiry List</p>
            <h2
              id="shortlist-drawer-title"
              className="font-editorial text-2xl font-semibold text-[#3B0D27]"
            >
              Quote Tray ({items.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close quote tray"
            className="w-10 h-10 rounded-lg border border-[#EBDCE4] bg-[#FDFBF7] flex items-center justify-center text-[#3B0D27] hover:bg-[#FCE7F3] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-14 h-14 rounded-2xl bg-[#FCE7F3] border border-[#EBDCE4] flex items-center justify-center text-[#3B0D27] mb-4">
                <ShoppingBag className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="font-editorial text-2xl font-semibold text-[#3B0D27]">
                Your quote tray is empty
              </h3>
              <p className="text-sm text-[#6E5D66] mt-2 max-w-xs">
                Save personal keepsakes or corporate bulk kits here to send everything together in
                one tidy brief.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 px-5 py-2.5 rounded-lg bg-[#3B0D27] text-[#FDFBF7] text-sm font-medium hover:bg-[#59163C] transition-colors cursor-pointer"
              >
                Browse Catalogue
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#6E5D66]">
                <span>{items.length} saved {items.length === 1 ? 'item' : 'items'}</span>
                <button
                  type="button"
                  onClick={onClearAll}
                  className="text-[#6E5D66] hover:text-[#3B0D27] underline underline-offset-2 cursor-pointer"
                >
                  Clear all
                </button>
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl bg-[#FAF5EE] border border-[#EBDCE4] p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-medium text-[#6E5D66]">
                        {item.isBulkOnly ? 'MOQ: 30+ Pieces · Corporate Bulk' : 'No MOQ · Personal Keepsake'}
                      </p>
                      <h3 className="font-editorial text-xl font-semibold text-[#3B0D27] leading-snug">
                        {item.name}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      aria-label={`Remove ${item.name} from tray`}
                      className="p-1.5 rounded-md text-[#6E5D66] hover:text-[#3B0D27] hover:bg-[#FCE7F3] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Customisation metadata */}
                  {(item.customText || item.accentColor || item.finish || item.artworkName || item.notes) && (
                    <div className="text-xs text-[#6E5D66] space-y-0.5 pt-2 border-t border-[#EBDCE4]">
                      {item.customText && (
                        <p>
                          Text: <span className="text-[#3B0D27] font-medium">“{item.customText}”</span>
                        </p>
                      )}
                      {item.accentColor && <p>Accent: {item.accentColor}</p>}
                      {item.finish && <p>Finish: {item.finish}</p>}
                      {item.artworkName && <p className="truncate">Artwork: {item.artworkName}</p>}
                      {item.notes && <p>{item.notes}</p>}
                    </div>
                  )}

                  {/* Quantity stepper & line estimate */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#EBDCE4]">
                    <div className="inline-flex items-center rounded-lg border border-[#EBDCE4] bg-[#FDFBF7]">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.isBulkOnly ? -5 : -1)}
                        disabled={item.quantity <= item.moq}
                        aria-label={`Decrease quantity for ${item.name}`}
                        className="w-8 h-8 flex items-center justify-center text-[#3B0D27] disabled:opacity-35 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold tabular-nums text-[#3B0D27]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.isBulkOnly ? 5 : 1)}
                        aria-label={`Increase quantity for ${item.name}`}
                        className="w-8 h-8 flex items-center justify-center text-[#3B0D27] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>

                    <p className="text-sm font-semibold text-[#3B0D27] tabular-nums">
                      ~₹{(item.unitPriceEstimate * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="px-6 py-4 border-t border-[#EBDCE4] bg-[#FDFBF7] space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-[#6E5D66]">Indicative Studio Total</span>
              <span className="font-editorial text-2xl font-semibold text-[#3B0D27] tabular-nums">
                ~₹{estimatedSubtotal.toLocaleString('en-IN')}
              </span>
            </div>

            <a
              href={buildWhatsAppUrl(consolidatedBrief)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-lg bg-[#3B0D27] text-[#FDFBF7] text-sm font-semibold hover:bg-[#59163C] transition-colors inline-flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              Send Entire Shortlist via WhatsApp
            </a>

            <div className="grid grid-cols-1 gap-2">
              {hasBulkItems && (
                <button
                  type="button"
                  onClick={onSendBulkToQuoteForm}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#FCE7F3] text-[#3B0D27] border border-[#EBDCE4] text-xs font-semibold hover:bg-[#F9D8E6] transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Load Bulk Items into B2B Quotation Form
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}

              <button
                type="button"
                onClick={handleCopyAll}
                className="w-full py-2 px-4 rounded-lg border border-[#EBDCE4] text-xs font-medium text-[#3B0D27] hover:bg-[#FAF5EE] transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    Consolidated List Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    Copy Consolidated List
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
