export const adviceService = {
  async createNewAdvice() {
    try {
      const response = await fetch("/api/ai/advice/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error creating advice");
      }

      const newAdvice = await response.json();

      return newAdvice;
    } catch (error) {
      console.error("Error creating new advice:", error);
      throw error;
    }
  },
};
