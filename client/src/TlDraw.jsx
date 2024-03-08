import React from "react";
import { Tldraw, useEditor } from "tldraw";
import "./index.css";

const Tldraw = () => {
  const editor = useEditor();
  console.log(editor);

  const handleSave = () => {
    if (editor && editor.store) {
      const snapshot = editor.store.getSnapshot();
      console.log(snapshot);
      const stringified = JSON.stringify(snapshot);
      // localStorage.setItem("my-editor-snapshot", stringified);
    } else {
      console.error("Editor or its methods are not available.");
    }
  };

  return (
    <>
      <div className="header">
        <h1>Building Planner Tldraw</h1>
        <button onClick={handleSave}>Save</button>
      </div>
      <div style={{ inset: 0, position: "fixed", top: "5rem" }}>
        <Tldraw persistenceKey="my-persistence-key" />
      </div>
    </>
  );
};

export default Tldraw;
