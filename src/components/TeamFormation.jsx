import React from "react";
import { Box, VStack, SlideFade } from "@chakra-ui/react";

const roleCoordinates = {
  GK: { x: "50%", y: "10%" },
  DF: { x: "20%", y: "30%", spread: "60%" },
  MF: { x: "10%", y: "50%", spread: "80%" },
  FW: { x: "25%", y: "70%", spread: "50%" },
  ST: { x: "50%", y: "90%" },
};

const getPlayerPositionStyle = (position, index, totalPlayersInPosition) => {
  const roleCoordinate = roleCoordinates[position];
  const x = Array.isArray(roleCoordinate.x) ? roleCoordinate.x[index] : roleCoordinate.x;
  const y = roleCoordinate.y;
  let left;

  if (roleCoordinate.spread) {
    const spreadBy = parseInt(roleCoordinate.spread, 10);
    const spacing = spreadBy / (totalPlayersInPosition - 1);
    left = `calc(${x} + ${index * spacing}% - 50%)`;
  } else {
    left = `calc(${x} - 50%)`;
  }

  return {
    left,
    top: y,
    position: "absolute",
  };
};

const TeamFormation = ({ team, side, onPlayerDrop, onDragStart, draggedPlayer }) => {
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

  // ... rest of the TeamFormation component

  return (
    <VStack spacing={2} w="100%" h="600px" position="relative" bg={side === "left" ? "green.500" : "blue.500"}>
      {/* ... rest of the component */}
      {sortedTeam.map((player, index) => {
        const positionStyle = getPlayerPositionStyle(player.position, playersByPosition[player.position].indexOf(player), playersByPosition[player.position].length);
        return (
          <SlideFade key={player.name} in={true} offsetY="20px">
            <Box
              p={2}
              color="white"
              borderRadius="md"
              {...positionStyle}
              zIndex="1"
              draggable
              onDragStart={() => onDragStart({ ...player, team: side === "left" ? "team1" : "team2" })}
              onDrop={(e) => {
                e.preventDefault();
                onPlayerDrop(draggedPlayer, side === "left" ? "team1" : "team2");
              }}
              onDragOver={(e) => e.preventDefault()}
              opacity={draggedPlayer && draggedPlayer.name === player.name ? 0.5 : 1}
            >
              {`${player.name} ${player.position}`}
            </Box>
          </SlideFade>
        );
      })}
    </VStack>
  );
};

export default TeamFormation;
