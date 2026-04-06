import { useEffect, useState } from "react";
import API from "../api/axios";

export default function useDashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await API.get("/interview/sessions");
        setSessions(res.data || []);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return { sessions, loading };
}