import { useState } from "react";
import { 
  ChevronDown, 
  ChevronRight, 
  FileCode, 
  Folder, 
  FolderOpen, 
  Plus, 
  ArrowLeft, 
  HelpCircle,
  Layers,
  FileText
} from "lucide-react";

const ProjectSidebar = ({
  activeFile = "server.js",
  onSelectFile = () => {},
  activeWorkspace = "Distributed Systems",
  onSelectWorkspace = () => {},
  onBackToDashboard = () => {},
}) => {
  const [srcOpen, setSrcOpen] = useState(true);
  const [testsOpen, setTestsOpen] = useState(false);

  const files = {
    src: [
      { name: "server.js", lang: "javascript" },
      { name: "routes.js", lang: "javascript" },
      { name: "database.js", lang: "javascript" },
      { name: "auth.js", lang: "javascript" },
    ],
    tests: [
      { name: "server.test.js", lang: "javascript" },
    ],
    root: [
      { name: "README.md", lang: "markdown" },
    ]
  };

  const workspaces = [
    "Engineering",
    "Distributed Systems",
    "Payment Gateway"
  ];

  return (
    <aside className="ide-project-sidebar">
      {/* SECTION 1: PROJECT FILES */}
      <div className="ide-sidebar-section">
        <span className="ide-section-title">PROJECT</span>
        
        <div className="file-tree-container">
          {/* src folder */}
          <div className="tree-folder-group">
            <button
              type="button"
              className="tree-folder-btn"
              onClick={() => setSrcOpen(!srcOpen)}
            >
              {srcOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              {srcOpen ? <FolderOpen size={14} className="folder-icon" /> : <Folder size={14} className="folder-icon" />}
              <span>src</span>
            </button>

            {srcOpen && (
              <div className="tree-folder-children">
                {files.src.map((file) => (
                  <button
                    key={file.name}
                    type="button"
                    className={`tree-file-btn ${activeFile === file.name ? "active" : ""}`}
                    onClick={() => onSelectFile(file.name)}
                  >
                    <FileCode size={13} className="file-icon" />
                    <span>{file.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* tests folder */}
          <div className="tree-folder-group">
            <button
              type="button"
              className="tree-folder-btn"
              onClick={() => setTestsOpen(!testsOpen)}
            >
              {testsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              {testsOpen ? <FolderOpen size={14} className="folder-icon" /> : <Folder size={14} className="folder-icon" />}
              <span>tests</span>
            </button>

            {testsOpen && (
              <div className="tree-folder-children">
                {files.tests.map((file) => (
                  <button
                    key={file.name}
                    type="button"
                    className={`tree-file-btn ${activeFile === file.name ? "active" : ""}`}
                    onClick={() => onSelectFile(file.name)}
                  >
                    <FileCode size={13} className="file-icon" />
                    <span>{file.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* README.md */}
          {files.root.map((file) => (
            <button
              key={file.name}
              type="button"
              className={`tree-file-btn root-file ${activeFile === file.name ? "active" : ""}`}
              onClick={() => onSelectFile(file.name)}
            >
              <FileText size={13} className="file-icon" />
              <span>{file.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 2: WORKSPACES */}
      <div className="ide-sidebar-section">
        <div className="section-title-with-action">
          <span className="ide-section-title">WORKSPACES</span>
          <button type="button" className="add-workspace-btn" title="Add Workspace">
            <Plus size={12} />
          </button>
        </div>

        <div className="workspaces-list">
          {workspaces.map((ws) => (
            <button
              key={ws}
              type="button"
              className={`workspace-item-btn ${activeWorkspace === ws ? "active" : ""}`}
              onClick={() => onSelectWorkspace(ws)}
            >
              <Layers size={13} className="ws-icon" />
              <span>{ws}</span>
            </button>
          ))}
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="ide-sidebar-footer">
        <button
          type="button"
          className="ide-footer-btn"
          onClick={onBackToDashboard}
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </button>

        <button
          type="button"
          className="ide-footer-btn"
        >
          <HelpCircle size={14} />
          <span>Help</span>
        </button>
      </div>
    </aside>
  );
};

export default ProjectSidebar;
