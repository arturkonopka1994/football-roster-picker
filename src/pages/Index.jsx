import React, { useState, useCallback } from "react";
import { VStack, HStack, Box, Textarea, Button, Text, Heading, useToast } from "@chakra-ui/react";
import { FaFutbol } from "react-icons/fa";
import TeamFormation from "../components/TeamFormation";

// Helper function to shuffle array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const positionOrder = { GK: 1, DF: 2, MF: 3, ST: 4, FW: 4 };
const sortPlayersByPosition = (playerA, playerB) => {
  if (positionOrder[playerA.position] === positionOrder[playerB.position]) {
    return playerB.skill - playerA.skill;
  }
  return positionOrder[playerA.position] - positionOrder[playerB.position];
};

const Index = () => {
  const [inputValue, setInputValue] = useState("");
  const [teams, setTeams] = useState({ team1: [], team2: [] });
  const toast = useToast();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const pickTeams = () => {
    // ... The existing pickTeams logic remains unchanged ...
  };

  // Add a state for the dragged player
  const [draggedPlayer, setDraggedPlayer] = useState(null);

  // Add a function to handle player drag start
  const handleDragStart = (player, event) => {
    setDraggedPlayer(player);
    event.dataTransfer.setData("text/plain", player.name);
  };

  // Add a function to handle player drop
  const handleDrop = (team, event) => {
    event.preventDefault();
    if (draggedPlayer) {
      const sourceTeam = team === "team1" ? "team2" : "team1";
      const destination = teams[team].concat(draggedPlayer);
      const source = teams[sourceTeam].filter((player) => player.name !== draggedPlayer.name);
      setTeams({ ...teams, [team]: destination, [sourceTeam]: source });
      setDraggedPlayer(null);
    }
  };

  return (
    <VStack spacing={4} p={5}>
      <Heading as="h1">Football Team Picker</Heading>
      <Text fontSize="xl" color="gray.600">
        Enter player details (Name, Skill Level, Position):
      </Text>
      <Textarea placeholder="Artur, 5, MF" value={inputValue} onChange={handleInputChange} size="sm" />
      <Button leftIcon={<FaFutbol />} colorScheme="blue" onClick={pickTeams}>
        Pick Teams
      </Button>

      <HStack w="100%" justify="space-between" p={5}>
        <VStack w="48%" onDrop={(e) => handleDrop("team1", e)} onDragOver={(e) => e.preventDefault()}>
          <Text fontSize="2xl" color="teal.500">
            Team 1 - Skill {teams.team1.reduce((total, player) => total + player.skill, 0)}
          </Text>
          {teams.team1.sort(sortPlayersByPosition).map((player, i) => (
            <Box key={i} p={2} shadow="md" borderWidth="1px" w="100%" draggable="true" onDragStart={(e) => handleDragStart(player, e)}>
              <Text>{player.name}</Text>
              <Text>{`Skill: ${player.skill} | Pos: ${player.position}`}</Text>
            </Box>
          ))}
        </VStack>

        <VStack w="48%" onDrop={(e) => handleDrop("team2", e)} onDragOver={(e) => e.preventDefault()}>
          <Text fontSize="2xl" color="orange.500">
            Team 2 - Skill {teams.team2.reduce((total, player) => total + player.skill, 0)}
          </Text>
          {teams.team2.sort(sortPlayersByPosition).map((player, i) => (
            <Box key={i} p={2} shadow="md" borderWidth="1px" w="100%" draggable="true" onDragStart={(e) => handleDragStart(player, e)}>
              <Text>{player.name}</Text>
              <Text>{`Skill: ${player.skill} | Pos: ${player.position}`}</Text>
            </Box>
          ))}
        </VStack>
      </HStack>

      <HStack w="100%" justify="space-between" p={5} key={JSON.stringify(teams)}>
        <TeamFormation team={teams.team1} side="left" />
        <TeamFormation team={teams.team2} side="right" />
      </HStack>
    </VStack>
  );
};

export default Index;
