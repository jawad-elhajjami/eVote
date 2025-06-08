"use client"
import { useDashboardUser } from "./layout"
import { CheckCircle, Clock, Key, Lock, ShieldCheck, Vote, Copy, Calendar } from "lucide-react"

const Dashboard = () => {
  const data = useDashboardUser()
  const role = data?.user?.roles || "guest"

  // Mock data - replace with actual data from your backend
  const stats = {
    votesParticipated: 7,
    activeElections: 3,
    completedElections: 12,
    securityScore: 92,
  }

  const recentActivity = [
    { id: 1, action: "Voted in Student Council Election", date: "2 days ago", status: "Completed" },
    { id: 2, action: "Generated new RSA key pair", date: "5 days ago", status: "Completed" },
    { id: 3, action: "Updated security preferences", date: "1 week ago", status: "Completed" },
  ]

  const upcomingElections = [
    { id: 1, title: "Campus Improvement Proposal", endDate: "June 20, 2024", participants: 89 },
    { id: 2, title: "Curriculum Changes Vote", endDate: "June 10, 2024", participants: 212 },
  ]

  // Mock public key - replace with actual user public key
  const publicKey = data?.publicKey || "No public key found."

  const copyToClipboard = (text:any) => {
    navigator.clipboard.writeText(text)
    alert("Public key copied to clipboard!")
  }

  return (
    <div className="">
      <h3 className="text-lg text-black font-medium mt-2 mb-6">Welcome back, {data?.user?.username || "Guest"} <i>{"("}{role}{")"}</i></h3>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Vote className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Votes Participated</p>
              <h4 className="text-xl font-semibold text-gray-800">{stats.votesParticipated}</h4>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <Calendar className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Active Elections</p>
              <h4 className="text-xl font-semibold text-gray-800">{stats.activeElections}</h4>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Completed Elections</p>
              <h4 className="text-xl font-semibold text-gray-800">{stats.completedElections}</h4>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-amber-50 rounded-lg">
              <ShieldCheck className="h-6 w-6 text-amber-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Security Score</p>
              <h4 className="text-xl font-semibold text-gray-800">{stats.securityScore}%</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Public Key Section */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Key className="h-5 w-5 text-gray-600 mr-2" />
            <h4 className="text-lg font-medium text-gray-800">Your Public Key</h4>
          </div>
          <button
            onClick={() => copyToClipboard(publicKey)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </button>
        </div>
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
          <p className="text-xs font-mono text-gray-600 break-all">{publicKey}</p>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          This is your RSA public key used for vote signing. Your private key is securely stored and never shared.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Elections */}
        <div className="bg-white rounded-lg shadow border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-600 mr-2" />
              <h4 className="text-lg font-medium text-gray-800">Upcoming Elections</h4>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingElections.map((election) => (
              <div key={election.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium text-gray-800">{election.title}</h5>
                    <p className="text-sm text-gray-500">Ends on {election.endDate}</p>
                    <p className="text-xs text-gray-400 mt-1">{election.participants} participants</p>
                  </div>
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                    Vote Now
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-100">
            <button className="text-sm text-blue-600 hover:text-blue-800">View all elections</button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-600 mr-2" />
              <h4 className="text-lg font-medium text-gray-800">Recent Activity</h4>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                  </div>
                  <span className="px-2 h-6 py-1 bg-green-100 text-green-800 text-xs rounded-full">{activity.status}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-100">
            <button className="text-sm text-blue-600 hover:text-blue-800">View all activity</button>
          </div>
        </div>
      </div>

      {/* Security Tips */}
      <div className="mt-8 bg-green-100 border border-green-300 rounded-lg p-4">
        <div className="flex items-start">
          <div className="p-2 bg-green-200 rounded-lg">
            <Lock className="h-5 w-5 text-green-600" />
          </div>
          <div className="ml-4">
            <h5 className="font-medium text-green-800">Security Tip</h5>
            <p className="text-sm text-green-800 mt-1">
              Remember to keep your private key secure and never share it with anyone. Your votes are cryptographically
              signed and verified using your key pair.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
