import API from "../api";

// Candidates ko fetch karne ka function (setCandidates ko parameter me pass karna hoga)
export const fetchCandidates = async (setCandidates) => {
  try {
    const data = await getCandidates();
    if (Array.isArray(data)) {
      setCandidates(data);
    } else {
      console.error("Unexpected API response format", data);
    }
  } catch (error) {
    console.error("Error fetching candidates:", error);
  }
};

// Candidates ko API se fetch karne ka function
export const getCandidates = async () => {
  try {
    const { data } = await API.get("/candidates", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return data;
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return [];
  }
};

// Resume download karne ka function
export const downloadResume = async (candidateId) => {
  try {
    const response = await API.get(`/candidates/${candidateId}/resume`, {
      responseType: "blob",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "resume.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error downloading resume:", error);
  }
};
