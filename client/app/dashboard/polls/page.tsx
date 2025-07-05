"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  User,
  Eye,
  Vote,
  Search,
  RefreshCw,
  Trash2,
  Edit,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PollsPage = () => {
  const { user } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [deletingPollId, setDeletingPollId] = useState<string | null>(null);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      setError(null);

      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch("http://localhost:3001/api/polls/all", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch polls: ${response.status}`);
      }

      const data = await response.json();
      setPolls(data);
    } catch (err) {
      console.error("Error fetching polls:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch polls");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const filteredPolls = polls.filter((poll) => {
    const matchesSearch =
      poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poll.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poll.createdBy.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && poll.isActive) ||
      (filterStatus === "inactive" && !poll.isActive);

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTotalVotes = (options: Poll["options"]) => {
    return options.reduce((total, option) => total + option.votes, 0);
  };

  const deletePoll = async (pollId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this poll? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeletingPollId(pollId);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3001/api/polls/delete/${pollId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete poll: ${response.status}`);
      }

      // Remove the poll from the local state
      setPolls(polls.filter((poll) => poll._id !== pollId));
      alert("Poll deleted successfully!");
    } catch (err) {
      console.error("Error deleting poll:", err);
      alert("Failed to delete poll. Please try again.");
    } finally {
      setDeletingPollId(null);
    }
  };

  const isMyPoll = (poll: Poll) => {
    return user?.username === poll.createdBy.username;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading polls...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading polls
              </h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={fetchPolls}
              className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">All Polls</h1>
        <p className="text-gray-600">
          View and manage all voting polls in the system
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search polls by title, description, or creator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 text-black rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select
              value={filterStatus}
              onValueChange={(value) =>
                setFilterStatus(value as "all" | "active" | "inactive")
              }
            >
              <SelectTrigger className="w-[180px] text-black">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={fetchPolls}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredPolls.length} of {polls.length} polls
        </p>
      </div>

      {/* Polls Table */}
      <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
        {filteredPolls.length === 0 ? (
          <div className="p-8 text-center">
            <Vote className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No polls found
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "There are no polls available at the moment"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Poll Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Creator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Votes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPolls.map((poll) => (
                  <tr key={poll._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-800">
                          {poll.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {poll.description}
                        </p>
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">
                            {poll.options.length} option
                            {poll.options.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-800">
                          {poll.createdBy.username}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          poll.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {poll.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Vote className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-800">
                          {getTotalVotes(poll.options)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          {formatDate(poll.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="link"
                          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                          asChild
                        >
                          <Link
                            href={`/dashboard/vote/${poll._id}`}
                            className="flex items-center"
                          >
                            <Eye className="h-4 w-4" />
                            Vote
                          </Link>
                        </Button>
                        {isMyPoll(poll) && (
                          <>
                            <Link
                              href={`/dashboard/polls/edit/${poll._id}`}
                              className="flex items-center text-sm text-green-600 hover:text-green-800"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Link>
                            <button
                              onClick={() => deletePoll(poll._id)}
                              disabled={deletingPollId === poll._id}
                              className="flex items-center text-sm text-red-600 hover:text-red-800 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                            >
                              {deletingPollId === poll._id ? (
                                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 mr-1" />
                              )}
                              {deletingPollId === poll._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                    <td>
                    <Button
                          asChild
                        >
                          <Link
                            href={`/dashboard/polls/results/${poll._id}`}
                            className="flex items-center text-sm">
                              View Results
                            </Link>
                        </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollsPage;
