import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchMetadata, deleteShortUrl } from "./api/api";
import { fetchKeyCount } from "./api/keyCountApi";

const Shawtyfy = () => {
  const [longUrl, setLongUrl] = useState("");
  const [userId, setUserId] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [tableData, setTableData] = useState([]);
  const [totalKeys, setTotalKeys] = useState(0);

  useEffect(() => {
    fetchDataOnMount();
    fetchTotalKeys();
  }, []);

  const fetchTotalKeys = async () => {
    try {
      const response = await fetchKeyCount();
      setTotalKeys(response.data.key_count);
    } catch (error) {
      console.error("Error fetching total keys:", error);
    }
  };

  const fetchDataOnMount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9808" + "/get-all-keys"
      );

      const keys = response.data.keys;
      const data = await Promise.all(
        keys.map(async (key) => {
          const metadata = await fetchMetadata(key);
          return {
            shorturl: key,
            url: metadata.url,
            userid: metadata.userId,
          };
        })
      );
      setTableData(data);
    } catch (error) {
      console.error("Error fetching keys and metadata:", error);
    }
  };

  const handleShorten = async () => {
    try {
      const response = await axios.post(
        "http://localhost:9808" + "/create-short-url",
        {
          long_url: longUrl,
          user_id: userId,
        }
      );

      setShortenedUrl(response.data.short_url);
      fetchDataOnMount();
    } catch (error) {
      console.error("Error shortening URL:", error);
    }
  };

  const handleDelete = async (shortUrl) => {
    try {
      await deleteShortUrl(shortUrl);
      fetchDataOnMount();
      const keyCountResponse = await fetchKeyCount();
      const newKeyCount = keyCountResponse.data.key_count;
      setTotalKeys(newKeyCount);
    } catch (error) {
      console.error("Error deleting URL:", error);
    }
  };

  const handleRefresh = () => {
    fetchDataOnMount();
    fetchTotalKeys();
  };
  // import React, { useState, useEffect } from "react";
  // import axios from "axios";

  // const Shawtyfy = () => {
  //   const [longUrl, setLongUrl] = useState("");
  //   const [userId, setUserId] = useState("");
  //   const [shortenedUrl, setShortenedUrl] = useState("");
  //   const [tableData, setTableData] = useState([]);
  //   const [totalKeys, setTotalKeys] = useState(0);

  //   useEffect(() => {
  //     // Fetch keys and metadata on component mount
  //     fetchDataOnMount();
  //     fetchTotalKeys();
  //   }, []);

  //   const fetchTotalKeys = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:9808/get-key-count");
  //       setTotalKeys(response.data.key_count);
  //     } catch (error) {
  //       console.error("Error fetching total keys:", error);
  //     }
  //   };

  //   const fetchDataOnMount = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:9808" + "/get-all-keys"
  //       );

  //       const keys = response.data.keys;
  //       const data = await Promise.all(
  //         keys.map(async (key) => {
  //           const metadata = await handleFetchMetadata(key);
  //           return {
  //             shorturl: key,
  //             url: metadata.url,
  //             userid: metadata.userId,
  //           };
  //         })
  //       );
  //       setTableData(data);
  //     } catch (error) {
  //       console.error("Error fetching keys and metadata:", error);
  //     }
  //   };

  //   const handleShorten = async () => {
  //     try {
  //       const response = await axios.post(
  //         "http://localhost:9808" + "/create-short-url",
  //         {
  //           long_url: longUrl,
  //           user_id: userId,
  //         }
  //       );

  //       setShortenedUrl(response.data.short_url);
  //       // Fetch keys again after shortening
  //       fetchDataOnMount();
  //     } catch (error) {
  //       console.error("Error shortening URL:", error);
  //     }
  //   };

  //   const handleFetchMetadata = async (shortUrl) => {
  //     try {
  //       const response = await axios.post("http://localhost:9808/get-metadata", {
  //         short_url: shortUrl,
  //       });

  //       return {
  //         url: response.data.url,
  //         userId: response.data.user_id,
  //       };
  //     } catch (error) {
  //       console.error("Error fetching metadata:", error);
  //       return {
  //         url: "Error",
  //         userId: "Error",
  //       };
  //     }
  //   };

  //   const handleDelete = async (shortUrl) => {
  //     try {
  //       await axios.post("http://localhost:9808/delete", {
  //         short_url: shortUrl,
  //       });

  //       // Fetch keys again after deleting
  //       fetchDataOnMount();

  //       // fetch key count
  //       const keyCountResponse = await axios.get(
  //         "http://localhost:9808/get-key-count"
  //       );
  //       const newKeyCount = keyCountResponse.data.key_count;

  //       // Update key count in the component state
  //       setTotalKeys(newKeyCount);
  //     } catch (error) {
  //       console.error("Error deleting URL:", error);
  //     }
  //   };

  //   const handleRefresh = () => {
  //     // Fetch keys and metadata on refresh
  //     fetchDataOnMount();
  //     fetchTotalKeys();
  //   };

  return (
    <div>
      <h1 onClick={handleRefresh} style={{ cursor: "pointer" }}>
        Shawtyfy
      </h1>
      <p>Total Keys: {totalKeys}</p>
      <div>
        <label>Enter URL:</label>
        <input
          type="text"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
        />
      </div>
      <div>
        <label>Enter User ID:</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>
      <div>
        <button onClick={handleShorten}>Shorten URL</button>
      </div>
      {shortenedUrl && (
        <div>
          <p>Shortened URL:</p>
          <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">
            {shortenedUrl}
          </a>
        </div>
      )}
      <div style={{ textAlign: "center" }}>
        <h2>Key Table</h2>
        <table>
          <thead>
            <tr>
              <th>Short URL</th>
              <th>URL</th>
              <th>User ID</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>{row.shorturl}</td>
                <td>{row.url}</td>
                <td>{row.userid}</td>
                <td>
                  <button onClick={() => handleDelete(row.shorturl)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Shawtyfy;
