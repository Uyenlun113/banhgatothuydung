"use client";

export default function Features() {
  const features = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      ),
      title: "Giao hàng miễn phí",
      description: "Giao hàng miễn phí, nhanh chóng và đáng tin cậy cho đơn hàng trên $50.00",
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v13m0-13V6a2 2 0 112 2v-2m0 13V5a2 2 0 114 0v6m-6 0a2 2 0 102 0m-2 0a2 2 0 112 0m6 0a2 2 0 102 0m-2 0a2 2 0 112 0"
          />
        </svg>
      ),
      title: "Thanh toán an toàn",
      description: "Giới thiệu bạn bè hoặc viết đánh giá và nhận quà tặng bất ngờ",
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      title: "Hỗ trợ 24/7",
      description: "Hãy gọi cho chúng tôi và nhận dịch vụ tư vấn tốt nhất",
    },
  ];

  return (
    <section className="py-14 bg-gradient-to-b from-white to-primary-50/60">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-3xl border border-white bg-white/80 p-6 shadow-[0_20px_45px_rgba(236,72,153,0.08)] backdrop-blur transition hover:-translate-y-1 hover:bg-white"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-500 transition group-hover:bg-primary-100 flex-shrink-0">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              </div>
              <p className="text-sm text-gray-500">{feature.description}</p>
              <div className="mt-4 h-[2px] w-16 rounded-full bg-primary-200 transition group-hover:w-24" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
