import API from "../api";

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
