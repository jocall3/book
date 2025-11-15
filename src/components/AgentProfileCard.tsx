import React from 'react';

interface AgentProfileCardProps {
  name: string;
  primaryFunction: string;
  humorousHighlight: string;
}

const AgentProfileCard: React.FC<AgentProfileCardProps> = ({ name, primaryFunction, humorousHighlight }) => {
  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '20px',
      margin: '15px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h3 style={{
        margin: '0 0 10px 0',
        color: '#333',
        fontSize: '1.4em',
        fontWeight: 'bold'
      }}>
        {name}
      </h3>
      <p style={{
        margin: '0 0 15px 0',
        color: '#555',
        fontSize: '0.95em'
      }}>
        <strong style={{ color: '#222' }}>Function:</strong> {primaryFunction}
      </p>
      <p style={{
        margin: '0',
        color: '#666',
        fontSize: '0.9em',
        fontStyle: 'italic',
        borderLeft: '3px solid #ccc',
        paddingLeft: '10px'
      }}>
        "{humorousHighlight}"
      </p>
    </div>
  );
};

export default AgentProfileCard;