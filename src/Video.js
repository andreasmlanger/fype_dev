import { AgoraVideoPlayer } from "agora-rtc-react";
import { Grid } from "@material-ui/core";
import { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";

export default function Video(props) {
  const { users, tracks, screen } = props;
  const [activeUsers, setActiveUsers] = useState([]);
  const [fullscreen, setFullscreen] = useState(false);
  const [gridSpacing, setGridSpacing] = useState(12);
  function calcMobileSpacing(arr) {
    return arr.length > 1 ? 6 : 12;
  }
  function calcBrowserSpacing(arr) {
    return Math.max(Math.floor(12 / (arr.length + 1)), 4);
  }

  function makeUserFullScreen(userId) {
    if (!isMobile) {
      if (gridSpacing !== 12) {
        setActiveUsers(users.filter((User) => User.uid === userId));
        setFullscreen(true);
        return setGridSpacing(12);
      } else {
        setFullscreen(false);
        return setGridSpacing(calcBrowserSpacing(users));
      }
    }
  }

  useEffect(() => {
    setActiveUsers(users);
    isMobile
      ? setGridSpacing(calcMobileSpacing(users))
      : setGridSpacing(calcBrowserSpacing(users));
  }, [users, tracks, screen]);

  if (screen) {
    // User shares screen
    return (
      <AgoraVideoPlayer
        videoTrack={tracks[1]}
        style={{ height: "100%", width: "100%" }}
      />
    );
  } else {
    return (
      <Grid container style={{ height: "100%" }}>
        {!fullscreen && (
          <Grid item xs={gridSpacing}>
            <AgoraVideoPlayer
              videoTrack={tracks[1]}
              style={{ height: "100%", width: "100%" }}
            />
          </Grid>
        )}
        {activeUsers.length > 0 &&
          activeUsers.map((user) => {
            if (user.videoTrack) {
              return (
                <Grid
                  item
                  xs={gridSpacing}
                  onMouseDown={(e) => makeUserFullScreen(user.uid)}
                >
                  <AgoraVideoPlayer
                    videoTrack={user.videoTrack}
                    key={user.uid}
                    style={{ height: "100%", width: "100%" }}
                  />
                </Grid>
              );
            } else return null;
          })}
      </Grid>
    );
  }
}
