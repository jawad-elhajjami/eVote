import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, AlertCircle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/app/utils/helperFunctions";
const CHART_COLORS = [
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#06b6d4", // cyan-500
  "#84cc16", // lime-500
  "#f97316", // orange-500
  "#ec4899", // pink-500
  "#6366f1", // indigo-500
];

export default function DetailedResults({
  results,
}: {
  results: PollResultsData;
}) {
  return (
    <div className="lg:col-span-1">
      <Card className="bg-white border-gray-100 shadow">
        <CardHeader>
          <CardTitle className="text-gray-800">Detailed Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.results
            .sort((a, b) => b.votes - a.votes)
            .map((result, index) => {
              const maxVotes = Math.max(...results.results.map((r) => r.votes));
              const isWinner = result.votes === maxVotes && maxVotes > 0;
              const isTie =
                results.results.filter((r) => r.votes === maxVotes).length >
                  1 && maxVotes > 0;
              const color =
                CHART_COLORS[
                  results.results.indexOf(result) % CHART_COLORS.length
                ];

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {isWinner && !isTie && (
                        <Trophy className="h-4 w-4 text-yellow-500 mr-2" />
                      )}
                      {isWinner && isTie && (
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded mr-2">
                          TIE
                        </span>
                      )}
                      <span
                        className={`font-medium ${
                          isWinner && !isTie
                            ? "text-yellow-700"
                            : isWinner && isTie
                            ? "text-orange-700"
                            : "text-gray-800"
                        }`}
                      >
                        {result.text}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-800">
                        {result.votes}
                      </div>
                      <div className="text-sm text-gray-500">
                        {result.percentage}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${result.percentage}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              );
            })}

          {results.totalVotes === 0 && (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No votes yet
              </h3>
              <p className="text-gray-600">
                This poll hasn't received any votes.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Poll Status */}
      <Card className="bg-white border-gray-100 shadow mt-6">
        <CardHeader>
          <CardTitle className="text-gray-800">Poll Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Status</span>
            <Badge
              className={
                results.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }
            >
              {results.isActive ? "Active" : "Ended"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total Participants</span>
            <span className="font-medium text-gray-800">
              {results.totalVotes}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Options</span>
            <span className="font-medium text-gray-800">
              {results.results.length}
            </span>
          </div>

          {results.endDate && (
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm text-gray-600">
                  Poll ended on {formatDate(results.endDate)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
