import React from 'react';
import { FileText, MessageCircle, ShoppingBag } from 'lucide-react';
import type {
  CorporatePrefill,
  OrderMode,
  Product,
  ProductCategory,
  ShortlistItem,
} from './types';
import { PRODUCTS, buildWhatsAppUrl } from './data/products';
import { HeroSection } from './components/HeroSection';
import { ShopSection } from './components/ShopSection';
import { CorporateSection } from './components/CorporateSection';
import { AboutAndContactSection } from './components/AboutAndContactSection';
import { CustomiserDrawer } from './components/CustomiserDrawer';
import { ShortlistDrawer } from './components/ShortlistDrawer';
import { StylistWidget } from './components/StylistWidget';

const SHORTLIST_STORAGE_KEY = 'amora_shortlist_v1';

function loadInitialShortlist(): ShortlistItem[] {
  try {
    const raw = window.localStorage.getItem(SHORTLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ShortlistItem[]) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [activeCategory, setActiveCategory] = React.useState<ProductCategory>('All');
  const [orderMode, setOrderMode] = React.useState<OrderMode>('all');
  const [customisingProduct, setCustomisingProduct] = React.useState<Product | null>(null);
  const [isShortlistOpen, setIsShortlistOpen] = React.useState(false);
  const [shortlist, setShortlist] = React.useState<ShortlistItem[]>(loadInitialShortlist);
  const [corporatePrefill, setCorporatePrefill] = React.useState<CorporatePrefill | null>(null);
  const [toastText, setToastText] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(SHORTLIST_STORAGE_KEY, JSON.stringify(shortlist));
    } catch {
      // Ignore storage quota errors
    }
  }, [shortlist]);

  const showToast = (message: string) => {
    setToastText(message);
    window.setTimeout(() => {
      setToastText((current) => (current === message ? null : current));
    }, 2600);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleExplorePersonal = () => {
    setActiveCategory('All');
    setOrderMode('personal');
    scrollToSection('shop');
  };

  const handleExploreCorporate = () => {
    scrollToSection('corporate');
  };

  const handleJumpToCategory = (category: ProductCategory, mode: OrderMode = 'all') => {
    setActiveCategory(category);
    setOrderMode(mode);
    scrollToSection('shop');
  };

  const handleAddShortlistItem = (draft: Omit<ShortlistItem, 'id'>) => {
    setShortlist((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === draft.productId &&
          (item.customText ?? '') === (draft.customText ?? '') &&
          (item.accentColor ?? '') === (draft.accentColor ?? '') &&
          (item.finish ?? '') === (draft.finish ?? '')
      );
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + draft.quantity,
        };
        return next;
      }
      return [
        ...prev,
        {
          ...draft,
          id: `${draft.productId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        },
      ];
    });
    showToast(`Added ${draft.name} to Quote Tray`);
  };

  const handleQuickAddProduct = (product: Product) => {
    handleAddShortlistItem({
      productId: product.id,
      name: product.name,
      isBulkOnly: product.isBulkOnly,
      moq: product.moq,
      quantity: product.moq,
      unitPriceEstimate: product.unitPriceEstimate,
    });
  };

  const handleAddKitToShortlist = (kitItems: Omit<ShortlistItem, 'id'>[]) => {
    setShortlist((prev) => [
      ...prev,
      ...kitItems.map((item) => ({
        ...item,
        id: `${item.productId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      })),
    ]);
    showToast(`Added ${kitItems.length} corporate kit items to Quote Tray`);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setShortlist((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.moq, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setShortlist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearShortlist = () => {
    setShortlist([]);
  };

  const handleSendBulkToQuoteForm = () => {
    const bulkItems = shortlist.filter((item) => item.isBulkOnly);
    if (bulkItems.length === 0) return;

    const uniqueNames = Array.from(new Set(bulkItems.map((b) => b.name)));
    const maxQty = Math.max(30, ...bulkItems.map((b) => b.quantity));
    const finish = bulkItems.find((b) => b.finish)?.finish ?? 'UV Print';
    const notes = bulkItems
      .map((b) => {
        const extra = [b.customText ? `Text: "${b.customText}"` : null, b.notes]
          .filter(Boolean)
          .join(' · ');
        return `${b.name} (${b.quantity} pcs${extra ? ` — ${extra}` : ''})`;
      })
      .join('; ');

    setCorporatePrefill({
      products: uniqueNames,
      quantity: maxQty,
      finish,
      requirements: `Transferred from Quote Tray: ${notes}`,
    });
    setIsShortlistOpen(false);
    scrollToSection('bulk-quote-form');
  };

  const shortlistedProductIds = React.useMemo(
    () => new Set(shortlist.map((item) => item.productId)),
    [shortlist]
  );

  const quickWhatsAppUrl = buildWhatsAppUrl(
    'Hello Amora.co! I would like to enquire about personalised gifting or corporate bulk merchandise.'
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3B0D27]">
      {/* Strict 3-Zone Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#FDFBF7]/95 backdrop-blur-sm border-b border-[#EBDCE4]">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#home"
            className="font-editorial text-2xl sm:text-[28px] font-semibold tracking-tight text-[#3B0D27] whitespace-nowrap shrink-0"
          >
            amora.co
          </a>

          {/* Zone 2: 5 Concise Single-Line Text Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#6E5D66]"
          >
            <a
              href="#shop"
              className="hover:text-[#3B0D27] transition-colors whitespace-nowrap shrink-0"
            >
              Shop
            </a>
            <a
              href="#corporate"
              className="hover:text-[#3B0D27] transition-colors whitespace-nowrap shrink-0"
            >
              Corporate
            </a>
            <a
              href="#bulk-quote-form"
              className="hover:text-[#3B0D27] transition-colors whitespace-nowrap shrink-0"
            >
              Bulk Quote
            </a>
            <a
              href="#about"
              className="hover:text-[#3B0D27] transition-colors whitespace-nowrap shrink-0"
            >
              About
            </a>
            <a
              href="#contact"
              className="hover:text-[#3B0D27] transition-colors whitespace-nowrap shrink-0"
            >
              Contact
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsShortlistOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-[#3B0D27] text-[#FDFBF7] hover:bg-[#59163C] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B0D27]"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              <span>Quote Tray</span>
              {shortlist.length > 0 && (
                <span className="tabular-nums text-[#F9D8E6]">({shortlist.length})</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Single-Page Experience */}
      <main>
        <HeroSection
          onExplorePersonal={handleExplorePersonal}
          onExploreCorporate={handleExploreCorporate}
          onJumpToCategory={handleJumpToCategory}
        />

        <ShopSection
          products={PRODUCTS}
          activeCategory={activeCategory}
          orderMode={orderMode}
          onCategoryChange={setActiveCategory}
          onOrderModeChange={setOrderMode}
          onOpenCustomiser={setCustomisingProduct}
          onQuickAddShortlist={handleQuickAddProduct}
          shortlistedProductIds={shortlistedProductIds}
        />

        <CorporateSection
          prefill={corporatePrefill}
          onAddKitToShortlist={handleAddKitToShortlist}
        />

        <AboutAndContactSection />
      </main>

      {/* Subtle Shortlist Toast Notification */}
      {toastText && (
        <div
          role="status"
          aria-live="polite"
          className="fixed left-1/2 -translate-x-1/2 bottom-20 md:bottom-6 z-40 px-4 py-2.5 rounded-lg bg-[#3B0D27] text-[#FDFBF7] text-xs sm:text-sm font-medium shadow-lg border border-[#59163C] whitespace-nowrap"
        >
          {toastText}
        </div>
      )}

      {/* Slide-Over Live Product Customisation & Mockup Previewer */}
      <CustomiserDrawer
        product={customisingProduct}
        onClose={() => setCustomisingProduct(null)}
        onAddToShortlist={handleAddShortlistItem}
      />

      {/* Slide-Over Saved Shortlist / Quote Tray */}
      <ShortlistDrawer
        isOpen={isShortlistOpen}
        items={shortlist}
        onClose={() => setIsShortlistOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearAll={handleClearShortlist}
        onSendBulkToQuoteForm={handleSendBulkToQuoteForm}
      />

      {/* Floating AI Gift & Merch Stylist (Gemini API) */}
      <StylistWidget />

      {/* Mobile Sticky Bottom Quick-Action Bar (Compact 56px, <= 15% mobile cap) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 h-14 bg-[#FDFBF7]/95 backdrop-blur-sm border-t border-[#EBDCE4] px-3 flex items-center gap-2.5">
        <a
          href={quickWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 h-10 rounded-lg bg-[#3B0D27] text-[#FDFBF7] text-xs font-semibold inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          <MessageCircle className="w-4 h-4" aria-hidden="true" />
          WhatsApp
        </a>
        <button
          type="button"
          onClick={() => scrollToSection('bulk-quote-form')}
          className="flex-1 h-10 rounded-lg bg-[#FCE7F3] text-[#3B0D27] border border-[#EBDCE4] text-xs font-semibold inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
        >
          <FileText className="w-4 h-4" aria-hidden="true" />
          Bulk Quote
        </button>
      </div>
    </div>
  );
}
