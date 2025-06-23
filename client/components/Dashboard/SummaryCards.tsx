import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trophy, TrendingUp } from "lucide-react";

export default function SummaryCards({
  results,
}: {
  results: PollResultsData;
}) {
  const getWinner = () => {
    if (!results || results.results.length === 0) return null;

    // Find the highest vote count
    const maxVotes = Math.max(...results.results.map((r) => r.votes));

    // If no votes, return null
    if (maxVotes === 0) return null;

    // Find all options with the highest vote count
    const winners = results.results.filter((r) => r.votes === maxVotes);

    // If there's a tie (more than one winner), return null to indicate tie
    if (winners.length > 1) return null;

    // Return the single winner
    return winners[0];
  };
  const winner = getWinner();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-white border-gray-100 shadow">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Votes</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {results.totalVotes}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-100 shadow">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <Trophy className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Winner</p>
              <h3 className="text-lg font-bold text-gray-800 truncate">
                {winner
                  ? winner.text
                  : results.totalVotes === 0
                  ? "No votes yet"
                  : results.results.filter(
                      (r) =>
                        r.votes ===
                        Math.max(...results.results.map((x) => x.votes))
                    ).length > 1
                  ? "Tie"
                  : "No clear winner"}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-100 shadow">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">
                {winner
                  ? "Winning Percentage"
                  : results.totalVotes === 0
                  ? "Winning Percentage"
                  : results.results.filter(
                      (r) =>
                        r.votes ===
                        Math.max(...results.results.map((x) => x.votes))
                    ).length > 1
                  ? "Tied Percentage"
                  : "Leading Percentage"}
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {winner
                  ? `${winner.percentage}%`
                  : results.totalVotes === 0
                  ? "0%"
                  : `${Math.max(
                      ...results.results.map((r) =>
                        Number.parseFloat(r.percentage)
                      )
                    )}%`}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
