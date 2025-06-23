"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/app/utils/helperFunctions";

import { ArrowLeft, Calendar, User, Download } from "lucide-react";
import Link from "next/link";
import DashboardError from "@/components/Dashboard/DashboardError";
import Loading from "@/components/Dashboard/Loading";
import NotFound from "@/components/Dashboard/NotFound";
import SummaryCards from "@/components/Dashboard/SummaryCards";
import DetailedResults from "@/components/Dashboard/DetailedResults";
import Charts from "@/components/Dashboard/Charts";

export default function PollResultsPage() {
  const { id } = useParams();
  const [results, setResults] = useState<PollResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, [id]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3001/api/polls/${id}/results`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch results: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching results:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch results"
      );
    } finally {
      setLoading(false);
    }
  };

  const exportResults = () => {
    if (!results) return;

    const exportData = {
      poll: {
        id: results.pollId,
        title: results.title,
        description: results.description,
        createdBy: results.createdBy.username,
        endDate: results.endDate,
        totalVotes: results.totalVotes,
      },
      results: results.results,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `poll-results-${results.pollId}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <Loading loadingMessage="Loading results..." />;
  }

  if (error) {
    return (
      <DashboardError
        error="Error Loading results"
        link={"/dashboard/polls"}
        btnText="Back to Polls"
      />
    );
  }

  if (!results) {
    return (
      <NotFound
        notFoundMessage="The requested poll results could not be found."
        link={"/dashboard/polls"}
        btnText="Back to Polls"
      />
    );
  }
  

  return (
    <div className="p-6">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/dashboard/polls"
          className="inline-flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Polls
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{results.title}</h1>
            <p className="text-gray-600 mb-4">{results.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                Created by {results.createdBy.username}
              </div>
              {results.endDate && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Ended {formatDate(results.endDate)}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={results.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
              {results.isActive ? "Active" : "Ended"}
            </Badge>
            <Button onClick={exportResults} className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          </div>
        </div>
      </div>

      <SummaryCards results={results} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts */}
        <Charts results={results} />

        {/* Detailed Results */}
        <DetailedResults results={results} />
      </div>
    </div>
  );
}
