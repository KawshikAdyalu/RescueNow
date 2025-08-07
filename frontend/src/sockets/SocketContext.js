import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { getSocket } from "./socket";

const SocketContext = createContext();

export function SocketProvider({ token, children }) {
  const [updates, setUpdates] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token || socketRef.current) return;

    const s = getSocket(token);
    socketRef.current = s;
    s.connect();

    const handleNewDisaster = (data) =>
      setUpdates((prev) => [
        { type: "new-disaster", payload: data, timestamp: new Date() },
        ...prev,
      ]);

    const handleUpdateDisaster = (data) =>
      setUpdates((prev) => [
        { type: "update-disaster", payload: data, timestamp: new Date() },
        ...prev,
      ]);

    const handleSOSAlert = (data) =>
      setUpdates((prev) => [
        { type: "sos-alert", payload: data, timestamp: new Date() },
        ...prev,
      ]);

    s.on("new-disaster", handleNewDisaster);
    s.on("update-disaster", handleUpdateDisaster);
    s.on("sos-alert", handleSOSAlert);

    return () => {
      s.off("new-disaster", handleNewDisaster);
      s.off("update-disaster", handleUpdateDisaster);
      s.off("sos-alert", handleSOSAlert);
      s.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ updates, setUpdates }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useLiveUpdates = () => useContext(SocketContext);
