import React, { useState, useEffect } from "react";
import { getSuggestion } from "@/backend/suggestion";
import { Search, X, Hash, MessageSquare } from "lucide-react";
import Button from "../Button";

const Searchbar = ({ value }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [options, setOptions] = useState<string[][]>([]);
  const [typingTimeout, setTypingTimeout] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { queryforDynamicSearch, setQueryforDynamicSearch } = value;

  const get_suggestions = async () => {
    if (!searchQuery.trim()) {
      setOptions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const resp = await getSuggestion(searchQuery);
      const opts: string[][] = resp.map((item: any) => [...item]);
      setOptions(opts);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
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
    setIsFocused(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setOptions([]);
    setQueryforDynamicSearch({ need: -1, keyword: "" });
  };

  return (
    <div className="w-full">
      <div className="relative flex gap-3">
        <div className="relative flex-1">
          {/* Search Icon */}
          <Search
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors duration-200 ${
              isFocused ? "text-indigo-500" : "text-gray-400"
            }`}
          />

          {/* Input Field */}
          <input
            type="text"
            placeholder="Search for rooms, topics, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className={`w-full pl-12 pr-12 py-3.5 rounded-xl border-2 transition-all duration-200 focus:outline-none text-base shadow-sm bg-white ${
              isFocused
                ? "border-indigo-500 ring-4 ring-indigo-100 shadow-md"
                : "border-gray-200 hover:border-gray-300"
            }`}
          />

          {/* Clear Button */}
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200 group"
            >
              <X className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            </button>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute right-12 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <Button
          value="Search"
          onClick={() => {
            setOptions([]);
            setQueryforDynamicSearch({ need: 3, keyword: searchQuery });
            setIsFocused(false);
          }}
        />
      </div>

      {/* Suggestions Dropdown */}
      {options.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
            <span className="text-sm font-semibold text-gray-700">
              Suggestions ({options.length})
            </span>
          </div>

          {/* Suggestion Items */}
          <div className="divide-y divide-gray-100">
            {options.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSuggestionClick(item)}
                className="px-4 py-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 cursor-pointer transition-all duration-200 group"
              >
                {/* Room Name */}
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                    {item[0]}
                  </span>
                </div>

                {/* Matched Fields */}
                <div className="flex flex-wrap gap-2 ml-6">
                  {Object.entries(item[2]).map(([key, value]) => (
                    <div
                      key={key}
                      className="inline-flex items-center gap-1.5 text-xs bg-white border border-gray-200 text-gray-700 px-2.5 py-1.5 rounded-lg shadow-sm group-hover:border-indigo-200 group-hover:shadow transition-all"
                    >
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-md font-medium text-[10px] shadow-sm">
                        <Hash className="w-2.5 h-2.5" />
                        Match
                      </span>
                      <span className="font-semibold text-gray-800">
                        {key}:
                      </span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results Message */}
      {searchQuery && !isLoading && options.length === 0 && isFocused && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-xl shadow-lg border border-gray-200 p-6 z-50 text-center animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">No suggestions found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try a different search term
          </p>
        </div>
      )}
    </div>
  );
};

export default Searchbar;
