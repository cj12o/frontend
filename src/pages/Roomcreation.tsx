import { useState } from "react";
import Search from "@/components/Search";
import type { Moderator } from "@/types/moderator";
import { createRoom } from "@/backend/room";
import { Save, RotateCcw, Lock, Globe, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AlertDestructive from "@/components/ErrorAlert";

const RoomCreation = () => {
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tag, setTag] = useState("");
  const [topic, setTopic] = useState("");
  const [privateStatus, setPrivateStatus] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [moderator, setModerator] = useState<Moderator[]>([]);
  const [ModerationType, setModerationType] = useState(0);

  const validate = (): string | null => {
    if (!roomName.trim()) return "Room name is required";
    if (roomName.trim().length < 3) return "Room name must be at least 3 characters";
    if (!topic.trim()) return "Topic is required";
    if ((ModerationType === 0 || ModerationType === -1) && moderator.length === 0)
      return "Please add at least one moderator for this moderation type";
    return null;
  };

  const submitHandler = async () => {
    setError("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const mod_id: number[] = [];
    moderator.map((mod) => {
      mod_id.push(mod.id);
    });

    let val_for_mod = mod_id;
    if (ModerationType == -1) {
      val_for_mod.splice(0, 0, -1);
    } else if (ModerationType == -2) {
      val_for_mod = [-2];
    }
    const resp = await createRoom(
      roomName,
      roomDescription,
      topic,
      privateStatus,
      tags,
      val_for_mod,
    );

    if (resp === 200 || resp === 201) {
      setLoading(false);
      alert("Room created successfully");
      setRoomName("");
      setTags([]);
      setTopic("");
      setRoomDescription("");
      setModerator([]);
      setPrivateStatus(false);
      setModerationType(0);
    } else {
      setLoading(false);
      setError("Room creation failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 antialiased [background:radial-gradient(125%_100%_at_50%_0%,#FFF_6%,#E0F0FF_30%,#E7EFFD_70%,#FFF_400%)]">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 border-3 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-base text-gray-600 font-medium">
              Creating your room...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="w-full max-w-2xl mb-3 animate-[slideDown_0.3s_ease-out]">
          <AlertDestructive title="Error" desc={error} />
        </div>
      )}

      <Card className="w-full max-w-2xl opacity-90 shadow-gradient from-black to-gray-900 shadow-xl animate-[fadeInUp_0.4s_ease-out] [animation-fill-mode:backwards]">
        <CardHeader>
          <CardTitle className="text-3xl">Create Room</CardTitle>
          <CardDescription className="text-base">Create a new community space</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-6">
            {/* Room Name */}
            <div className="grid gap-2">
              <Label htmlFor="roomName" className="text-base">Room Name</Label>
              <Input
                id="roomName"
                type="text"
                placeholder="Enter room name"
                className="h-11 text-base transition-shadow duration-200 focus:shadow-md"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>

            {/* Topic */}
            <div className="grid gap-2">
              <Label htmlFor="topic" className="text-base">Topic</Label>
              <Input
                id="topic"
                type="text"
                placeholder="Topic"
                className="h-11 text-base transition-shadow duration-200 focus:shadow-md"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-base">Description</Label>
              <textarea
                id="description"
                placeholder="Room description"
                className="border border-input bg-background px-3 py-2.5 w-full rounded-md text-base shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-28 resize-none transition-shadow duration-200 focus:shadow-md"
                value={roomDescription}
                onChange={(e) => setRoomDescription(e.target.value)}
              />
            </div>

            {/* Moderation Type */}
            <div className="grid gap-2">
              <Label className="text-base">Moderation Type</Label>
              <div className="flex p-1 bg-muted/50 border border-input rounded-md gap-1">
                {[
                  { label: "Manual", value: 0 },
                  { label: "Semi-Auto", value: -1 },
                  { label: "Auto", value: -2 },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setModerationType(type.value)}
                    className={`flex-1 py-2.5 rounded-sm text-base font-medium transition-all duration-200 cursor-pointer ${
                      ModerationType === type.value
                        ? "bg-background text-foreground shadow-sm border border-input scale-[1.02]"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {ModerationType === -2
                  ? "ML model detects and removes violating messages automatically."
                  : ModerationType === -1
                    ? "ML model flags violating messages for human verification."
                    : "All moderation is done manually by human moderators."}
              </p>
            </div>

            {/* Private Toggle */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-md border border-input transition-colors duration-200 hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="transition-transform duration-200">
                  {privateStatus ? (
                    <Lock className="w-5 h-5 text-foreground animate-[fadeIn_0.2s_ease-out]" />
                  ) : (
                    <Globe className="w-5 h-5 text-muted-foreground animate-[fadeIn_0.2s_ease-out]" />
                  )}
                </div>
                <div>
                  <Label className="block text-base">
                    {privateStatus ? "Private Room" : "Public Room"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {privateStatus
                      ? "Only invited members can join"
                      : "Anyone can discover and join"}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={privateStatus}
                  onChange={() => setPrivateStatus((prev) => !prev)}
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-200 peer-checked:bg-gray-800 transition-colors duration-200"></div>
              </label>
            </div>

            {/* Tags */}
            <div className="grid gap-2">
              <Label className="flex items-center gap-1.5 text-base">
                <Tag className="w-4 h-4" />
                Tags
              </Label>
              <Input
                type="text"
                placeholder="Press Enter to add tags"
                className="h-11 text-base transition-shadow duration-200 focus:shadow-md"
                value={tag}
                onKeyDown={(e) => {
                  if (e.code === "Enter") {
                    e.preventDefault();
                    if (tag !== "") {
                      if (tags.includes(tag)) {
                        setError("Tag already exists");
                        return;
                      }
                      setTags((prev) => [...prev, tag]);
                    }
                    setTag("");
                  }
                }}
                onChange={(e) => setTag(e.target.value)}
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {tags.map((t, i) => (
                    <span
                      key={i}
                      className="group inline-flex items-center gap-1.5 bg-muted text-foreground rounded-md px-3 py-1.5 text-sm font-medium border border-input animate-[scaleIn_0.2s_ease-out] transition-all duration-150 hover:shadow-sm"
                    >
                      {t}
                      <button
                        onClick={() =>
                          setTags((prev) => prev.filter((ele) => ele !== t))
                        }
                        className="opacity-50 hover:opacity-100 transition-all duration-150 hover:scale-110 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Moderator Search */}
            {(ModerationType === 0 || ModerationType === -1) && (
              <div className="grid gap-2 animate-[fadeIn_0.3s_ease-out]">
                <Label className="text-base">Moderators</Label>
                <Search
                  value={{
                    setModerator: setModerator,
                    moderator: moderator,
                    flag: 0,
                    room_id: 0,
                  }}
                />
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex gap-3">
          <Button
            className="flex-1 h-11 text-base transition-all duration-200 hover:shadow-md active:scale-[0.98]"
            onClick={submitHandler}
          >
            <Save className="w-4.5 h-4.5 mr-2" />
            Create Room
          </Button>
          <Button
            variant="outline"
            className="h-11 text-base transition-all duration-200 hover:shadow-sm active:scale-[0.98]"
            onClick={() => {
              setRoomName("");
              setTags([]);
              setTopic("");
              setRoomDescription("");
              setModerator([]);
              setPrivateStatus(false);
              setModerationType(0);
              setError("");
            }}
          >
            <RotateCcw className="w-4.5 h-4.5 mr-2" />
            Clear
          </Button>
        </CardFooter>
      </Card>

      {/* Keyframe definitions */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default RoomCreation;
