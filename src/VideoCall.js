import { useState, useEffect } from "react";
import {
  config,
  useClient,
  useMicrophoneAndCameraTracks,
  channelName,
} from "./settings.js";
import { Grid } from "@material-ui/core";
import Video from "./Video";
import Controls from "./Controls";
import { createScreenVideoTrack } from "agora-rtc-react";

export default function VideoCall(props) {
  const { setInCall } = props;
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  const [screen, setScreen] = useState(false);
  const client = useClient();
  var { ready, tracks } = useMicrophoneAndCameraTracks();

  // Screen share
  var useScreenVideoTrack = createScreenVideoTrack();
  var screenTrack = useScreenVideoTrack();
  var stream = screenTrack["tracks"];

  if (screen && stream) {
    tracks = [tracks[0], stream, tracks[1]];
  }

  useEffect(() => {
    let init = async (name) => {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            if (prevUsers.includes(user)) {
              return prevUsers; // when screen is shared
            }
            return [...prevUsers, user];
          });
        }
        if (mediaType === "audio") {
          user.audioTrack.play();
        }
      });
      client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "audio") {
          if (user.audioTrack) user.audioTrack.stop();
        }
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
      });
      client.on("user-left", (user) => {
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
      });
      if (client._sessionId) client.unpublish(); // unpublish first
      try {
        await client.join(config.appId, name, config.token, null);
      } catch (error) {
        console.log("error");
      }
      if (tracks && !tracks[0]._isClosed && !tracks[1]._isClosed)
        await client.publish([tracks[0], tracks[1]]);
      setStart(true);
    };
    if (ready && tracks) {
      try {
        init(channelName);
      } catch (error) {
        console.log(error);
      }
    }
  }, [client, ready, tracks]);

  return (
    <Grid container direction="column" style={{ height: "100%" }}>
      <Grid item style={{ height: "0%", zIndex: 1 }}>
        {ready && tracks && (
          <Controls
            tracks={tracks}
            stream={stream}
            setStart={setStart}
            setInCall={setInCall}
            setScreen={setScreen}
          />
        )}
      </Grid>
      <Grid item style={{ height: "100%" }}>
        {start && tracks && (
          <Video tracks={tracks} users={users} screen={screen} />
        )}
      </Grid>
    </Grid>
  );
}
