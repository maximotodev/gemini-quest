// src/utils/randomFacts.ts
// Replace with your actual random facts
const facts2025 = [
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
