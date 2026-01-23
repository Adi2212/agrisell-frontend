import { useEffect, useState } from "react";

import offer1 from "@/assets/offer1.png";
import offer2 from "@/assets/offer2.png";
import offer3 from "@/assets/offer3.png";

export default function BannerSlider() {
  const images = [offer1, offer2, offer3];
  const [index, setIndex] = useState(0);

  // Auto change banner
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden rounded-xl mb-6">

      {/* Images */}
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`Banner ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover
            transition-opacity duration-700 ease-in-out
            ${i === index ? "opacity-100" : "opacity-0"}
          `}
        />
      ))}

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2.5 w-2.5 rounded-full transition
              ${i === index ? "bg-white" : "bg-white/50"}
            `}
          />
        ))}
      </div>
    </div>
  );
}
