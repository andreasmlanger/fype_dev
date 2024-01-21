import { useState } from "react";
import { Button } from "@material-ui/core";
import VideoCall from "./VideoCall";

function App() {
  const [inCall, setInCall] = useState(false);
  return (
    <div className="App" style={{ height: "100%" }}>
      {inCall ? (
        <VideoCall setInCall={setInCall} />
      ) : (
        <div className="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setInCall(true)}
          >
            Join Call
          </Button>
        </div>
      )}
    </div>
  );
}

export default App;
