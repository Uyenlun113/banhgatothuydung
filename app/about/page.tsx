"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-100 via-primary-50 to-white py-10 overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-10 w-32 h-32 bg-primary-200 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary-300 rounded-full blur-3xl"></div>
          </div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary-500 mb-6">
                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                Về chúng tôi
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Bánh Gato <span className="text-primary-500">Thúy Dung</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Ngọt ngào gửi trọn yêu thương – Hiệu bánh thủ công tại Nguyệt Đức, Phú Thọ
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full bg-primary-100 rounded-3xl"></div>
                <img
                  src="https://res.cloudinary.com/datjhdhe2/image/upload/v1763458900/576532236_4201855833419678_1444017225392973163_n_f3omcv.jpg"
                  alt="Bánh Gato Thúy Dung"
                  className="relative rounded-3xl shadow-2xl w-full object-cover"
                />
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl">
                  <p className="text-4xl font-bold text-primary-500">5+</p>
                  <p className="text-sm text-gray-600">Năm kinh nghiệm</p>
                </div>
              </div>

              <div className="space-y-6">
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">
                  Câu chuyện của chúng tôi
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Giới thiệu hiệu bánh Thúy Dung</h2>
                <p className="text-gray-600 leading-relaxed">
                  Hiệu bánh Gato Thúy Dung là địa chỉ quen thuộc chuyên cung cấp bánh sinh nhật, bánh sự kiện và bánh
                  ngọt theo yêu cầu với hương vị thơm ngon – chuẩn vị – an toàn.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Với nhiều năm kinh nghiệm làm bánh thủ công, chúng tôi luôn đặt chất lượng và sự hài lòng của khách
                  hàng lên hàng đầu.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Thúy Dung nhận làm bánh sinh nhật trẻ em – người lớn, bánh cưới, bánh kỷ niệm, khai trương, cupcake –
                  mini cake và cả bánh thiết kế theo mẫu khách gửi.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-400 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-primary-200/50 hover:shadow-primary-300/50 transition hover:scale-[1.02]"
                >
                  Liên hệ đặt bánh
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">Dịch vụ</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { icon: "🎂", title: "Bánh sinh nhật", desc: "Trẻ em & người lớn, thiết kế theo yêu cầu" },
                { icon: "💒", title: "Bánh tiệc cưới", desc: "Tiệc kỷ niệm, khai trương, sự kiện" },
                { icon: "🧁", title: "Cupcake & Mini cake", desc: "Set teatime, tiệc nhỏ, quà tặng" },
                { icon: "✨", title: "Bánh theo mẫu", desc: "Thiết kế theo hình ảnh khách gửi" },
                { icon: "💐", title: "Hoa tươi", desc: "Hoa sinh nhật, hoa sự kiện, bó hoa theo yêu cầu" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group bg-white rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(236,72,153,0.12)] transition-all hover:-translate-y-2"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center text-3xl mb-4 group-hover:bg-primary-100 transition">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Locations Section */}
        <section className="py-6 bg-gradient-to-b from-primary-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">Địa chỉ</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">Hệ thống cửa hàng</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                { title: "Cơ sở 1", address: "69 Phố Lồ, xã Nguyệt Đức, Phú Thọ", phone: "0988 884 285" },
                { title: "Cơ sở 2", address: "208 Văn Tiến, xã Nguyệt Đức, Phú Thọ", phone: "0988 884 285" },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-3xl p-8 shadow-[0_15px_50px_rgba(0,0,0,0.06)]">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center text-2xl flex-shrink-0">
                      📍
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-primary-500 font-semibold">{item.title}</p>
                      <p className="mt-2 text-lg font-bold text-gray-900">{item.address}</p>
                      <a
                        href={`tel:${item.phone.replace(/\s/g, "")}`}
                        className="mt-2 inline-flex items-center gap-2 text-primary-600 font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        {item.phone}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-primary-500 to-primary-400 rounded-[40px] p-12 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl"></div>
              </div>
              <div className="relative max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Sẵn sàng đặt bánh?</h2>
                <p className="text-white/90 mb-8">
                  Liên hệ ngay với chúng tôi để được tư vấn và đặt bánh theo yêu cầu của bạn
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition hover:scale-[1.02]"
                  >
                    Liên hệ ngay
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <a
                    href="tel:0988884285"
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur text-white px-8 py-4 rounded-full font-bold hover:bg-white/30 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    0988 884 285
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
