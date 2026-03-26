import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Player from "video.js/dist/types/player";
import { Box, Stack, Typography } from "@mui/material";
import { SliderUnstyledOwnProps } from "@mui/base/SliderUnstyled";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import SettingsIcon from "@mui/icons-material/Settings";
import BrandingWatermarkOutlinedIcon from "@mui/icons-material/BrandingWatermarkOutlined";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import useWindowSize from "src/hooks/useWindowSize";
import { formatTime } from "src/utils/common";

import MaxLineTypography from "src/components/MaxLineTypography";
import VolumeControllers from "src/components/watch/VolumeControllers";
import VideoJSPlayer from "src/components/watch/VideoJSPlayer";
import PlayerSeekbar from "src/components/watch/PlayerSeekbar";
import PlayerControlButton from "src/components/watch/PlayerControlButton";
import MainLoadingScreen from "src/components/MainLoadingScreen";

export function Component() {
  const playerRef = useRef<Player | null>(null);

  const [playerState, setPlayerState] = useState({
    paused: false,
    muted: false,
    playedSeconds: 0,
    duration: 0,
    volume: 0.8,
    loaded: 0,
  });

  const navigate = useNavigate();
  const [playerInitialized, setPlayerInitialized] = useState(false);

  const windowSize = useWindowSize();

  // FINAL WORKING VIDEO (SOUND + CONTROL OK)
  const videoJsOptions = useMemo(() => {
    return {
      preload: "auto",
      autoplay: true,
      controls: false,
      fluid: true,
      width: windowSize.width,
      height: windowSize.height,
      sources: [
        {
          src: "https://www.w3schools.com/html/mov_bbb.mp4",
          type: "video/mp4",
        },
      ],
    };
  }, [windowSize]);

  const handlePlayerReady = function (player: Player): void {
    player.on("pause", () => {
      setPlayerState((prev) => ({ ...prev, paused: true }));
    });

    player.on("play", () => {
      setPlayerState((prev) => ({ ...prev, paused: false }));
    });

    player.on("timeupdate", () => {
      setPlayerState((prev) => ({
        ...prev,
        playedSeconds: player.currentTime(),
      }));
    });

    player.one("durationchange", () => {
      setPlayerInitialized(true);
      setPlayerState((prev) => ({
        ...prev,
        duration: player.duration(),
      }));
    });

    playerRef.current = player;

    setPlayerState((prev) => ({
      ...prev,
      paused: player.paused(),
    }));
  };

  const handleVolumeChange: SliderUnstyledOwnProps["onChange"] = (_, value) => {
    const vol = (value as number) / 100;
    playerRef.current?.volume(vol);
    setPlayerState((prev) => ({
      ...prev,
      volume: vol,
    }));
  };

  const handleSeekTo = (v: number) => {
    playerRef.current?.currentTime(v);
  };

  const handleGoBack = () => {
    navigate("/browse");
  };

  if (!!videoJsOptions.width) {
    return (
      <Box sx={{ position: "relative" }}>
        <VideoJSPlayer options={videoJsOptions} onReady={handlePlayerReady} />

        {!playerInitialized && <MainLoadingScreen />}

        {playerRef.current && playerInitialized && (
          <Box sx={{ position: "absolute", inset: 0 }}>
            <Box px={2} sx={{ position: "absolute", top: 75 }}>
              <PlayerControlButton onClick={handleGoBack}>
                <KeyboardBackspaceIcon />
              </PlayerControlButton>
            </Box>

            <Box px={2} sx={{ position: "absolute", top: "60%" }}>
              <Typography variant="h3" sx={{ color: "white" }}>
                Demo Video
              </Typography>
            </Box>

            <Box px={2} sx={{ position: "absolute", bottom: 20, width: "100%" }}>
              <PlayerSeekbar
                playedSeconds={playerState.playedSeconds}
                duration={playerState.duration}
                seekTo={handleSeekTo}
              />

              <Stack direction="row" alignItems="center" spacing={2}>
                {!playerState.paused ? (
                  <PlayerControlButton onClick={() => playerRef.current?.pause()}>
                    <PauseIcon />
                  </PlayerControlButton>
                ) : (
                  <PlayerControlButton onClick={() => playerRef.current?.play()}>
                    <PlayArrowIcon />
                  </PlayerControlButton>
                )}

                <VolumeControllers
                  muted={playerState.muted}
                  handleVolumeToggle={() => {
                    playerRef.current?.muted(!playerState.muted);
                    setPlayerState((prev) => ({
                      ...prev,
                      muted: !prev.muted,
                    }));
                  }}
                  value={playerState.volume}
                  handleVolume={handleVolumeChange}
                />

                <Typography sx={{ color: "white" }}>
                  {`${formatTime(playerState.playedSeconds)} / ${formatTime(playerState.duration)}`}
                </Typography>

                <PlayerControlButton>
                  <FullscreenIcon />
                </PlayerControlButton>
              </Stack>
            </Box>
          </Box>
        )}
      </Box>
    );
  }

  return null;
}

Component.displayName = "WatchPage";
