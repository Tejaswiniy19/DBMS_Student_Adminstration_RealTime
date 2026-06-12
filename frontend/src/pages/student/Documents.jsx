import { useState } from "react";
import api from "../../api/api";
import { UploadCloud } from "lucide-react";

export default function Documents() {
  const [files, setFiles] = useState({});
  const [status, setStatus] = useState("");

  const documentFields = [
    "photograph",
    "aadhaar",
    "sscMemo",
    "intermediateMemo",
    "transferCertificate",
    "incomeCertificate",
    "casteCertificate",
    "DOBCertificate",
    "rankCard",
    "signature",
    "sportsCertificate",
    "academicCertificate",
  ];

  const handleChange = (e) => {
    setFiles((prev) => ({
      ...prev,
      [e.target.name]: e.target.files[0],
    }));
  };

  const handleUpload = async () => {
    try {
      const form = new FormData();

      Object.entries(files).forEach(([field, file]) => {
        if (file) {
          form.append(field, file);
        }
      });

      if (Object.keys(files).length === 0) {
        setStatus("Please select at least one document.");
        return;
      }

      await api.post("/documents/upload", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setStatus(
        "Documents uploaded successfully. View them in DigiLocker on Dashboard."
      );

      setFiles({});
    } catch (error) {
      console.error(error);
      setStatus("Upload failed.");
    }
  };

  return (
    <div className="space-y-6">
      <section className="card-glass p-8 rounded-3xl border-slate-200">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Document Vault</h2>

            <p className="mt-2 text-slate-500">
              Upload your documents securely for admin verification.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-3xl bg-blue-600 px-4 py-3 text-white">
            <UploadCloud size={18} />
            <span>Supported: PDF, JPG, PNG</span>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {documentFields.map((name) => (
            <label
              key={name}
              className="block rounded-3xl border border-slate-200 bg-white p-5"
            >
              <span className="font-semibold capitalize">
                {name.replace(/([A-Z])/g, " $1")}
              </span>

              <input
                type="file"
                name={name}
                accept="application/pdf,image/jpeg,image/png"
                onChange={handleChange}
                className="mt-4 w-full"
              />
            </label>
          ))}
        </div>

        <div className="mt-6">
          <button
            onClick={handleUpload}
            className="rounded-3xl bg-blue-600 px-6 py-3 text-white"
          >
            Upload Files
          </button>
        </div>

        {status && (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            {status}
          </div>
        )}
      </section>
    </div>
  );
}