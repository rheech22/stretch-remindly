import { db } from "./db";

export const stretchingTips = {
  get: async () => {
    try {
      const { data } = await db.from("stretching-tips").select("*");
      return data;
    } catch (error) {
      console.error("Error fetching stretching tips:", error);
      return [];
    }
  },
};
