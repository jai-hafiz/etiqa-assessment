import axios from "axios";

export const githubAPI = async (page = 1) => {
  try {

    const response = await axios.get(
      `https://api.github.com/search/repositories`,
      {
        params: {
          q: ">2024-07-15", // Repos created after July 5, 2024
          sort: "stars",
          order: "desc",
          page,
          per_page: 30,
        },
      }
    );
    console.log("API response:", response.data); // Debug the full response
    return {
      items: response.data.items || [],
      totalCount: response.data.total_count || 0,
    };
  } catch (error) {
    console.error("GitHub API Error:", error.response?.data || error.message);
    throw error;
  }
};