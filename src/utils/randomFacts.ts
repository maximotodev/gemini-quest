// src/utils/randomFacts.ts
// Replace with your actual random facts
const facts2025 = [
  "In 2025, the global population is expected to surpass 8.1 billion.",
  "NASA plans to return humans to the Moon by 2025 under the Artemis program.",
  "Paris is hosting the Summer Olympics in 2025 for the third time in history.",
  "Electric vehicle sales are projected to exceed 17 million units worldwide in 2025.",
  "The average global temperature is expected to be one of the hottest on record in 2025.",
  "AI and automation are predicted to eliminate over 85 million jobs by the end of 2025, but also create over 90 million new ones.",
  "The market for wearable technology is expected to reach $160 billion by 2025.",
  "Bitcoin's block reward is now 3.125 BTC after the 2024 halving, making 2025 the first full year under this new rate.",
  "The James Webb Space Telescope continues to deliver high-resolution images of exoplanets and distant galaxies in 2025.",
  "Global e-learning revenue is expected to surpass $400 billion in 2025.",
  "The average smartphone will have over 1 TB of storage in 2025.",
  "Quantum computing research funding reached record highs in 2025.",
  "2025 marks 20 years since YouTube was founded.",
  "In 2025, synthetic meat production has become commercially viable in many countries.",
  "The world’s first 3D-printed neighborhood is expanding in Latin America in 2025.",
  "Solar energy is now the cheapest form of electricity in most parts of the world in 2025.",
  "Augmented reality (AR) glasses have begun to replace smartphones for early adopters in 2025.",
  "More than 70% of global internet traffic in 2025 is now encrypted by default.",
  "Reusable rockets have made space tourism more affordable in 2025, with suborbital flights offered by multiple companies.",
  "2025 is the International Year of Quantum Science and Technology, celebrating 100 years of quantum mechanics.",
  "Scientists are predicting the first fully functioning brain-computer interface by the end of the year.",
  "Renewable energy sources are now the primary source of power in over 30 countries.",
  "The global population has surpassed 8 billion, with over half living in urban areas.",
  "The first commercial space hotel is scheduled to open, offering luxury stays in orbit.",
  "Artificial intelligence is being widely used to discover new drugs and personalize medical treatments.",
  "Virtual reality is becoming more immersive, with haptic suits providing realistic touch sensations.",
  "Electric vehicles have outsold gasoline cars in several major markets.",
  "Researchers are working on genetically engineered crops that can capture carbon from the atmosphere.",
  "Quantum computers have achieved breakthroughs in solving complex problems.",
  "Mars exploration continues with the launch of several new rovers and orbital missions.",
];

export const randomFacts2025 = () => {
  const randomIndex = Math.floor(Math.random() * facts2025.length);
  return facts2025[randomIndex];
};
