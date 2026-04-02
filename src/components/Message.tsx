import React, {
  useEffect,
  useState,
  useCallback,
  createContext,
  useContext,
} from "react";
import {
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Trash2,
  Pencil,
  X,
  CornerDownRight,
  Send
} from "lucide-react";
import { useParams } from "react-router-dom";
import { deleteMsg, getMsg } from "@/backend/message";
import { WebSocketContext } from "../pages/WebSocketProvider";
import { getVotes } from "@/backend/votes";
import { Link } from "react-router-dom";
import PollComponents from "./Poll";

const ExpandedContext = createContext<{
  getExpanded: (id: number) => boolean;
  toggleExpand: (id: number) => void;
} | null>(null);

const PollComp = React.memo(
  ({ id, room_id }: { id: number; room_id: number }) => {
    return <PollComponents id={id} room_id={room_id} />;
  },
);

function Message() {
  type Comment = {
    id: number;
    author: string;
    profile_pic?: string;
    message: string;
    images_msg: string;
    file_msg: string;
    upvotes: number;
    downvotes: number;
    children: Comment[];
    hasPoll: boolean;
    is_unsafe: boolean;
  };
  type Vote = {
    message_id: number;
    vote_type: number;
  };
  const [comments, setComments] = useState<Comment[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [expandedComments, setExpandedComments] = useState<
    Record<number, boolean>
  >({});

  const { sendMessage, lastJsonMessage } = useContext(WebSocketContext);

  const { id } = useParams();

  const getMessageData = async (id: number) => {
    try {
      const resp = await getMsg(Number(id));
      if (resp) setComments(resp?.messages || []);
    } catch (e) {
      console.error(e);
    }
  };
  const getVotesData = async (id: number) => {
    try {
      const resp = await getVotes(Number(id));
      if (resp) setVotes(resp || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    try {
      getMessageData(Number(id));
      getVotesData(Number(id));
    } catch (e) {
      console.error(e);
    }
  }, [id]);

  const getExpanded = useCallback(
    (commentId: number) => expandedComments[commentId] ?? false,
    [expandedComments],
  );
  const toggleExpand = useCallback((commentId: number) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !(prev[commentId] ?? false),
    }));
  }, []);

  useEffect(() => {
    if (!lastJsonMessage) return;
    console.log(`Agent task:${lastJsonMessage.task}`);
    if (
      lastJsonMessage.task === "chat" ||
      (lastJsonMessage.task === "AgentActivity" &&
        lastJsonMessage.tool_called === "threadGenerator")
    ) {
      if (lastJsonMessage.parent) {
        console.log("added to exisiting comment");
        setComments((prev) => addReply(prev));
      } else {
        setComments((prev) => [
          ...prev,
          {
            id: lastJsonMessage.message_id,
            author: lastJsonMessage.username,
            message: lastJsonMessage.message,
            images_msg: lastJsonMessage.image_url,
            file_msg: lastJsonMessage.file_url,
            children: [],
            upvotes: 0,
            downvotes: 0,
            hasPoll: false,
            is_unsafe: false,
          },
        ]);
      }
    } else if (lastJsonMessage.task == "deleteMessage") {
      setComments((prev) =>
        prev.filter((comment) => comment.id !== lastJsonMessage.message_id),
      );
    } else if (
      lastJsonMessage.task == "editMessage" ||
      lastJsonMessage.task == "moddedMessage"
    ) {
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === lastJsonMessage.message_id
            ? { ...comment, message: lastJsonMessage.message }
            : comment,
        ),
      );
    } else if (
      lastJsonMessage?.task === "vote" &&
      lastJsonMessage.operation_done == true
    ) {
      const voteType = lastJsonMessage.vote_type;
      const status = lastJsonMessage.status;
      const messageId = lastJsonMessage.message_id;
      const voteAuthor = lastJsonMessage.vote_author;
      const userName = localStorage.getItem("name") || "";

      setComments((prev) => updateVotes(prev, messageId, status, voteType));

      if (voteAuthor === userName) {
        const voteTypeNum = voteType === "upvote" ? 1 : -1;
        if (status === "addVote") {
          setVotes((prev) => [
            ...prev,
            { message_id: messageId, vote_type: voteTypeNum },
          ]);
        } else {
          setVotes((prev) =>
            prev.filter(
              (v) =>
                !(v.message_id === messageId && v.vote_type === voteTypeNum),
            ),
          );
        }
      }
    } else if (
      lastJsonMessage.task === "AgentActivity" &&
      lastJsonMessage.tool_called === "pollGenerator"
    ) {
      console.log("Poll received from AgentActivity");

      // You could either create a new comment for the poll...
      setComments((prev) => [
        ...prev,
        {
          id: lastJsonMessage.message_id,
          author: lastJsonMessage.username,
          message: lastJsonMessage.question, // show question as the text"
          images_msg: "",
          file_msg: "",
          children: [],
          upvotes: 0,
          downvotes: 0,
          hasPoll: true,
          is_unsafe: false,
        },
      ]);
    }
  }, [lastJsonMessage]);

  const updateVotes = (
    comments: Comment[],
    message_id: number,
    status: string,
    vote_type: string,
  ): Comment[] => {
    return comments.map((comment) => {
      if (comment.id === message_id && vote_type === "upvote") {
        console.log(`Status:${status}`);
        if (status === "addVote")
          return { ...comment, upvotes: comment.upvotes + 1 };
        else return { ...comment, upvotes: comment.upvotes - 1 };
      } else if (comment.id == message_id && vote_type === "downvote") {
        console.log(`Status:${status}`);
        if (status === "addVote")
          return { ...comment, downvotes: comment.downvotes + 1 };
        else return { ...comment, downvotes: comment.downvotes - 1 };
      }
      if (comment.children.length > 0) {
        return {
          ...comment,
          children: updateVotes(
            comment.children,
            message_id,
            status,
            vote_type,
          ),
        };
      } else return comment;
    });
  };
  const handleForm = (comment_id: number, inputComment: string) => {
    console.log("Handle Form called");
    const newReply = {
      message: inputComment,
      parent: comment_id,
    };

    const rep: string = JSON.stringify(newReply);
    sendMessage(rep);
  };
  const deleteMessage = async (room_id: number, comment_id: number) => {
    await deleteMsg(room_id, comment_id);
  };

  const handleVote = (comment_id: number, type: string, status: string) => {
    const resp = {
      task: "vote",
      status: status,
      vote_type: type,
      message_id: comment_id,
      vote_author: localStorage.getItem("name") || "",
    };
    const send_resp = JSON.stringify(resp);
    sendMessage(send_resp);
  };
  const addReply = (comments: Comment[]): Comment[] => {
    return comments.map((comment) => {
      if (comment.id == lastJsonMessage?.parent) {
        console.log(`lastJson:${lastJsonMessage}`);
        return {
          ...comment,
          children: [
            ...comment.children,
            {
              id: lastJsonMessage?.message_id,
              author: lastJsonMessage?.username,
              message: lastJsonMessage?.message,
              images_msg: "",
              file_msg: "",
              children: [],
              upvotes: 0,
              downvotes: 0,
              hasPoll: false,
              is_unsafe: false,
            },
          ],
        };
      } else if (comment.children.length > 0) {
        return { ...comment, children: addReply(comment.children) };
      } else return comment;
    });
  };

  const RenderComment = React.memo(
    ({ comment, margin }: { comment: Comment; margin: number }) => {
      const context = useContext(ExpandedContext);
      if (!context) {
        throw new Error(
          "ExpandedContext must be used within a Message component",
        );
      }
      const { getExpanded, toggleExpand } = context;

      const [inputComment, setInputComment] = useState("");
      const [inputBoxNeeded, setInputBoxNeeded] = useState(false);

      const expanded = getExpanded(comment.id);
      const isUpvoted = votes.find(
        (v) => v.message_id == comment.id && v.vote_type == 1,
      );
      const isDownvoted = votes.find(
        (v) => v.message_id == comment.id && v.vote_type == -1,
      );
      const currentUser = localStorage.getItem("name") || "";
      const isOwnMessage = comment.author === currentUser;

      return (
        <div className={`flex flex-col group w-fit ${isOwnMessage ? "ml-auto" : ""}`}>
          <div>
          {comment.hasPoll ? (
            <div className="mt-4">
              <PollComp id={Number(comment.id)} room_id={Number(id)} />
            </div>
          ) : (
            <div className={`group backdrop-blur-sm rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden ${
              isOwnMessage
                ? "bg-gradient-to-br from-blue-50/90 to-indigo-50/80 border-blue-200/60 hover:shadow-blue-200/40"
                : "bg-white/95 border-blue-100/60 hover:shadow-blue-100/40"
            }`}>
              <div className="flex items-start p-1 gap-2.5 bg-amber-100">
                {/* Votes section */}
                <div className="flex items-center gap-1 bg-gradient-to-b from-blue-50/80 to-indigo-50/60 rounded-xl p-1.5 min-w-[44px] border border-blue-100/40">
                  <div className="flex">
                    <div className="flex items-center">
                      <button
                        onClick={() => {
                          isUpvoted
                            ? handleVote(comment.id, "upvote", "subtractVote")
                            : handleVote(comment.id, "upvote", "addVote");
                        }}
                        className={`p-0.5 rounded-md transition-all duration-200 ${
                          isUpvoted
                            ? "text-orange-500 bg-orange-100/80 shadow-sm shadow-orange-200/50"
                            : "text-gray-400 hover:text-blue-600 hover:bg-blue-100/60"
                        }`}
                      >
                    <ChevronUp className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </button>
                    <span
                        className={`text-[10px] font-bold min-w-[12px] text-center ${
                          isUpvoted
                            ? "text-orange-500"
                            : "text-gray-500"
                        }`}
                      >
                        {comment.upvotes}
                      </span>
                  </div>
                  <div className="flex items-center">
                    <button
                    onClick={() => {
                      isDownvoted
                        ? handleVote(comment.id, "downvote", "subtractVote")
                        : handleVote(comment.id, "downvote", "addVote");
                    }}
                    className={`p-0.5 rounded-md transition-all duration-200 ${
                      isDownvoted
                        ? "text-indigo-500 bg-indigo-100/80 shadow-sm shadow-indigo-200/50"
                        : "text-gray-400 hover:text-blue-600 hover:bg-blue-100/60"
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </button>
                    <span
                        className={`text-[10px] font-bold min-w-[12px] text-center ${
                          isDownvoted
                            ? "text-indigo-500"
                            : "text-gray-500"
                        }`}
                      >
                        {comment.downvotes}
                      </span>
                  </div>
                  </div>
                </div>

                {/* Comment content */}
                <div className="flex-1 min-w-0">
                  <div className="mr-1 break-words">
                    <Link
                      to={`/profile/${comment.author}`}
                      className="text-xs font-bold text-blue-700 hover:text-indigo-600 transition-colors inline-flex items-center gap-1.5 align-middle mr-2"
                    >
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-200 to-indigo-300 flex items-center justify-center text-[10px] text-white font-bold overflow-hidden shrink-0 shadow-sm shadow-blue-200/50 ring-1 ring-blue-200/50">
                        {comment.profile_pic ? (
                          <img
                            src={comment.profile_pic}
                            alt={comment.author}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                parent.innerHTML = `<span class="text-[10px] text-white font-bold">${comment.author
                                  .charAt(0)
                                  .toUpperCase()}</span>`;
                              }
                            }}
                          />
                        ) : (
                          comment.author.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="leading-snug">
                        {comment.author}
                      </span>
                    </Link>
                    <span className="text-sm text-gray-700">
                      {comment.message}
                    </span>
                  </div>

                  <div className="text-black leading-snug break-words space-y-1 text-xs">
                    

                    {/* If there's an image */}
                    {comment.images_msg && (
                      <div className="relative group/image inline-block">
                        <img
                          src={comment.images_msg}
                          alt="attachment"
                          className="rounded-xl border border-gray-200 max-w-xs mt-2 shadow-sm transition-transform duration-200 hover:scale-[1.01]"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                      </div>
                    )}

                    {/* If there's a file */}
                    {comment.file_msg && (
                      <div className="mt-2">
                        <a
                          href={comment.file_msg}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50/60 text-blue-600 rounded-xl hover:bg-blue-100/60 transition-colors border border-blue-200/50 shadow-sm hover:shadow-md"
                        >
                          <span className="text-base">📎</span>
                          <span className="font-medium text-xs">
                            Download Attachment
                          </span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center gap-2 mt-1">
                    

                    {comment.children.length > 0 && (
                      <button
                        onClick={() => toggleExpand(comment.id)}
                        className="flex items-center gap-0.5 text-[11px] font-medium text-blue-500 hover:text-indigo-700 transition-all px-2 py-1 rounded-lg hover:bg-blue-50 shadow-sm"
                      >
                        {expanded ? (
                          <>
                            <ChevronUp className="w-2.5 h-2.5" />
                            Hide
                          </>
                        ) : (
                          <>
                            <CornerDownRight className="w-2.5 h-2.5" />
                            {comment.children.length}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {expanded && comment.children.length > 0 && (
                <div className="bg-gradient-to-b from-blue-50/40 to-indigo-50/30 border-t border-blue-100/30 p-3 pl-5 space-y-3">
                  {comment.children.map((rep) => (
                    <RenderComment comment={rep} margin={margin} key={rep.id} />
                  ))}
                </div>
              )}
            </div>
          )}
          </div>

          <div className="w-full flex gap-1.5 h-1 overflow-visible justify-end items-center z-10 pr-2">
              <div className="flex-1">
                {inputBoxNeeded && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleForm(comment.id, inputComment);
                        setInputComment("");
                        setInputBoxNeeded(false);
                      }}
                      className="mt-2 flex gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        className="flex-1 px-3 py-2 bg-blue-50/50 border border-blue-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 transition-all text-xs placeholder-gray-400"
                        value={inputComment}
                        onChange={(e) => setInputComment(e.target.value)}
                        autoFocus
                      />
                      <button type="submit" className="p-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl shadow-md shadow-blue-300/40 hover:shadow-lg hover:shadow-blue-400/40 active:scale-95 transition-all duration-200">
                        <Send size={14} />
                      </button>
                    </form>
                  )}
              </div>
              <button
                onClick={() => deleteMessage(Number(id), comment.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 bg-white/90 hover:bg-red-50 rounded-lg shadow-sm shadow-red-100/30 hover:shadow-md hover:shadow-red-200/40 transition-all duration-200 active:scale-95 border border-gray-100 hover:border-red-200"
                title="Delete message"
              >
                <Trash2 size={14} />
              </button>
              <button
                className="p-1.5 text-gray-400 hover:text-blue-600 bg-white/90 hover:bg-blue-50 rounded-lg shadow-sm shadow-blue-100/30 hover:shadow-md hover:shadow-blue-200/40 transition-all duration-200 active:scale-95 border border-gray-100 hover:border-blue-200"
                title="Edit message"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => setInputBoxNeeded((prev) => !prev)}
                className={`p-1.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 border ${
                  inputBoxNeeded
                    ? "bg-indigo-100 text-indigo-700 shadow-indigo-200/50 border-indigo-200"
                    : "text-gray-400 bg-white/90 hover:bg-indigo-50 hover:text-indigo-600 shadow-indigo-100/30 hover:shadow-indigo-200/40 border-gray-100 hover:border-indigo-200"
                }`}
                title="Reply"
              >
                {inputBoxNeeded ? (
                  <X size={14} />
                ) : (
                  <MessageCircle size={14} />
                )}
              </button>
          </div>
        </div>
      );
    },
  );

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="flex-1 overflow-y-auto p-6 pb-4 custom-scrollbar">
        <ExpandedContext.Provider value={{ getExpanded, toggleExpand }}>
          <div className="max-w-4xl mx-auto space-y-3.5">
            {comments.map((c) => (
              <RenderComment comment={c} margin={1} key={c.id} />
            ))}
          </div>
        </ExpandedContext.Provider>
      </div>
    </div>
  );
}

export default Message;
