import React from 'react';
import { ArrowUpRight, Instagram, Mail, MapPin, MessageCircle } from 'lucide-react';
import {
  BRAND_LOGO_URL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  INSTAGRAM_LOOKBOOK,
  STUDIO_EMAIL,
  buildWhatsAppUrl,
} from '../data/products';
import { ProductVisual } from './ProductVisual';

export const AboutAndContactSection: React.FC = () => {
  const [logoError, setLogoError] = React.useState(false);

  const conciergeWhatsApp = buildWhatsAppUrl(
    'Hello Amora.co team! I would love to discuss a personalised gift or corporate merchandise enquiry.'
  );

  return (
    <>
      {/* 4. ABOUT US */}
      <section id="about" className="py-16 lg:py-24 bg-[#FDFBF7] border-b border-[#EBDCE4]">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Editorial Studio Emblem Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-[#FAF5EE] border border-[#EBDCE4] p-7 sm:p-10 flex flex-col items-center text-center">
                <div className="w-56 sm:w-64 aspect-square rounded-2xl overflow-hidden bg-[#FDFBF7] border border-[#EBDCE4] shadow-[0_18px_34px_-16px_rgba(59,13,39,0.2)] flex items-center justify-center">
                  {!logoError ? (
                    <img
                      src={BRAND_LOGO_URL}
                      alt="Amora.co official logo — prints and pretty things"
                      referrerPolicy="no-referrer"
                      onError={() => setLogoError(true)}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="p-6">
                      <p className="font-editorial text-4xl font-semibold text-[#3B0D27]">
                        amora.co
                      </p>
                      <p className="text-xs text-[#6E5D66] mt-1">prints, &amp; pretty things</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-5 border-t border-[#EBDCE4] w-full flex flex-col gap-1">
                  <p className="text-xs font-semibold text-[#3B0D27]">
                    Founded by Achintya Gurba
                  </p>
                  <p className="text-xs text-[#6E5D66]">
                    Kalyan, Thane District, Maharashtra, India
                  </p>
                </div>
              </div>
            </div>

            {/* Founder & Brand Story */}
            <div className="lg:col-span-7">
              <p className="text-xs font-medium text-[#6E5D66] mb-2">
                Our Story · Prints &amp; Pretty Things
              </p>
              <h2
                className="font-editorial text-3xl sm:text-5xl font-semibold text-[#3B0D27] leading-tight"
                style={{ textWrap: 'balance' }}
              >
                Where heartfelt keepsakes meet high-craft corporate branding
              </h2>

              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[#6E5D66]">
                <p>
                  Founded by <span className="font-semibold text-[#3B0D27]">Achintya Gurba</span> in{' '}
                  <span className="font-semibold text-[#3B0D27]">
                    Kalyan, Thane District, Maharashtra
                  </span>
                  , <span className="font-semibold text-[#3B0D27]">Amora.co</span> began with a
                  simple belief: printed objects should feel intentional, tactile, and worth
                  keeping — never disposable.
                </p>
                <p>
                  On one side of our studio table, we craft intimate single-piece keepsakes with
                  zero minimum orders: vintage-toned polaroids, pressed-feel bookmarks, kiss-cut
                  sticker sheets, and wax-sealed photostrip letters made to celebrate birthdays,
                  friendships, and quiet everyday memories.
                </p>
                <p>
                  On the other, we partner with growing startups, agencies, and HR leaders to
                  produce cohesive corporate merchandise and employee welcome kits (from 30+ pieces)
                  with studio-grade colour calibration across drinkware and workspace mats.
                </p>
              </div>

              {/* Three Studio Craft Commitments */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8 pt-8 border-t border-[#EBDCE4]">
                <div>
                  <p className="font-editorial text-2xl font-semibold text-[#3B0D27]">1 Piece</p>
                  <p className="text-xs text-[#6E5D66] mt-1">
                    No MOQ on personal prints, polaroids, frames &amp; bookmarks
                  </p>
                </div>
                <div>
                  <p className="font-editorial text-2xl font-semibold text-[#3B0D27]">30+ MOQ</p>
                  <p className="text-xs text-[#6E5D66] mt-1">
                    Dedicated bulk production for bottles, mugs &amp; desk mats
                  </p>
                </div>
                <div>
                  <p className="font-editorial text-2xl font-semibold text-[#3B0D27]">Kalyan Hub</p>
                  <p className="text-xs text-[#6E5D66] mt-1">
                    Proofed in Thane District, shipped reliably across India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONTACT & SOCIAL HUB */}
      <section id="contact" className="py-16 lg:py-24 bg-[#FAF5EE]">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
            <div className="lg:col-span-7">
              <p className="text-xs font-medium text-[#6E5D66] mb-2">
                Contact &amp; Social Lookbook · {INSTAGRAM_HANDLE}
              </p>
              <h2
                className="font-editorial text-3xl sm:text-5xl font-semibold text-[#3B0D27] leading-tight"
                style={{ textWrap: 'balance' }}
              >
                Start a conversation with our Kalyan studio
              </h2>
            </div>
            <div className="lg:col-span-5 flex flex-wrap gap-3 lg:justify-end">
              <a
                href={conciergeWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#3B0D27] text-[#FDFBF7] text-sm font-semibold hover:bg-[#59163C] transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                WhatsApp Concierge
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#FDFBF7] border border-[#EBDCE4] text-[#3B0D27] text-sm font-semibold hover:bg-[#FCE7F3] transition-colors whitespace-nowrap"
              >
                <Instagram className="w-4 h-4" aria-hidden="true" />
                Follow {INSTAGRAM_HANDLE}
              </a>
            </div>
          </div>

          {/* Direct Contact Details Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            <a
              href={conciergeWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-[#FDFBF7] border border-[#EBDCE4] p-6 hover:border-[#3B0D27]/40 transition-colors flex flex-col justify-between gap-4"
            >
              <div className="flex items-center justify-between text-[#3B0D27]">
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
                <ArrowUpRight className="w-4 h-4 text-[#6E5D66]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-[#6E5D66]">Direct Order &amp; Proofing Desk</p>
                <p className="font-editorial text-2xl font-semibold text-[#3B0D27] mt-1">
                  WhatsApp Concierge
                </p>
                <p className="text-xs text-[#6E5D66] mt-1">
                  Fastest for sending photos, captions &amp; logo files
                </p>
              </div>
            </a>

            <a
              href={`mailto:${STUDIO_EMAIL}`}
              className="rounded-2xl bg-[#FDFBF7] border border-[#EBDCE4] p-6 hover:border-[#3B0D27]/40 transition-colors flex flex-col justify-between gap-4"
            >
              <div className="flex items-center justify-between text-[#3B0D27]">
                <Mail className="w-5 h-5" aria-hidden="true" />
                <ArrowUpRight className="w-4 h-4 text-[#6E5D66]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-[#6E5D66]">Corporate Procurement &amp; Press</p>
                <p className="font-editorial text-2xl font-semibold text-[#3B0D27] mt-1">
                  {STUDIO_EMAIL}
                </p>
                <p className="text-xs text-[#6E5D66] mt-1">
                  GST invoices, POs &amp; vector artwork submissions
                </p>
              </div>
            </a>

            <div className="rounded-2xl bg-[#FDFBF7] border border-[#EBDCE4] p-6 flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between text-[#3B0D27]">
                <MapPin className="w-5 h-5" aria-hidden="true" />
                <span className="text-xs text-[#6E5D66]">Maharashtra, India</span>
              </div>
              <div>
                <p className="text-xs text-[#6E5D66]">Studio Location</p>
                <p className="font-editorial text-2xl font-semibold text-[#3B0D27] mt-1">
                  Kalyan, Thane District
                </p>
                <p className="text-xs text-[#6E5D66] mt-1">
                  Local studio pickup by appointment · Pan-India delivery
                </p>
              </div>
            </div>
          </div>

          {/* Curated Instagram Lookbook Grid */}
          <div className="rounded-2xl bg-[#FDFBF7] border border-[#EBDCE4] p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#3B0D27]">
                  Fresh off the studio table
                </h3>
                <p className="text-xs sm:text-sm text-[#6E5D66] mt-0.5">
                  Explore recent personalised prints, unboxings, and team kits on Instagram{' '}
                  <span className="font-semibold text-[#3B0D27]">{INSTAGRAM_HANDLE}</span>
                </p>
              </div>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3B0D27] hover:text-[#59163C] whitespace-nowrap shrink-0"
              >
                Open Instagram Feed
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {INSTAGRAM_LOOKBOOK.map((post) => (
                <a
                  key={post.id}
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl overflow-hidden border border-[#EBDCE4] bg-[#FAF5EE] flex flex-col hover:border-[#3B0D27]/40 transition-colors"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden border-b border-[#EBDCE4]">
                    <ProductVisual
                      visualType={post.visualType}
                      accentColor={post.accent}
                      customText={post.sampleText}
                      alt={post.title}
                      mode="card"
                    />
                  </div>
                  <div className="p-4 bg-[#FDFBF7] flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-[#6E5D66] mb-1">
                        <span>{INSTAGRAM_HANDLE}</span>
                        <span>{post.category}</span>
                      </div>
                      <h4 className="font-editorial text-xl font-semibold text-[#3B0D27] group-hover:text-[#59163C]">
                        {post.title}
                      </h4>
                      <p className="text-xs text-[#6E5D66] mt-1 leading-relaxed">{post.caption}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Clean Quiet Footer */}
      <footer className="bg-[#3B0D27] text-[#FDFBF7] pt-12 pb-24 md:pb-12">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-editorial text-2xl font-semibold">amora.co</p>
            <p className="text-xs text-[#F9D8E6]/80 mt-1">
              Thoughtfully Personalised. Beautifully Branded. · Kalyan, Thane District, Maharashtra
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs text-[#F9D8E6]/85">
            <a href="#shop" className="hover:text-white transition-colors">
              Shop
            </a>
            <a href="#corporate" className="hover:text-white transition-colors">
              Corporate (MOQ 30+)
            </a>
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Instagram ({INSTAGRAM_HANDLE})
            </a>
            <span className="text-[#F9D8E6]/60">
              © {new Date().getFullYear()} Amora.co · Founded by Achintya Gurba
            </span>
          </div>
        </div>
      </footer>
    </>
  );
};
