import React from "react";
import { Box, VStack, SlideFade, Flex } from "@chakra-ui/react";

const TeamFormation = ({ team, side, onPlayerDrop, onDragStart, draggedPlayer }) => {
  // Create an object to hold players grouped by their position
  const formation = {
    GK: [],
    DF: [],
    MF: [],
    FW: [],
    ST: [],
  };

  // Group players by their position
  team.forEach((player) => {
    formation[player.position].push(player);
  });

  return (
    <VStack spacing={0} w="100%" h="600px" position="relative" bg={side === "left" ? "green.500" : "blue.500"}>
      {Object.entries(formation).map(([position, players]) => (
        <Flex key={position} h="20%" w="100%" wrap="wrap" justify="space-evenly" align="center">
          {players.map((player) => (
            <SlideFade key={player.name} in={true} offsetY="20px">
              <Box
                p={2}
                color="white"
                borderRadius="md"
                zIndex="1"
                draggable="true"
                onDragStart={(e) => onDragStart({ ...player, team: side === "left" ? "team1" : "team2" })}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (draggedPlayer && draggedPlayer.name !== player.name) {
                    onPlayerDrop(draggedPlayer, player, side === "left" ? "team1" : "team2");
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                opacity={draggedPlayer && draggedPlayer.name === player.name ? 0.5 : 1}
              >
                {`${player.name} ${player.position}`}
              </Box>
            </SlideFade>
          ))}
        </Flex>
      ))}
    </VStack>
  );
};

export default TeamFormation;
