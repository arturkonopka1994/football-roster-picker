import React, { useState, useCallback } from "react";
import { VStack, HStack, Box, Textarea, Button, Text, Heading, useToast } from "@chakra-ui/react";
import { FaFutbol } from "react-icons/fa";
import TeamFormation from "../components/TeamFormation";
// Helper functions and imports...

const Index = () => {
  // State hooks and other functions...
  // State hooks and other functions...

  return (
    <VStack spacing={4} p={5} onDragOver={onDragOver}>
      {/* ... heading, text, textarea, and button components ... */}

      <HStack w="100%" justify="space-between" p={5}>
        <VStack w="48%">
          {/* ... team 1 heading and content ... */}
          {/* ... team 1 player list ... */}
        </VStack>

        <VStack w="48%">
          {/* ... team 2 heading and content ... */}
          {/* ... team 2 player list ... */}
        </VStack>
      </HStack>

      {/* ... team formations ... */}

      {/* ... team formations ... */}
    </VStack>
  );
};

export default Index;
