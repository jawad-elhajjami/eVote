import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Clock, Users, Lock } from "lucide-react";
import { getTotalVotes, getTimeRemaining, formatDate } from "@/app/utils/helperFunctions";
export default function PollInfoSidebar({ poll }: { poll: Poll }) {
  const totalVotes = getTotalVotes(poll.options);
  const timeRemaining = getTimeRemaining(poll.deadline);
  const isExpired = poll.deadline && new Date(poll.deadline) < new Date();
  return (
    <div className="lg:col-span-1">
      <Card className="bg-white border-gray-100 shadow">
        <CardHeader>
          <CardTitle className="text-gray-800">Poll Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Created By</h4>
            <div className="flex items-center mt-1">
              <User className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-800">{poll.createdBy.username}</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700">Created On</h4>
            <div className="flex items-center mt-1">
              <Clock className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-800">
                {formatDate(poll.createdAt)}
              </span>
            </div>
          </div>

          {poll.deadline && (
            <div>
              <h4 className="text-sm font-medium text-gray-700">Deadline</h4>
              <div className="flex items-center mt-1">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-800">
                  {formatDate(poll.deadline)}
                  {!isExpired && (
                    <span className="ml-2 text-sm text-blue-600 font-medium">
                      {timeRemaining}
                    </span>
                  )}
                </span>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-gray-700">Total Votes</h4>
            <div className="flex items-center mt-1">
              <Users className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-800">
                {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Security Information
            </h4>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <Lock className="h-4 w-4 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-800">
                  Cryptographically Secured
                </span>
              </div>
              <p className="text-xs text-gray-600">
                All votes are cryptographically signed using RSA-2048 to ensure
                authenticity and prevent tampering. Your vote receipt contains a
                unique hash that can be used for verification.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
