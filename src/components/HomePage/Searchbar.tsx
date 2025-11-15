import React, { useState, useEffect } from "react";
import { getSuggestion } from "@/backend/suggestion";
import { Search } from "lucide-react";
import Button from "../Button";

const Searchbar = ({ value }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [options, setOptions] = useState<string[][]>([]);
  const [typingTimeout, setTypingTimeout] = useState<any>(null);
  const { queryforDynamicSearch, setQueryforDynamicSearch } = value;

  const get_suggestions = async () => {
    if (!searchQuery.trim()) {
      setOptions([]);
      return;
    }

    try {
      const resp = await getSuggestion(searchQuery);
      const opts: string[][] = resp.map((item: any) => [...item]);
      setOptions(opts);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      get_suggestions();
    }, 500);

    setTypingTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleSuggestionClick = (item: string[]) => {
    setQueryforDynamicSearch({
      need: 1,
      keyword: item[1],
    });
    setSearchQuery(item[0]);
    setOptions([]);
  };

  return (
    <div className="w-full">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search for rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none text-base shadow-sm hover:border-gray-300"
          />
        </div>
        <Button
          value="Search"
          onClick={() => {
            setOptions([]);
            setQueryforDynamicSearch({ need: 3, keyword: searchQuery });
          }}
        />
      </div>

      {options.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto">
          {options.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSuggestionClick(item)}
              className="px-4 py-3 hover:bg-indigo-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
            >
              <div className="font-semibold text-gray-900 mb-1">{item[0]}</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(item[2]).map(([key, value]) => (
                  <span
                    key={key}
                    className="inline-block text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                  >
                    
                    <span className="font-medium">
                      <span className="bg-orange-400 p-1 rounded-full text-white m-1">Matched</span>
                      {key}:
                      </span> {value}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Searchbar;