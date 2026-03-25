import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import Player from "video.js/dist/types/player";

import { getRandomNumber } from "src/utils/common";
import MaxLineTypography from "./MaxLineTypography";
import PlayButton from "./PlayButton";
import MoreInfoButton from "./MoreInfoButton";
import NetflixIconButton from "./NetflixIconButton";
import MaturityRate from "./MaturityRate";
import useOffSetTop from "src/hooks/useOffSetTop";
import { useDetailModal } from "src/providers/DetailModalProvider";
import { MEDIA_TYPE } from "src/types/Common";
import {
  useGetVideosByMediaTypeAndCustomGenreQuery,
  useLazyGetAppendedVideosQuery,
} from "src/store/slices/discover";
import { Movie } from "src/types/Movie";
import VideoJSPlayer from "./watch/VideoJSPlayer";

interface TopTrailerProps {
  mediaType: MEDIA_TYPE;
}

export default function TopTrailer({ mediaType }: TopTrailerProps) {
  const { data } = useGetVideosByMediaTypeAndCustomGenreQuery({
    mediaType,
    apiString: "popular",
    page: 1,
  });

  const [getVideoDetail, { data: detail }] = useLazyGetAppendedVideosQuery();
  const [video, setVideo] = useState<Movie | null>(null);
  const [muted, setMuted] = useState(true);
  const playerRef = useRef<Player | null>(null);

  const isOffset = useOffSetTop(window.innerWidth * 0.5625);
  const { setDetailType } = useDetailModal();

  const maturityRate = useMemo(() => getRandomNumber(20), []);

  const handleReady = useCallback((player: Player) => {
    playerRef.current = player;
  }, []);

  useEffect(() => {
    if (playerRef.current) {
      if (isOffset) {
        playerRef.current.pause();
      } else {
        if (playerRef.current.paused()) {
          playerRef.current.play();
        }
      }
    }
  }, [isOffset]);

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

  const handleMute = useCallback((status: boolean) => {
    if (playerRef.current) {
      playerRef.current.muted(!status);
      setMuted(!status);
    }
  }, []);

  // 🔥 FIX: Safe video key handling
  const videoKey = useMemo(() => {
    if (!detail?.videos?.results || detail.videos.results.length === 0) {
      return null;
    }
    return detail.videos.results[0].key;
  }, [detail]);

  return (
    <Box sx={{ position: "relative", zIndex: 1 }}>
      <Box sx={{ mb: 3, pb: "40%", position: "relative" }}>
        <Box sx={{ width: "100%", height: "56.25vw", position: "absolute" }}>
          
          {video && (
            <>
              <Box sx={{ position: "absolute", inset: 0 }}>

                {/* 🔥 FIXED PLAYER */}
                {videoKey ? (
                  <VideoJSPlayer
                    options={{
                      loop: true,
                      muted: true,
                      autoplay: true,
                      controls: false,
                      responsive: true,
                      fluid: true,
                      techOrder: ["youtube"],
                      sources: [
                        {
                          type: "video/youtube",
                          src: `https://www.youtube.com/watch?v=${videoKey}`,
                        },
                      ],
                    }}
                    onReady={handleReady}
                  />
                ) : (
                  // 🔥 FALLBACK IMAGE
                  <img
                    src={`https://image.tmdb.org/t/p/original${video.backdrop_path}`}
                    alt="banner"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                  sx={{ position: "absolute", right: 0, bottom: "35%" }}
                >
                  <NetflixIconButton
                    size="large"
                    onClick={() => handleMute(muted)}
                  >
                    {!muted ? <VolumeUpIcon /> : <VolumeOffIcon />}
                  </NetflixIconButton>
                  <MaturityRate>{`${maturityRate}+`}</MaturityRate>
                </Stack>
              </Box>

              {/* TEXT CONTENT */}
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
    </Box>
  );
}
