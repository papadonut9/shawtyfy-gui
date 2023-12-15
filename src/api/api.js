import axios from "axios";

export const fetchMetadata = async (shortUrl) => {
  try {
    const response = await axios.post("http://localhost:9808/get-metadata", {
      short_url: shortUrl,
    });

    return {
      url: response.data.url,
      userId: response.data.user_id,
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      url: "Error",
      userId: "Error",
    };
  }
};

export const deleteShortUrl = async (shortUrl) => {
  try {
    await axios.post("http://localhost:9808/delete", {
      short_url: shortUrl,
    });
  } catch (error) {
    console.error("Error deleting URL:", error);
  }
};
