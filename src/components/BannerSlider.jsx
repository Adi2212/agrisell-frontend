import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { offerApi } from "@/api/api";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";

import offer1 from "@/assets/offer1.png";
import offer2 from "@/assets/offer2.png";
import offer3 from "@/assets/offer3.png";

export default function BannerSlider() {
  const navigate = useNavigate();
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback static banners if no active offers exist
  const defaultBanners = [
    {
      id: "def-1",
      bannerUrl: offer1,
      title: "Fresh Harvest Deals",
      description: "Directly from trusted local farmers",
      isFallback: true,
    },
    {
      id: "def-2",
      bannerUrl: offer2,
      title: "Special Agri Discounts",
      description: "Save big on seasonal essentials",
      isFallback: true,
    },
    {
      id: "def-3",
      bannerUrl: offer3,
      title: "Organic Best Sellers",
      description: "100% natural and certified products",
      isFallback: true,
    },
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchActiveOffers = async () => {
      try {
        const res = await offerApi.get("/active");
        if (isMounted) {
          if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            setOffers(res.data);
          } else {
            setOffers([]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch active offers, using defaults:", err);
        if (isMounted) setOffers([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchActiveOffers();
    return () => {
      isMounted = false;
    };
  }, []);

  const slides = offers.length > 0 ? offers : defaultBanners;

  function handleApi(carouselApi) {
    if (!carouselApi) return;
    setApi(carouselApi);
    setCurrent(carouselApi.selectedScrollSnap());
    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap());
    });
  }

  const handleBannerClick = (slide) => {
    if (slide.isFallback) return;
    if (slide.products && slide.products.length === 1) {
      navigate(`/product/${slide.products[0].id}`);
    } else if (slide.products && slide.products.length > 1) {
      // Navigate to categories or scroll to product section
      const productSection = document.getElementById("featured-products");
      if (productSection) {
        productSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="relative w-full mb-6">
      <Carousel
        setApi={handleApi}
        opts={{ loop: true }}
        plugins={[
          Autoplay({
            delay: 4000,
            stopOnInteraction: false,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {slides.map((slide, i) => (
            <CarouselItem key={slide.id || i} className="pl-0">
              <div
                onClick={() => handleBannerClick(slide)}
                className={`relative h-56 sm:h-64 md:h-72 lg:h-84 overflow-hidden rounded-2xl shadow-md group ${
                  !slide.isFallback ? "cursor-pointer" : ""
                }`}
              >
                {/* Banner Image */}
                <img
                  src={slide.bannerUrl}
                  alt={slide.title || `Banner ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = offer1;
                  }}
                />

                {/* Dark Gradient Overlay for dynamic text readability */}
                {!slide.isFallback && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex flex-col justify-end p-5 md:p-8 text-white">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {slide.discountPercentage && (
                        <span className="bg-red-600 text-white font-extrabold px-3 py-1 rounded-full text-xs md:text-sm shadow-lg tracking-wide flex items-center gap-1 animate-pulse">
                          <Sparkles className="w-3.5 h-3.5" />
                          {slide.discountPercentage}% OFF
                        </span>
                      )}
                      {slide.productCount > 0 && (
                        <span className="bg-white/20 backdrop-blur-md text-white font-semibold px-2.5 py-0.5 rounded-full text-xs">
                          {slide.productCount} Products On Sale
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold drop-shadow tracking-tight">
                      {slide.title}
                    </h2>

                    {slide.description && (
                      <p className="text-sm md:text-base text-gray-200 line-clamp-2 max-w-2xl mt-1 drop-shadow">
                        {slide.description}
                      </p>
                    )}

                    {slide.products && slide.products.length > 0 && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-primary-foreground group-hover:underline">
                        <span>Shop this sale</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dots navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => api?.scrollTo(i)}
            aria-label={`Go to banner ${i + 1}`}
            aria-current={current === i ? "true" : undefined}
            className={`h-2.5 rounded-full transition-all duration-300 shadow ${
              current === i
                ? "w-7 bg-white"
                : "w-2.5 bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
