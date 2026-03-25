import { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
<<<<<<< Updated upstream
import Stack from "@mui/material/Stack";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
=======
>>>>>>> Stashed changes

import { getRandomNumber } from "src/utils/common";
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

<<<<<<< Updated upstream
  const [getVideoDetail, { data: detail }] =
    useLazyGetAppendedVideosQuery();

  const [video, setVideo] = useState<Movie | null>(null);
  const [muted, setMuted] = useState(true);

  const playerRef = useRef<any>(null);
  const isOffset = useOffSetTop(window.innerWidth * 0.5625);
  const { setDetailType } = useDetailModal();

  const maturityRate = useMemo(() => getRandomNumber(20), []);

  // 🎯 Select random movie
=======
  const [video, setVideo] = useState<Movie | null>(null);
  const [getVideoDetail, { data: detail }] =
    useLazyGetAppendedVideosQuery();

  // 🔥 Select random video
>>>>>>> Stashed changes
  useEffect(() => {
    if (data?.results) {
      const videos = data.results.filter((item) => !!item.backdrop_path);
      setVideo(videos[getRandomNumber(videos.length)]);
    }
  }, [data]);

<<<<<<< Updated upstream
  // 🎯 Fetch video detail
=======
  // 🔥 Fetch video details
>>>>>>> Stashed changes
  useEffect(() => {
    if (video) {
      getVideoDetail({ mediaType, id: video.id });
    }
  }, [video]);

<<<<<<< Updated upstream
  // 🔥 SAFE VIDEO KEY
=======
  // 🔥 FIXED: Safe video key handling
>>>>>>> Stashed changes
  const videoKey = useMemo(() => {
    if (!detail?.videos?.results || detail.videos.results.length === 0) {
      return null;
    }
    return detail.videos.results[0].key;
  }, [detail]);
<<<<<<< Updated upstream

  const handleMute = useCallback(() => {
    setMuted((prev) => !prev);
  }, []);

  return (
    <Box sx={{ position: "relative", zIndex: 1 }}>
      <Box sx={{ mb: 3, pb: "40%", position: "relative" }}>
        <Box sx={{ width: "100%", height: "56.25vw", position: "absolute" }}>

          {video && (
            <>
              {/* 🎬 VIDEO OR IMAGE */}
              <Box sx={{ position: "absolute", inset: 0 }}>
                {videoKey ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=${
                      muted ? 1 : 0
                    }&controls=0&loop=1`}
                    title="YouTube video"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  />
                ) : (
                  <img
                    src={`https://image.tmdb.org/t/p/original${video.backdrop_path}`}
                    alt="banner"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}

                {/* overlay */}
                <Box
                  sx={{
                    background:
                      "linear-gradient(77deg,rgba(0,0,0,.6),transparent 85%)",
                    position: "absolute",
                    inset: 0,
                  }}
                />

                {/* bottom gradient */}
                <Box
                  sx={{
                    backgroundImage:
                      "linear-gradient(180deg,hsla(0,0%,8%,0),#141414)",
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    height: "15vw",
                  }}
                />

                {/* mute button */}
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    position: "absolute",
                    right: 0,
                    bottom: "35%",
                  }}
                >
                  <NetflixIconButton size="large" onClick={handleMute}>
                    {!muted ? <VolumeUpIcon /> : <VolumeOffIcon />}
                  </NetflixIconButton>
                  <MaturityRate>{`${maturityRate}+`}</MaturityRate>
                </Stack>
              </Box>

              {/* TEXT SECTION */}
              <Box sx={{ position: "absolute", inset: 0 }}>
                <Stack
                  spacing={4}
                  sx={{
                    bottom: "35%",
                    position: "absolute",
                    left: "60px",
                    width: "36%",
                  }}
                >
                  <MaxLineTypography variant="h2" maxLine={1}>
                    {video.title}
                  </MaxLineTypography>

                  <MaxLineTypography variant="h5" maxLine={3}>
                    {video.overview}
                  </MaxLineTypography>

                  <Stack direction="row" spacing={2}>
                    <PlayButton size="large" />
                    <MoreInfoButton
                      size="large"
                      onClick={() =>
                        setDetailType({ mediaType, id: video.id })
                      }
                    />
                  </Stack>
                </Stack>
              </Box>
            </>
          )}

        </Box>
      </Box>
=======

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      
      {/* 🔥 FIXED PLAYER */}
      {video && (
        <>
          {videoKey ? (
            <VideoJSPlayer
              options={{
                autoplay: true,
                controls: true,
                responsive: true,
                fluid: true,
                sources: [
                  {
                    src: `https://www.youtube.com/embed/${videoKey}`,
                    type: "video/youtube",
                  },
                ],
              }}
            />
          ) : (
            // 🔥 FALLBACK IMAGE (NO VIDEO CASE)
            <img
              src={`https://image.tmdb.org/t/p/original${video.backdrop_path}`}
              alt="banner"
              style={{ width: "100%", height: "auto" }}
            />
          )}
        </>
      )}
>>>>>>> Stashed changes
    </Box>
  );
}
