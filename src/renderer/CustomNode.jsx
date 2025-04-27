import React, { useState } from "react";
import { Handle } from "reactflow";
import "./style.css";

export default function CustomNode({ data }) {
  const [show, setShow] = useState(false);
  const bg = data.style?.background || "#ffffff";

  return (
    <div className="custom-node" style={{ background: bg }}>
      <div className="custom-label" onClick={(e)=>e.stopPropagation()}>
        {data.label}
      </div>

      <div
        className="toggle-desc"
        onClick={(e)=>{e.stopPropagation();setShow(v=>!v);}}
      >
        {show ? "إخفاء التفاصيل" : "إظهار التفاصيل"}
      </div>

      {show && (
        <div className="custom-desc">
          {data.description || <em>لا توجد تفاصيل</em>}
        </div>
      )}

      <Handle type="target" position="top" />
      <Handle type="source" position="bottom" />
    </div>
  );
}
