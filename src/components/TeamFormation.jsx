import React from "react";
import { Box, VStack, SlideFade } from "@chakra-ui/react";

const TeamFormation = ({ team }) => {
  const sortedTeam = team.sort((a, b) => {
    if (a.position === b.position) {
      return b.skill - a.skill;
    }
    return a.position.localeCompare(b.position);
  });

  return (
    <VStack spacing={2} w="100%" h="400px" position="relative" bg="green.500">
      <Box position="absolute" top="0" left="0" right="0" bottom="0" bgImage="url('/path-to-football-pitch-image.jpg')" bgPosition="center" bgRepeat="no-repeat" bgSize="cover" opacity="0.2" />
      {sortedTeam.map((player, index) => (
        <SlideFade key={index} in={true} offsetY="20px">
          <Box p={2} color="white" borderRadius="md" position="relative" zIndex="1">
            {player.name}
          </Box>
        </SlideFade>
      ))}
    </VStack>
  );
};

export default TeamFormation;
