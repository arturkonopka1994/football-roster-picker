import React from "react";
import { Box, VStack, SlideFade, Grid } from "@chakra-ui/react";

const roleCoordinates = {
  GK: { x: "50%", y: "10%" },
  DF: { x: ["10%", "30%", "50%", "70%", "90%"], y: "30%" },
  MF: { x: ["10%", "30%", "50%", "70%", "90%"], y: "50%" },
  FW: { x: ["25%", "50%", "75%"], y: "70%" },
  ST: { x: "50%", y: "90%" },
};

const getPlayerPositionStyle = (position, index, total) => {
  // For positions with multiple players, spread them out evenly
  const xPositions = roleCoordinates[position].x;
  const x = Array.isArray(xPositions) ? xPositions[Math.min(index, xPositions.length - 1)] : xPositions;
  const y = roleCoordinates[position].y;

  return {
    left: `calc(${x} - 50%)`, // Center the box based on its width
    top: y,
    position: "absolute",
  };
};

const TeamFormation = ({ team, side }) => {
  const sortedTeam = team.sort((a, b) => {
    if (a.position === b.position) {
      return b.skill - a.skill;
    }
    return a.position.localeCompare(b.position);
  });

  // Group players by position to spread them out evenly
  const playersByPosition = sortedTeam.reduce((acc, player) => {
    acc[player.position] = acc[player.position] || [];
    acc[player.position].push(player);
    return acc;
  }, {});

  return (
    <VStack spacing={2} w="100%" h="600px" position="relative" bg={side === "left" ? "green.500" : "blue.500"}>
      <Box position="absolute" top="0" left="0" right="0" bottom="0" bgImage="url('/path-to-football-pitch-image.jpg')" bgPosition="center" bgRepeat="no-repeat" bgSize="cover" opacity="0.2" />
      {sortedTeam.map((player, index) => {
        const positionStyle = getPlayerPositionStyle(player.position, playersByPosition[player.position].indexOf(player), playersByPosition[player.position].length);
        return (
          <SlideFade key={index} in={true} offsetY="20px">
            <Box p={2} color="white" borderRadius="md" {...positionStyle} zIndex="1">
              {player.name}
            </Box>
          </SlideFade>
        );
      })}
    </VStack>
  );
};

export default TeamFormation;
