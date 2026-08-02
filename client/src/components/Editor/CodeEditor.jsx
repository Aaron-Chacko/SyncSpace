// src/components/CodeEditor.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import MonacoEditor from '@monaco-editor/react';
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';
import * as awarenessProtocol from 'y-protocols/awareness';
import { useSocketContext } from '../../context/SocketContext';
import LanguageSelector from './LanguageSelector';
import { Terminal, AlertCircle, X, Maximize2, Minimize2, Eye, GitBranch, RefreshCw, TerminalSquare } from 'lucide-react';
import './Editor.css';
import socket from '../../services/socket';

// ============================================
// SUPPORTED LANGUAGES
// ============================================
export const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'markdown', label: 'Markdown' },
];

// ============================================
// CODE TEMPLATES
// ============================================
export const CODE_TEMPLATES = {
  javascript: `// Welcome to SyncSpace - JavaScript
function greet(name) {
  console.log(\`Hello, \${name}! Welcome to SyncSpace\`);
  return { message: "Welcome to SyncSpace", version: "2.0" };
}

// Example usage
const result = greet("Developer");
console.log("Result:", result);`,

  typescript: `// Welcome to SyncSpace - TypeScript
interface User {
  name: string;
  age: number;
  isActive: boolean;
}

function greetUser(user: User): string {
  return \`Welcome \${user.name} to SyncSpace!\`;
}

const user: User = {
  name: "Developer",
  age: 25,
  isActive: true
};

console.log(greetUser(user));`,

  python: `# Welcome to SyncSpace - Python
import sys

def greet(name):
    print(f"Hello, {name}! Welcome to SyncSpace")
    # Read stdin if input is provided under the Terminal tab
    user_input = sys.stdin.read().strip()
    if user_input:
        print(f"Received Input: {user_input}")
    return {"message": "Welcome to SyncSpace", "version": "2.0"}

# Example usage
result = greet("Developer")
print("Returned:", result)`,

  java: `// Welcome to SyncSpace - Java
import java.io.*;
import java.util.*;

public class SyncSpace {
    public static void main(String[] args) throws IOException {
        System.out.println("🚀 Welcome to SyncSpace!");
        
        // Read input from Terminal tab stdin
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        String line = reader.readLine();
        if (line != null && !line.isEmpty()) {
            System.out.println("Input arguments: " + line);
        }
        
        User user = new User("Developer", 25);
        System.out.println("Hello, " + user.getName() + "!");
    }
}

class User {
    private String name;
    private int age;
    
    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public String getName() {
        return name;
    }
    
    public int getAge() {
        return age;
    }
}`,

  cpp: `// Welcome to SyncSpace - C++
#include <iostream>
#include <string>

int main() {
    std::cout << "🚀 Welcome to SyncSpace C++!" << std::endl;
    
    // Read input from Terminal tab stdin
    std::string custom_input;
    if (std::getline(std::cin, custom_input)) {
        std::cout << "Input arguments: " << custom_input << std::endl;
    }
    
    std::string user = "Developer";
    std::cout << "Hello, " << user << "!" << std::endl;
    return 0;
}`,

  c: `// Welcome to SyncSpace - C
#include <stdio.h>

int main() {
    printf("🚀 Welcome to SyncSpace C!\\n");
    char custom_input[256];
    if (fgets(custom_input, sizeof(custom_input), stdin)) {
        printf("Input arguments: %s", custom_input);
    }
    char user[] = "Developer";
    printf("Hello, %s!\\n", user);
    return 0;
}`,

  go: `// Welcome to SyncSpace - Go
package main

import (
    "fmt"
    "os"
    "bufio"
)

func main() {
    fmt.Println("🚀 Welcome to SyncSpace Go!")
    
    // Read input from Terminal tab stdin
    reader := bufio.NewReader(os.Stdin)
    text, _ := reader.ReadString('\\n')
    if text != "" {
        fmt.Printf("Input arguments: %s\\n", text)
    }
    
    user := "Developer"
    fmt.Printf("Hello, %s!\\n", user)
}`,

  rust: `// Welcome to SyncSpace - Rust
use std::io::{self, BufRead};

fn main() {
    println!("🚀 Welcome to SyncSpace Rust!");
    
    // Read input from Terminal tab stdin
    let stdin = io::stdin();
    if let Some(Ok(line)) = stdin.lock().lines().next() {
        println!("Input arguments: {}", line);
    }
    
    let user = "Developer";
    println!("Hello, {}!", user);
}`,

  ruby: `# Welcome to SyncSpace - Ruby
puts "🚀 Welcome to SyncSpace Ruby!"
# Read input from Terminal tab stdin
custom_input = gets
if custom_input
  puts "Input arguments: #{custom_input.strip}"
end
user = "Developer"
puts "Hello, #{user}!"`,

  php: `<?php
// Welcome to SyncSpace - PHP
echo "🚀 Welcome to SyncSpace PHP!\\n";
// Read input from Terminal tab stdin
$custom_input = fgets(STDIN);
if ($custom_input) {
  echo "Input arguments: " . trim($custom_input) . "\\n";
}
$user = "Developer";
echo "Hello, " . $user . "!\\n";
?>`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to SyncSpace</title>
    <style>
        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            background: #09090b;
            color: #f4f4f5;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            text-align: center;
            padding: 2.5rem;
            border: 2px solid #6c5ce7;
            border-radius: 16px;
            background: #12121a;
            box-shadow: 0 8px 32px rgba(108, 92, 231, 0.2);
        }
        h1 {
            color: #a29bfe;
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }
        p {
            color: #a6adc8;
            font-size: 1.1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Welcome to SyncSpace</h1>
        <p>A full-featured collaborative workspace</p>
    </div>
</body>
</html>`,

  css: `/* Welcome to SyncSpace - CSS */
body {
  background-color: #0d0e15;
  color: #e2e8f0;
  font-family: system-ui, sans-serif;
  padding: 2rem;
}

.box {
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  padding: 20px;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
  margin-top: 15px;
}`,

  json: `{
  "name": "SyncSpace",
  "version": "2.0",
  "description": "Welcome to SyncSpace",
  "features": [
    "Collaborative Whiteboard",
    "Real-time Code Editor",
    "Live Code Runner"
  ]
}`,

  markdown: `# Welcome to SyncSpace Code Editor

This is a **markdown file** template.

- Edit code collaboratively in real-time.
- Press **Run Code** to compile and test algorithms.
- Cursors and selections are shared.
`,
};

// ============================================
// CODE EDITOR COMPONENT
// ============================================
const CodeEditor = ({
  roomId,
  userId,
  userName,
  userColor,
  canEdit = false,
  isReplayMode = false,
}) => {
  const socket = useSocketContext();

  // ----- STATE -----
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('syncspace_editor_lang') || 'javascript';
  });
  const [code, setCode] = useState(() => {
    const saved = localStorage.getItem('syncspace_editor_code');
    if (saved) return saved;
    return CODE_TEMPLATES['javascript'] || '';
  });
  const [editorTheme, setEditorTheme] = useState(() => {
    return localStorage.getItem('syncspace_editor_theme') || 'syncspace-dark';
  });
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState('on');
  const [minimap, setMinimap] = useState(true);
  const [lineNumbers, setLineNumbers] = useState('on');
  const isReadOnly = isReplayMode || !canEdit;
  const [saveStatus, setSaveStatus] = useState('Workspace: Connected');
  const [isSaving, setIsSaving] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [doc, setDoc] = useState(null);

  // ----- STATUS BAR STATES -----
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  // ----- CODE RUNNER STATES -----
  const [isRunning, setIsRunning] = useState(false);
  const [stdin, setStdin] = useState(''); // Standard Input
  const [consoleOutput, setConsoleOutput] = useState('');
  const [consoleError, setConsoleError] = useState('');
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isConsoleMaximized, setIsConsoleMaximized] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [consoleTab, setConsoleTab] = useState('output'); // 'output' | 'terminal' | 'problems' | 'preview'

  // ----- REFS -----
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const bindingRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  const yDocRef = useRef(null);
  const yAwarenessRef = useRef(null);
  const applyingRemoteChangeRef = useRef(false);

  useEffect(() => {
    if (!roomId) return undefined;
    const handleCodeChange = (data) => {
      if (data.room !== roomId || typeof data.code !== 'string') return;
      applyingRemoteChangeRef.current = true;
      setCode(data.code);
      if (data.language) setLanguage(data.language);
      window.setTimeout(() => { applyingRemoteChangeRef.current = false; }, 0);
    };
    socket.on('code-change', handleCodeChange);
    return () => socket.off('code-change', handleCodeChange);
  }, [roomId]);

  // ============================================
  // GET USER COLOR
  // ============================================
  const getUserColor = useCallback((id) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
      '#FFEAA7', '#DDA0DD', '#FF8A5C', '#A29BFE',
      '#FD79A8', '#00B894', '#0984E3', '#FDCB6E',
    ];
    if (!id) return colors[0];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }, []);

  // ============================================
  // Yjs COLLABORATIVE SETUP
  // ============================================
  useEffect(() => {
    if (!roomId || !userId || !socket) return;

    // Create Yjs document
    const yDoc = new Y.Doc();
    yDocRef.current = yDoc;
    setDoc(yDoc);

    // Create awareness
    const yAwareness = new awarenessProtocol.Awareness(yDoc);
    yAwareness.setLocalState({
      user: {
        id: userId,
        name: userName || 'Anonymous',
        color: userColor || getUserColor(userId),
      },
    });
    yAwarenessRef.current = yAwareness;

    // Listen for awareness changes (render badge and connected users list)
    const awarenessChangeHandler = () => {
      const states = yAwareness.getStates();
      const users = [];
      states.forEach((state, clientId) => {
        if (clientId === yAwareness.clientID) return;
        if (!state.user) return;
        users.push({
          clientId,
          ...state.user,
        });
      });
      setConnectedUsers(users);
    };
    yAwareness.on('change', awarenessChangeHandler);

    // Socket.io sync listeners
    const handleYjsInit = (update) => {
      if (update && update.byteLength > 0) {
        Y.applyUpdate(yDoc, new Uint8Array(update), 'remote');
      }
    };

    const handleYjsUpdate = (update) => {
      Y.applyUpdate(yDoc, new Uint8Array(update), 'remote');
    };

    const handleYjsAwareness = (update) => {
      awarenessProtocol.applyAwarenessUpdate(yAwareness, new Uint8Array(update), 'remote');
    };

    socket.on('yjs-init', handleYjsInit);
    socket.on('yjs-update', handleYjsUpdate);
    socket.on('yjs-awareness', handleYjsAwareness);

    // Join Yjs room session
    socket.emit('yjs-join', { roomId });

    // Document changes -> Broadcast update
    yDoc.on('update', (update, origin) => {
      if (origin !== 'remote') {
        socket.emit('yjs-update', { roomId, update });
      }
    });

    // Awareness changes -> Broadcast awareness update
    yAwareness.on('update', ({ added, updated, removed }, origin) => {
      if (origin !== 'remote') {
        const changedClients = added.concat(updated).concat(removed);
        const updateData = awarenessProtocol.encodeAwarenessUpdate(yAwareness, changedClients);
        socket.emit('yjs-awareness', { roomId, update: updateData });
      }
    });

    // Synchronize language via Yjs shared map
    const yMap = yDoc.getMap('metadata');
    const handleMetadataChange = () => {
      if (yMap.has('language')) {
        const remoteLang = yMap.get('language');
        if (remoteLang && remoteLang !== language) {
          setLanguage(remoteLang);
          if (editorRef.current && monacoRef.current) {
            const model = editorRef.current.getModel();
            if (model) {
              monacoRef.current.editor.setModelLanguage(model, remoteLang);
            }
          }
        }
      }
    };
    yMap.observe(handleMetadataChange);

    setIsCollaborative(true);

    return () => {
      socket.off('yjs-init', handleYjsInit);
      socket.off('yjs-update', handleYjsUpdate);
      socket.off('yjs-awareness', handleYjsAwareness);
      yMap.unobserve(handleMetadataChange);
      yAwareness.off('change', awarenessChangeHandler);
      yAwareness.destroy();
      yDoc.destroy();
      setIsCollaborative(false);
    };
  }, [roomId, userId, socket, userName, userColor, getUserColor]);

  // ============================================
  // MONACO EDITOR SETUP
  // ============================================
  const handleEditorDidMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Define modern high-end minimalist dark theme (Vercel-like One Dark)
    monaco.editor.defineTheme('syncspace-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '5c6370', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c678dd' },
        { token: 'identifier', foreground: 'abb2bf' },
        { token: 'string', foreground: '98c379' },
        { token: 'number', foreground: 'd19a66' },
        { token: 'type', foreground: '56b6c2' },
        { token: 'class', foreground: 'e5c07b' },
        { token: 'function', foreground: '61afef' },
      ],
      colors: {
        'editor.background': '#18181b', // Flat Zinc Background
        'editor.foreground': '#abb2bf',
        'editor.lineHighlightBackground': '#202023',
        'editorLineNumber.foreground': '#52525b',
        'editorLineNumber.activeForeground': '#a1a1aa',
        'editor.selectionBackground': '#3e4451',
        'editor.inactiveSelectionBackground': '#2c313c',
        'editorSuggestWidget.background': '#18181b',
        'editorSuggestWidget.border': '#27272a',
      }
    });

    if (editorTheme === 'syncspace-dark') {
      monaco.editor.setTheme('syncspace-dark');
    } else {
      monaco.editor.setTheme(editorTheme);
    }

    // Configure editor options
    editor.updateOptions({
      fontSize: fontSize,
      fontFamily: 'Consolas, "Courier New", monospace',
      minimap: { enabled: minimap },
      scrollbar: { vertical: 'visible' },
      wordWrap: wordWrap,
      lineNumbers: lineNumbers,
      renderWhitespace: 'selection',
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      detectIndentation: true,
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: true,
      readOnly: isReadOnly,
    });

    // Monaco model language mapping
    const model = editor.getModel();
    if (model) {
      monaco.editor.setModelLanguage(model, language);
    }

    // Yjs Monaco Binding
    if (yDocRef.current && yAwarenessRef.current && model) {
      const yText = yDocRef.current.getText('code');
      const binding = new MonacoBinding(
        yText,
        model,
        new Set([editor]),
        yAwarenessRef.current
      );
      bindingRef.current = binding;
    }

    // Dynamic Cursor Tracking
    editor.onDidChangeCursorPosition((e) => {
      setCursorPos({
        line: e.position.lineNumber,
        col: e.position.column
      });
    });

    // Code changes tracking (local autosave)
    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      setCode(value);
      setSaveStatus('Sync: Syncing...');
      
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        localStorage.setItem('syncspace_editor_code', value);
        setSaveStatus('Sync: Saved');
      }, 500);
    });
  }, [fontSize, minimap, wordWrap, lineNumbers, isReadOnly, editorTheme]);

  // ============================================
  // CODE RUNNER FUNCTION
  // ============================================
  const handleRunCode = useCallback(async () => {
    if (!editorRef.current) return;
    const currentCode = editorRef.current.getValue();

    setIsConsoleOpen(true);

    if (language === 'html' || language === 'css') {
      setConsoleTab('preview');
      return;
    }

    setIsRunning(true);
    setConsoleOutput('');
    setConsoleError('');
    setExecutionTime(null);
    setConsoleTab('output');

    try {
      const response = await fetch('http://localhost:5000/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          code: currentCode,
          stdin: stdin, // Forward stdin
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.run) {
          const out = data.run.stdout || '';
          const err = data.run.stderr || '';
          
          setConsoleOutput(out);
          setConsoleError(err);
          
          if (err) {
            setConsoleTab('problems');
          }

          if (data.run.time !== undefined) {
            const ms = parseFloat(data.run.time) * 1000;
            setExecutionTime(`${ms.toFixed(0)} ms`);
          }
        } else {
          setConsoleOutput(data.output || 'Execution finished.');
        }
      } else {
        setConsoleError(data.error || 'Failed to execute code.');
        setConsoleTab('problems');
      }
    } catch (err) {
      setConsoleError('Runner server connection error: Could not reach compile backend.');
      setConsoleTab('problems');
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  }, [language, stdin]);

  // ============================================
  // HANDLERS
  // ============================================
  const handleLanguageChange = useCallback((newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('syncspace_editor_lang', newLanguage);

    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model && monacoRef.current) {
        monacoRef.current.editor.setModelLanguage(model, newLanguage);
      }

      // Check if current text is template or empty
      const currentVal = editorRef.current.getValue();
      const isTemplate = Object.values(CODE_TEMPLATES).some(t => t.trim() === currentVal.trim()) || currentVal.trim() === '';
      if (isTemplate) {
        const template = CODE_TEMPLATES[newLanguage] || '';
        editorRef.current.setValue(template);
        setCode(template);
        localStorage.setItem('syncspace_editor_code', template);
      }
    }

    // Sync language selection to room via Yjs Map
    if (yDocRef.current) {
      const yMap = yDocRef.current.getMap('metadata');
      if (yMap.get('language') !== newLanguage) {
        yMap.set('language', newLanguage);
      }
    }

    setSaveStatus(`Sync: Active`);
  }, []);

  const handleResetCode = useCallback(() => {
    const template = CODE_TEMPLATES[language] || '';
    if (editorRef.current) {
      editorRef.current.setValue(template);
    }
    setCode(template);
    localStorage.setItem('syncspace_editor_code', template);
    setSaveStatus('Sync: Saved');
    
    const event = new CustomEvent('show-toast', {
      detail: { message: '🔄 Reset code to language template', type: 'success' }
    });
    window.dispatchEvent(event);
  }, [language]);

  const handleThemeChange = useCallback((newTheme) => {
    setEditorTheme(newTheme);
    localStorage.setItem('syncspace_editor_theme', newTheme);
    if (monacoRef.current) {
      if (newTheme === 'syncspace-dark') {
        monacoRef.current.editor.setTheme('syncspace-dark');
      } else {
        monacoRef.current.editor.setTheme(newTheme);
      }
    }
  }, []);

const handleEditorChange = useCallback((value) => {
  const nextCode = value || '';
  setCode(nextCode);
  if (!roomId || !canEdit || applyingRemoteChangeRef.current) return;
  socket.emit('code-change', {
    room: roomId,
    code: nextCode,
    language,
  });
}, [roomId, canEdit, language]);

  const handleFontSizeChange = useCallback((newSize) => {
    setFontSize(newSize);
    if (editorRef.current) {
      editorRef.current.updateOptions({ fontSize: newSize });
    }
  }, []);

  const handleWordWrapToggle = useCallback(() => {
    const newWrap = wordWrap === 'on' ? 'off' : 'on';
    setWordWrap(newWrap);
    if (editorRef.current) {
      editorRef.current.updateOptions({ wordWrap: newWrap });
    }
  }, [wordWrap]);

  const handleMinimapToggle = useCallback(() => {
    setMinimap(!minimap);
    if (editorRef.current) {
      editorRef.current.updateOptions({ minimap: { enabled: !minimap } });
    }
  }, [minimap]);

  const handleLineNumbersToggle = useCallback(() => {
    const newValue = lineNumbers === 'on' ? 'off' : 'on';
    setLineNumbers(newValue);
    if (editorRef.current) {
      editorRef.current.updateOptions({ lineNumbers: newValue });
    }
  }, [lineNumbers]);

  const handleManualSave = useCallback(() => {
    if (!editorRef.current) return;
    setIsSaving(true);
    setSaveStatus('Sync: Saving...');

    const value = editorRef.current.getValue();
    localStorage.setItem('syncspace_editor_code', value);
    setSaveStatus('Sync: Saved');

    setTimeout(() => {
      setIsSaving(false);
      const event = new CustomEvent('show-toast', {
        detail: { message: '💾 Code saved and synced!', type: 'success' }
      });
      window.dispatchEvent(event);
    }, 400);
  }, []);

  const handleFormatCode = useCallback(() => {
    if (!editorRef.current) return;
    const action = editorRef.current.getAction('editor.action.formatDocument');
    if (action) {
      action.run();
    }
  }, []);

  const getIframeSrcDoc = () => {
    if (!editorRef.current) return '';
    const currentCode = editorRef.current.getValue();

    if (language === 'html') {
      return currentCode;
    }

    if (language === 'css') {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <style>${currentCode}</style>
          </head>
          <body>
            <div class="box">Live CSS Sandbox Preview</div>
          </body>
        </html>
      `;
    }
    return '';
  };

  // Keyboard Shortcuts (Ctrl+S / Ctrl+Enter to Run)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleManualSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleManualSave, handleRunCode]);

  return (
    <div className="code-editor-container minimalist-style">
      {/* Top Header Bar */}
      <LanguageSelector
        language={language}
        onLanguageChange={handleLanguageChange}
        theme={editorTheme}
        onThemeChange={handleThemeChange}
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
        wordWrap={wordWrap}
        onWordWrapToggle={handleWordWrapToggle}
        minimap={minimap}
        onMinimapToggle={handleMinimapToggle}
        lineNumbers={lineNumbers}
        onLineNumbersToggle={handleLineNumbersToggle}
        onFormatCode={handleFormatCode}
        onSave={handleManualSave}
        onRun={handleRunCode}
        onResetCode={handleResetCode}
        isSaving={isSaving}
        isCollaborative={isCollaborative}
        connectedUsers={connectedUsers}
      />

      {/* Workspace Frame */}
      <div className={`editor-workspace-wrapper ${isConsoleOpen ? 'console-split' : ''} ${isConsoleMaximized ? 'console-maximized' : ''}`}>
        <div className="editor-wrapper">
          <MonacoEditor
            height="100%"
            language={language}
            theme={editorTheme}
            value={code}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              automaticLayout: true,
              scrollBeyondLastLine: false,
            }}
          />

          {/* Collaborative Floating Badges */}
          {connectedUsers.length > 0 && (
            <div className="connected-users-badge">
              {connectedUsers.map((user) => (
                <span
                  key={user.clientId}
                  className="user-badge"
                  style={{
                    background: user.color || '#6c5ce7',
                  }}
                  title={user.name}
                >
                  {user.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Flat Docked Bottom Panel */}
        {isConsoleOpen && (
          <div className="vs-panel">
            <div className="vs-panel-header">
              <div className="vs-panel-tabs">
                <button
                  className={`vs-panel-tab ${consoleTab === 'problems' ? 'active' : ''}`}
                  onClick={() => setConsoleTab('problems')}
                >
                  <span>PROBLEMS</span>
                  {consoleError && <span className="vs-error-badge">1</span>}
                </button>

                <button
                  className={`vs-panel-tab ${consoleTab === 'output' ? 'active' : ''}`}
                  onClick={() => setConsoleTab('output')}
                >
                  <span>OUTPUT</span>
                </button>

                <button
                  className={`vs-panel-tab ${consoleTab === 'terminal' ? 'active' : ''}`}
                  onClick={() => setConsoleTab('terminal')}
                >
                  <span>TERMINAL</span>
                </button>

                {(language === 'html' || language === 'css') && (
                  <button
                    className={`vs-panel-tab ${consoleTab === 'preview' ? 'active' : ''}`}
                    onClick={() => setConsoleTab('preview')}
                  >
                    <span>PREVIEW</span>
                  </button>
                )}
              </div>

              <div className="vs-panel-controls">
                {executionTime && consoleTab === 'output' && (
                  <span className="vs-panel-time">Time: {executionTime}</span>
                )}

                <button
                  onClick={() => setIsConsoleMaximized(!isConsoleMaximized)}
                  className="vs-panel-btn"
                  title={isConsoleMaximized ? "Collapse Panel" : "Maximize Panel"}
                >
                  {isConsoleMaximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                </button>

                <button
                  onClick={() => {
                    setIsConsoleOpen(false);
                    setIsConsoleMaximized(false);
                  }}
                  className="vs-panel-btn vs-close-btn"
                  title="Close Panel"
                >
                  <X size={12} />
                </button>
              </div>
            </div>

            <div className="vs-panel-content">
              {/* Output Tab */}
              {consoleTab === 'output' && (
                <div className="vs-terminal-body scrollable">
                  {isRunning ? (
                    <div className="vs-terminal-loading">
                      <span className="vs-spinner"></span>
                      <span>Executing code in local workspace...</span>
                    </div>
                  ) : consoleOutput ? (
                    <pre className="vs-terminal-pre">{consoleOutput}</pre>
                  ) : (
                    <div className="vs-terminal-empty">No output logs recorded. Run script.</div>
                  )}
                </div>
              )}

              {/* Terminal Tab (Standard input for testcases) */}
              {consoleTab === 'terminal' && (
                <div className="vs-stdin-container">
                  <div className="vs-stdin-title">STANDARD INPUT (stdin)</div>
                  <textarea
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    placeholder="Provide standard inputs (stdin) here..."
                    className="vs-stdin-textarea"
                  />
                </div>
              )}

              {/* Problems Tab */}
              {consoleTab === 'problems' && (
                <div className="vs-terminal-body scrollable error">
                  {consoleError ? (
                    <div className="vs-problem-line">
                      <AlertCircle size={14} className="vs-problem-icon" />
                      <pre className="vs-problem-pre">{consoleError}</pre>
                    </div>
                  ) : (
                    <div className="vs-terminal-empty">No compiler warnings or problems.</div>
                  )}
                </div>
              )}

              {/* Live Preview Tab */}
              {consoleTab === 'preview' && (
                <div className="vs-preview-container">
                  <iframe
                    srcDoc={getIframeSrcDoc()}
                    title="Live Preview"
                    sandbox="allow-scripts"
                    className="vs-preview-iframe"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Flat Pinned Bottom Status Bar */}
      <div className="vs-status-bar">
        <div className="vs-status-left">
          <div className="vs-status-item vs-status-branch">
            <GitBranch size={12} className="vs-status-icon" />
            <span>main</span>
          </div>

          <div className="vs-status-item">
            <RefreshCw size={11} className="vs-status-icon vs-spin-icon" style={{ display: isSaving ? 'inline' : 'none' }} />
            <span>{saveStatus}</span>
          </div>

          <button className={`vs-status-tab-btn ${isConsoleOpen ? 'active' : ''}`} onClick={() => setIsConsoleOpen(!isConsoleOpen)}>
            <TerminalSquare size={11} className="vs-status-icon" />
            <span>Terminal</span>
          </button>
        </div>

        <div className="vs-status-right">
          <div className="vs-status-item">
            <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
          </div>

          <div className="vs-status-item hide-mobile">
            <span>Spaces: 2</span>
          </div>

          <div className="vs-status-item hide-mobile">
            <span>UTF-8</span>
          </div>

          <div className="vs-status-item vs-status-lang">
            <span>{SUPPORTED_LANGUAGES.find(l => l.value === language)?.label || language}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
