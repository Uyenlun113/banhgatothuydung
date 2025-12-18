"use client";

import BestSellers from "@/components/BestSellers";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import PopularCategories from "@/components/PopularCategories";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <PopularCategories />
        <BestSellers />
        {/* <Testimonials /> */}
        <Newsletter />

        {/* About Owner Section */}
        <section className="py-16 bg-gradient-to-r from-primary-100 to-primary-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">
              <div className="flex-shrink-0">
                <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-primary-200 shadow-2xl">
                  <img
                    src="https://res.cloudinary.com/datjhdhe2/image/upload/v1766048507/523252547_4096633187275277_1593709758470341248_n_gv4v5d.jpg"
                    alt="Thúy Dung"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 italic">Xin chào, mình là Thúy Dung!</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Mình là chủ tiệm bánh Gato Thúy Dung tại Nguyệt Đức, Phú Thọ. Với hơn 5 năm kinh nghiệm làm bánh thủ
                  công, mình luôn mong muốn mang đến những chiếc bánh ngon, đẹp và an toàn cho mọi người. Ngoài bánh,
                  mình còn nhận làm hoa tươi và tráp ăn hỏi cho các dịp đặc biệt.
                </p>
                <Link
                  href="/about"
                  className="inline-block px-8 py-3 border-2 border-primary-500 text-primary-500 rounded-full hover:bg-primary-500 hover:text-white transition font-medium"
                >
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
