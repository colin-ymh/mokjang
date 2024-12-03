import { useEffect, useState } from "react";
import { MEDIA } from "@/constant/constant";

export default function useMediaType() {
  const [mediaType, setMediaType] = useState<MEDIA>(() => {
    if (typeof window === "undefined") {
      return MEDIA.DESKTOP; // 기본값 (서버에서 렌더링 시)
    }
    const width = window.innerWidth;
    if (width < 768) return MEDIA.MOBILE;
    if (width < 1024) return MEDIA.TABLET;
    return MEDIA.DESKTOP;
  });

  useEffect(() => {
    const updateMediaType = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setMediaType(MEDIA.MOBILE);
      } else if (width < 1024) {
        setMediaType(MEDIA.TABLET);
      } else {
        setMediaType(MEDIA.DESKTOP);
      }
    };

    updateMediaType(); // 초기화
    window.addEventListener("resize", updateMediaType);

    return () => {
      window.removeEventListener("resize", updateMediaType);
    };
  }, []);

  return mediaType;
}
