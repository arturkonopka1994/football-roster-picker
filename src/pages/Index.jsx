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
    // Sort by skill in descending order if positions are equal
    return playerB.skill - playerA.skill;
  }
  return positionOrder[playerA.position] - positionOrder[playerB.position];
};

const validPositions = ["GK", "DF", "MF", "FW", "ST"];

const Index = () => {
  const [draggedPlayer, setDraggedPlayer] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [teams, setTeams] = useState({ team1: [], team2: [] });
  const [teamsPicked, setTeamsPicked] = useState(false);
  const toast = useToast();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const pickTeams = () => {
    const players = inputValue.split("\n").map((player) => {
      const [name, skill, position] = player.split(",").map((item) => item.trim());
      if (!validPositions.includes(position)) {
        toast({
          title: "Invalid Position",
          description: `The position "${position}" is not valid. Valid positions are: ${validPositions.join(", ")}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        throw new Error(`Invalid position: ${position}`);
      }
      return { name, skill: parseInt(skill, 10), position };
    });

    const goalkeepers = players.filter((player) => player.position === "GK");

    if (goalkeepers.length > 2) {
      const goalkeeperCount = goalkeepers.length;
      toast({
        title: "Warning",
        description: `${goalkeeperCount} goalkeepers listed. Only 2 allowed.`,
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
    const otherPlayers = players.filter((player) => player.position !== "GK");

    // Shuffle arrays to randomize player order
    shuffleArray(goalkeepers);
    shuffleArray(otherPlayers);

    // Initialize teams
    const team1 = [];
    const team2 = [];

    // Calculate total skill level for outfield players
    const totalSkill = otherPlayers.reduce((acc, player) => acc + player.skill, 0);

    // Assign one goalkeeper to each team if there are at least two goalkeepers
    // Otherwise, assign the goalkeeper later to balance the teams
    if (goalkeepers.length === 1) {
      shuffleArray(otherPlayers); // Make sure outfield players' order is randomized
    } else if (goalkeepers.length >= 2) {
      team1.push(goalkeepers[0]);
      team2.push(goalkeepers[1]);
    }

    // Split other players into two teams based on skill trying to balance the total skill of each team
    const teamSkills = { team1: 0, team2: 0 };
    // Split outfield players into two teams attempting to balance the total skill of each team
    otherPlayers.forEach((player) => {
      if (team1.length <= team2.length) {
        team1.push(player);
        teamSkills.team1 += player.skill;
      } else {
        team2.push(player);
        teamSkills.team2 += player.skill;
      }
    });

    // If there is only one goalkeeper, assign them to the team with fewer players
    // or if the number of players is equal, to the team with the lower total skill level
    if (goalkeepers.length === 1) {
      if (team1.length < team2.length || (team1.length === team2.length && teamSkills.team1 <= teamSkills.team2)) {
        team1.push(goalkeepers[0]);
      } else {
        team2.push(goalkeepers[0]);
      }
    }

    // Sort teams by position and set them
    setTeams({ team1: team1.sort(sortPlayersByPosition), team2: team2.sort(sortPlayersByPosition) });

    // Show toast notification
    toast({
      title: "Teams have been picked!",
      description: "Check below to see the teams.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const onDropPlayer = useCallback(
    (draggedPlayer, targetPlayer, targetTeam) => {
      // Ensure targetTeam is either 'team1' or 'team2'
      if (!["team1", "team2"].includes(targetTeam)) return;

      setTeams((prevTeams) => {
        const sourceTeam = draggedPlayer.team;
        const destinationTeam = targetTeam;

        // Remove the dragged player from the source team and add to the destination team
        const updatedDestinationTeam = targetPlayer ? prevTeams[destinationTeam].map((p) => (p.name === targetPlayer.name ? draggedPlayer : p)) : [...prevTeams[destinationTeam], draggedPlayer];
        let updatedSourceTeam = prevTeams[sourceTeam].filter((p) => p.name !== draggedPlayer.name);
        if (targetPlayer) {
          updatedSourceTeam = [...updatedSourceTeam, targetPlayer];
        }

        // Sort both teams by position and update state
        return {
          ...prevTeams,
          [sourceTeam]: updatedSourceTeam.sort(sortPlayersByPosition),
          [destinationTeam]: updatedDestinationTeam.sort(sortPlayersByPosition),
        };
      });
      setDraggedPlayer(null); // Reset the dragged player state after drop
    },
    [sortPlayersByPosition],
  );

  const onDragStart = useCallback((player) => {
    setDraggedPlayer(player);
  }, []);

  const onDragOver = useCallback((e) => {
    e.preventDefault(); // Necessary for dropping to work
  }, []);

  return (
    <VStack spacing={4} p={5} onDragOver={onDragOver}>
      <Heading as="h1">Football Team Picker</Heading>

      <Text fontSize="xl" color="gray.600">
        Enter player details (Name, Skill Level, Position):
      </Text>
      <Textarea placeholder="Artur, 5, MF (Valid positions: GK, DF, MF, FW, ST)" value={inputValue} onChange={handleInputChange} size="sm" />
      <Button
        leftIcon={<FaFutbol />}
        colorScheme="blue"
        onClick={() => {
          pickTeams();
          setTeamsPicked(true);
        }}
      >
        Pick Teams
      </Button>

      <HStack w="100%" justify="space-between" p={5} style={{ display: teamsPicked ? "flex" : "none" }}>
        <VStack w="48%">
          <Text fontSize="2xl" color="teal.500">
            Team 1 - Skill {teams.team1.reduce((total, player) => total + player.skill, 0)}
          </Text>
          {teams.team1.sort(sortPlayersByPosition).map((player, i) => (
            <Box key={i} p={2} shadow="md" borderWidth="1px" w="100%">
              <Text>{player.name}</Text>
              <Text>{`Skill: ${player.skill} | Pos: ${player.position}`}</Text>
            </Box>
          ))}
        </VStack>

        <VStack w="48%">
          <Text fontSize="2xl" color="orange.500">
            Team 2 - Skill {teams.team2.reduce((total, player) => total + player.skill, 0)}
          </Text>
          {teams.team2.sort(sortPlayersByPosition).map((player, i) => (
            <Box key={i} p={2} shadow="md" borderWidth="1px" w="100%">
              <Text>{player.name}</Text>
              <Text>{`Skill: ${player.skill} | Pos: ${player.position}`}</Text>
            </Box>
          ))}
        </VStack>
      </HStack>
      <HStack w="100%" justify="space-between" p={5} align="start" style={{ display: teamsPicked ? "flex" : "none" }}>
        <VStack w="48%">
          <Text fontSize="2xl" fontWeight="bold" color="teal.500" mb={4}>
            Team 1 - Total Skill: {teams.team1.reduce((total, player) => total + player.skill, 0)}
          </Text>
          <TeamFormation team={teams.team1} side="left" onPlayerDrop={onDropPlayer} onDragStart={onDragStart} draggedPlayer={draggedPlayer} showSkill={false} />
        </VStack>
        <VStack w="48%">
          <Text fontSize="2xl" fontWeight="bold" color="orange.500" mb={4}>
            Team 2 - Total Skill: {teams.team2.reduce((total, player) => total + player.skill, 0)}
          </Text>
          <TeamFormation team={teams.team2} side="right" onPlayerDrop={onDropPlayer} onDragStart={onDragStart} draggedPlayer={draggedPlayer} showSkill={false} />
        </VStack>
      </HStack>
    </VStack>
  );
};

export default Index;
