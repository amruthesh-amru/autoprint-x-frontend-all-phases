import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOption } from "@/app/slices/printOptionSlice";

const PrintOptionsForm = () => {
  const totalPages = useSelector((state) => state.pageNumber.value);
  const dispatch = useDispatch();
  const [options, setOptions] = useState({
    fileName: "",
    paperSize: "A4",
    color: "color",
    duplex: false,
    copies: 1,
    orientation: "portrait",
    pageRange: "",
    selectAll: false,
    binding: "none",
    estimatedCost: 0,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOptions((prev) => {
      const newOptions = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // If "selectAll" changes, adjust pageRange accordingly.
      if (name === "selectAll") {
        if (checked) {
          newOptions.pageRange = "";
        }
      } else if (name === "pageRange") {
        // If user types a value into pageRange, ensure selectAll is false.
        newOptions.selectAll = value.trim() === "";
      }

      // Dispatch updated options to Redux store.
      console.log(newOptions);

      dispatch(setOption(newOptions));
      return newOptions;
    });
  };

  const calculateSelectedPages = (range) => {
    if (!range) return 0;
    return range.split(",").reduce((total, part) => {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map(Number);
        return total + (end - start + 1);
      }
      return total + 1;
    }, 0);
  };

  // Compute estimated cost based on options and total pages.
  const computedCost = useMemo(() => {
    const pages = options.selectAll
      ? totalPages
      : calculateSelectedPages(options.pageRange);
    let cost = pages * (options.color === "color" ? 5 : 2) * options.copies;
    if (options.binding !== "none" && options.binding !== "staple")
      cost += 10 * options.copies;
    if (options.duplex) cost = cost / 2;
    return cost;
  }, [
    totalPages,
    options.selectAll,
    options.pageRange,
    options.color,
    options.copies,
    options.duplex,
    options.binding,
  ]);

  // Update the estimatedCost field and dispatch updated options when computedCost changes.
  useEffect(() => {
    if (computedCost !== options.estimatedCost) {
      setOptions((prev) => {
        const newOptions = { ...prev, estimatedCost: computedCost };
        dispatch(setOption(newOptions));
        return newOptions;
      });
    }
  }, [computedCost, options.estimatedCost, dispatch]);

  return (
    <>
      <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
        Print Options
      </h2>
      <div className="p-6 bg-white shadow-xl rounded-lg border border-gray-200 flex w-full items-center justify-evenly gap-10">
        {/* Left Column */}
        <div className="flex flex-col">
          {/* Paper Size */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Paper Size
            </label>
            <select
              name="paperSize"
              value={options.paperSize}
              onChange={handleChange}
              className="w-full border rounded p-2 focus:ring-2 focus:ring-indigo-400"
            >
              <option value="A4">A4</option>
              <option value="A3">A3</option>
            </select>
          </div>
          {/* Orientation */}
          <div>
            <label className="block mt-4 text-gray-700 font-medium">
              Orientation
            </label>
            <select
              name="orientation"
              value={options.orientation}
              onChange={handleChange}
              className="w-full border rounded p-2 focus:ring-2 focus:ring-indigo-400"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
          {/* Color Selection */}
          <div>
            <label className="block mt-4 text-gray-700 font-medium">
              Color
            </label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="color"
                  value="color"
                  checked={options.color === "color"}
                  onChange={handleChange}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>Color</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="color"
                  value="bw"
                  checked={options.color === "bw"}
                  onChange={handleChange}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>Black & White</span>
              </label>
            </div>
          </div>
          {/* Duplex Printing */}
          {totalPages > 1 && (
            <div>
              <label className="block mt-4 text-gray-700 font-medium">
                Duplex (Double-Sided)
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="duplex"
                  checked={options.duplex}
                  onChange={handleChange}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2">Enable</span>
              </div>
            </div>
          )}
        </div>
        {/* Right Column */}
        <div className="flex flex-col justify-start gap-2">
          {/* Page Range / Select All */}
          <div className="flex flex-col gap-1">
            <label className="block text-gray-700 font-medium">
              Page Range
            </label>
            <input
              type="text"
              name="pageRange"
              placeholder="e.g., 1-5,4,8-9"
              value={options.pageRange}
              onChange={handleChange}
              disabled={options.selectAll}
              className="w-full border rounded p-2 focus:ring-2 focus:ring-indigo-400"
            />
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                name="selectAll"
                checked={options.selectAll}
                onChange={handleChange}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2">Select All Pages ({totalPages})</span>
            </div>
          </div>
          {/* Copies */}
          <div>
            <label className="block mt-4 text-gray-700 font-medium">
              Number of Copies
            </label>
            <input
              type="number"
              name="copies"
              min="1"
              value={options.copies}
              onChange={handleChange}
              className="w-full border rounded p-2 focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          {/* Binding Options */}
          <div>
            <label className="block mt-4 text-gray-700 font-medium">
              Binding
            </label>
            <select
              name="binding"
              value={options.binding}
              onChange={handleChange}
              className="w-full border rounded p-2 focus:ring-2 focus:ring-indigo-400"
            >
              <option value="none">None</option>
              <option value="staple">Staple</option>
              <option value="spiral">Spiral</option>
              <option value="clip">Clip</option>
            </select>
          </div>
        </div>
      </div>
      <div className="mt-4 text-gray-700 font-medium flex justify-between">
        <span>Estimated Cost:</span>
        <span className="text-indigo-600 font-bold">
          ₹{options.estimatedCost}
        </span>
      </div>
    </>
  );
};

export default PrintOptionsForm;
