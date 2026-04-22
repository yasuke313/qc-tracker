import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [analytes, setAnalytes] = useState([]);
  const [selectedAnalyte, setSelectedAnalyte] = useState(null);
  const [entries, setEntries] = useState([]);
  const [result, setResult] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");

  const [analyteName, setAnalyteName] = useState("");
  const [analyteUnit, setAnalyteUnit] = useState("");
  const [analyteLevel, setAnalyteLevel] = useState("low");
  const [analyteMean, setAnalyteMean] = useState("");
  const [analyteSd, setAnalyteSd] = useState("");
  const [analyteLoading, setAnalyteLoading] = useState(false);
  const [analyteError, setAnalyteError] = useState("");
  const [analyteSuccess, setAnalyteSuccess] = useState("");

  const config = {
    headers: { Authorization: `Bearer ${user.token}` },
  };

  useEffect(() => {
    fetchAnalytes();
  }, []);

  useEffect(() => {
    if (selectedAnalyte) {
      fetchEntries();
    }
  }, [selectedAnalyte]);

  const fetchAnalytes = async () => {
    try {
      const { data } = await axios.get(
        "https://qc-tracker-1.onrender.com/api/analytes",
        config,
      );
      setAnalytes(data);
      if (data.length > 0) setSelectedAnalyte(data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEntries = async () => {
    try {
      const { data } = await axios.get(
        `https://qc-tracker-1.onrender.com/api/qc-entries?analyteId=${selectedAnalyte._id}`,
        config,
      );
      setEntries(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post(
        "https://qc-tracker-1.onrender.com/api/qc-entries",
        {
          analyteId: selectedAnalyte._id,
          result: Number(result),
          notes,
        },
        config,
      );
      setSuccess("QC result submitted successfully!");
      setResult("");
      setNotes("");
      setSubmitted(true);
      setActivePage("log");
      fetchEntries();
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAddAnalyte = async (e) => {
    e.preventDefault();
    setAnalyteError("");
    setAnalyteSuccess("");
    setAnalyteLoading(true);

    try {
      await axios.post(
        "https://qc-tracker-1.onrender.com/api/analytes",
        {
          name: analyteName,
          unit: analyteUnit,
          level: analyteLevel,
          mean: Number(analyteMean),
          sd: Number(analyteSd),
        },
        config,
      );
      setAnalyteSuccess(`${analyteName} (${analyteLevel}) added successfully!`);
      setAnalyteName("");
      setAnalyteUnit("");
      setAnalyteLevel("low");
      setAnalyteMean("");
      setAnalyteSd("");
      fetchAnalytes();
    } catch (error) {
      setAnalyteError(error.response?.data?.message || "Something went wrong");
    } finally {
      setAnalyteLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === "rejected")
      return "bg-red-900 text-red-300 px-2 py-1 rounded-full text-xs font-bold";
    if (status === "warning")
      return "bg-orange-900 text-orange-300 px-2 py-1 rounded-full text-xs font-bold";
    return "bg-green-900 text-green-300 px-2 py-1 rounded-full text-xs font-bold";
  };

  const chartData = entries.map((entry, index) => ({
    run: index + 1,
    result: entry.result,
  }));

  // Theme classes
  const bg = darkMode ? "bg-gray-950" : "bg-gray-100";
  const card = darkMode ? "bg-gray-900" : "bg-white";
  const text = darkMode ? "text-white" : "text-gray-800";
  const subtext = darkMode ? "text-gray-400" : "text-gray-500";
  const input = darkMode
    ? "bg-gray-800 text-white border-gray-700 placeholder-gray-500"
    : "bg-white text-gray-800 border-gray-300 placeholder-gray-400";
  const sidebar = darkMode
    ? "bg-gray-900 border-gray-800"
    : "bg-white border-gray-200";
  const tableHead = darkMode
    ? "bg-gray-800 text-gray-400"
    : "bg-gray-50 text-gray-600";
  const tableRow = darkMode
    ? "hover:bg-gray-800 border-gray-800"
    : "hover:bg-gray-50 border-gray-100";
  const activeNav = darkMode
    ? "bg-blue-600 text-white"
    : "bg-blue-600 text-white";
  const inactiveNav = darkMode
    ? "text-gray-400 hover:bg-gray-800 hover:text-white"
    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

  return (
    <div className={`min-h-screen ${bg} flex transition-colors duration-300`}>
      {/* Sidebar */}
      <div className={`${sidebar} border-r w-64 flex flex-col fixed h-full`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white rounded-lg p-1 font-bold text-sm">
              QC
            </div>
            <span className={`${text} font-bold text-lg`}>QC Tracker</span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActivePage("dashboard")}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
              activePage === "dashboard" ? activeNav : inactiveNav
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActivePage("submit")}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
              activePage === "submit" ? activeNav : inactiveNav
            }`}
          >
            Daily Entries
          </button>
          <button
            onClick={() => setActivePage("chart")}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
              activePage === "chart" ? activeNav : inactiveNav
            }`}
          >
            LJ Chart
          </button>
          <button
            onClick={() => setActivePage("log")}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
              activePage === "log" ? activeNav : inactiveNav
            }`}
          >
            QC Log
          </button>

          <button
            onClick={() => setActivePage("addAnalyte")}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
              activePage === "addAnalyte" ? activeNav : inactiveNav
            }`}
          >
            Add Analyte
          </button>
        </nav>

        {/* Bottom section */}
        <div
          className={`p-4 border-t ${darkMode ? "border-gray-800" : "border-gray-200"}`}
        >
          <p className={`${subtext} text-sm mb-1`}>{user.name}</p>
          <p className={`${subtext} text-xs mb-4`}>
            {user.role.replace("_", " ")}
          </p>

          <button
            onClick={handleLogout}
            className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content — pushed right by sidebar width */}
      <div className="ml-64 flex-1 p-6">
        {/* Top bar with toggle */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`flex items-center gap-2 px-3 py-2 rounded-full border transition ${
              darkMode
                ? "border-gray-600 bg-gray-800 text-yellow-300 hover:bg-gray-700"
                : "border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 4.354a.75.75 0 01.75.75V6a.75.75 0 01-1.5 0v-.896a.75.75 0 01.75-.75zM12 18a.75.75 0 01.75.75v.896a.75.75 0 01-1.5 0V18.75A.75.75 0 0112 18zM4.354 12a.75.75 0 01.75-.75H6a.75.75 0 010 1.5h-.896a.75.75 0 01-.75-.75zM18 12a.75.75 0 01.75-.75h.896a.75.75 0 010 1.5H18.75A.75.75 0 0118 12zM6.343 6.343a.75.75 0 011.06 0l.634.633a.75.75 0 11-1.06 1.061l-.634-.634a.75.75 0 010-1.06zM16.596 16.596a.75.75 0 011.061 0l.634.634a.75.75 0 11-1.06 1.06l-.634-.634a.75.75 0 010-1.06zM6.343 17.657a.75.75 0 010-1.06l.634-.634a.75.75 0 111.06 1.06l-.633.634a.75.75 0 01-1.061 0zM16.596 7.404a.75.75 0 010-1.06l.634-.634a.75.75 0 111.06 1.06l-.634.634a.75.75 0 01-1.06 0zM12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
              </svg>
            )}
          </button>
        </div>

        {/* rest of your content stays here unchanged */}

        {selectedAnalyte && (
          <>
            {/* Dashboard page */}
            {activePage === "dashboard" && (
              <div className="grid grid-cols-3 gap-4">
                <div className={`${card} rounded-xl shadow p-6 text-center`}>
                  <p className={`${subtext} text-sm mb-1`}>Total Runs</p>
                  <p className="text-4xl font-bold text-blue-500">
                    {entries.length}
                  </p>
                </div>
                <div className={`${card} rounded-xl shadow p-6 text-center`}>
                  <p className={`${subtext} text-sm mb-1`}>Warnings</p>
                  <p className="text-4xl font-bold text-orange-400">
                    {entries.filter((e) => e.status === "warning").length}
                  </p>
                </div>
                <div className={`${card} rounded-xl shadow p-6 text-center`}>
                  <p className={`${subtext} text-sm mb-1`}>Rejections</p>
                  <p className="text-4xl font-bold text-red-400">
                    {entries.filter((e) => e.status === "rejected").length}
                  </p>
                </div>
              </div>
            )}

            {/* Submit Result page */}
            {activePage === "submit" && (
              <div className={`${card} rounded-xl shadow p-6`}>
                <h3 className={`text-lg font-bold ${text} mb-4`}>
                  Submit QC Result
                </h3>
                {error && (
                  <p className="bg-red-900 text-red-300 p-3 rounded mb-4 text-sm">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="bg-green-900 text-green-300 p-3 rounded mb-4 text-sm">
                    {success}
                  </p>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className={`block ${text} font-medium mb-1`}>
                      Result ({selectedAnalyte.unit})
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={result}
                      onChange={(e) => setResult(e.target.value)}
                      required
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 ${input}`}
                      placeholder="Enter result"
                    />
                  </div>
                  <div className="mb-6">
                    <label className={`block ${text} font-medium mb-1`}>
                      Notes (optional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 ${input}`}
                      placeholder="Add a note"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Result"}
                  </button>
                </form>
              </div>
            )}

            {/* LJ Chart page */}
            {activePage === "chart" && (
              <div className={`${card} rounded-xl shadow p-6`}>
                <h3 className={`text-lg font-bold ${text} mb-1`}>
                  Levey-Jennings Chart — {selectedAnalyte.name} (
                  {selectedAnalyte.level})
                </h3>
                <p className={`${subtext} text-sm mb-4`}>
                  Mean: {selectedAnalyte.mean} | SD: {selectedAnalyte.sd} |
                  Unit: {selectedAnalyte.unit}
                </p>
                {!submitted || entries.length === 0 ? (
                  <p className={`${subtext} text-center py-20`}>
                    No data yet. Submit a QC result first to see the chart.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={420}>
                    <LineChart
                      data={entries.map((entry, index) => ({
                        run: index + 1,
                        result: entry.result,
                        zScore: entry.zScore.toFixed(2),
                        status: entry.status,
                        flags:
                          entry.flags.map((f) => f.rule).join(", ") || "none",
                      }))}
                      margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={darkMode ? "#374151" : "#e5e7eb"}
                      />
                      <XAxis
                        dataKey="run"
                        stroke={darkMode ? "#9ca3af" : "#6b7280"}
                        label={{
                          value: "Run Number",
                          position: "insideBottom",
                          offset: -10,
                          fill: darkMode ? "#9ca3af" : "#6b7280",
                        }}
                      />
                      <YAxis
                        domain={["auto", "auto"]}
                        stroke={darkMode ? "#9ca3af" : "#6b7280"}
                        label={{
                          value: selectedAnalyte.unit,
                          angle: -90,
                          position: "insideLeft",
                          fill: darkMode ? "#9ca3af" : "#6b7280",
                        }}
                      />

                      {/* Custom tooltip */}
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            const color =
                              d.status === "rejected"
                                ? "#f87171"
                                : d.status === "warning"
                                  ? "#fb923c"
                                  : "#4ade80";
                            return (
                              <div
                                style={{
                                  backgroundColor: darkMode
                                    ? "#1f2937"
                                    : "#ffffff",
                                  border: `1px solid ${color}`,
                                  borderRadius: "8px",
                                  padding: "10px 14px",
                                }}
                              >
                                <p
                                  style={{
                                    color: darkMode ? "#fff" : "#000",
                                    fontWeight: "bold",
                                    marginBottom: "4px",
                                  }}
                                >
                                  Run {d.run}
                                </p>
                                <p
                                  style={{
                                    color: darkMode ? "#d1d5db" : "#4b5563",
                                    fontSize: "13px",
                                  }}
                                >
                                  Result:{" "}
                                  <strong>
                                    {d.result} {selectedAnalyte.unit}
                                  </strong>
                                </p>
                                <p
                                  style={{
                                    color: darkMode ? "#d1d5db" : "#4b5563",
                                    fontSize: "13px",
                                  }}
                                >
                                  Z-Score: <strong>{d.zScore}</strong>
                                </p>
                                <p
                                  style={{
                                    color,
                                    fontSize: "13px",
                                    fontWeight: "bold",
                                    marginTop: "4px",
                                  }}
                                >
                                  {d.status.toUpperCase()}
                                  {d.flags !== "none" ? ` — ${d.flags}` : ""}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />

                      {/* SD Reference lines */}
                      <ReferenceLine
                        y={selectedAnalyte.mean}
                        stroke="#22c55e"
                        strokeWidth={2}
                        label={{
                          value: "Mean",
                          fill: darkMode ? "#fff" : "#000",
                          fontSize: 11,
                        }}
                      />
                      <ReferenceLine
                        y={selectedAnalyte.mean + selectedAnalyte.sd}
                        stroke="#3b82f6"
                        strokeDasharray="4 4"
                        label={{
                          value: "+1SD",
                          fill: darkMode ? "#9ca3af" : "#6b7280",
                          fontSize: 11,
                        }}
                      />
                      <ReferenceLine
                        y={selectedAnalyte.mean - selectedAnalyte.sd}
                        stroke="#3b82f6"
                        strokeDasharray="4 4"
                        label={{
                          value: "-1SD",
                          fill: darkMode ? "#9ca3af" : "#6b7280",
                          fontSize: 11,
                        }}
                      />
                      <ReferenceLine
                        y={selectedAnalyte.mean + 2 * selectedAnalyte.sd}
                        stroke="#f97316"
                        strokeDasharray="4 4"
                        label={{
                          value: "+2SD",
                          fill: darkMode ? "#9ca3af" : "#6b7280",
                          fontSize: 11,
                        }}
                      />
                      <ReferenceLine
                        y={selectedAnalyte.mean - 2 * selectedAnalyte.sd}
                        stroke="#f97316"
                        strokeDasharray="4 4"
                        label={{
                          value: "-2SD",
                          fill: darkMode ? "#9ca3af" : "#6b7280",
                          fontSize: 11,
                        }}
                      />
                      <ReferenceLine
                        y={selectedAnalyte.mean + 3 * selectedAnalyte.sd}
                        stroke="#ef4444"
                        strokeDasharray="4 4"
                        label={{
                          value: "+3SD",
                          fill: darkMode ? "#9ca3af" : "#6b7280",
                          fontSize: 11,
                        }}
                      />
                      <ReferenceLine
                        y={selectedAnalyte.mean - 3 * selectedAnalyte.sd}
                        stroke="#ef4444"
                        strokeDasharray="4 4"
                        label={{
                          value: "-3SD",
                          fill: darkMode ? "#9ca3af" : "#6b7280",
                          fontSize: 11,
                        }}
                      />

                      {/* The line connecting all points */}
                      <Line
                        type="monotone"
                        dataKey="result"
                        stroke={darkMode ? "#60a5fa" : "#2563eb"}
                        strokeWidth={2}
                        dot={(props) => {
                          const { cx, cy, payload } = props;
                          const color =
                            payload.status === "rejected"
                              ? "#ef4444"
                              : payload.status === "warning"
                                ? "#f97316"
                                : "#22c55e";
                          return (
                            <circle
                              key={`dot-${props.index}`}
                              cx={cx}
                              cy={cy}
                              r={6}
                              fill={color}
                              stroke={darkMode ? "#1f2937" : "#ffffff"}
                              strokeWidth={2}
                            />
                          );
                        }}
                        activeDot={{ r: 9 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}

                {/* Legend */}
                <div className="flex gap-6 mt-4 justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span className={`${subtext} text-xs`}>In control</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                    <span className={`${subtext} text-xs`}>Warning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <span className={`${subtext} text-xs`}>Rejected</span>
                  </div>
                </div>
              </div>
            )}

            {/* QC Log page */}
            {activePage === "log" && (
              <div className={`${card} rounded-xl shadow p-6`}>
                <h3 className={`text-lg font-bold ${text} mb-4`}>QC Log</h3>
                {entries.length === 0 ? (
                  <p className={`${subtext} text-center py-20`}>
                    No entries yet. Submit a QC result first.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className={`${tableHead} uppercase text-xs`}>
                        <tr>
                          <th className="px-4 py-3">Run</th>
                          <th className="px-4 py-3">Result</th>
                          <th className="px-4 py-3">Z-Score</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Flags</th>
                          <th className="px-4 py-3">Operator</th>
                          <th className="px-4 py-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${tableRow}`}>
                        {entries.map((entry, index) => (
                          <tr key={entry._id} className={tableRow}>
                            <td className={`px-4 py-3 font-medium ${text}`}>
                              {index + 1}
                            </td>
                            <td className={`px-4 py-3 ${text}`}>
                              {entry.result} {selectedAnalyte.unit}
                            </td>
                            <td className={`px-4 py-3 ${text}`}>
                              {entry.zScore.toFixed(2)}
                            </td>
                            <td className="px-4 py-3">
                              <span className={getStatusBadge(entry.status)}>
                                {entry.status.toUpperCase()}
                              </span>
                            </td>
                            <td className={`px-4 py-3 ${text}`}>
                              {entry.flags.length > 0
                                ? entry.flags.map((f) => f.rule).join(", ")
                                : "-"}
                            </td>
                            <td className={`px-4 py-3 ${text}`}>
                              {entry.operatorId.name}
                            </td>
                            <td className={`px-4 py-3 ${subtext}`}>
                              {new Date(entry.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Add Analyte page */}
            {activePage === "addAnalyte" && (
              <div className={`${card} rounded-xl shadow p-6`}>
                <h3 className={`text-lg font-bold ${text} mb-1`}>
                  Add New Analyte
                </h3>
                <p className={`${subtext} text-sm mb-6`}>
                  Create a new test type with its reference mean and SD
                </p>
                {analyteError && (
                  <p className="bg-red-900 text-red-300 p-3 rounded mb-4 text-sm">
                    {analyteError}
                  </p>
                )}
                {analyteSuccess && (
                  <p className="bg-green-900 text-green-300 p-3 rounded mb-4 text-sm">
                    {analyteSuccess}
                  </p>
                )}
                <form onSubmit={handleAddAnalyte}>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className={`block ${text} font-medium mb-1`}>
                        Analyte Name
                      </label>
                      <input
                        type="text"
                        value={analyteName}
                        onChange={(e) => setAnalyteName(e.target.value)}
                        required
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 ${input}`}
                        placeholder="e.g. Potassium"
                      />
                    </div>
                    <div>
                      <label className={`block ${text} font-medium mb-1`}>
                        Unit
                      </label>
                      <input
                        type="text"
                        value={analyteUnit}
                        onChange={(e) => setAnalyteUnit(e.target.value)}
                        required
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 ${input}`}
                        placeholder="e.g. mmol/L"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className={`block ${text} font-medium mb-1`}>
                      Level
                    </label>
                    <select
                      value={analyteLevel}
                      onChange={(e) => setAnalyteLevel(e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 ${input}`}
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className={`block ${text} font-medium mb-1`}>
                        Mean
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={analyteMean}
                        onChange={(e) => setAnalyteMean(e.target.value)}
                        required
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 ${input}`}
                        placeholder="e.g. 4.5"
                      />
                    </div>
                    <div>
                      <label className={`block ${text} font-medium mb-1`}>
                        Standard Deviation (SD)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={analyteSd}
                        onChange={(e) => setAnalyteSd(e.target.value)}
                        required
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 ${input}`}
                        placeholder="e.g. 0.2"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={analyteLoading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {analyteLoading ? "Adding..." : "Add Analyte"}
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
