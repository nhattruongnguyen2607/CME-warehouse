import { useState, useMemo, useCallback } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Raw Material", "Packaging", "Chemical", "Spare Part", "Finished Good", "Other"];
const UNITS = ["kg", "g", "liter", "ml", "pcs", "box", "roll", "sheet", "set", "m", "m²", "m³"];

// ─── Light Theme Tokens ───────────────────────────────────────────────────────
const C = {
  bg:         "#f5f6fa",
  surface:    "#ffffff",
  surfaceAlt: "#f0f2f8",
  border:     "#e2e5ee",
  borderHover:"#c7cde0",
  accent:     "#2563eb",
  accentSoft: "#eff4ff",
  textPrimary:"#1a1f36",
  textSec:    "#5a6282",
  textMuted:  "#9ba3bf",
  success:    "#16a34a",
  successBg:  "#f0fdf4",
  successBdr: "#bbf7d0",
  warn:       "#d97706",
  warnBg:     "#fffbeb",
  warnBdr:    "#fde68a",
  danger:     "#dc2626",
  dangerBg:   "#fef2f2",
  dangerBdr:  "#fecaca",
  shadow:     "0 1px 3px rgba(30,40,90,0.08), 0 1px 2px rgba(30,40,90,0.04)",
  shadowMd:   "0 4px 16px rgba(30,40,90,0.10)",
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const icons = {
  inbox:    "M22 12h-6l-2 3H10l-2-3H2M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z",
  send:     "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  grid:     "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  clock:    "M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2",
  search:   "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  plus:     "M12 5v14M5 12h14",
  warning:  "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
  filter:   "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  check:    "M20 6L9 17l-5-5",
  package:  "M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12",
  chart:    "M18 20V10M12 20V4M6 20v-6",
};

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toasts, remove }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === "error" ? C.dangerBg : t.type === "warn" ? C.warnBg : C.successBg,
          border: `1px solid ${t.type === "error" ? C.dangerBdr : t.type === "warn" ? C.warnBdr : C.successBdr}`,
          color: C.textPrimary, borderRadius: 8, padding: "12px 16px", fontSize: 13,
          fontFamily: "'IBM Plex Mono', monospace",
          display: "flex", alignItems: "center", gap: 10, minWidth: 270,
          boxShadow: C.shadowMd, animation: "slideIn 0.2s ease",
        }}>
          <span style={{ color: t.type === "error" ? C.danger : t.type === "warn" ? C.warn : C.success, fontSize: 16 }}>
            {t.type === "error" ? "✗" : t.type === "warn" ? "⚠" : "✓"}
          </span>
          <span style={{ flex: 1 }}>{t.msg}</span>
          <button onClick={() => remove(t.id)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 16, padding: 0 }}>×</button>
        </div>
      ))}
    </div>
  );
}
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);
  const remove = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);
  return { toasts, add, remove };
}

// ─── Form Primitives ──────────────────────────────────────────────────────────
const inputStyle = (focus) => ({
  width: "100%", padding: "9px 12px", borderRadius: 7,
  background: C.surface,
  border: `1.5px solid ${focus ? C.accent : C.border}`,
  color: C.textPrimary, fontSize: 13, fontFamily: "'IBM Plex Mono', monospace",
  outline: "none", transition: "border 0.15s, box-shadow 0.15s",
  boxSizing: "border-box",
  boxShadow: focus ? `0 0 0 3px ${C.accent}18` : "none",
});

function Field({ label, children, error, required }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, color: C.textSec, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase", display: "block", marginBottom: 5, fontWeight: 600 }}>
        {label}{required && <span style={{ color: C.danger, marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {error && <div style={{ color: C.danger, fontSize: 11, marginTop: 4, fontFamily: "'IBM Plex Mono', monospace" }}>{error}</div>}
    </div>
  );
}
function Input({ value, onChange, placeholder, type = "text", list }) {
  const [focus, setFocus] = useState(false);
  return <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} type={type} list={list}
    style={inputStyle(focus)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} />;
}
function Select({ value, onChange, options }) {
  const [focus, setFocus] = useState(false);
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ ...inputStyle(focus), appearance: "none", cursor: "pointer" }}
      onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}>
      {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
    </select>
  );
}

// ─── Reusable UI ──────────────────────────────────────────────────────────────
function Btn({ children, onClick, variant = "primary", size = "md", disabled, style: ex }) {
  const styles = {
    primary: { bg: C.accent,   color: "#fff",       border: "none" },
    danger:  { bg: C.danger,   color: "#fff",       border: "none" },
    success: { bg: C.success,  color: "#fff",       border: "none" },
    ghost:   { bg: "transparent", color: C.textSec, border: `1.5px solid ${C.border}` },
  };
  const s = styles[variant] || styles.primary;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: s.bg, color: s.color, border: s.border,
      borderRadius: 7, cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600,
      fontSize: size === "sm" ? 11 : 13, opacity: disabled ? 0.45 : 1,
      padding: size === "sm" ? "6px 12px" : "9px 18px",
      display: "inline-flex", alignItems: "center", gap: 6,
      transition: "opacity 0.15s, box-shadow 0.15s, transform 0.1s",
      boxShadow: variant !== "ghost" ? C.shadow : "none",
      letterSpacing: "0.01em", ...ex,
    }}
      onMouseEnter={e => { if (!disabled && variant !== "ghost") e.currentTarget.style.boxShadow = C.shadowMd; }}
      onMouseLeave={e => { if (!disabled) { e.currentTarget.style.boxShadow = variant !== "ghost" ? C.shadow : "none"; e.currentTarget.style.transform = "scale(1)"; } }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = "scale(0.97)"; }}
      onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}>
      {children}
    </button>
  );
}

function Badge({ text, color = C.accent }) {
  return <span style={{
    background: color + "18", color, border: `1px solid ${color}35`,
    borderRadius: 5, padding: "2px 8px", fontSize: 10,
    fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700,
    letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap",
  }}>{text}</span>;
}

function Card({ children, style: ex }) {
  return <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: C.shadow, ...ex }}>{children}</div>;
}

function StatCard({ label, value, sub, color = C.accent }) {
  return (
    <Card style={{ padding: "18px 22px", borderLeft: `3px solid ${color}` }}>
      <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: C.textPrimary, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 5, fontFamily: "'IBM Plex Mono', monospace" }}>{sub}</div>}
    </Card>
  );
}

function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: C.textPrimary, letterSpacing: "-0.02em" }}>{title}</div>
      {sub && <div style={{ fontSize: 12, color: C.textMuted, fontFamily: "'IBM Plex Mono', monospace", marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function Table({ cols, rows, emptyMsg = "No data found" }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>
        <thead>
          <tr style={{ background: C.surfaceAlt, borderBottom: `1px solid ${C.border}` }}>
            {cols.map(c => (
              <th key={c.key} style={{ padding: "10px 16px", textAlign: c.align || "left", color: C.textSec, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", fontSize: 10, whiteSpace: "nowrap" }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={cols.length} style={{ padding: "48px 16px", textAlign: "center", color: C.textMuted, fontStyle: "italic" }}>{emptyMsg}</td></tr>
          ) : rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: C.surface, transition: "background 0.1s" }}
              onMouseEnter={e => e.currentTarget.style.background = C.surfaceAlt}
              onMouseLeave={e => e.currentTarget.style.background = C.surface}>
              {cols.map(c => (
                <td key={c.key} style={{ padding: "10px 16px", textAlign: c.align || "left", color: C.textPrimary, ...c.cellStyle }}>
                  {c.render ? c.render(row[c.key], row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FilterBar({ children }) {
  return (
    <Card style={{ padding: "14px 16px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, color: C.textMuted, fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
        <Icon d={icons.filter} size={11} color={C.textMuted} />Filters
      </div>
      {children}
    </Card>
  );
}

// ─── STOCK IN ─────────────────────────────────────────────────────────────────
function StockIn({ inventory, addTransaction, toast }) {
  const empty = { code: "", name: "", quantity: "", unit: "kg", date: new Date().toISOString().split("T")[0], supplier: "", category: "Raw Material", note: "" };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: "" })); };
  const selectedItem = inventory[form.code?.toUpperCase()];

  const validate = () => {
    const e = {};
    if (!form.code.trim()) e.code = "Required";
    if (!form.name.trim()) e.name = "Required";
    if (!form.quantity || isNaN(form.quantity) || +form.quantity <= 0) e.quantity = "Must be > 0";
    if (!form.date) e.date = "Required";
    if (!form.supplier.trim()) e.supplier = "Required";
    setErrors(e); return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    const qty = parseFloat(form.quantity);
    addTransaction({ type: "in", code: form.code.toUpperCase(), name: form.name, quantity: qty, unit: form.unit, date: form.date, party: form.supplier, category: form.category, note: form.note });
    toast(`Stocked in ${qty} ${form.unit} of ${form.name}`, "success");
    setForm(empty);
  };

  return (
    <div>
      <SectionHeader title="Stock In — Inbound Receipt" sub="Record materials entering the warehouse" />
      <Card style={{ padding: "24px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Material Code" required error={errors.code}>
            <Input value={form.code} onChange={v => {
              const up = v.toUpperCase();
              set("code", up);
              if (inventory[up]) {
                const it = inventory[up];
                setForm(p => ({ ...p, code: up, name: it.name, unit: it.unit, category: it.category, supplier: it.supplier }));
              }
            }} placeholder="e.g. RM-001" list="codelist" />
            <datalist id="codelist">{Object.keys(inventory).map(c => <option key={c} value={c} />)}</datalist>
          </Field>
          <Field label="Material Name" required error={errors.name}>
            <Input value={form.name} onChange={v => set("name", v)} placeholder="e.g. Steel Rod 10mm" />
          </Field>
          <Field label="Quantity" required error={errors.quantity}>
            <Input value={form.quantity} onChange={v => set("quantity", v)} placeholder="0" type="number" />
          </Field>
          <Field label="Unit of Measure">
            <Select value={form.unit} onChange={v => set("unit", v)} options={UNITS} />
          </Field>
          <Field label="Entry Date" required error={errors.date}>
            <Input value={form.date} onChange={v => set("date", v)} type="date" />
          </Field>
          <Field label="Supplier" required error={errors.supplier}>
            <Input value={form.supplier} onChange={v => set("supplier", v)} placeholder="Supplier name" />
          </Field>
          <Field label="Category">
            <Select value={form.category} onChange={v => set("category", v)} options={CATEGORIES.filter(c => c !== "All")} />
          </Field>
          <Field label="Note">
            <Input value={form.note} onChange={v => set("note", v)} placeholder="Optional note…" />
          </Field>
        </div>
        {selectedItem && (
          <div style={{ background: C.successBg, border: `1px solid ${C.successBdr}`, borderRadius: 8, padding: "10px 14px", marginTop: 4, marginBottom: 16, display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: C.success, fontFamily: "'IBM Plex Mono', monospace" }}>
            <Icon d={icons.package} size={13} color={C.success} />
            Existing item — Current stock: <strong>{selectedItem.quantity} {selectedItem.unit}</strong> → After receipt: <strong>{selectedItem.quantity + (+form.quantity || 0)} {selectedItem.unit}</strong>
          </div>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <Btn onClick={submit}><Icon d={icons.plus} size={13} />Confirm Receipt</Btn>
          <Btn variant="ghost" onClick={() => { setForm(empty); setErrors({}); }}>Clear</Btn>
        </div>
      </Card>
    </div>
  );
}

// ─── STOCK OUT ────────────────────────────────────────────────────────────────
function StockOut({ inventory, addTransaction, toast }) {
  const empty = { code: "", quantity: "", date: new Date().toISOString().split("T")[0], recipient: "", note: "" };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: "" })); };
  const item = inventory[form.code];
  const qty = parseFloat(form.quantity);
  const overStock = item && !isNaN(qty) && qty > item.quantity;

  const validate = () => {
    const e = {};
    if (!form.code) e.code = "Select a material";
    else if (!item) e.code = "Not found in inventory";
    if (!form.quantity || isNaN(qty) || qty <= 0) e.quantity = "Must be > 0";
    else if (overStock) e.quantity = `Exceeds stock (${item.quantity} ${item.unit} available)`;
    if (!form.date) e.date = "Required";
    if (!form.recipient.trim()) e.recipient = "Required";
    setErrors(e); return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    addTransaction({ type: "out", code: form.code, name: item.name, quantity: qty, unit: item.unit, date: form.date, party: form.recipient, note: form.note });
    toast(`Released ${qty} ${item.unit} of ${item.name}`, "success");
    setForm(empty);
  };

  return (
    <div>
      <SectionHeader title="Stock Out — Outbound Release" sub="Record materials leaving the warehouse" />
      <Card style={{ padding: "24px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Material Code" required error={errors.code}>
            <Select value={form.code} onChange={v => set("code", v)} options={[
              { value: "", label: "— Select Material —" },
              ...Object.values(inventory).map(i => ({ value: i.code, label: `${i.code} — ${i.name}` }))
            ]} />
          </Field>
          <Field label="Available Stock">
            <div style={{ ...inputStyle(false), display: "flex", alignItems: "center", justifyContent: "space-between", background: C.surfaceAlt }}>
              <span style={{ color: item ? (overStock ? C.danger : C.success) : C.textMuted, fontWeight: item ? 600 : 400 }}>
                {item ? `${item.quantity} ${item.unit}` : "—"}
              </span>
              {item && <Badge text={item.category} color={C.textSec} />}
            </div>
          </Field>
          <Field label="Quantity to Release" required error={errors.quantity}>
            <Input value={form.quantity} onChange={v => set("quantity", v)} placeholder="0" type="number" />
          </Field>
          <Field label="Unit">
            <div style={{ ...inputStyle(false), color: item ? C.textPrimary : C.textMuted, background: C.surfaceAlt }}>{item ? item.unit : "—"}</div>
          </Field>
          <Field label="Release Date" required error={errors.date}>
            <Input value={form.date} onChange={v => set("date", v)} type="date" />
          </Field>
          <Field label="Recipient" required error={errors.recipient}>
            <Input value={form.recipient} onChange={v => set("recipient", v)} placeholder="Department / person name" />
          </Field>
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="Note">
              <Input value={form.note} onChange={v => set("note", v)} placeholder="Work order, batch number, etc." />
            </Field>
          </div>
        </div>
        {overStock && (
          <div style={{ background: C.dangerBg, border: `1px solid ${C.dangerBdr}`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: C.danger, fontFamily: "'IBM Plex Mono', monospace" }}>
            <Icon d={icons.warning} size={13} color={C.danger} />
            <strong>Insufficient stock!</strong>&nbsp;Requested {qty} {item?.unit} but only <strong>{item?.quantity} {item?.unit}</strong> available.
          </div>
        )}
        {item && !overStock && form.quantity && !isNaN(qty) && qty > 0 && (
          <div style={{ background: C.successBg, border: `1px solid ${C.successBdr}`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: C.success, fontFamily: "'IBM Plex Mono', monospace" }}>
            <Icon d={icons.check} size={13} color={C.success} />
            Stock after release: <strong>{item.quantity - qty} {item.unit}</strong>
          </div>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <Btn onClick={submit} variant="danger"><Icon d={icons.send} size={13} />Confirm Release</Btn>
          <Btn variant="ghost" onClick={() => { setForm(empty); setErrors({}); }}>Clear</Btn>
        </div>
      </Card>
    </div>
  );
}

// ─── INVENTORY ────────────────────────────────────────────────────────────────
function Inventory({ inventory }) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterSupplier, setFilterSupplier] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const suppliers = useMemo(() => ["All", ...new Set(Object.values(inventory).map(i => i.supplier).filter(Boolean))], [inventory]);
  const filtered = useMemo(() => Object.values(inventory).filter(item => {
    const q = search.toLowerCase();
    if (q && !item.code.toLowerCase().includes(q) && !item.name.toLowerCase().includes(q)) return false;
    if (filterCat !== "All" && item.category !== filterCat) return false;
    if (filterSupplier !== "All" && item.supplier !== filterSupplier) return false;
    if (dateFrom && item.entryDate < dateFrom) return false;
    if (dateTo && item.entryDate > dateTo) return false;
    return true;
  }), [inventory, search, filterCat, filterSupplier, dateFrom, dateTo]);

  const lowStock = filtered.filter(i => i.quantity < 20).length;
  const catColor = v => v === "Raw Material" ? "#2563eb" : v === "Packaging" ? "#7c3aed" : v === "Chemical" ? "#dc2626" : v === "Spare Part" ? "#0891b2" : "#64748b";

  const exportCSV = () => {
    const h = ["Code", "Name", "Category", "Quantity", "Unit", "Supplier", "Entry Date"];
    const rows = filtered.map(i => [i.code, i.name, i.category, i.quantity, i.unit, i.supplier, i.entryDate]);
    const csv = [h, ...rows].map(r => r.map(v => `"${v ?? ""}"`).join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `inventory_${new Date().toISOString().split("T")[0]}.csv`; a.click();
  };

  const cols = [
    { key: "code", label: "Code", render: v => <span style={{ color: C.accent, fontWeight: 700 }}>{v}</span> },
    { key: "name", label: "Material Name" },
    { key: "category", label: "Category", render: v => <Badge text={v} color={catColor(v)} /> },
    { key: "quantity", label: "Qty", align: "right", render: v => <span style={{ color: v < 20 ? C.danger : v < 50 ? C.warn : C.success, fontWeight: 700 }}>{v}</span> },
    { key: "unit", label: "Unit" },
    { key: "supplier", label: "Supplier" },
    { key: "entryDate", label: "Last Entry" },
  ];

  return (
    <div>
      <SectionHeader title="Inventory Overview" sub="Real-time warehouse stock status" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 22 }}>
        <StatCard label="Total SKUs" value={Object.keys(inventory).length} sub="unique materials" color={C.accent} />
        <StatCard label="Filtered Results" value={filtered.length} sub="matching current filters" color="#7c3aed" />
        <StatCard label="Low Stock Alerts" value={lowStock} sub="< 20 units remaining" color={lowStock > 0 ? C.danger : C.success} />
      </div>
      <FilterBar>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto", gap: 10, alignItems: "end" }}>
          <Field label="Search">
            <div style={{ position: "relative" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Code or name…" style={{ ...inputStyle(false), paddingLeft: 34 }} />
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.textMuted, pointerEvents: "none" }}><Icon d={icons.search} size={13} /></span>
            </div>
          </Field>
          <Field label="Category"><Select value={filterCat} onChange={setFilterCat} options={CATEGORIES} /></Field>
          <Field label="Supplier"><Select value={filterSupplier} onChange={setFilterSupplier} options={suppliers} /></Field>
          <Field label="From"><Input value={dateFrom} onChange={setDateFrom} type="date" /></Field>
          <Field label="To"><Input value={dateTo} onChange={setDateTo} type="date" /></Field>
          <div style={{ paddingBottom: 14 }}>
            <Btn variant="ghost" size="sm" onClick={() => { setSearch(""); setFilterCat("All"); setFilterSupplier("All"); setDateFrom(""); setDateTo(""); }}>Reset</Btn>
          </div>
        </div>
      </FilterBar>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 12 }}>
        <Btn variant="ghost" size="sm" onClick={exportCSV}><Icon d={icons.download} size={12} />Export CSV</Btn>
      </div>
      <Table cols={cols} rows={filtered} emptyMsg="No materials match your filters" />
    </div>
  );
}

// ─── HISTORY ──────────────────────────────────────────────────────────────────
function History({ transactions }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(() => [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .filter(t => {
      const q = search.toLowerCase();
      if (q && !t.code.toLowerCase().includes(q) && !t.name.toLowerCase().includes(q) && !t.party.toLowerCase().includes(q)) return false;
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      if (dateFrom && t.date < dateFrom) return false;
      if (dateTo && t.date > dateTo) return false;
      return true;
    }), [transactions, search, typeFilter, dateFrom, dateTo]);

  const exportCSV = () => {
    const h = ["TX ID", "Type", "Code", "Name", "Qty", "Unit", "Date", "Party", "Note"];
    const rows = filtered.map(t => [t.id, t.type.toUpperCase(), t.code, t.name, t.quantity, t.unit, t.date, t.party, t.note || ""]);
    const csv = [h, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`; a.click();
  };

  const cols = [
    { key: "id", label: "TX ID", render: v => <span style={{ color: C.textMuted, fontSize: 10 }}>{v}</span> },
    { key: "type", label: "Type", render: v => <Badge text={v === "in" ? "IN" : "OUT"} color={v === "in" ? C.success : C.warn} /> },
    { key: "code", label: "Code", render: v => <span style={{ color: C.accent, fontWeight: 700 }}>{v}</span> },
    { key: "name", label: "Material Name" },
    { key: "quantity", label: "Qty", align: "right", render: (v, row) => <span style={{ color: row.type === "in" ? C.success : C.danger, fontWeight: 700 }}>{row.type === "in" ? "+" : "-"}{v}</span> },
    { key: "unit", label: "Unit" },
    { key: "date", label: "Date" },
    { key: "party", label: "Supplier / Recipient" },
    { key: "note", label: "Note", render: v => <span style={{ color: C.textMuted, fontStyle: v ? "normal" : "italic" }}>{v || "—"}</span> },
  ];

  return (
    <div>
      <SectionHeader title="Transaction History" sub="Full audit log of all inbound & outbound movements" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 22 }}>
        <StatCard label="Total Transactions" value={transactions.length} color={C.textSec} />
        <StatCard label="Stock In Records" value={transactions.filter(t => t.type === "in").length} color={C.success} />
        <StatCard label="Stock Out Records" value={transactions.filter(t => t.type === "out").length} color={C.warn} />
      </div>
      <FilterBar>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 10, alignItems: "end" }}>
          <Field label="Search">
            <div style={{ position: "relative" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Code, name, party…" style={{ ...inputStyle(false), paddingLeft: 34 }} />
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.textMuted, pointerEvents: "none" }}><Icon d={icons.search} size={13} /></span>
            </div>
          </Field>
          <Field label="Type"><Select value={typeFilter} onChange={setTypeFilter} options={[{ value: "all", label: "All" }, { value: "in", label: "Stock In" }, { value: "out", label: "Stock Out" }]} /></Field>
          <Field label="From"><Input value={dateFrom} onChange={setDateFrom} type="date" /></Field>
          <Field label="To"><Input value={dateTo} onChange={setDateTo} type="date" /></Field>
          <div style={{ paddingBottom: 14 }}>
            <Btn variant="ghost" size="sm" onClick={() => { setSearch(""); setTypeFilter("all"); setDateFrom(""); setDateTo(""); }}>Reset</Btn>
          </div>
        </div>
      </FilterBar>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <Btn variant="ghost" size="sm" onClick={exportCSV}><Icon d={icons.download} size={12} />Export CSV</Btn>
      </div>
      <Table cols={cols} rows={filtered} emptyMsg="No transactions found" />
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ inventory, transactions, setTab }) {
  const items = Object.values(inventory);
  const lowStock = items.filter(i => i.quantity < 20);
  const recentTx = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  const todayTx = transactions.filter(t => t.date === new Date().toISOString().split("T")[0]).length;
  const categories = {};
  items.forEach(i => { categories[i.category] = (categories[i.category] || 0) + 1; });
  const catColor = cat => cat === "Raw Material" ? "#2563eb" : cat === "Packaging" ? "#7c3aed" : cat === "Chemical" ? "#dc2626" : cat === "Spare Part" ? "#0891b2" : "#64748b";

  return (
    <div>
      <SectionHeader title="Warehouse Dashboard" sub="Live overview of warehouse status" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        <StatCard label="Total SKUs" value={items.length} sub="unique materials" color={C.accent} />
        <StatCard label="Total Transactions" value={transactions.length} sub="all time" color="#7c3aed" />
        <StatCard label="Today's Movements" value={todayTx} sub="today" color={C.success} />
        <StatCard label="Low Stock Alerts" value={lowStock.length} sub="< 20 units" color={lowStock.length > 0 ? C.danger : C.success} />
      </div>

      {items.length === 0 ? (
        <Card style={{ padding: "64px 32px", textAlign: "center" }}>
          <div style={{ marginBottom: 14 }}><Icon d={icons.package} size={44} color={C.borderHover} /></div>
          <div style={{ fontSize: 17, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: C.textSec, marginBottom: 8 }}>Warehouse is empty</div>
          <div style={{ fontSize: 13, color: C.textMuted, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 22 }}>Start by adding materials via Stock In</div>
          <Btn onClick={() => setTab("stockin")}><Icon d={icons.plus} size={13} />Add First Item</Btn>
        </Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Card style={{ padding: "20px 22px" }}>
            <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase", letterSpacing: "0.09em", fontWeight: 700, marginBottom: 16 }}>Stock by Category</div>
            {Object.entries(categories).map(([cat, count]) => {
              const pct = Math.round(count / items.length * 100);
              return (
                <div key={cat} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: C.textPrimary, fontFamily: "'IBM Plex Mono', monospace" }}>{cat}</span>
                    <span style={{ fontSize: 11, color: C.textMuted, fontFamily: "'IBM Plex Mono', monospace" }}>{count} SKU · {pct}%</span>
                  </div>
                  <div style={{ background: C.surfaceAlt, borderRadius: 4, height: 5, overflow: "hidden", border: `1px solid ${C.border}` }}>
                    <div style={{ width: `${pct}%`, background: catColor(cat), borderRadius: 4, height: "100%", transition: "width 0.6s ease" }} />
                  </div>
                </div>
              );
            })}
          </Card>

          <Card style={{ padding: "20px 22px" }}>
            <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase", letterSpacing: "0.09em", fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
              <Icon d={icons.warning} size={11} color={C.warn} /> Low Stock Alerts
            </div>
            {lowStock.length === 0 ? (
              <div style={{ color: C.success, fontSize: 13, fontFamily: "'IBM Plex Mono', monospace", display: "flex", alignItems: "center", gap: 8 }}>
                <Icon d={icons.check} size={15} color={C.success} /> All items sufficiently stocked
              </div>
            ) : lowStock.map(item => (
              <div key={item.code} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize: 12, color: C.danger, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>{item.code}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{item.name}</div>
                </div>
                <Badge text={`${item.quantity} ${item.unit}`} color={C.danger} />
              </div>
            ))}
          </Card>

          <Card style={{ padding: "20px 22px", gridColumn: "1 / -1" }}>
            <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase", letterSpacing: "0.09em", fontWeight: 700, marginBottom: 16 }}>Recent Transactions</div>
            {recentTx.length === 0 ? (
              <div style={{ color: C.textMuted, fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", fontStyle: "italic" }}>No transactions yet</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
                <tbody>
                  {recentTx.map(t => (
                    <tr key={t.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: "8px 0", width: 50 }}><Badge text={t.type.toUpperCase()} color={t.type === "in" ? C.success : C.warn} /></td>
                      <td style={{ padding: "8px 10px", color: C.accent, fontWeight: 700 }}>{t.code}</td>
                      <td style={{ padding: "8px 10px", color: C.textPrimary }}>{t.name}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", color: t.type === "in" ? C.success : C.danger, fontWeight: 700 }}>{t.type === "in" ? "+" : "-"}{t.quantity} {t.unit}</td>
                      <td style={{ padding: "8px 0 8px 10px", color: C.textMuted, textAlign: "right" }}>{t.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [inventory, setInventory] = useState({});
  const [transactions, setTransactions] = useState([]);
  const { toasts, add: toast, remove } = useToast();

  const addTransaction = useCallback((tx) => {
    const id = "TX-" + String(Date.now()).slice(-6);
    const newTx = { id, ...tx };
    setTransactions(prev => [...prev, newTx]);
    setInventory(prev => {
      const item = prev[tx.code];
      const newQty = tx.type === "in"
        ? (item ? item.quantity + tx.quantity : tx.quantity)
        : Math.max(0, (item?.quantity || 0) - tx.quantity);
      const updated = tx.type === "in"
        ? { ...(item || {}), code: tx.code, name: tx.name, unit: tx.unit, supplier: tx.party, entryDate: tx.date, category: tx.category || item?.category || "Other", quantity: newQty }
        : { ...item, quantity: newQty };
      return { ...prev, [tx.code]: updated };
    });
  }, []);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: icons.chart },
    { id: "stockin",   label: "Stock In",   icon: icons.inbox },
    { id: "stockout",  label: "Stock Out",  icon: icons.send },
    { id: "inventory", label: "Inventory",  icon: icons.grid },
    { id: "history",   label: "History",    icon: icons.clock },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg} !important; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: ${C.surfaceAlt}; }
        ::-webkit-scrollbar-thumb { background: ${C.borderHover}; border-radius: 3px; }
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; }
        select option { background: ${C.surface}; color: ${C.textPrimary}; }
        input::placeholder { color: ${C.textMuted}; }
      `}</style>

      <div style={{ background: C.bg, minHeight: "100vh", color: C.textPrimary }}>
        {/* Header */}
        <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 24px", display: "flex", alignItems: "center", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 4px rgba(30,40,90,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 0", marginRight: 32 }}>
            <div style={{ width: 34, height: 34, background: C.accent, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px #2563eb30" }}>
              <Icon d={icons.package} size={17} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: C.textPrimary, letterSpacing: "-0.02em", lineHeight: 1 }}>WAREHUB</div>
              <div style={{ fontSize: 9, color: C.textMuted, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.12em", textTransform: "uppercase" }}>Inventory System</div>
            </div>
          </div>
          <nav style={{ display: "flex", height: "100%", flex: 1 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                background: "none", border: "none", cursor: "pointer", padding: "0 16px", height: 54,
                display: "flex", alignItems: "center", gap: 7, fontSize: 12,
                fontFamily: "'IBM Plex Mono', monospace",
                color: tab === t.id ? C.accent : C.textMuted,
                fontWeight: tab === t.id ? 700 : 500,
                borderBottom: tab === t.id ? `2.5px solid ${C.accent}` : "2.5px solid transparent",
                transition: "all 0.15s", letterSpacing: "0.01em",
              }}>
                <Icon d={t.icon} size={13} color={tab === t.id ? C.accent : C.textMuted} />
                {t.label}
              </button>
            ))}
          </nav>
          <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'IBM Plex Mono', monospace" }}>
            {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
          </div>
        </div>

        {/* Page content */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>
          {tab === "dashboard" && <Dashboard inventory={inventory} transactions={transactions} setTab={setTab} />}
          {tab === "stockin"   && <StockIn inventory={inventory} addTransaction={addTransaction} toast={toast} />}
          {tab === "stockout"  && <StockOut inventory={inventory} addTransaction={addTransaction} toast={toast} />}
          {tab === "inventory" && <Inventory inventory={inventory} />}
          {tab === "history"   && <History transactions={transactions} />}
        </div>
      </div>
      <Toast toasts={toasts} remove={remove} />
    </>
  );
}
