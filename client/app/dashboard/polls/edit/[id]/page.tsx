"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Plus, ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

export default function EditPollPage() {
  const router = useRouter();
  const params = useParams();
  const pollId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);

  const [active, setActive] = useState(true);

  useEffect(() => {
    fetchPoll();
  }, [pollId]);

  const fetchPoll = async () => {
    try {
      setLoading(true);
      setError(null);

      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3001/api/polls/${pollId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch poll: ${response.status}`);
      }

      const poll: Poll = await response.json();

      // Populate form with existing data
      setTitle(poll.title);
      setDescription(poll.description);
      setActive(poll.isActive ? true : false);
      setEndDate(
        poll.endDate ? new Date(poll.endDate).toISOString().slice(0, 16) : ""
      );
      setOptions(poll.options.map((option) => option.text));
    } catch (err) {
      console.error("Error fetching poll:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch poll");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleIsActiveChange = (checked: boolean) => {
    setActive(checked);
  }

  const addOption = () => setOptions([...options, ""]);

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    const validOptions = options.filter((opt) => opt.trim() !== "");
    if (validOptions.length < 2) {
      alert("At least 2 options are required");
      return;
    }

    try {
      setSaving(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3001/api/polls/update/${pollId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            options: validOptions,
            isActive: active,
            endDate: endDate || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update poll");
      }

      alert("Poll updated successfully!");
      router.push("/dashboard/polls");
    } catch (err: any) {
      console.error("Error updating poll:", err);
      alert(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading poll...</span>
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
                Error loading poll
              </h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/dashboard/polls">
              <Button variant="outline">Back to Polls</Button>
            </Link>
          </div>
        </div>
      </div>
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

      <h1 className="text-3xl font-bold text-black mb-6">Edit Poll</h1>

      <Card className="bg-white max-w-2xl border-gray-100 shadow">
        <CardHeader>
          <CardTitle className="text-black">Poll Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-black mb-2 block">Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white border-gray-200 text-black"
                required
                disabled={saving}
              />
            </div>

            <div>
              <Label className="text-black mb-2 block">Description</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white border-gray-200 text-black"
                disabled={saving}
              />
            </div>

            <div>
              <Label className="text-black mb-2 block">
                Deadline (Optional)
              </Label>
              <Input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white border-gray-200 text-black"
                disabled={saving}
              />
            </div>

            <div>
              <Label className="text-black mb-2 block">Options</Label>
              {options.map((opt, index) => (
                <div key={index} className="flex gap-2 items-center mt-2">
                  <Input
                    value={opt}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="bg-white border-gray-200 text-black flex-1"
                    placeholder={`Option ${index + 1}`}
                    required
                    disabled={saving}
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => removeOption(index)}
                      disabled={saving}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="mt-2"
                onClick={addOption}
                disabled={saving}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Option
              </Button>
            </div>

            {/* isActive Checkbox */}
            <div className="flex items-center">
              <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950 w-full">
                <Checkbox
                  id="toggle-2"
                  className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                  checked={active}
                  onCheckedChange={(val) => setActive(!!val)}
                />
                <div className="grid gap-1.5 font-normal">
                  <p className="text-sm leading-none font-medium">
                    Activate Poll
                  </p>
                  <p className="text-muted-foreground text-sm">
                    You can toggle this to make the poll active or inactive. An inactive poll will not accept votes.
                  </p>
                </div>
              </Label>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating Poll...
                  </>
                ) : (
                  "Update Poll"
                )}
              </Button>
              <Link href="/dashboard/polls">
                <Button type="button" variant="outline" disabled={saving}>
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
