import { fetcher } from "@/lib/fetcher";

export const movementCrudService = {
  async createMovement(movementData) {
    const response = await fetcher("/api/movements/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movementData),
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  },

  async updateMovement(movementId, movementData) {
    const response = await fetcher(`/api/movements/update?id=${movementId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movementData),
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  },

  async deleteMovement(movementId) {
    const response = await fetcher(`/api/movements/delete?id=${movementId}`, {
      method: "DELETE",
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  },
};
