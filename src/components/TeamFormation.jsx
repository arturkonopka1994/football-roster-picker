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
    <VStack spacing={2}>
      {sortedTeam.map((player, index) => (
        <SlideFade key={index} in={true} offsetY="20px">
          <Box p={2} bg="green.500" color="white" borderRadius="md">
            {player.name}
          </Box>
        </SlideFade>
      ))}
    </VStack>
  );
};

export default TeamFormation;
