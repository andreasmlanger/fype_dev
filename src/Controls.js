import { useState } from "react";
import { useClient } from "./settings";
import { Button } from "@material-ui/core";
import { isMobile } from "react-device-detect";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import ScreenShareIcon from "@material-ui/icons/ScreenShare";
import StopScreenShareIcon from "@material-ui/icons/StopScreenShare";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

export default function Controls(props) {
  const client = useClient();
  const { tracks, stream, setStart, setInCall, setScreen } = props;
  const [trackState, setTrackState] = useState({
    video: true,
    audio: true,
    screen: false,
  });

  const mute = async (type) => {
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    } else if (type === "screen") {
      setScreen(!trackState.screen);
      setTrackState((ps) => {
        return { ...ps, screen: !ps.screen };
      });
    }
  };

  const leaveChannel = async () => {
    if (stream) stream.close(); // end screen share
    client.removeAllListeners();
    setStart(false);
    setInCall(false);
    for (const track of tracks) {
      track.close(); // close remaining tracks
    }
    await client.leave();
  };

  return (
    <div style={{ margin: "10px" }}>
      <Button
        variant="contained"
        style={{ marginRight: "5px" }}
        color={trackState.audio ? "primary" : "secondary"}
        onClick={() => mute("audio")}
      >
        {trackState.audio ? <MicIcon /> : <MicOffIcon />}
      </Button>

      <Button
        variant="contained"
        style={{ marginRight: "5px" }}
        color={trackState.video ? "primary" : "secondary"}
        onClick={() => mute("video")}
      >
        {trackState.video ? <VideocamIcon /> : <VideocamOffIcon />}
      </Button>
      {!isMobile && (
        <Button
          variant="contained"
          style={{ marginRight: "5px" }}
          color={trackState.screen ? "primary" : "default"}
          onClick={() => mute("screen")}
        >
          {trackState.screen ? <ScreenShareIcon /> : <StopScreenShareIcon />}
        </Button>
      )}
      <Button
        variant="contained"
        color="default"
        onClick={() => leaveChannel()}
      >
        Leave
        <ExitToAppIcon />
      </Button>
    </div>
  );
}
