import React from 'react';
import './ResultsCard.css';

function ResultsCard({ title, text }) {
  return (
    <div className='results-card'>
      <h2 className='card-title text--md'>{title}</h2>
      <p className='card-text'>{text}</p>
    </div>
  );
}

export default ResultsCard;
