import React, { useState } from "react";
import { useWidgetStore, type Page } from "../store/widgetStore";
import type { WidgetType } from "../components/widgets/widgetConfig";

export const CustomPage: React.FC = () => {
  const {
    widgets,
    toggleWidgetVisibility,
    moveWidgetToPage,
    renamePage,
    addPage,
    deletePage,
  } = useWidgetStore();

  // For renaming pages
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [renameValue, setRenameValue] = useState("");

  // For adding new pages
  const [newPageName, setNewPageName] = useState("");

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    widgetType: WidgetType,
    fromPage: Page
  ) => {
    e.dataTransfer.setData("widgetType", widgetType);
    e.dataTransfer.setData("fromPage", fromPage);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, toPage: Page) => {
    const widgetType = e.dataTransfer.getData("widgetType") as WidgetType;
    const fromPage = e.dataTransfer.getData("fromPage") as Page;

    if (fromPage !== toPage) {
      moveWidgetToPage(fromPage, toPage, widgetType);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Needed to allow drop
  };

  const startRename = (page: Page) => {
    setEditingPage(page);
    setRenameValue(widgets[page].name);
  };

  const submitRename = () => {
    if (
      editingPage &&
      renameValue.trim() !== "" &&
      renameValue.trim() !== widgets[editingPage].name
    ) {
      renamePage(editingPage, renameValue.trim() as Page);
    }
    setEditingPage(null);
    setRenameValue("");
  };
  

  const cancelRename = () => {
    setEditingPage(null);
    setRenameValue("");
  };

  const handleAddPage = () => {
    const trimmed = newPageName.trim();
    if (trimmed && !widgets[trimmed as Page]) {
      addPage(trimmed as Page);
      setNewPageName("");
    }
  };

  const handleDeletePage = (page: Page) => {
    if (window.confirm(`Are you sure you want to delete page "${page}"? This action cannot be undone.`)) {
      deletePage(page);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Customize Widgets by Page</h1>

      {(Object.keys(widgets) as Page[]).map((page) => (
        <section
          key={page}
          className="mb-10 border rounded p-5 shadow-sm bg-white"
          onDrop={(e) => handleDrop(e, page)}
          onDragOver={handleDragOver}
        >
          <div className="flex items-center mb-4">
            {editingPage === page ? (
              <>
                <input
                  className="border p-1 rounded mr-2"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitRename();
                    else if (e.key === "Escape") cancelRename();
                  }}
                />
                <button
                  onClick={submitRename}
                  className="px-3 py-1 bg-green-600 rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={cancelRename}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold capitalize flex-grow">
                    {widgets[page].name}
                </h2>
                <button
                  onClick={() => startRename(page)}
                  className="px-2 py-1 bg-blue-600 rounded"
                  title="Rename Page"
                >
                  ✏️
                </button>
                <button
                    onClick={() => handleDeletePage(page)}
                    className="px-3 py-1 mx-3 bg-red-600 text-white rounded flex items-center justify-center"
                    aria-label={`Delete ${page}`}
                >
                    🗑️
                </button>
              </>
            )}
          </div>

          {widgets[page].widgets.length === 0 ? (
            <p className="text-gray-600 italic">
              No widgets yet. Drag from another page.
            </p>
          ) : (
            <div className="space-y-3">
              {widgets[page].widgets.map(({ type, visible }) => (
                <div
                  key={type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, type, page)}
                  className="border p-3 rounded bg-gray-50 flex justify-between items-center cursor-move"
                  title="Drag to move to another page"
                >
                  <span>{type}</span>
                  <button
                    onClick={() => toggleWidgetVisibility(page, type)}
                    className="text-gray-700 hover:text-black text-lg"
                    title="Toggle Visibility"
                  >
                    {visible ? "👁️" : "🚫"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}

      {/* Add New Page */}
      <div className="mt-10 border rounded p-5 shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Add New Page</h2>
        <input
          className="border p-2 rounded mr-2"
          placeholder="New page name"
          value={newPageName}
          onChange={(e) => setNewPageName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddPage();
          }}
        />
        <button
          onClick={handleAddPage}
          disabled={!newPageName.trim() || !!widgets[newPageName.trim() as Page]}
          className="px-3 py-1 bg-blue-600 rounded disabled:opacity-50"
        >
          Add Page
        </button>
      </div>
    </div>
  );
};
