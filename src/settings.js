import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

const appId = process.env.REACT_APP_AGORA_ID;
const appCertificate = process.env.REACT_APP_AGORA_CERTIFICATE;
export const channelName = "main";
const uid = 0;
const role = RtcRole.PUBLISHER;
const privilegeExpiredTs = Math.floor(Date.now() / 1000) + 3600;
const token = RtcTokenBuilder.buildTokenWithUid(
  appId,
  appCertificate,
  channelName,
  uid,
  role,
  privilegeExpiredTs
);

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
