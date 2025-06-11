"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import DashboardError from "@/components/Dashboard/DashboardError";
import Loading from "@/components/Dashboard/Loading";
import NotFound from "@/components/Dashboard/NotFound";
import PollInfoSidebar from "@/components/Dashboard/PollInfoSidebar";
import VotingForm from "@/components/Dashboard/VotingForm";

export default function VotePage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
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
      console.log(data);
      setPoll(data);
    } catch (error) {
      console.error("Error fetching poll:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch poll");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitVote = async ({
    option,
    signature,
    hash,
    voteData,
    timestamp,
  }: {
    option: string;
    signature: string;
    hash: string;
    voteData: string;
    timestamp: string;
  }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Debug: Log what we're sending
      const requestBody = {
        option,
        signature,
        hash,
        voteData,
        timestamp,
      };

      console.log("Sending request body:", requestBody);
      console.log("Individual values:");
      console.log("- option:", option);
      console.log("- signature:", signature ? "present" : "missing");
      console.log("- hash:", hash ? "present" : "missing");
      console.log("- voteData:", voteData ? "present" : "missing");
      console.log("- timestamp:", timestamp);

      const response = await fetch(
        `http://localhost:3001/api/polls/${poll?._id}/vote`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        // Debug: log the response to see what we're actually getting
        const responseText = await response.text();
        console.log("Response status:", response.status);
        console.log("Response text:", responseText);

        // Try to parse as JSON, fallback to text if it fails
        let errorMessage = "Failed to submit vote";
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = `Server returned HTML instead of JSON. Status: ${response.status}`;
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Vote response:", result);

      // Show success message with receipt information
      alert(`Vote submitted successfully! 
  Receipt: ${result.receipt || "N/A"}
  Hash: ${hash}
  Keep this information to verify your vote later.`);

      // Optionally refresh the poll data to show updated vote counts
      // fetchPoll();
    } catch (err) {
      console.error("Voting error:", err);
      alert(
        `Error submitting vote: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      throw err; // Re-throw so VotingForm can handle the error state
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
      <NotFound
        notFoundMessage="Poll not found"
        description="The poll you are looking for does not exist."
        btnText="Back to polls"
        link="/dashboard/polls"
      />
    );
  }

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 mt-6 gap-6">
      <VotingForm
        pollId={poll._id}
        title={poll.title}
        options={poll.options.map((opt) => opt.text)}
        userId={user?.id || ""}
        onSubmit={onSubmitVote}
      />
      <PollInfoSidebar poll={poll} />
    </div>
  );
}
