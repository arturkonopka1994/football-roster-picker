import React, { useState } from "react";
import { VStack, HStack, Box, Textarea, Button, Text, Heading, Image, useToast } from "@chakra-ui/react";
import { FaFutbol } from "react-icons/fa";

// Helper function to shuffle array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const Index = () => {
  const [inputValue, setInputValue] = useState("");
  const [teams, setTeams] = useState({ team1: [], team2: [] });
  const toast = useToast();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const pickTeams = () => {
    const players = inputValue.split("\n").map((player) => {
      const [name, skill, position] = player.split(",").map((item) => item.trim());
      return { name, skill: parseInt(skill, 10), position };
    });

    const goalkeepers = players.filter((player) => player.position === "GK");
    const otherPlayers = players.filter((player) => player.position !== "GK");

    // Shuffle arrays to randomize player order
    shuffleArray(goalkeepers);
    shuffleArray(otherPlayers);

    // Initialize teams
    const team1 = [];
    const team2 = [];

    // Ensure there is always one goalkeeper in each team if two are available
    if (goalkeepers.length >= 2) {
      team1.push(goalkeepers[0]);
      team2.push(goalkeepers[1]);
    } // No need for an else condition, as we only ensure distribution when at least two goalkeepers are available

    // Distribute other players based on skill
    otherPlayers.forEach((player, index) => {
      if (index % 2 === 0) {
        team1.push(player);
      } else {
        team2.push(player);
      }
    });

    // Set teams
    setTeams({ team1, team2 });

    // Show toast notification
    toast({
      title: "Teams have been picked!",
      description: "Check below to see the teams.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
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
        <VStack w="48%">
          <Text fontSize="2xl" color="teal.500">
            Team 1
          </Text>
          {teams.team1.map((player, i) => (
            <Box key={i} p={2} shadow="md" borderWidth="1px" w="100%">
              <Text>{player.name}</Text>
              <Text>{`Skill: ${player.skill} | Pos: ${player.position}`}</Text>
            </Box>
          ))}
        </VStack>

        <VStack w="48%">
          <Text fontSize="2xl" color="orange.500">
            Team 2
          </Text>
          {teams.team2.map((player, i) => (
            <Box key={i} p={2} shadow="md" borderWidth="1px" w="100%">
              <Text>{player.name}</Text>
              <Text>{`Skill: ${player.skill} | Pos: ${player.position}`}</Text>
            </Box>
          ))}
        </VStack>
      </HStack>
    </VStack>
  );
};

export default Index;
