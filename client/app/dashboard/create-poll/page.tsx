"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useProtectedRoute } from "@/app/utils/withAuth";
import { toast } from "sonner";

export default function CreatePollPage() {
  useProtectedRoute();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const router = useRouter();

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await fetch("http://localhost:3001/api/polls/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, options, deadline }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Poll created successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="mt-8">
      <h1 className="text-3xl font-bold text-black mb-6">Create a New Poll</h1>
      <Card className="bg-white max-w-4xl border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-black">Poll Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-black mb-4">Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white/10 border-black/15 text-black"
                required
              />
            </div>
            <div>
              <Label className="text-black mb-4">Description</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white/10 border-black/15 text-black"
              />
            </div>
            <div>
              <Label className="text-black mb-4">Deadline</Label>
              <Input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="bg-white/10 border-black/15 text-black"
              />
            </div>
            <div>
              <Label className="text-black mb-4">Options</Label>
              {options.map((opt, index) => (
                <div key={index} className="flex gap-2 items-center mt-2">
                  <Input
                    value={opt}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="bg-white/10 border-black/15 text-black flex-1"
                    required
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-red-400"
                      onClick={() => removeOption(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" className="mt-2" onClick={addOption}>
                <Plus className="w-4 h-4 mr-1" /> Add Option
              </Button>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            >
              Create Poll
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
