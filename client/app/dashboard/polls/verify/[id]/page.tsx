import QRCode from "react-qr-code";

export default function VoteSuccessPage({ receipt, hash }: { receipt: string, hash: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white p-6">
      <h1 className="text-3xl font-bold mb-4 text-green-400">
        ✅ Vote Submitted Successfully
      </h1>

      <div className="bg-slate-800 p-4 rounded shadow-md w-full max-w-md text-sm mb-4">
        <p><strong>Receipt ID:</strong> {receipt}</p>
        <p><strong>Vote Hash:</strong> <span className="break-words">{hash}</span></p>
      </div>

      <p className="mb-2">Scan this QR code later to verify your vote:</p>
      <QRCode
        value={`http://localhost:3000/verify/${receipt}`}
        size={180}
        bgColor="#1e293b"
        fgColor="#ffffff"
        level="H"
      />

      <a
        href={`http://localhost:3000/verify/${receipt}`}
        target="_blank"
        className="mt-6 underline text-blue-400"
      >
        Or click here to verify
      </a>
    </div>
  );
}
