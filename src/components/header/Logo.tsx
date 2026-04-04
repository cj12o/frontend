import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
function Logo() {
  return (
    <Link to="/">
      <div className="flex items-center space-x-3">
      <h1 className="text-4xl font-black tracking-tighter text-blue-400 
                    [text-stroke:1px_#000] [-webkit-text-stroke:1px_#000] 
                    drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
        ChatRooms
    </h1>
      </div>
    </Link>
  );
}

export default Logo;
