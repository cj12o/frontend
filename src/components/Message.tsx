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
  X,
  CornerDownRight,
  MoreHorizontal,
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

const PollComp = React.memo(({ id }: { id: number }) => {
  return <PollComponents id={id} />;
});

function Message() {
  type Comment = {
    id: number;
    author: string;
    message: string;
    images_msg: string;
    file_msg: string;
    upvotes: number;
    downvotes: number;
    children: Comment[];
    hasPoll: boolean;
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
    [expandedComments]
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
          },
        ]);
      }
    } else if (lastJsonMessage.task == "deleteMessage") {
      setComments((prev) =>
        prev.filter((comment) => comment.id !== lastJsonMessage.message_id)
      );
    } else if (
      lastJsonMessage.task == "editMessage" ||
      lastJsonMessage.task == "moddedMessage"
    ) {
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === lastJsonMessage.message_id
            ? { ...comment, message: lastJsonMessage.message }
            : comment
        )
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
                !(v.message_id === messageId && v.vote_type === voteTypeNum)
            )
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
        },
      ]);
    }
  }, [lastJsonMessage]);

  const updateVotes = (
    comments: Comment[],
    message_id: number,
    status: string,
    vote_type: string
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
            vote_type
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
    const resp = await deleteMsg(room_id, comment_id);
    // if(resp){
    //     setComments((prev) => prev.filter((comment) => comment.id !== comment_id))
    // }
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
          "ExpandedContext must be used within a Message component"
        );
      }
      const { getExpanded, toggleExpand } = context;

      const [inputComment, setInputComment] = useState("");
      const [inputBoxNeeded, setInputBoxNeeded] = useState(false);

      const expanded = getExpanded(comment.id);
      const isUpvoted = votes.find(
        (v) => v.message_id == comment.id && v.vote_type == 1
      );
      const isDownvoted = votes.find(
        (v) => v.message_id == comment.id && v.vote_type == -1
      );

      return (
        <>
          {comment.hasPoll ? (
            <div className="mt-4">
              <PollComp id={Number(comment.id)} />
            </div>
          ) : (
            <div className="group bg-white rounded-2xl mb-2 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
              <div className="flex items-start p-3 gap-3">
                {/* Votes section */}
                <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl p-1 min-w-[40px]">
                  <button
                    onClick={() => {
                      isUpvoted
                        ? handleVote(comment.id, "upvote", "subtractVote")
                        : handleVote(comment.id, "upvote", "addVote");
                    }}
                    className={`p-1 rounded-lg transition-all duration-200 ${
                      isUpvoted
                        ? "text-orange-500 bg-orange-50"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <ChevronUp className="w-4 h-4" strokeWidth={2.5} />
                  </button>

                  <span
                    className={`text-xs font-bold ${
                      isUpvoted
                        ? "text-orange-500"
                        : isDownvoted
                        ? "text-indigo-500"
                        : "text-gray-600"
                    }`}
                  >
                    {comment.upvotes - comment.downvotes}
                  </span>

                  <button
                    onClick={() => {
                      isDownvoted
                        ? handleVote(comment.id, "downvote", "subtractVote")
                        : handleVote(comment.id, "downvote", "addVote");
                    }}
                    className={`p-1 rounded-lg transition-all duration-200 ${
                      isDownvoted
                        ? "text-indigo-500 bg-indigo-50"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>

                {/* Comment content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <Link
                      to={`/profile/${comment.author}`}
                      className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors flex items-center gap-2"
                    >
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-[10px] text-indigo-600">
                        {comment.author.charAt(0).toUpperCase()}
                      </div>
                      {comment.author}
                    </Link>

                    {/* Actions Menu */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {comment.author === localStorage.getItem("name") && (
                        <button
                          onClick={() => deleteMessage(Number(id), comment.id)}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="text-gray-700 leading-relaxed break-words space-y-2 text-sm">
                    <p>{comment.message}</p>

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
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors border border-gray-200"
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
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => setInputBoxNeeded((prev) => !prev)}
                      className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md transition-all duration-200 ${
                        inputBoxNeeded
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      }`}
                    >
                      {inputBoxNeeded ? (
                        <X className="w-3 h-3" />
                      ) : (
                        <MessageCircle className="w-3 h-3" />
                      )}
                      {inputBoxNeeded ? "Cancel" : "Reply"}
                    </button>

                    {comment.children.length > 0 && (
                      <button
                        onClick={() => toggleExpand(comment.id)}
                        className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-indigo-600 transition-colors px-2 py-1 rounded-md hover:bg-indigo-50"
                      >
                        {expanded ? (
                          <>
                            <ChevronUp className="w-3 h-3" />
                            Hide Replies
                          </>
                        ) : (
                          <>
                            <CornerDownRight className="w-3 h-3" />
                            {comment.children.length} Replies
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {inputBoxNeeded && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleForm(comment.id, inputComment);
                        setInputComment("");
                        setInputBoxNeeded(false);
                      }}
                      className="mt-3 flex gap-2 animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                        value={inputComment}
                        onChange={(e) => setInputComment(e.target.value)}
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 font-medium text-xs shadow-sm hover:shadow-indigo-500/30 active:scale-95"
                      >
                        Send
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {expanded && comment.children.length > 0 && (
                <div className="bg-gray-50/50 border-t border-gray-100 p-3 pl-6 space-y-2">
                  {comment.children.map((rep) => (
                    <RenderComment comment={rep} margin={margin} key={rep.id} />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      );
    }
  );

  return (
    <div className="flex flex-col h-screen bg-transparent">
      <div className="flex-1 overflow-y-auto p-4 pb-24 custom-scrollbar">
        <ExpandedContext.Provider value={{ getExpanded, toggleExpand }}>
          <div className="max-w-4xl mx-auto space-y-3">
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
