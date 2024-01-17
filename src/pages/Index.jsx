import React, { useState, useCallback } from "react";
import { VStack, HStack, Box, Textarea, Button, Text, Heading, useToast } from "@chakra-ui/react";
import { FaFutbol } from "react-icons/fa";
import TeamFormation from "../components/TeamFormation";
// Helper functions and imports...

const Index = () => {
  const [teamOne, setTeamOne] = useState([]);
  const [teamTwo, setTeamTwo] = useState([]);

  // Handler functions such as onDragOver, onDragStart, onPlayerDrop...

  return (
    <VStack spacing={4} p={5}>
      <Heading as="h1" size="xl" my={6}>
        Team Picker
      </Heading>

      <Textarea placeholder="Enter team 1 players here..." />
      <Button colorScheme="blue">Set Team 1</Button>

      <Textarea placeholder="Enter team 2 players here..." />
      <Button colorScheme="teal">Set Team 2</Button>

      <HStack w="100%" justify="space-between" p={5}>
        <VStack w="48%">
          <Heading as="h3" size="lg">
            Team 1 Formation
          </Heading>
          <TeamFormation team={teamOne} side="left" />
        </VStack>

        <VStack w="48%">
          <Heading as="h3" size="lg">
            Team 2 Formation
          </Heading>
          <TeamFormation team={teamTwo} side="right" />
        </VStack>
      </HStack>
    </VStack>
  );
};

export default Index;
