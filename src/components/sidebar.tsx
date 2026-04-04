import { getTopics as getTopicsBackend } from "@/backend/topic";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter
} from "@/components/ui/sidebar";
import { useTopicContext } from "@/context/topics_context";
import { useEffect } from "react";
import { House, Plus, Hash } from "lucide-react";
import { roomlist } from "@/backend/room_list";
import { useRoomContext } from "@/context/room_context";
import { useErrorContext } from "@/context/error_context";
import SidebarfooterComp from "./sidebarfooter";
export function AppSidebar() {
  const { topics, setTopics, selectedTopic, setSelectedTopic } =
    useTopicContext();
  const { setRooms } = useRoomContext();
  const { setError } = useErrorContext();

  const get_topics = async () => {
    try {
      const resp = await getTopicsBackend();
      if (resp && Array.isArray(resp)) {
        setTopics(resp);
      } else {
        setTopics([]);
      }
    } catch (e: any) {
      console.error("Error fetching topics:", e);
      setTopics([]);
    }
  };

  const gettopicWiseRoom = async (topic: string) => {
    //for parent topic
    try {
      const resp = await roomlist(2, topic);
      if (resp && resp.results) {
        setRooms(resp.results);
        setSelectedTopic(topic);
      } else {
        setRooms([]);
        setError(`No rooms found for topic: ${topic}`);
      }
    } catch (e: any) {
      console.error("Error fetching topic rooms:", e);
      setError(e.message || `Failed to load rooms for topic: ${topic}`);
      setRooms([]);
    }
  };

  useEffect(() => {
    get_topics();
  }, []);

  return (
    <Sidebar collapsible="icon" className="sticky overflow-visible border-r">
      {/* Trigger button - half on sidebar, half floating out */}
      <div className="absolute right-0 translate-x-1/2 top-5 z-50">
        <SidebarTrigger />
      </div>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Home">
                <a href="/">
                  <House className="size-4" />
                  <span>Home</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Create Room">
                <a href="/createRoom">
                  <Plus className="size-4" />
                  <span>Create Room</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Topics List */}
        <SidebarGroup >
          <SidebarGroupLabel className="font-bold text-2xl underline">Topics</SidebarGroupLabel>
          <SidebarGroupContent className="pt-3">
            <SidebarMenu className="gap-2">

              <div className="flex justify-between  items-center w-full  hover:shadow-b-lg">
                <div className="flex items-center justify-center ">
                  <Hash className="size-4  rounded-full bg-amber-200 m-2" />
                  <span
                    className={
                      selectedTopic === "all"
                        ? " pr-1 right-0"
                        : "pr-1"
                    }
                  >
                    {"All Topics"}
                  </span>
                </div>

                <span className="p-1 rounded-full shadow-2xl text-md">
                  {topics.length}
                </span>
              </div>

              {topics.map((topic) => (
                <SidebarMenuItem key={topic.id} 
                onClick={() => {
                            setSelectedTopic(topic.topic);
                            gettopicWiseRoom(topic.topic);
                          }}
                className={selectedTopic===topic.topic?"border-2  border-gray-800 gap-2 ":"border border-b-1 hover:border-2  border-b-gray-800 gap-2 border-t-white border-r-gray-200"}>
                  <SidebarMenuButton tooltip={topic.topic} className="hover:cursor-pointer hover:shadow-black hover:shadow-b-lg">
                    <div className="flex justify-between  items-center w-full  hover:shadow-b-lg">
                      <div className="flex items-center justify-center ">
                        <Hash className="size-4  rounded-full bg-amber-200 m-2" />
                        <span
                          className={
                            selectedTopic === topic.topic
                              ? " pr-1 right-0"
                              : "pr-1"
                          }
                        >
                          {topic.topic}
                        </span>
                      </div>

                      <span className="p-1 rounded-full shadow-2xl text-md">
                        {topic.relatedRooms}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarfooterComp />
      </SidebarFooter>
    </Sidebar>
  );
}
