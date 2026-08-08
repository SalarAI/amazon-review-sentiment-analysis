"use client";

import { useEffect, useState, type CSSProperties } from "react";

export type Copy = { fa: string; en: string };
export type Metric = { value: string; title: Copy; detail: Copy };
export type Finding = { title: Copy; text: Copy };
export type Visual = { src: string; title: Copy; source: string };
export type VisualGroup = { title: Copy; description: Copy; visuals: Visual[] };
export type DataTable = { title: Copy; description: Copy; columns: Copy[]; rows: string[][]; source: string };
export type ModelArchitecture = { name: string; badge: Copy; params: string; trainable: string; trainablePct: string; layers: Copy[]; tricks: Copy[] };
export type PresentationData = {
  part: string;
  eyebrow: Copy;
  title: Copy;
  subtitle: Copy;
  description: Copy;
  metrics: Metric[];
  findings: Finding[];
  tables?: DataTable[];
  architectures?: ModelArchitecture[];
  groups: VisualGroup[];
  takeaway: Copy;
};

export default function BilingualPresentation({ data }: { data: PresentationData }) {
  const [lang, setLang] = useState<"fa" | "en">("fa");
  const [activeImage, setActiveImage] = useState<Visual | null>(null);
  const [activeArchitecture, setActiveArchitecture] = useState(0);
  const [tableSort, setTableSort] = useState<Record<number, { column: number; ascending: boolean }>>({});
  const t = (copy: Copy) => copy[lang];
  const takeawayStep = 2 + Number(Boolean(data.architectures)) + Number(Boolean(data.tables)) + Number(data.groups.length > 0);

  useEffect(() => {
    const saved = localStorage.getItem("presentation-language");
    if (saved === "fa" || saved === "en") setLang(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("presentation-language", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setActiveImage(null);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(target => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const fullscreen = async () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
  const sortedRows = (table: DataTable, tableIndex: number) => {
    const sort = tableSort[tableIndex];
    if (!sort) return table.rows;
    const numeric = (value: string) => Number(value.replace(/[%,$—]/g, "").replaceAll(",", ""));
    return [...table.rows].sort((a, b) => {
      const aNumber = numeric(a[sort.column]);
      const bNumber = numeric(b[sort.column]);
      const comparison = Number.isNaN(aNumber) || Number.isNaN(bNumber)
        ? a[sort.column].localeCompare(b[sort.column], lang)
        : aNumber - bNumber;
      return sort.ascending ? comparison : -comparison;
    });
  };
  const sortTable = (tableIndex: number, column: number) => setTableSort(current => {
    const previous = current[tableIndex];
    return { ...current, [tableIndex]: { column, ascending: previous?.column === column ? !previous.ascending : true } };
  });

  return <main className="deck" dir={lang === "fa" ? "rtl" : "ltr"}>
    <header className="deck-header">
      <a className="deck-brand" href="#top"><span>AR</span><div><strong>Amazon Review Intelligence</strong><small>{data.part} · QBC AI Project 02</small></div></a>
      <nav><a href="#story">{lang === "fa" ? "داستان بخش" : "Part story"}</a>{data.architectures && <a href="#architecture">{lang === "fa" ? "معماری" : "Architecture"}</a>}<a href="#tables">{lang === "fa" ? "جدول‌ها" : "Tables"}</a>{data.groups.length > 0 && <a href="#visuals">{lang === "fa" ? "نمودارها" : "Visuals"}</a>}</nav>
      <div className="deck-actions"><button className="language-button" onClick={() => setLang(lang === "fa" ? "en" : "fa")}>{lang === "fa" ? "English" : "فارسی"}</button><button className="present-button" onClick={fullscreen}>⛶ <span>{lang === "fa" ? "ارائه" : "Present"}</span></button></div>
    </header>

    <section className="deck-hero hero-animate" id="top">
      <div className="hero-kicker"><span>{data.part}</span>{t(data.eyebrow)}</div>
      <h1>{t(data.title)}<em>{t(data.subtitle)}</em></h1>
      <p>{t(data.description)}</p>
      <div className="hero-line"><span /> <small>Amazon Electronics Reviews · 2014</small></div>
    </section>

    <section className="deck-section story-section" id="story">
      <div className="section-intro reveal"><span>01</span><div><small>{lang === "fa" ? "نمای کلی" : "Overview"}</small><h2>{lang === "fa" ? "آنچه در این بخش انجام شد" : "What this part accomplished"}</h2></div></div>
      <div className="metric-grid">{data.metrics.map((metric, index) => <article className="reveal" style={{ "--delay": `${index * 90}ms` } as CSSProperties} key={metric.title.en}><strong>{metric.value}</strong><h3>{t(metric.title)}</h3><p>{t(metric.detail)}</p></article>)}</div>
      <div className="finding-grid">{data.findings.map((finding, index) => <article className="reveal" style={{ "--delay": `${index * 110}ms` } as CSSProperties} key={finding.title.en}><span>{String(index + 1).padStart(2, "0")}</span><h3>{t(finding.title)}</h3><p>{t(finding.text)}</p></article>)}</div>
    </section>

    {data.architectures && <section className="architecture-section" id="architecture">
      <div className="deck-section">
        <div className="section-intro reveal"><span>02</span><div><small>{lang === "fa" ? "داخل مدل‌ها" : "Inside the models"}</small><h2>{lang === "fa" ? "ساختار لایه‌ها و ترفندهای آموزش" : "Layer structure and training techniques"}</h2></div></div>
        <div className="model-selector" role="tablist" aria-label={lang === "fa" ? "انتخاب مدل" : "Select model"}>{data.architectures.map((model, index) => <button role="tab" aria-selected={activeArchitecture === index} className={activeArchitecture === index ? "active" : ""} onClick={() => setActiveArchitecture(index)} key={model.name}><span>0{index + 1}</span>{model.name}</button>)}</div>
        <div className="architecture-grid">{data.architectures.map((model, modelIndex) => <article className={`architecture-card reveal ${activeArchitecture === modelIndex ? "is-active" : "is-muted"}`} style={{ "--delay": `${modelIndex * 120}ms` } as CSSProperties} key={model.name} onClick={() => setActiveArchitecture(modelIndex)}>
          <header><div><small>{t(model.badge)}</small><h3>{model.name}</h3></div><strong>{model.trainablePct}</strong></header>
          <div className="param-strip"><span>{lang === "fa" ? "کل پارامتر" : "Total"}<b>{model.params}</b></span><span>{lang === "fa" ? "قابل‌آموزش" : "Trainable"}<b>{model.trainable}</b></span></div>
          <div className="layer-flow">{model.layers.map((layer, index) => <div className="layer-step" key={layer.en}><span>{String(index + 1).padStart(2,"0")}</span><strong>{t(layer)}</strong>{index < model.layers.length - 1 && <i />}</div>)}</div>
          <div className="trick-list">{model.tricks.map(trick => <span key={trick.en}>{t(trick)}</span>)}</div>
        </article>)}</div>
      </div>
    </section>}

    {data.tables && <section className="deck-section table-section" id="tables">
      <div className="section-intro reveal"><span>{data.architectures ? "03" : "02"}</span><div><small>{lang === "fa" ? "خروجی‌های جدولی" : "Notebook tables"}</small><h2>{lang === "fa" ? "اعدادی که داستان داده را کامل می‌کنند" : "The numbers behind the story"}</h2></div></div>
      <div className="table-grid">{data.tables.map((table, index) => <article className="data-table-card reveal" style={{ "--delay": `${index * 100}ms` } as CSSProperties} key={table.title.en}>
        <header><div><h3>{t(table.title)}</h3><p>{t(table.description)}</p></div><small>{table.source}</small></header>
        <div className="table-scroll"><table><thead><tr>{table.columns.map((column, columnIndex) => <th key={column.en}><button onClick={() => sortTable(index, columnIndex)}>{t(column)}<span aria-hidden="true">{tableSort[index]?.column === columnIndex ? (tableSort[index].ascending ? "↑" : "↓") : "↕"}</span></button></th>)}</tr></thead><tbody>{sortedRows(table,index).map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>
      </article>)}</div>
    </section>}

    {data.groups.length > 0 && <section className="deck-section visual-section" id="visuals">
      <div className="section-intro reveal"><span>{data.architectures ? "04" : data.tables ? "03" : "02"}</span><div><small>{lang === "fa" ? "خروجی‌های واقعی" : "Real outputs"}</small><h2>{lang === "fa" ? "نمودارها و تصاویر notebookها" : "Notebook charts and images"}</h2></div></div>
      {data.groups.map(group => <div className="visual-group" key={group.title.en}>
        <div className="group-heading reveal"><h3>{t(group.title)}</h3><p>{t(group.description)}</p></div>
        <div className="visual-grid">{group.visuals.map((visual, index) => <button className="visual-card reveal" style={{ "--delay": `${(index % 2) * 100}ms` } as CSSProperties} key={visual.src} onClick={() => setActiveImage(visual)}>
          <div className="visual-frame"><img src={visual.src} alt={t(visual.title)} loading="lazy" /></div>
          <div><small>{visual.source}</small><strong>{t(visual.title)}</strong><span>{lang === "fa" ? "نمایش بزرگ‌تر ↗" : "Open larger ↗"}</span></div>
        </button>)}</div>
      </div>)}
    </section>}

    <section className="deck-section takeaway reveal" id="summary"><span>{String(takeawayStep).padStart(2,"0")}</span><div><small>{lang === "fa" ? "نتیجهٔ این بخش" : "Part takeaway"}</small><h2>{t(data.takeaway)}</h2></div></section>
    <footer><span>Amazon Review Sentiment Analysis</span><span>{data.part} / 04</span></footer>

    {activeImage && <div className="image-modal" role="dialog" aria-modal="true" onClick={() => setActiveImage(null)}><button aria-label="Close">×</button><figure onClick={event => event.stopPropagation()}><img src={activeImage.src} alt={t(activeImage.title)} /><figcaption><strong>{t(activeImage.title)}</strong><small>{activeImage.source}</small></figcaption></figure></div>}
  </main>;
}
