"use client";

import { useEffect, useState } from "react";
import Part1 from "./presentations/ExplorationPresentation";
import Part2 from "./presentations/PreparationPresentation";
import Part3 from "./presentations/BackbonePresentation";
import Part4 from "./presentations/BonusPresentation";

const pages = [
  { id: "part1", title: "Part 1 · EDA", Component: Part1 },
  { id: "part2", title: "Part 2 · Satisfaction", Component: Part2 },
  { id: "part3", title: "Part 3 · Transformers", Component: Part3 },
  { id: "part4", title: "Part 4 · Bonus", Component: Part4 },
] as const;

function indexFromUrl() {
  if (typeof window === "undefined") return 0;
  const id = new URLSearchParams(location.search).get("page");
  const index = pages.findIndex(page => page.id === id);
  return index < 0 ? 0 : index;
}

export default function Home() {
  const [current, setCurrent] = useState(0);
  const Page = pages[current].Component;

  useEffect(() => { const sync = () => setCurrent(indexFromUrl()); sync(); addEventListener("popstate", sync); return () => removeEventListener("popstate", sync); }, []);
  useEffect(() => { scrollTo(0, 0); document.title = `${pages[current].title} | Amazon Review Intelligence`; }, [current]);

  const navigate = (index: number) => {
    const url = new URL(location.href); url.searchParams.set("page", pages[index].id); url.hash = "";
    history.pushState({}, "", url); setCurrent(index);
  };

  return <><link rel="stylesheet" href="/presentation-styles/project.css?v=11" /><Page key={pages[current].id} />
    <nav className="page-switcher" aria-label="Presentation parts">
      {pages.map((page, index) => <button className={index === current ? "active" : ""} onClick={() => navigate(index)} key={page.id}><span>0{index + 1}</span><strong>{page.title}</strong></button>)}
    </nav>
  </>;
}
