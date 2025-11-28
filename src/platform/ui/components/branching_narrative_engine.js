```javascript
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const NarrativeContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const NarrativeText = styled.p`
  margin-bottom: 15px;
  line-height: 1.6;
`;

const ChoiceButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const BranchingNarrativeEngine = ({ initialScene, onSceneChange }) => {
  const [currentScene, setCurrentScene] = useState(initialScene);
  const [sceneData, setSceneData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchSceneData = async () => {
      try {
        if (!currentScene) {
          // Handle initial state or error gracefully
          setSceneData({ text: "The story begins...", choices: [] });
          return;
        }

        const response = await fetch(`/api/scenes/${currentScene}`); // Assuming an API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSceneData(data);
      } catch (e) {
        setError(e.message || "Failed to load scene.");
        setSceneData({ text: "An error occurred while loading the scene.", choices: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchSceneData();
  }, [currentScene]);


  const handleChoiceClick = (nextScene) => {
    setCurrentScene(nextScene);
    if(onSceneChange) {
      onSceneChange(nextScene);
    }
  };


  if (loading) {
    return (
      <NarrativeContainer>
        <p>Loading...</p>
      </NarrativeContainer>
    );
  }

  if (error) {
    return (
      <NarrativeContainer>
        <p>Error: {error}</p>
      </NarrativeContainer>
    );
  }

  if (!sceneData) {
    return (
      <NarrativeContainer>
        <p>Scene data not found.</p>
      </NarrativeContainer>
    );
  }

  return (
    <NarrativeContainer>
      <NarrativeText>{sceneData.text}</NarrativeText>
      {sceneData.choices && sceneData.choices.map((choice, index) => (
        <ChoiceButton key={index} onClick={() => handleChoiceClick(choice.nextScene)}>
          {choice.text}
        </ChoiceButton>
      ))}
    </NarrativeContainer>
  );
};

export default BranchingNarrativeEngine;
```
