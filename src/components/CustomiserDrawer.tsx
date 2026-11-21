import React from 'react';
import {
  AlertCircle,
  Check,
  Copy,
  ImagePlus,
  MessageCircle,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import type { Product, ShortlistItem } from '../types';
import { ACCENT_SWATCHES, buildWhatsAppUrl } from '../data/products';
import { ProductVisual } from './ProductVisual';

interface CustomiserDrawerProps {
  product: Product | null;
  onClose: () => void;
  onAddToShortlist: (item: Omit<ShortlistItem, 'id'>) => void;
}

export const CustomiserDrawer: React.FC<CustomiserDrawerProps> = ({
  product,
  onClose,
  onAddToShortlist,
}) => {
  const [customText, setCustomText] = React.useState('');
  const [accentColor, setAccentColor] = React.useState('#3B0D27');
  const [fontStyle, setFontStyle] = React.useState<'serif' | 'sans'>('serif');
  const [uploadedImage, setUploadedImage] = React.useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = React.useState<string | null>(null);
  const [quantityInput, setQuantityInput] = React.useState<string>('1');
  const [extraNotes, setExtraNotes] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const [addedToTray, setAddedToTray] = React.useState(false);

  React.useEffect(() => {
    if (!product) return;
    setCustomText(product.defaultSampleText);
    setAccentColor(product.defaultAccent);
    setFontStyle(product.isBulkOnly ? 'sans' : 'serif');
    setUploadedImage(null);
    setUploadedFileName(null);
    setQuantityInput(String(product.moq));
    setExtraNotes('');
    setCopied(false);
    setAddedToTray(false);
  }, [product]);

  // Close on Escape key
  React.useEffect(() => {
    if (!product) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const parsedQty = Number(quantityInput);
  const isBelowMoq = !Number.isFinite(parsedQty) || parsedQty < product.moq;
  const safeQty = isBelowMoq ? product.moq : Math.floor(parsedQty);
  const accentLabel =
    ACCENT_SWATCHES.find((s) => s.hex.toLowerCase() === accentColor.toLowerCase())?.name ??
    accentColor;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const whatsappMessage = [
    `Hello Amora.co! I'd like to enquire about a customised order:`,
    `• Product: ${product.name} (${product.isBulkOnly ? 'Corporate Bulk — MOQ 30+' : 'Personal Keepsake — No MOQ'})`,
    `• Quantity: ${safeQty} ${safeQty === 1 ? 'piece' : 'pieces'}`,
    `• Custom Text / Dedication: "${customText.trim() || 'None specified'}"`,
    `• Typography Style: ${fontStyle === 'serif' ? 'Editorial Serif' : 'Clean Modern Sans'}`,
    `• Accent Palette: ${accentLabel}`,
    `• Artwork / Photo Ready: ${uploadedFileName ? `Yes (${uploadedFileName} — will attach here)` : 'Will share shortly'}`,
    extraNotes.trim() ? `• Additional Notes: ${extraNotes.trim()}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore if clipboard API unavailable
    }
  };

  const handleAddCustomised = () => {
    onAddToShortlist({
      productId: product.id,
      name: product.name,
      isBulkOnly: product.isBulkOnly,
      moq: product.moq,
      quantity: safeQty,
      unitPriceEstimate: product.unitPriceEstimate,
      customText: customText.trim() || undefined,
      accentColor: accentLabel,
      artworkName: uploadedFileName ?? undefined,
      notes: extraNotes.trim() || undefined,
    });
    setAddedToTray(true);
    window.setTimeout(() => setAddedToTray(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#3B0D27]/45 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customiser-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl h-full bg-[#FDFBF7] shadow-2xl border-l border-[#EBDCE4] flex flex-col overflow-hidden">
        {/* Drawer Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[#EBDCE4] bg-[#FAF5EE]">
          <div className="min-w-0">
            <p className="text-xs text-[#6E5D66]">
              Live Product Customiser ·{' '}
              <span className="font-semibold text-[#3B0D27]">
                {product.isBulkOnly ? 'MOQ: 30+ Pieces' : 'No MOQ · From 1 Piece'}
              </span>
            </p>
            <h2
              id="customiser-title"
              className="font-editorial text-2xl font-semibold text-[#3B0D27] truncate"
            >
              {product.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close customiser drawer"
            className="w-10 h-10 rounded-lg border border-[#EBDCE4] bg-[#FDFBF7] flex items-center justify-center text-[#3B0D27] hover:bg-[#FCE7F3] transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Live Interactive Mockup Stage */}
          <div className="rounded-2xl overflow-hidden border border-[#EBDCE4] aspect-[16/11] w-full bg-[#FAF5EE] relative">
            <ProductVisual
              visualType={product.visualType}
              accentColor={accentColor}
              customText={customText}
              uploadedImage={uploadedImage}
              fontStyle={fontStyle}
              mode="studio"
            />
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-[#FDFBF7]/90 border border-[#EBDCE4] text-[11px] font-medium text-[#6E5D66]">
              Live Studio Mockup
            </div>
          </div>

          {/* Photo / Logo Upload Control */}
          <div className="rounded-xl bg-[#FAF5EE] border border-[#EBDCE4] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[#3B0D27]">
                  1. Upload Photo or Company Logo
                </p>
                <p className="text-xs text-[#6E5D66] mt-0.5">
                  Preview your artwork live directly onto the mockup above.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#3B0D27] text-[#FDFBF7] text-xs font-medium hover:bg-[#59163C] transition-colors cursor-pointer whitespace-nowrap">
                  <ImagePlus className="w-3.5 h-3.5" aria-hidden="true" />
                  {uploadedImage ? 'Replace Image' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
                {uploadedImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedImage(null);
                      setUploadedFileName(null);
                    }}
                    aria-label="Remove uploaded image"
                    className="p-2 rounded-lg border border-[#EBDCE4] bg-[#FDFBF7] text-[#6E5D66] hover:text-[#3B0D27] cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
            {uploadedFileName && (
              <p className="text-xs text-[#3B0D27] mt-2 truncate">
                Loaded: <span className="font-medium">{uploadedFileName}</span>
              </p>
            )}
          </div>

          {/* Custom Text / Dedication & Typography */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8">
              <label htmlFor="custom-caption" className="block text-xs font-semibold text-[#3B0D27] mb-1.5">
                2. Custom Text / Dedication / Brand Line
              </label>
              <input
                id="custom-caption"
                type="text"
                maxLength={48}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type a caption, name, date, or company tagline..."
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#EBDCE4] bg-[#FAF5EE]/50 text-[#3B0D27] focus:outline-none focus:border-[#3B0D27]"
              />
            </div>

            <div className="sm:col-span-4">
              <span className="block text-xs font-semibold text-[#3B0D27] mb-1.5">
                Typeface
              </span>
              <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-[#FAF5EE] border border-[#EBDCE4]">
                <button
                  type="button"
                  onClick={() => setFontStyle('serif')}
                  className={`py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    fontStyle === 'serif'
                      ? 'bg-[#FDFBF7] text-[#3B0D27] shadow-sm border border-[#EBDCE4]'
                      : 'text-[#6E5D66]'
                  }`}
                >
                  Editorial
                </button>
                <button
                  type="button"
                  onClick={() => setFontStyle('sans')}
                  className={`py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    fontStyle === 'sans'
                      ? 'bg-[#FDFBF7] text-[#3B0D27] shadow-sm border border-[#EBDCE4]'
                      : 'text-[#6E5D66]'
                  }`}
                >
                  Modern
                </button>
              </div>
            </div>
          </div>

          {/* Accent Colour Palette & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
            <div className="sm:col-span-7">
              <span className="block text-xs font-semibold text-[#3B0D27] mb-2">
                3. Brand / Border Accent — <span className="font-normal text-[#6E5D66]">{accentLabel}</span>
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                {ACCENT_SWATCHES.map((swatch) => {
                  const active = accentColor.toLowerCase() === swatch.hex.toLowerCase();
                  return (
                    <button
                      key={swatch.hex}
                      type="button"
                      onClick={() => setAccentColor(swatch.hex)}
                      title={swatch.name}
                      aria-label={`Select ${swatch.name} accent`}
                      className={`w-9 h-9 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                        active
                          ? 'border-[#3B0D27] scale-110'
                          : 'border-[#EBDCE4] hover:scale-105'
                      }`}
                      style={{ backgroundColor: swatch.hex }}
                    >
                      {active && (
                        <Check
                          className={`w-4 h-4 ${
                            swatch.hex === '#F3E9DC' || swatch.hex === '#E6A4B8'
                              ? 'text-[#3B0D27]'
                              : 'text-white'
                          }`}
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="sm:col-span-5">
              <label htmlFor="custom-qty" className="block text-xs font-semibold text-[#3B0D27] mb-1.5">
                4. Quantity {product.isBulkOnly ? '(Min. 30)' : '(From 1)'}
              </label>
              <input
                id="custom-qty"
                type="number"
                min={1}
                value={quantityInput}
                onChange={(e) => setQuantityInput(e.target.value)}
                className={`w-full px-3.5 py-2 text-sm font-semibold tabular-nums rounded-lg border bg-[#FAF5EE]/50 text-[#3B0D27] focus:outline-none ${
                  isBelowMoq ? 'border-[#B4234B]' : 'border-[#EBDCE4] focus:border-[#3B0D27]'
                }`}
              />
              {isBelowMoq && (
                <p className="mt-1.5 text-[11px] font-medium text-[#8C1D40] flex items-start gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                  MOQ is {product.moq} pieces for {product.shortName}.
                </p>
              )}
            </div>
          </div>

          {/* Extra Notes */}
          <div>
            <label htmlFor="custom-extra-notes" className="block text-xs font-semibold text-[#3B0D27] mb-1.5">
              5. Gift Wrapping / Delivery Date Notes (Optional)
            </label>
            <input
              id="custom-extra-notes"
              type="text"
              value={extraNotes}
              onChange={(e) => setExtraNotes(e.target.value)}
              placeholder="e.g. Birthday gift wrap, Kalyan pickup, or needed by Friday"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#EBDCE4] bg-[#FAF5EE]/50 text-[#3B0D27] focus:outline-none focus:border-[#3B0D27]"
            />
          </div>

          {/* Pre-Formatted WhatsApp Enquiry Preview */}
          <div className="rounded-xl bg-[#FAF5EE] border border-[#EBDCE4] p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-[#3B0D27]">
                Pre-Formatted WhatsApp Enquiry Message
              </span>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#3B0D27] hover:text-[#59163C] cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    Copy Brief
                  </>
                )}
              </button>
            </div>
            <pre className="text-xs text-[#6E5D66] whitespace-pre-wrap font-sans leading-relaxed">
              {whatsappMessage}
            </pre>
          </div>
        </div>

        {/* Sticky Drawer Footer Actions */}
        <div className="px-6 py-4 border-t border-[#EBDCE4] bg-[#FDFBF7] flex flex-col sm:flex-row gap-2.5">
          <a
            href={buildWhatsAppUrl(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-lg bg-[#3B0D27] text-[#FDFBF7] text-sm font-semibold hover:bg-[#59163C] transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            Enquire via WhatsApp
          </a>
          <button
            type="button"
            onClick={handleAddCustomised}
            className="py-3 px-4 rounded-lg bg-[#FCE7F3] text-[#3B0D27] border border-[#EBDCE4] text-sm font-semibold hover:bg-[#F9D8E6] transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            {addedToTray ? (
              <>
                <Check className="w-4 h-4" aria-hidden="true" />
                Added to Quote Tray
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" aria-hidden="true" />
                Add to Quote Tray
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
