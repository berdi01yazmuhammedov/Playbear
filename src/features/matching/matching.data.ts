import type { Activity } from "../../types/activity";

export const foodMatchingActivity: Activity = {
  id: "food-vocabulary",
  type: "matching",
  title: "Food Vocabulary",
  instructions: "Match each word with its meaning.",
  items: [
    {
      id: "food-1",
      prompt: "apple",
      answer: "a round fruit",
    },
    {
      id: "food-2",
      prompt: "bread",
      answer: "a baked food",
    },
    {
      id: "food-3",
      prompt: "cheese",
      answer: "a dairy food",
    },
    {
      id: "food-4",
      prompt: "rice",
      answer: "small white grains",
    },
    {
      id: "food-5",
      prompt: "banana",
      answer: "a long yellow fruit",
    },
    {
      id: "food-6",
      prompt: "carrot",
      answer: "an orange vegetable",
    },
  ],
};