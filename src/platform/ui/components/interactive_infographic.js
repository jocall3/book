```javascript
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const InfographicContainer = styled.div`
  width: 100%;
  height: auto;
  position: relative;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 20px;
  box-sizing: border-box;
`;

const PerspectiveSelector = styled.select`
  margin-bottom: 10px;
  padding: 5px;
  font-size: 14px;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 400px; /* Adjust height as needed */
  background-color: white;
  border: 1px solid #ddd;
  overflow: hidden; /* Important for scrollable content */
`;

const ChartContent = styled.div`
  width: auto;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow-x: auto; /* Enable horizontal scrolling */
  overflow-y: auto;
`;


const InteractiveInfographic = ({ infographicData, initialPerspective = 'James' }) => {
  const [currentPerspective, setCurrentPerspective] = useState(initialPerspective);
  const [chartContent, setChartContent] = useState('');

  useEffect(() => {
    //  Simulate fetching data or transforming data based on perspective
    const generateChartContent = (perspective) => {
      if (!infographicData || !infographicData.perspectives) {
        return <p>No data available.</p>;
      }

      const perspectiveData = infographicData.perspectives[perspective];

      if (!perspectiveData) {
        return <p>Data not available for this perspective.</p>;
      }

      // Basic HTML chart generation (replace with your actual chart library integration like D3.js, Chart.js, etc.)
      let content = '';

      if (Array.isArray(perspectiveData.elements)) {
        content = perspectiveData.elements.map((element, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <strong>{element.title}:</strong> {element.description}
          </div>
        ));
      } else if (typeof perspectiveData.content === 'string') {
          content = <p>{perspectiveData.content}</p>;
      } else {
          content = <p>No content to display for this perspective.</p>;
      }

      return content;
    };

    const newContent = generateChartContent(currentPerspective);
    setChartContent(newContent);

  }, [currentPerspective, infographicData]);

  const handlePerspectiveChange = (event) => {
    setCurrentPerspective(event.target.value);
  };

  if (!infographicData || !infographicData.perspectives) {
    return <InfographicContainer><p>Loading...</p></InfographicContainer>;
  }

  const perspectiveOptions = Object.keys(infographicData.perspectives).map(perspective => (
    <option key={perspective} value={perspective}>
      {perspective}
    </option>
  ));


  return (
    <InfographicContainer>
      <PerspectiveSelector onChange={handlePerspectiveChange} value={currentPerspective}>
        {perspectiveOptions}
      </PerspectiveSelector>

      <ChartWrapper>
        <ChartContent>
          {chartContent}
        </ChartContent>
      </ChartWrapper>
    </InfographicContainer>
  );
};

export default InteractiveInfographic;
```