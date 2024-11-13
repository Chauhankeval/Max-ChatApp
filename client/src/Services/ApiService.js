
const API_URL = import.meta.env.VITE_SERVER_URL;


export const ApiService = {
  callServicePostBodyData: async (url, bodyData) => {

    try {
      const response = await fetch(`${API_URL}/${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
        credentials: "include",
      });


      console.log("<<response",response)
      if (!response.ok) {
       
        if (response.status === 400) {
          throw new Error("Bad Request. Please check your input.");
        } else if (response.status === 404) {
          throw new Error("Resource not found.");
        } else if (response.status === 500) {
          throw new Error("Internal Server Error. Please try again later.");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error while calling API:", error);
      throw error;
    }
  },

  callServiceGetUserData: async (url, bodyData) => {
    try {
      const response = await fetch(`${API_URL}/${url}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
        credentials: "include",
      });

      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error while calling API:", error);
      throw error;
    }
  },

  callServiceGetUserDownload: async (url, options) => {
    try {
      // Perform a GET request to download the file as a blob
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Return the response as a blob for file downloads
      return await response.blob();
    } catch (error) {
      console.error("Error while calling API:", error);
      throw error;
    }
  },
  
  

  callServicePutUserData: async (url, bodyData) => {
    try {
      const response = await fetch(`${API_URL}/${url}`, {
        method: "PUT", // Change the method to 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData), 
        credentials: "include", 
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data; // Return the response data
    } catch (error) {
      console.error("Error while calling API:", error);
      throw error; // Re-throw the error for further handling
    }
  },

  callServicePostFormData: async (url, formData) => {
    console.log("<<Url", url);
    try {
      const response = await fetch(`${API_URL}/${url}`, {
        method: "POST",
        body: formData, // FormData automatically sets the correct content-type, so no need to add headers
        credentials: "include",
      });
  

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error while calling API:", error);
      throw error;
    }
  },

  callServiceDelete: async (url) => {
    console.log("<<Url", url);
    try {
      const response = await fetch(`${API_URL}/${url}`, {
        method: "DELETE",
        credentials: "include", // Include cookies for authentication if needed
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json(); // Assuming the server returns some data
      return data;
    } catch (error) {
      console.error("Error while calling API:", error);
      throw error;
    }
  }
  ,

  
};
