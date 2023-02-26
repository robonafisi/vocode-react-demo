import { Box, Button, Spinner, useColorMode, VStack } from "@chakra-ui/react";
import React from "react";
import { ConversationConfig, ConversationStatus } from "../types/conversation";
import { useConversation } from "../hooks/conversation";
import Siriwave from "react-siriwave";
import MicrophoneIcon from "./MicrophoneIcon";

const MAX_AMPLITUDE = 2.1;
const GRAY = "#A0AEC0";

const Conversation = ({
  conversationConfig,
}: {
  conversationConfig: ConversationConfig;
}) => {
  const [status, start, stop, currentAudioBuffer] =
    useConversation(conversationConfig);
  const [waveAmplitude, setWaveAmplitude] = React.useState(0.0);

  React.useEffect(() => {
    const amplitude = Math.min(
      currentAudioBuffer.reduce((acc, val) => {
        return acc + Math.abs(val);
      }, 0) /
        currentAudioBuffer.length /
        50,
      MAX_AMPLITUDE
    );
    setWaveAmplitude(amplitude);
  }, [currentAudioBuffer]);

  return (
    <VStack>
      <Button
        variant="link"
        disabled={["connecting", "error"].includes(status)}
        onClick={status === "connected" ? stop : start}
      >
        {/* <AudioVisualization muted={status !== "connected"} /> */}
        <Box boxSize={100}>
          <MicrophoneIcon color={GRAY} muted={status !== "connected"} />
        </Box>
      </Button>
      <Box boxSize={50} />
      {status === "connecting" && (
        <Box padding={5}>
          <Spinner />
        </Box>
      )}
      {status === "connected" && (
        <Siriwave color={GRAY} amplitude={waveAmplitude} />
      )}
    </VStack>
  );
};

export default Conversation;
