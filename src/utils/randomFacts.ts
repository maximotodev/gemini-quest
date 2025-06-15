export const randomFacts2025 = () => {
  const facts = [
    "The first video game was created in 1958.",
    "A group of owls is called a parliament.",
    "Honey never spoils.",
    "The Eiffel Tower can be 15 cm taller during the summer.",
    "Bananas are berries, but strawberries aren't.",
    "A crocodile cannot stick its tongue out.",
    "The average person spends six months of their life waiting for red lights to turn green.",
    "It is impossible to lick your elbow.",
    "A shrimp's heart is located in its head.",
    "Starfish don't have brains.",
    "The unicorn is the national animal of Scotland.",
    "There are more trees on Earth than stars in the Milky Way galaxy.",
    "A day on Venus is longer than a year on Earth.",
    "The Great Wall of China is not visible from space with the naked eye.",
    "Cows have best friends.",
    "The population of Dublin in 2024 is estimated to be 1.4 million.",
    "The population of Ireland in 2024 is estimated to be 5.3 million.",
  ];
  return facts[Math.floor(Math.random() * facts.length)];
};
