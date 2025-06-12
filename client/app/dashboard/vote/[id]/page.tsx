"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import DashboardError from "@/components/Dashboard/DashboardError";
import Loading from "@/components/Dashboard/Loading";
import NotFound from "@/components/Dashboard/NotFound";
import PollInfoSidebar from "@/components/Dashboard/PollInfoSidebar";
import VotingForm from "@/components/Dashboard/VotingForm";
import { downloadReceipt } from "@/app/utils/helperFunctions";
import { useRouter } from "next/navigation";
import { CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VotePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voteSuccess, setVoteSuccess] = useState<VoteSuccess | null>(null);

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
      setVoteSuccess({
        receipt: result.receipt || "N/A",
        hash,
        signature,
      });

      // Optionally refresh the poll data to show updated vote counts
      fetchPoll();
    } catch (err) {
      setError(`Error submitting vote: ${
        err instanceof Error ? err.message : "Unknown error"
      }`)
    }
  };

  if (loading) {
    return <Loading loadingMessage="Loading poll details... Please wait." />;
  }

  if (voteSuccess) {
    return (
      <div className="mt-8 w-full max-w-md rounded-lg border border-gray-300 mx-auto h-fit flex flex-col items-center justify-center text-white p-6 bg-white ">
        <CheckCircle className="text-green-400 w-20 h-20 mb-4" />
        <h1 className="text-3xl text-center font-bold mb-4 text-black">
          Vote Submitted Successfully
        </h1>
        <p className="text-sm bg-green-50 p-4 rounded-lg max-w-md text-left mb-4 flex gap-2 border border-blue-200">
          <Info className="text-green-400" />
          <span className="text-green-600">You can download the reciept and use it in the futur to verify if your
          vote was accounted for.</span>
        </p>

        <div className="bg-slate-800 p-4 rounded max-w-md shadow-md w-full text-sm">
          <p className="overflow-ellipsis line-clamp-2">
            <strong>Receipt ID:</strong> {voteSuccess.receipt}
          </p>
          <p className="overflow-ellipsis line-clamp-2">
            <strong>Vote Hash:</strong>{" "}
            <span className="break-words">{voteSuccess.hash}</span>
          </p>
        </div>

        <Button
          onClick={() => downloadReceipt(voteSuccess)}
          className="mt-6 px-4 py-2 bg-green-600 rounded hover:bg-green-700 text-white"
        >
          Download Receipt
        </Button>

        <button
          onClick={() => router.push("/dashboard/polls")}
          className="mt-4 text-sm text-blue-400 hover:underline"
        >
          ← Back to Polls
        </button>
      </div>
    );
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
