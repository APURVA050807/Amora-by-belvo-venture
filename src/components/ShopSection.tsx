import React from 'react';
import { Check, Plus, SlidersHorizontal } from 'lucide-react';
import type { OrderMode, Product, ProductCategory } from '../types';
import { CATEGORY_TABS } from '../data/products';
import { ProductVisual } from './ProductVisual';

interface ShopSectionProps {
  products: Product[];
  activeCategory: ProductCategory;
  orderMode: OrderMode;
  onCategoryChange: (category: ProductCategory) => void;
  onOrderModeChange: (mode: OrderMode) => void;
  onOpenCustomiser: (product: Product) => void;
  onQuickAddShortlist: (product: Product) => void;
  shortlistedProductIds: Set<string>;
}

const ORDER_MODES: Array<{ id: OrderMode; label: string }> = [
  { id: 'all', label: 'All Orders' },
  { id: 'personal', label: 'Single / Personal Orders (No MOQ)' },
  { id: 'bulk', label: 'Corporate Bulk Only (MOQ 30+)' },
];

export const ShopSection: React.FC<ShopSectionProps> = ({
  products,
  activeCategory,
  orderMode,
  onCategoryChange,
  onOrderModeChange,
  onOpenCustomiser,
  onQuickAddShortlist,
  shortlistedProductIds,
}) => {
  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      const categoryMatch =
        activeCategory === 'All' || product.categories.includes(activeCategory);
      const modeMatch =
        orderMode === 'all' ||
        (orderMode === 'personal' && !product.isBulkOnly) ||
        (orderMode === 'bulk' && product.isBulkOnly);
      return categoryMatch && modeMatch;
    });
  }, [products, activeCategory, orderMode]);

  return (
    <section id="shop" className="py-16 lg:py-24 bg-[#FDFBF7] border-b border-[#EBDCE4]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-[#6E5D66] mb-2">
              Studio Catalogue · 10 Signature Formats
            </p>
            <h2
              className="font-editorial text-3xl sm:text-5xl font-semibold text-[#3B0D27] leading-tight"
              style={{ textWrap: 'balance' }}
            >
              Personal keepsakes &amp; branded company essentials
            </h2>
          </div>
          <p className="text-sm text-[#6E5D66] max-w-md leading-relaxed">
            Personal prints start from a single unit with no minimums. Drinkware and desk
            merchandise follow our strict <span className="font-semibold text-[#3B0D27]">30+ piece bulk policy</span>.
          </p>
        </div>

        {/* Interactive Filter Controls */}
        <div className="flex flex-col gap-4 pb-8 mb-10 border-b border-[#EBDCE4]">
          {/* Primary Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeCategory === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onCategoryChange(tab)}
                  className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B0D27] ${
                    isActive
                      ? 'bg-[#3B0D27] text-[#FDFBF7]'
                      : 'bg-[#FAF5EE] text-[#6E5D66] border border-[#EBDCE4] hover:text-[#3B0D27] hover:border-[#3B0D27]/30'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Secondary Order Mode Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div
              role="group"
              aria-label="Filter by minimum order quantity"
              className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#FAF5EE] border border-[#EBDCE4] w-fit"
            >
              {ORDER_MODES.map((mode) => {
                const isSelected = orderMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => onOrderModeChange(mode.id)}
                    className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#FDFBF7] text-[#3B0D27] shadow-sm border border-[#EBDCE4]'
                        : 'text-[#6E5D66] hover:text-[#3B0D27]'
                    }`}
                  >
                    {mode.label}
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-[#6E5D66] tabular-nums">
              Showing <span className="font-semibold text-[#3B0D27]">{filteredProducts.length}</span>{' '}
              of {products.length} studio items
            </p>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl bg-[#FAF5EE] border border-[#EBDCE4] p-12 text-center">
            <p className="font-editorial text-2xl text-[#3B0D27]">
              No items match that exact combination
            </p>
            <p className="text-sm text-[#6E5D66] mt-2">
              Corporate bulk products live under Merchandise &amp; Customised Products, while
              No-MOQ keepsakes live under Prints &amp; Keepsakes and Stickers &amp; Photocards.
            </p>
            <button
              type="button"
              onClick={() => {
                onCategoryChange('All');
                onOrderModeChange('all');
              }}
              className="mt-5 px-5 py-2.5 text-sm font-medium rounded-lg bg-[#3B0D27] text-[#FDFBF7] hover:bg-[#59163C] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredProducts.map((product) => {
              const isSaved = shortlistedProductIds.has(product.id);
              return (
                <article
                  key={product.id}
                  className="stationery-card rounded-2xl overflow-hidden flex flex-col"
                >
                  {/* Visual Product Stage (68% height focal area) */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-[#EBDCE4]">
                    <ProductVisual
                      visualType={product.visualType}
                      accentColor={product.defaultAccent}
                      customText={product.defaultSampleText}
                      imageUrl={product.imageUrl}
                      alt={product.name}
                      mode="card"
                    />
                    {product.isBulkOnly && (
                      <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-md bg-[#3B0D27] text-[#FDFBF7] text-[11px] font-semibold tracking-wide shadow-sm">
                        MOQ: 30+ Pieces
                      </div>
                    )}
                  </div>

                  {/* Clean Editorial Metadata & Actions */}
                  <div className="p-6 flex flex-col flex-1 justify-between gap-5">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs text-[#6E5D66] mb-1.5">
                        <span>{product.primaryCategory}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-medium text-[#3B0D27]">
                          {product.isBulkOnly ? 'Corporate Bulk Only' : 'No MOQ · From 1 pc'}
                        </span>
                      </div>

                      <h3 className="font-editorial text-2xl font-semibold text-[#3B0D27] leading-snug">
                        {product.name}
                      </h3>

                      <p className="text-sm text-[#6E5D66] mt-2 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-3 text-xs text-[#6E5D66]">
                        {product.specs.slice(1).map((spec, idx) => (
                          <React.Fragment key={spec}>
                            {idx > 0 && <span aria-hidden="true">·</span>}
                            <span>{spec}</span>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#EBDCE4]">
                      <div className="flex items-baseline justify-between mb-4">
                        <span className="text-base font-semibold text-[#3B0D27] tabular-nums">
                          {product.priceLabel}
                        </span>
                        <span className="text-xs text-[#6E5D66]">{product.unitLabel}</span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => onOpenCustomiser(product)}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium rounded-lg bg-[#3B0D27] text-[#FDFBF7] hover:bg-[#59163C] transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B0D27]"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                          Personalise &amp; Enquire
                        </button>

                        <button
                          type="button"
                          onClick={() => onQuickAddShortlist(product)}
                          aria-label={`Add ${product.name} to quote tray`}
                          className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs sm:text-sm font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            isSaved
                              ? 'bg-[#FCE7F3] text-[#3B0D27] border-[#E0B8CC]'
                              : 'bg-[#FAF5EE] text-[#3B0D27] border-[#EBDCE4] hover:bg-[#FCE7F3]/70'
                          }`}
                        >
                          {isSaved ? (
                            <>
                              <Check className="w-3.5 h-3.5" aria-hidden="true" />
                              Saved
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                              Shortlist
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
