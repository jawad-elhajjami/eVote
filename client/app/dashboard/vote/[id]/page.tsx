"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import DashboardError from "@/components/Dashboard/DashboardError";
import Loading from "@/components/Dashboard/Loading";
import NotFound from "@/components/Dashboard/NotFound";
import PollInfoSidebar from "@/components/Dashboard/PollInfoSidebar";

export default function VotePage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPoll();
  }, [id]);

  const fetchPoll = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(user);
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:3001/api/polls/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch poll: ${response.status}`);
      }

      const data = await response.json();
      setPoll(data);
    } catch (error) {
      console.error("Error fetching poll:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch poll");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <Loading loadingMessage="Loading poll details... Please wait." />;
  }

  if (error) {
    return (
      <DashboardError
        error={error}
        btnText="Back to polls"
        link={"/dashboard/polls"}
      />
    );
  }

  if (!poll) {
    return (
      <NotFound notFoundMessage="Poll not found" description="The poll you are looking for does not exist." btnText="Back to polls" link="/dashboard/polls" />
    );
  }

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 mt-6 gap-6">
      <div className="p-6 bg-white rounded-lg">
        <p className="text-black">Content goes here</p>
      </div>
      <PollInfoSidebar poll={poll} />
    </div>
  );
}
