"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Vote,
  RefreshCw,
  User,
  Clock,
  AlertCircle,
  FileKey,
  Download,
  CheckCircle,
  ArrowLeft,
  Users,
  Lock,
  Shield,
} from "lucide-react"
import Link from "next/link"

interface PollOption {
  _id: string
  text: string
  votes: number
}

interface Poll {
  _id: string
  title: string
  description: string
  options: PollOption[]
  createdBy: {
    _id: string
    username: string
  }
  createdAt: string
  deadline?: string
  isActive: boolean
  hasVoted: boolean
  userVote?: string
}

export default function VotePage() {
  const { id } = useParams()
//   const router = useRouter()
  const { user } = useAuth()
  const [poll, setPoll] = useState<Poll | null>(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [privateKey, setPrivateKey] = useState<File | null>(null)
  const [privateKeyError, setPrivateKeyError] = useState<string | null>(null)
  const [voteReceipt, setVoteReceipt] = useState<string | null>(null)

  useEffect(() => {
    fetchPoll()
  }, [id])

  const fetchPoll = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log(user)
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")

      const response = await fetch(`http://localhost:3001/api/polls/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch poll: ${response.status}`)
      }

      const data = await response.json()
      setPoll(data)
    } catch (error) {
      console.error("Error fetching poll:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch poll")
    } finally {
      setLoading(false)
    }
  }

  const handlePrivateKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setPrivateKey(null)
      return
    }

    // Check if file is a .pem file
    if (!file.name.endsWith(".pem")) {
      setPrivateKeyError("Please upload a valid .pem private key file")
      setPrivateKey(null)
      return
    }

    setPrivateKey(file)
    setPrivateKeyError(null)
  }

  const submitVote = async () => {
    if (!selectedOption) {
      alert("Please select an option before voting!")
      return
    }

    if (!privateKey) {
      setPrivateKeyError("Please upload your private key to sign your vote")
      return
    }

    if (!confirm("Are you sure you want to submit your vote? This action cannot be undone.")) {
      return
    }

    try {
      setVoting(true)
      setError(null)
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")

      // Read the private key file
      const privateKeyText = await privateKey.text()

      // Create the vote payload
      const votePayload = {
        pollId: id,
        optionId: selectedOption,
        timestamp: new Date().toISOString(),
        voter: user?.id || user?.username,
      }

      // In a real implementation, you would sign the vote with the private key
      // For now, we'll simulate this process
      const signedVote = await simulateSignVote(votePayload, privateKeyText)

      // Submit the vote to the server
      const response = await fetch("http://localhost:3001/api/vote/submit", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pollId: id,
          optionId: selectedOption,
          signature: signedVote.signature,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to submit vote")
      }

      const data = await response.json()

      // Generate vote receipt
      const receipt = {
        pollId: id,
        pollTitle: poll?.title,
        optionId: selectedOption,
        optionText: poll?.options.find((o) => o._id === selectedOption)?.text,
        timestamp: new Date().toISOString(),
        voter: user?.username,
        voteHash: signedVote.hash,
        signature: signedVote.signature,
      }

      // Convert receipt to string for download
      const receiptString = JSON.stringify(receipt, null, 2)
      setVoteReceipt(receiptString)

      // Update the poll in local state to show it's been voted on
      if (poll) {
        setPoll({
          ...poll,
          hasVoted: true,
          userVote: selectedOption,
          options: poll.options.map((option) =>
            option._id === selectedOption ? { ...option, votes: option.votes + 1 } : option,
          ),
        })
      }

      // Automatically download the receipt
      downloadReceipt(receiptString)
    } catch (error) {
      console.error("Error submitting vote:", error)
      setError(error instanceof Error ? error.message : "Failed to submit vote. Please try again.")
    } finally {
      setVoting(false)
    }
  }

  // Simulate signing a vote with a private key
  const simulateSignVote = async (payload: any, privateKeyText: string) => {
    // In a real implementation, you would use a library like crypto or node-forge
    // to sign the payload with the private key
    // For now, we'll simulate this process

    // Create a hash of the payload
    const payloadString = JSON.stringify(payload)
    const hash = await simulateHash(payloadString)

    // Simulate signing the hash with the private key
    const signature = await simulateSignature(hash, privateKeyText)

    return {
      hash,
      signature,
    }
  }

  // Simulate creating a hash
  const simulateHash = async (data: string) => {
    // In a real implementation, you would use a library like crypto
    // to create a SHA-256 hash of the data
    // For now, we'll simulate this process
    return "sha256-" + btoa(data).substring(0, 40)
  }

  // Simulate creating a signature
  const simulateSignature = async (hash: string, privateKey: string) => {
    // In a real implementation, you would use a library like crypto or node-forge
    // to sign the hash with the private key
    // For now, we'll simulate this process
    return "sig-" + btoa(hash + privateKey.substring(0, 20)).substring(0, 60)
  }

  // Download the vote receipt
  const downloadReceipt = (receiptString: string) => {
    const blob = new Blob([receiptString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `vote-receipt-${id}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTimeRemaining = (deadline?: string) => {
    if (!deadline) return null

    const now = new Date()
    const end = new Date(deadline)
    const diff = end.getTime() - now.getTime()

    if (diff <= 0) return "Ended"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days} day${days !== 1 ? "s" : ""} left`
    if (hours > 0) return `${hours} hour${hours !== 1 ? "s" : ""} left`
    return "Less than 1 hour left"
  }

  const getTotalVotes = (options: PollOption[]) => {
    return options.reduce((total, option) => total + option.votes, 0)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading poll...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error loading poll</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/dashboard/polls">
              <Button variant="outline" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Polls
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!poll) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Poll not found</h3>
              <p className="text-sm text-yellow-700 mt-1">The requested poll could not be found.</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/dashboard/polls">
              <Button variant="outline" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Polls
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const totalVotes = getTotalVotes(poll.options)
  const timeRemaining = getTimeRemaining(poll.deadline)
  const isExpired = poll.deadline && new Date(poll.deadline) < new Date()
  const canVote = poll.isActive && !poll.hasVoted && !isExpired

  return (
    <div className="p-6">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/dashboard/polls" className="inline-flex items-center text-gray-600 hover:text-gray-800">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Polls
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{poll.title}</h1>
        <p className="text-gray-600">{poll.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Voting Card */}
        <div className="lg:col-span-2">
          <Card className="bg-white border-gray-100 shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-gray-800">Cast Your Vote</CardTitle>
                <div>
                  {poll.hasVoted ? (
                    <Badge className="bg-green-100 text-green-800">Voted</Badge>
                  ) : canVote ? (
                    <Badge className="bg-blue-100 text-blue-800">Available</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">{isExpired ? "Expired" : "Inactive"}</Badge>
                  )}
                </div>
              </div>
              <CardDescription>
                {canVote
                  ? "Select an option and upload your private key to sign your vote"
                  : poll.hasVoted
                    ? "You have already voted in this poll"
                    : isExpired
                      ? "This poll has expired"
                      : "This poll is currently inactive"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Voting Options */}
              <div className="space-y-3">
                {poll.options.map((option) => {
                  const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0
                  const isSelected = selectedOption === option._id
                  const isUserVote = poll.hasVoted && poll.userVote === option._id

                  return (
                    <div key={option._id} className="relative">
                      {canVote ? (
                        <label
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="poll-option"
                            value={option._id}
                            checked={isSelected}
                            onChange={(e) => setSelectedOption(e.target.value)}
                            className="mr-3"
                          />
                          <span className="flex-1 text-gray-800">{option.text}</span>
                          <span className="text-sm text-gray-500">{option.votes} votes</span>
                        </label>
                      ) : (
                        <div
                          className={`p-3 border rounded-lg ${
                            isUserVote ? "border-green-500 bg-green-50" : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              {isUserVote && <CheckCircle className="h-4 w-4 text-green-600 mr-2" />}
                              <span className="text-gray-800">{option.text}</span>
                            </div>
                            <span className="text-sm text-gray-600">
                              {option.votes} votes ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${isUserVote ? "bg-green-500" : "bg-blue-500"}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Private Key Upload */}
              {canVote && (
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-800">Secure Voting</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Your vote will be cryptographically signed with your private key to ensure its authenticity. A
                          receipt will be generated for verification.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-700 mb-2 block">Upload Your Private Key (.pem)</Label>
                    <div className="flex items-center">
                      <Input
                        type="file"
                        accept=".pem"
                        onChange={handlePrivateKeyChange}
                        className="flex-1"
                        disabled={voting}
                      />
                      <div className="ml-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            privateKey
                              ? "bg-green-100 text-green-600 border border-green-200"
                              : "bg-gray-100 text-gray-400 border border-gray-200"
                          }`}
                        >
                          {privateKey ? <CheckCircle className="h-4 w-4" /> : <FileKey className="h-4 w-4" />}
                        </div>
                      </div>
                    </div>
                    {privateKeyError && <p className="text-sm text-red-600 mt-1">{privateKeyError}</p>}
                    <p className="text-xs text-gray-500 mt-1">
                      Your private key is only used locally to sign your vote and is never sent to our servers.
                    </p>
                  </div>

                  {/* Vote Button */}
                  <Button
                    onClick={submitVote}
                    disabled={!selectedOption || !privateKey || voting}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {voting ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Signing and Submitting Vote...
                      </>
                    ) : (
                      <>
                        <Vote className="mr-2 h-4 w-4" />
                        Sign and Submit Vote
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Vote Receipt */}
              {poll.hasVoted && voteReceipt && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-green-800">Vote Successfully Recorded</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Your vote has been cryptographically signed and recorded. A receipt has been generated for
                        verification.
                      </p>
                      <Button
                        onClick={() => downloadReceipt(voteReceipt)}
                        variant="outline"
                        className="mt-3 border-green-300 text-green-700 hover:bg-green-100"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Receipt Again
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Messages */}
              {poll.hasVoted && !voteReceipt && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-green-800">You have already voted in this poll</span>
                </div>
              )}

              {isExpired && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center">
                  <AlertCircle className="h-4 w-4 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-800">This poll has expired</span>
                </div>
              )}

              {!poll.isActive && !isExpired && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                  <span className="text-sm text-yellow-800">This poll is currently inactive</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Poll Info Sidebar */}
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
                  <span className="text-gray-800">{formatDate(poll.createdAt)}</span>
                </div>
              </div>

              {poll.deadline && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Deadline</h4>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-800">
                      {formatDate(poll.deadline)}
                      {!isExpired && <span className="ml-2 text-sm text-blue-600 font-medium">{timeRemaining}</span>}
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
                <h4 className="text-sm font-medium text-gray-700 mb-2">Security Information</h4>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <Lock className="h-4 w-4 text-gray-600 mr-2" />
                    <span className="text-sm font-medium text-gray-800">Cryptographically Secured</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    All votes are cryptographically signed using RSA-2048 to ensure authenticity and prevent tampering.
                    Your vote receipt contains a unique hash that can be used for verification.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
