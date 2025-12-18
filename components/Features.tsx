"use client";

export default function Features() {
  const features = [
    {
      icon: <span className="text-3xl">🎂</span>,
      title: "Bánh sinh nhật",
      description: "Bánh sinh nhật trẻ em, người lớn, thiết kế theo yêu cầu",
    },
    {
      icon: <span className="text-3xl">💐</span>,
      title: "Hoa tươi",
      description: "Hoa sinh nhật, hoa sự kiện, bó hoa theo yêu cầu",
    },
    {
      icon: <span className="text-3xl">🎁</span>,
      title: "Tráp ăn hỏi",
      description: "Tráp cưới truyền thống, tráp bánh kẹo, tráp hoa quả",
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
