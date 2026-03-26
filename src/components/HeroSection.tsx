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
    <Box sx={{ position: "relative" }}>
      <Box sx={{ pb: "40%", position: "relative" }}>
        <Box sx={{ position: "absolute", width: "100%", height: "100%" }}>

          {video && videoKey && (
            <>
              {/* ALWAYS MUTED PREVIEW */}
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoKey}`}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />

              {/* Overlay */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(77deg,rgba(0,0,0,.6),transparent 85%)",
                }}
              />

              {/* Content */}
              <Box sx={{ position: "absolute", bottom: "30%", left: 60 }}>
                <MaxLineTypography variant="h2">
                  {video.title}
                </MaxLineTypography>

                <MaxLineTypography variant="h5">
                  {video.overview}
                </MaxLineTypography>

                <Stack direction="row" spacing={2} mt={2}>
                  <PlayButton
                    size="large"
                    onClick={() => {
                      window.location.href = "/watch";
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

              <Box sx={{ position: "absolute", right: 0, bottom: "30%" }}>
                <MaturityRate>{`${maturityRate}+`}</MaturityRate>
              </Box>
            </>
          )}

        </Box>
      </Box>
    </Box>
  );
}
