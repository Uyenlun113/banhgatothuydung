'use client';

import { useEffect, useState } from 'react';

interface Promotion {
  _id: string;
  title: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export default function Newsletter() {
  const [promotion, setPromotion] = useState<Promotion | null>(null);

  useEffect(() => {
    fetch('/api/promotions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setPromotion(data.data[0]);
        }
      })
      .catch((error) => console.error('Promotion error:', error));
  }, []);

  if (!promotion) {
    return null;
  }

  const discountText =
    promotion.discountType === 'percentage'
      ? `-${promotion.discountValue}%`
      : `Tiết kiệm ${promotion.discountValue.toLocaleString('vi-VN')}đ`;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 rounded-[40px] bg-gradient-to-r from-primary-500 to-primary-400 px-8 py-10 text-white lg:grid-cols-2 lg:px-14 lg:py-16">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-white/70">Ưu đãi tuần này</p>
            <h2 className="text-3xl font-bold md:text-4xl">{promotion.title}</h2>
            <p className="text-base text-white/80 md:text-lg">
              {promotion.description || 'Áp dụng cho toàn bộ dòng bánh freshly-made.'}
            </p>
            <div className="inline-flex items-center gap-6 rounded-3xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white/80">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Thời gian</p>
                <p className="text-white">{new Date(promotion.startDate).toLocaleDateString('vi-VN')} → {new Date(promotion.endDate).toLocaleDateString('vi-VN')}</p>
              </div>
              <div className="text-lg font-bold text-white">{discountText}</div>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="rounded-[28px] border border-white/30 bg-white/10 p-6 backdrop-blur">
              <div className="text-sm uppercase tracking-[0.3em] text-white/70">Áp dụng code</div>
              <p className="mt-4 text-4xl font-semibold">{discountText}</p>
              <p className="text-white/80">Nhập mã <span className="font-semibold text-white">APCAKE</span> tại bước thanh toán</p>
              <div className="mt-6 rounded-2xl bg-white/90 px-4 py-3 text-center text-sm font-medium text-primary-600">
                CODE: APCAKE
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 hidden h-28 w-28 rounded-full bg-white/30 lg:block" />
            <div className="absolute -top-6 -left-4 hidden h-20 w-20 rounded-full bg-white/20 lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
}

