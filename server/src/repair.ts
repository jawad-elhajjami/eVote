import Poll from "./models/Poll";
import Vote from "./models/Vote";
export async function repairVoteCounts() {
  const polls = await Poll.find();

  for (const poll of polls) {
    // Reset all counts to zero
    poll.options.forEach((option) => (option.votes = 0));

    // Fetch all votes for this poll
    const votes = await Vote.find({ poll: poll._id });

    // Count votes per option
    for (const vote of votes) {
      const opt = poll.options.find((o) => o.text === vote.option);
      if (opt) opt.votes += 1;
    }

    await poll.save();
    console.log(`Updated counts for poll: ${poll.title}`);
  }

  console.log("✅ Vote counts repaired.");
}
