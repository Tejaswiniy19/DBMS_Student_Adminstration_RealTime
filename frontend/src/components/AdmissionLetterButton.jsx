import { generateAdmissionLetter } from "../utils/generateAdmissionLetter";

export default function AdmissionLetterButton({ student }) {
  return (
    <button
      onClick={() => generateAdmissionLetter(student)}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      Download Admission Letter
    </button>
  );
}