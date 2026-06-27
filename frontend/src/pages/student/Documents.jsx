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
    <div
    className="min-h-screen p-6 space-y-6 animate-fadeIn"
    style={{
      backgroundImage: `
        linear-gradient(
          rgba(15, 23, 42, 0.55),
          rgba(15, 23, 42, 0.55)
        ),
        url('https://jntugv.edu.in/static/media/JNTU_PIC.ae61eebb7dc963f0dd30.png')
      `,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      backgroundRepeat: "no-repeat"
    }}
  >
   
      <section className="card-glass p-8 rounded-3xl border border-white/30 shadow-2xl animate-slideUp">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Document Vault</h2>

            <p className="mt-2 text-slate-600 dark:text-slate-300 ">
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
  className="
    block
    rounded-3xl
    border
    border-slate-200
    bg-white/90
    dark:bg-slate-800/90
    dark:border-slate-700
    p-5
    shadow-md
    transition-all
    duration-300
  "
>

  <span className="font-semibold capitalize text-slate-800 dark:text-slate-100">
    {name.replace(/([A-Z])/g, " $1")}
  </span>

  <input
    type="file"
    name={name}
    accept="application/pdf,image/jpeg,image/png"
    onChange={handleChange}
    className="
      mt-4
      w-full
      rounded-lg
      border
      border-slate-300
      bg-slate-50
      px-3
      py-2
      text-slate-700
      file:mr-4
      file:rounded-lg
      file:border-0
      file:bg-blue-600
      file:px-4
      file:py-2
      file:text-white
      file:font-medium
      hover:file:bg-blue-700

      dark:bg-slate-900
      dark:border-slate-600
      dark:text-white
      dark:file:bg-blue-500
      dark:hover:file:bg-blue-600
    "
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
          <div className="mt-4 rounded-xl border border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700 p-4 text-green-700 dark:text-green-300">
            {status}
          </div>
        )}
      </section>
    </div>
  );
}