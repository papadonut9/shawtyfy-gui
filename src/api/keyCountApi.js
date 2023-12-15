import axios from "axios";

export const fetchKeyCount = async () => {
  try {
    const response = await axios.get("http://localhost:9808/get-key-count");
    return response;
  } catch (error) {
    console.error("Error fetching key count:", error);
    return {
      data: {
        key_count: "Error",
      },
    };
  }
};
