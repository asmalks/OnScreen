import React, { createContext, useContext, useState, ReactNode } from "react";
import { MockSession, mockSessions, ConnectedDevice, mockDevices } from "@/data/mockSessions";

interface SessionContextType {
  sessions: MockSession[];
  connectedDevices: ConnectedDevice[];
  activeSessionId: string | null;
  localStream: MediaStream | null;
  setActiveSessionId: (id: string | null) => void;
  setLocalStream: (stream: MediaStream | null) => void;
  createSession: (name: string, source: string) => MockSession;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<MockSession[]>(mockSessions);
  const [connectedDevices] = useState<ConnectedDevice[]>(mockDevices);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const createSession = (name: string, source: string): MockSession => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newSession: MockSession = {
      id,
      name,
      source,
      status: "active",
      connectedDevices: 0,
      latency: 0,
      resolution: "1080p",
      startedAt: "Just now",
      duration: "00:00:00",
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(id);
    return newSession;
  };

  return (
    <SessionContext.Provider
      value={{ sessions, connectedDevices, activeSessionId, localStream, setActiveSessionId, setLocalStream, createSession }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
