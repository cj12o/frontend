import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getMessageList, sendMessageList } from "@/backend/moderator";

const Moderation_messages = () => {
  type Messages = {
    id: number;
    message: string;
    images_msg: null | File;
    file_msg: null | File;
  };

  const [messages, setMessages] = useState<Messages[]>([]);
  const [id_action_needed, set_id_action_needed] = useState<number[]>([]);
  const [id_no_action_needed, set_id_no_action_needed] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [popUp, setPopUp] = useState(false);
  const authstatus = useSelector((state: any) => state.authStatus);
  const navigate = useNavigate();

  const [showConfirmation, setShowConfirmation] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    getMessageList(Number(id))
      .then((data) => setMessages(() => [...data]))
      .catch((e) => setError(e.message));
  }, [id]);

  const handleInitialSubmit = () => {
    setShowConfirmation(true);
  };

  const confirmSubmitHandler = async () => {
    setShowConfirmation(false);
    try {
      // Calculate unmarked messages
      const allMessageIds = messages.map((msg) => msg.id);
      const markedIds = new Set([...id_action_needed, ...id_no_action_needed]);
      const unmarkedIds = allMessageIds.filter((id) => !markedIds.has(id));

      // Combine existing no_action_needed with unmarked ones (auto-safe)
      const finalNoActionNeeded = [...id_no_action_needed, ...unmarkedIds];

      const resp = await sendMessageList(
        Number(id),
        finalNoActionNeeded,
        id_action_needed
      );
      if (resp == 200) {
        setPopUp(true);
      } else setError("Error in moderating messages");
    } catch (e: any) {
      setError(e.message);
    }
  };

  const unsafeCount = id_action_needed.length;
  const safeCount = id_no_action_needed.length;
  const unmarkedCount = messages.length - unsafeCount - safeCount;

  if (!authstatus) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Moderation Queue</h1>
          <button
            onClick={() => navigate("/moderator")}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Summary Bar */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-gray-700">
              {unmarkedCount}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Unmarked
            </div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg shadow-sm border border-red-200 text-center">
            <div className="text-2xl font-bold text-red-700">{unsafeCount}</div>
            <div className="text-xs text-red-500 uppercase tracking-wide">
              Unsafe
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg shadow-sm border border-green-200 text-center">
            <div className="text-2xl font-bold text-green-700">{safeCount}</div>
            <div className="text-xs text-green-500 uppercase tracking-wide">
              Safe
            </div>
          </div>
        </div>

        {/* Success Popup */}
        {popUp && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center justify-between">
            <span>
              Submitted! Unmarked messages were automatically marked as safe.
            </span>
            <div className="space-x-4">
              <button
                onClick={() => navigate("/moderator")}
                className="font-semibold hover:underline"
              >
                Go Back
              </button>
              <button
                onClick={() => navigate("/")}
                className="font-semibold hover:underline"
              >
                Home
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Confirm Submission
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to submit? Any unmarked messages will
                automatically be marked as{" "}
                <span className="font-semibold text-green-600">Safe</span>.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSubmitHandler}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  Go Ahead
                </button>
              </div>
            </div>
          </div>
        )}

        {error.length > 0 && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {messages &&
            error.length === 0 &&
            messages.map((msg) => {
              const isActionNeeded = id_action_needed.includes(msg.id);
              const isNoActionNeeded = id_no_action_needed.includes(msg.id);

              let cardClass =
                "bg-white border border-gray-200 shadow-sm rounded-lg p-4 transition-all duration-200";
              if (isActionNeeded) {
                cardClass =
                  "bg-red-50 border-red-200 shadow-sm rounded-lg p-4 transition-all duration-200";
              } else if (isNoActionNeeded) {
                cardClass =
                  "bg-green-50 border-green-200 shadow-sm rounded-lg p-4 transition-all duration-200";
              }

              return (
                <div key={msg.id} className={cardClass}>
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex-1">
                      <p className="text-base text-gray-800 leading-snug">
                        {msg.message}
                      </p>
                      {/* Placeholder for images/files if needed in future */}
                      {(msg.images_msg || msg.file_msg) && (
                        <div className="mt-1 text-xs text-gray-500 italic">
                          [Attachment present]
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 min-w-[140px] justify-end">
                      <button
                        className={`px-3 py-1.5 rounded-md font-medium text-xs transition-colors ${
                          isActionNeeded
                            ? "bg-red-600 text-white shadow-sm"
                            : "bg-white border border-red-500 text-red-500 hover:bg-red-50"
                        }`}
                        onClick={() => {
                          set_id_action_needed((prev) =>
                            Array.from(new Set([...prev, msg.id]))
                          );
                          set_id_no_action_needed((prev) =>
                            prev.filter((id) => id !== msg.id)
                          );
                        }}
                      >
                        Unsafe
                      </button>
                      <button
                        className={`px-3 py-1.5 rounded-md font-medium text-xs transition-colors ${
                          isNoActionNeeded
                            ? "bg-green-600 text-white shadow-sm"
                            : "bg-white border border-green-500 text-green-500 hover:bg-green-50"
                        }`}
                        onClick={() => {
                          set_id_no_action_needed((prev) =>
                            Array.from(new Set([...prev, msg.id]))
                          );
                          set_id_action_needed((prev) =>
                            prev.filter((id) => id !== msg.id)
                          );
                        }}
                      >
                        Safe
                      </button>
                      {(isActionNeeded || isNoActionNeeded) && (
                        <button
                          className="px-3 py-1.5 rounded-md font-medium text-xs text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                          onClick={() => {
                            set_id_action_needed((prev) =>
                              prev.filter((id) => id !== msg.id)
                            );
                            set_id_no_action_needed((prev) =>
                              prev.filter((id) => id !== msg.id)
                            );
                          }}
                        >
                          Unmark
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleInitialSubmit}
            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          >
            Submit Moderation
          </button>
        </div>
      </div>
    </div>
  );
};

export default Moderation_messages;
