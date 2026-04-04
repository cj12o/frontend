function Button({ className = "text-white", value = "button", ...props }) {
  return (
    <button
      {...props}
      className={`p-1 bg-indigo-500 shadow-md shadow-gray-800/90 hover:shadow-xs hover:shadow-gray-800/90 transition duration-200  active:bg-blue-900 ${className}`}
    >
      {value}
    </button>
  );
}

export default Button;
