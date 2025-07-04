import { useParams } from "react-router-dom";

export default function SubmissionDetail() {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Submission Detail
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          This page will show details for submission with ID:{" "}
          <span className="font-mono">{id}</span>
        </p>
      </div>
    </div>
  );
}
