// Generic API helper for safe API calls

export const handleApi = async (apiCall) => {
  try {
    const response = await apiCall();
    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    console.error("API Error:", error);

    return {
      data: null,
      error:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
    };
  }
};