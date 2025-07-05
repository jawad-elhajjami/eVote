"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, RefreshCw, Eye, Copy, ExternalLink, Shield, Users, FileText, Calendar, Hash, Vote } from "lucide-react"
import Link from "next/link"

type Vote = {
  receipt: string
  hash: string
  option: string
  pollTitle: string
  user: string
  timestamp: string
}

export default function VerifyVotesPage() {
  const [votes, setVotes] = useState<Vote[]>([])
  const [filteredVotes, setFilteredVotes] = useState<Vote[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchVotes = async () => {
    try {
      setRefreshing(true)
      const res = await fetch("http://localhost:3001/api/verify/votes")
      const data = await res.json()
      setVotes(data)
      setFilteredVotes(data)
    } catch (err) {
      console.error("Error fetching votes:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchVotes()
  }, [])

  useEffect(() => {
    const filtered = votes.filter((vote) =>
      Object.values(vote).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredVotes(filtered)
  }, [searchTerm, votes])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading vote verification data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-blue-600" />
              Vote Verification Dashboard
            </h1>
            <p className="text-gray-600">Monitor and verify all votes in the system</p>
          </div>
          <Button
            onClick={fetchVotes}
            disabled={refreshing}
            variant="outline"
            className="flex items-center bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-white border-gray-100 shadow">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Vote className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">Total Votes</p>
                <h3 className="text-xl font-semibold text-gray-800">{votes.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-100 shadow">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">Verified Votes</p>
                <h3 className="text-xl font-semibold text-gray-800">{votes.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-100 shadow">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">Unique Voters</p>
                <h3 className="text-xl font-semibold text-gray-800">{new Set(votes.map((v) => v.user)).size}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-100 shadow">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-50 rounded-lg">
                <FileText className="h-5 w-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">Active Polls</p>
                <h3 className="text-xl font-semibold text-gray-800">{new Set(votes.map((v) => v.pollTitle)).size}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white border-gray-100 shadow mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by receipt, hash, option, poll, or username..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-sm text-gray-500">
              Showing {filteredVotes.length} of {votes.length} votes
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Votes Table */}
      <Card className="bg-white border-gray-100 shadow">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Vote Records
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredVotes.length === 0 ? (
            <div className="p-8 text-center">
              <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No votes found</h3>
              <p className="text-gray-600">
                {searchTerm ? "Try adjusting your search criteria" : "No votes have been recorded yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-gray-700 font-medium">Receipt</TableHead>
                    <TableHead className="text-gray-700 font-medium">Vote Hash</TableHead>
                    <TableHead className="text-gray-700 font-medium">Option</TableHead>
                    <TableHead className="text-gray-700 font-medium">Poll</TableHead>
                    <TableHead className="text-gray-700 font-medium">Voter</TableHead>
                    <TableHead className="text-gray-700 font-medium">Timestamp</TableHead>
                    <TableHead className="text-gray-700 font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVotes.map((vote, i) => (
                    <TableRow key={i} className="hover:bg-gray-50">
                      <TableCell className="max-w-xs">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-800 truncate">{truncateText(vote.receipt, 30)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="flex items-center">
                          <Hash className="h-4 w-4 text-gray-400 mr-2" />
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 font-mono">
                            {truncateText(vote.hash, 20)}
                          </code>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-gray-700">
                          {vote.option}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <span className="text-sm text-gray-800 truncate block">{truncateText(vote.pollTitle, 25)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-800">Anonymous</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{formatDate(vote.timestamp)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => copyToClipboard(vote.hash)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Copy hash"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Link href={`/verify/${vote.hash}`} target="_blank">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Verify vote">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View details">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="bg-blue-50 border-blue-200 mt-6">
        <CardContent className="p-4">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h4 className="text-blue-800 font-medium mb-2">Cryptographic Verification</h4>
              <p className="text-blue-700 text-sm">
                All votes are cryptographically signed and can be independently verified. Each vote hash provides a
                tamper-proof record that ensures the integrity of the voting process. Click on the verification link to
                validate any vote's authenticity.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
