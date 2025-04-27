// =====  App.jsx  ===================================================
import React, {
  useCallback, useState, useRef, useEffect, useMemo,
} from "react";

import ReactFlow, {
  addEdge, useNodesState, useEdgesState,
  MiniMap, Controls, Background, ReactFlowProvider,
} from "reactflow";
import {
  FiPlusSquare, FiPlus, FiTrash2, FiCopy, FiEdit2, FiDroplet,
  FiChevronDown, FiChevronRight, FiFolder, FiSave,
} from "react-icons/fi";
import { HexColorPicker } from "react-colorful";
import "reactflow/dist/style.css";

import "./style.css";

import CustomNode from "./CustomNode.jsx";
import { STRINGS } from "./strings.ts";
import * as htmlToImage from "html-to-image";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ---- preset swatches ---- */
const PRESET = [
  "#ffffff", "#fef08a", "#fcd34d", "#fca5a5",
  "#fdba74", "#d9f99d", "#bbf7d0", "#a5f3fc",
];

const nodeTypes = { custom: CustomNode };

export default function App() {
  /* ---------- i18n ---------- */
  const [lang, setLang] = useState("ar");        // "ar" | "en"
  const t = key => STRINGS[lang][key];

  /* ---------- flow state ---------- */
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [collapsed, setCollapsed]        = useState(new Set());

  /* ---------- UI state ---------- */
  const [renameModal, setRenameModal] = useState({ open:false });
  const [colorModal , setColorModal ] = useState({ open:false });
  const [detailModal, setDetailModal] = useState({ open:false });
  const [exportOpen , setExportOpen ] = useState(false);
  const [swatchSel  , setSwatchSel  ] = useState(null);

  const fileInputRef = useRef(null);
  const dropdownRef  = useRef(null);

  /* ---------- connect ---------- */
  const handleConnect = useCallback(p => setEdges(es => addEdge(p, es)), []);

  /* close dropdown on outside click */
  useEffect(() => {
    const fn = e => {
      if (exportOpen && dropdownRef.current && !dropdownRef.current.contains(e.target))
        setExportOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [exportOpen]);

  /* ---------- helpers ---------- */
  const selected = nodes.filter(n => n.selected);
  const selCount = selected.length;
  const isEmpty  = nodes.length === 0;
  const genId    = () => `node_${Date.now()}`;

  /* ---------- tree ops ---------- */
  const addRoot = () =>
    setNodes(n => [
      ...n,
      {
        id: genId(),
        type: "custom",
        data: {
          label: t("addRoot"),
          parent: null,
          description: "",
          style: { background: "#ffffff" },
        },
        position: { x: 400, y: 50 },
      },
    ]);

  const addChild = () => {
    if (selCount !== 1) return;
    const parent = selected[0];
    const id     = genId();
    setNodes(n =>
      n.concat({
        id,
        type: "custom",
        data: {
          label: t("addChild"),
          parent: parent.id,
          description: "",
          style: { background: "#ffffff" },
        },
        position: { x: parent.position.x + 100, y: parent.position.y + 100 },
      }),
    );
    setEdges(e => e.concat({ id: `e_${parent.id}-${id}`, source: parent.id, target: id }));
  };

  const deleteSel = () => {
    if (selCount < 1) return;
    const del = new Set(selected.map(n => n.id));
    setNodes(n => n.filter(x => !del.has(x.id)));
    setEdges(e => e.filter(x => !del.has(x.source) && !del.has(x.target)));
  };

  const duplicateSel = () => {
    if (selCount < 1) return;
    const map = {}, clones = [];
    selected.forEach(n => {
      const newId = `${genId()}_${Math.random().toString(36).slice(2, 6)}`;
      map[n.id]   = newId;
      clones.push({
        ...n,
        id: newId,
        position: { x: n.position.x + 30, y: n.position.y + 30 },
      });
    });
    const newEdges = edges
      .filter(e => map[e.source] && map[e.target])
      .map(e => ({
        ...e,
        id: `e_${map[e.source]}-${map[e.target]}`,
        source: map[e.source],
        target: map[e.target],
      }));
    setNodes(n => n.concat(clones));
    setEdges(e => e.concat(newEdges));
  };

  const renameSel = () => {
    if (selCount !== 1) return;
    const n = selected[0];
    setRenameModal({ open: true, id: n.id, val: n.data.label });
  };
  const confirmRename = () => {
    setNodes(n =>
      n.map(x =>
        x.id === renameModal.id
          ? { ...x, data: { ...x.data, label: renameModal.val } }
          : x,
      ),
    );
    setRenameModal({ open: false });
  };

  const colorSel = () => {
    if (selCount !== 1) return;
    const n     = selected[0];
    const start = n.data.style?.background || "#ffffff";
    const idx   = PRESET.indexOf(start);
    setSwatchSel(idx >= 0 ? idx : null);
    setColorModal({ open: true, id: n.id, val: start });
  };
  const pickSwatch = (hex, idx) => {
    setColorModal(m => ({ ...m, val: hex }));
    setSwatchSel(idx);
  };
  const confirmColor = () => {
    setNodes(n =>
      n.map(x =>
        x.id === colorModal.id
          ? {
              ...x,
              data: {
                ...x.data,
                style: { ...(x.data.style || {}), background: colorModal.val },
              },
            }
          : x,
      ),
    );
    setColorModal({ open: false });
    setSwatchSel(null);
  };

  const toggleCollapse = () => {
    if (selCount !== 1) return;
    const id = selected[0].id;
    setCollapsed(s => {
      const t = new Set(s);
      t.has(id) ? t.delete(id) : t.add(id);
      return t;
    });
  };

  const onNodeClick      = (_, node) =>
    setDetailModal({ open: true, node, desc: node.data.description || "" });
  const onNodeDblClick   = (_, node) =>
    setRenameModal({ open: true, id: node.id, val: node.data.label });
  const confirmDetail    = () => {
    setNodes(n =>
      n.map(x =>
        x.id === detailModal.node.id
          ? { ...x, data: { ...x.data, description: detailModal.desc } }
          : x,
      ),
    );
    setDetailModal({ open: false });
  };

  /* ---------- export helpers ---------- */
  const saveJSON = () => {
    const blob = new Blob([JSON.stringify({ nodes, edges }, null, 2)], {
      type: "application/json",
    });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = "tree.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const saveImg = () =>
    htmlToImage
      .toPng(document.querySelector(".flow-wrapper"))
      .then(d => {
        const a = document.createElement("a");
        a.href = d;
        a.download = "tree.png";
        a.click();
      });
  const savePDF = async () => {
    const canvas = await html2canvas(document.querySelector(".flow-wrapper"));
    const pdf    = new jsPDF("landscape");
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 10, 10, 280, 150);
    pdf.save("tree.pdf");
  };

  /* ---------- filtered view ---------- */
  const vNodes = useMemo(
    () => nodes.filter(n => !collapsed.has(n.data.parent)),
    [nodes, collapsed],
  );
  const vEdges = useMemo(
    () => edges.filter(e => !collapsed.has(e.source) && !collapsed.has(e.target)),
    [edges, collapsed],
  );

  /* ================= render ================= */
  return (
    <div className="app-container" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={e => {
          const f = e.target.files[0];
          if (!f) return;
          const r = new FileReader();
          r.onload = ev => {
            try {
              const obj = JSON.parse(ev.target.result);
              setNodes(obj.nodes || []);
              setEdges(obj.edges || []);
            } catch {}
          };
          r.readAsText(f);
          e.target.value = "";
        }}
      />

      {/* ---------- toolbar ---------- */}
      <div className="toolbar">
        {/* language toggle */}
        <label className="lang-toggle" style={{ direction: "ltr" }}>
          <input
            type="checkbox"
            checked={lang === "en"}
            onChange={() => setLang(p => (p === "ar" ? "en" : "ar"))}
          />
          <span className="slider" />
          <span className="lang-label">{lang === "ar" ? "EN" : "AR"}</span>
        </label>

        <button onClick={addRoot}>
          <FiPlusSquare />
          <span>{t("addRoot")}</span>
        </button>
        <button onClick={addChild} disabled={selCount !== 1}>
          <FiPlus />
          <span>{t("addChild")}</span>
        </button>
        <button onClick={deleteSel} disabled={selCount < 1}>
          <FiTrash2 />
          <span>{t("delete")}</span>
        </button>
        <button onClick={duplicateSel} disabled={selCount < 1}>
          <FiCopy />
          <span>{t("duplicate")}</span>
        </button>
        <button onClick={renameSel} disabled={selCount !== 1}>
          <FiEdit2 />
          <span>{t("rename")}</span>
        </button>
        <button onClick={colorSel} disabled={selCount !== 1}>
          <FiDroplet />
          <span>{t("color")}</span>
        </button>
        <button onClick={toggleCollapse} disabled={selCount !== 1}>
          {collapsed.has(selected[0]?.id) ? <FiChevronRight /> : <FiChevronDown />}
          <span>{t("expand")}</span>
        </button>

        <div className="spacer" />

        {/* save dropdown */}
        <div className={`dropdown ${exportOpen ? "open" : ""}`} ref={dropdownRef}>
          <button
            className="dropdown-toggle"
            onClick={() => setExportOpen(o => !o)}
          >
            <FiSave />
            <span>{t("saveAs")}</span>
          </button>
          <div className="dropdown-menu">
            <button
              onClick={() => {
                saveJSON();
                setExportOpen(false);
              }}
            >
              {t("json")}
            </button>
            <button
              onClick={() => {
                saveImg();
                setExportOpen(false);
              }}
            >
              {t("png")}
            </button>
            <button
              onClick={() => {
                savePDF();
                setExportOpen(false);
              }}
            >
              {t("pdf")}
            </button>
          </div>
        </div>

        <button onClick={() => fileInputRef.current.click()}>
          <FiFolder />
          <span>{t("open")}</span>
        </button>
      </div>

      {/* ---------- workspace ---------- */}
      {isEmpty ? (
        <div className="splash-screen">
          <h2>{t("splashTitle")}</h2>
          <div className="splash-actions">
            <button onClick={addRoot}>{t("splashNew")}</button>
            <button onClick={() => fileInputRef.current.click()}>
              {t("splashOpen")}
            </button>
          </div>
        </div>
      ) : (
        <ReactFlowProvider>
          <div className="flow-wrapper">
            <ReactFlow
              nodes={vNodes}
              edges={vEdges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={handleConnect}
              onNodeClick={onNodeClick}
              onNodeDoubleClick={onNodeDblClick}
              fitView
              snapToGrid
              snapGrid={[16, 16]}
            >
              <MiniMap />
              <Controls />
              <Background gap={16} />
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      )}

      {/* ---------- rename modal ---------- */}
      {renameModal.open && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t("editName")}</h3>
            <input
              className="modal-input"
              value={renameModal.val}
              onChange={e =>
                setRenameModal(m => ({ ...m, val: e.target.value }))
              }
            />
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setRenameModal({ open: false })}
              >
                {t("cancel")}
              </button>
              <button className="btn-primary" onClick={confirmRename}>
                {t("confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- colour modal ---------- */}
      {colorModal.open && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t("pickColor")}</h3>

            <div className="swatch-grid">
              {PRESET.map((c, i) => (
                <div
                  key={c}
                  className={`swatch ${swatchSel === i ? "selected" : ""}`}
                  style={{ background: c }}
                  onClick={() => pickSwatch(c, i)}
                />
              ))}
            </div>

            <HexColorPicker
              color={colorModal.val}
              onChange={c => {
                setColorModal(m => ({ ...m, val: c }));
                setSwatchSel(null);
              }}
            />

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setColorModal({ open: false })}
              >
                {t("cancel")}
              </button>
              <button className="btn-primary" onClick={confirmColor}>
                {t("confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- details modal ---------- */}
      {detailModal.open && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t("details")}</h3>
            <p className="modal-label">{detailModal.node.data.label}</p>
            <textarea
              className="modal-textarea"
              value={detailModal.desc}
              onChange={e =>
                setDetailModal(m => ({ ...m, desc: e.target.value }))
              }
            />
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setDetailModal({ open: false })}
              >
                {t("cancel")}
              </button>
              <button className="btn-primary" onClick={confirmDetail}>
                {t("save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
