export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getTimeRemaining = (deadline?: string) => {
  if (!deadline) return null;

  const now = new Date();
  const end = new Date(deadline);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days} day${days !== 1 ? "s" : ""} left`;
  if (hours > 0) return `${hours} hour${hours !== 1 ? "s" : ""} left`;
  return "Less than 1 hour left";
};

export const getTotalVotes = (options: PollOption[]) => {
  return options.reduce((total, option) => total + option.votes, 0);
};

export const downloadReceipt = (voteSuccess: VoteSuccess) => {
  if (!voteSuccess) return;

  const content = `
eVote Receipt
===============
Option : ${voteSuccess.option}
Receipt ID: ${voteSuccess.receipt}
Vote Hash: ${voteSuccess.hash}
Date: ${new Date().toLocaleString()}

Keep this receipt to verify your vote in the future.
`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `eVote_Receipt_${voteSuccess.receipt}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
