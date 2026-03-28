import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheckIcon, 
  MagnifyingGlassIcon, 
  CheckBadgeIcon, 
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon
} from "@heroicons/react/24/outline";
import axios from "axios";

const VerifyCertificate = () => {
  const [searchParams] = useSearchParams();
  const [certId, setCertId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  // 1. Logic for Automatic QR Code Verification
  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) {
      setCertId(idFromUrl);
      performVerification(idFromUrl);
    }
  }, [searchParams]);

  // 2. Shared Verification Function
  const performVerification = async (idToVerify) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.get(`${apiUrl}/api/certificate/verify/${idToVerify}`);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Certificate ID. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Manual Form Submission
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!certId) return;
    performVerification(certId);
  };

  const handleDownload = () => {
    if (!result?.fileUrl) return;
    let downloadUrl = result.fileUrl;
    if (downloadUrl.includes("res.cloudinary.com")) {
      downloadUrl = downloadUrl.replace("/upload/", "/upload/fl_attachment/");
    }
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", `ED-Cert-${result.certificateId}.png`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans selection:bg-indigo-100 relative">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-[radial-gradient(at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-white to-transparent -z-10" />

      <div className="relative max-w-5xl mx-auto px-6 py-20">
        <header className="mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-10 w-1 bg-indigo-600 rounded-full" />
            <span className="uppercase tracking-[0.2em] text-xs font-bold text-indigo-600">Verification Portal</span>
          </motion.div>
          <h1 className="text-5xl font-light text-slate-800 tracking-tight">
            Validate <span className="font-bold">Credentials.</span>
          </h1>
          <p className="mt-4 text-slate-500 text-lg max-w-lg leading-relaxed">
            Scan a QR code or enter the unique ID to confirm the authenticity of Edvanta educational achievements.
          </p>
        </header>

        {/* Input Section */}
        <div className="mb-20">
          <form onSubmit={handleManualSubmit} className="max-w-2xl">
            <div className="flex flex-col sm:flex-row gap-0 group border-b-2 border-slate-200 focus-within:border-indigo-600 transition-all duration-300">
              <div className="flex-1 flex items-center py-4">
                <MagnifyingGlassIcon className="h-6 w-6 text-slate-400 mr-4" />
                <input
                  type="text"
                  placeholder="ID Number (e.g. ED-177...)"
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                  className="w-full bg-transparent text-xl font-medium outline-none placeholder:text-slate-300 uppercase tracking-wide"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !certId}
                className="py-4 px-8 text-indigo-600 font-bold hover:text-indigo-800 disabled:text-slate-300 transition-colors flex items-center gap-2 uppercase text-sm tracking-widest"
              >
                {loading ? <ArrowPathIcon className="h-5 w-5 animate-spin" /> : "Verify ID"}
              </button>
            </div>
          </form>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-4 p-4 border-l-4 border-red-500 bg-red-50 text-red-700 font-medium rounded-r-md max-w-lg"
            >
              <ExclamationTriangleIcon className="h-6 w-6 shrink-0" />
              <div>
                <p className="font-bold">Verification Failed</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div
              key={result.certificateId}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              {/* Result Details */}
              <div className="lg:col-span-5 space-y-10">
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <CheckBadgeIcon className="h-5 w-5 text-emerald-500" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Authentic Record Verified</span>
                    </div>
                    <h2 className="text-4xl font-bold text-slate-900 leading-tight">
                      {result.recipientName}
                    </h2>
                  </div>

                  <div className="grid gap-6">
                    <DetailItem label="Program of Study" value={result.courseName} />
                    <div className="grid grid-cols-2 gap-4 pt-4">
                       <DetailItem label="Conferred On" value={result.issueDate} />
                       <DetailItem label="Lead Instructor" value={result.instructorName} />
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex flex-col gap-4">
                  <button 
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-3 bg-slate-900 text-white h-14 rounded-full font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                    Download Credential
                  </button>
                  <p className="text-center font-mono text-xs text-slate-400">
                    Encrypted ID: {result.certificateId}
                  </p>
                </div>
              </div>

              {/* Preview Image */}
              <div className="lg:col-span-7">
                <div className="relative p-2 bg-white border border-slate-100 shadow-2xl rounded-sm group overflow-hidden">
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors pointer-events-none z-10" />
                  <img 
                    src={result.fileUrl} 
                    alt="Certificate Preview" 
                    className="w-full h-auto grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                  />
                  <a 
                    href={result.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-20"
                  >
                    <ArrowTopRightOnSquareIcon className="h-5 w-5 text-slate-800" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">{label}</p>
    <p className="text-lg font-medium text-slate-700">{value}</p>
  </div>
);

export default VerifyCertificate;