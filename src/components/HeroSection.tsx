import { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { getRandomNumber } from "src/utils/common";
import MaxLineTypography from "./MaxLineTypography";
import PlayButton from "./PlayButton";
import MoreInfoButton from "./MoreInfoButton";
import MaturityRate from "./MaturityRate";
import { useDetailModal } from "src/providers/DetailModalProvider";
import { MEDIA_TYPE } from "src/types/Common";
import {
  useGetVideosByMediaTypeAndCustomGenreQuery,
  useLazyGetAppendedVideosQuery,
} from "src/store/slices/discover";
import { Movie } from "src/types/Movie";

interface TopTrailerProps {
  mediaType: MEDIA_TYPE;
}

export default function TopTrailer({ mediaType }: TopTrailerProps) {
  const { data } = useGetVideosByMediaTypeAndCustomGenreQuery({
    mediaType,
    apiString: "popular",
    page: 1,
  });

  const [getVideoDetail, { data: detail }] =
    useLazyGetAppendedVideosQuery();

  const [video, setVideo] = useState<Movie | null>(null);
  const { setDetailType } = useDetailModal();

  const maturityRate = useMemo(() => getRandomNumber(20), []);

  useEffect(() => {
    if (data?.results) {
      const videos = data.results.filter((item) => !!item.backdrop_path);
      setVideo(videos[getRandomNumber(videos.length)]);
    }
  }, [data]);

  useEffect(() => {
    if (video) {
      getVideoDetail({ mediaType, id: video.id });
    }
  }, [video]);

  const videoKey = useMemo(() => {
    if (!detail?.videos?.results?.length) return null;
    return detail.videos.results[0].key;
  }, [detail]);

  return (
    <Box sx={{ position: "relative", zIndex: 1 }}>
      <Box sx={{ pb: "40%", position: "relative" }}>
        <Box sx={{ width: "100%", height: "56.25vw", position: "absolute" }}>

          {video && (
            <>
              {/* 🔥 VIDEO PREVIEW (ALWAYS MUTED) */}
              {videoKey ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoKey}`}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <img
                  src={`https://image.tmdb.org/t/p/original${video.backdrop_path}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}

              {/* Overlay */}
              <Box
                sx={{
                  background:
                    "linear-gradient(77deg,rgba(0,0,0,.6),transparent 85%)",
                  position: "absolute",
                  inset: 0,
                }}
              />

              {/* Content */}
              <Box sx={{ position: "absolute", bottom: "35%", left: "60px" }}>
                <MaxLineTypography variant="h2" maxLine={1}>
                  {video.title}
                </MaxLineTypography>

                <MaxLineTypography variant="h5" maxLine={3}>
                  {video.overview}
                </MaxLineTypography>

                <Stack direction="row" spacing={2} mt={2}>
                  {/* 🔥 PLAY BUTTON FIX */}
                  <PlayButton
                    size="large"
                    onClick={() => {
                      window.location.href = `/watch?video=${videoKey}`;
                    }}
                  />

                  <MoreInfoButton
                    size="large"
                    onClick={() =>
                      setDetailType({ mediaType, id: video.id })
                    }
                  />
                </Stack>
              </Box>

              {/* Age */}
              <Box sx={{ position: "absolute", right: 0, bottom: "35%" }}>
                <MaturityRate>{`${maturityRate}+`}</MaturityRate>
              </Box>
            </>
          )}

        </Box>
      </Box>
    </Box>
  );
}
