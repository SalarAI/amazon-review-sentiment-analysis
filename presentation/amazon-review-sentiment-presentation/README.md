# Amazon Review Sentiment Analysis — Interactive Presentation

An interactive bilingual presentation for the Amazon Review Sentiment Analysis project. It combines the project narrative, selected notebook tables, generated charts, model architectures, training techniques, and final results in a single responsive website.

این پوشه شامل ارائهٔ تعاملی و دوزبانهٔ پروژهٔ تحلیل نظرات آمازون است. ارائه، روند پروژه، جدول‌های منتخب notebookها، نمودارهای واقعی، معماری مدل‌ها، ترفندهای آموزش و نتایج نهایی را در یک وب‌سایت واکنش‌گرا نمایش می‌دهد.

## Presentation Sections / بخش‌های ارائه

| Part | Topic | توضیح |
|---|---|---|
| Part 1 | Exploratory Data Analysis | تحلیل توزیع امتیازها، طول نقدها، واژگان، برندها و کاربران |
| Part 2 | Warranty Satisfaction | استخراج رضایت از گارانتی با Word2Vec و شباهت معنایی |
| Part 3 | Transformer Models | مقایسهٔ RoBERTa LoRA، RoBERTa Full + Ordinal و DeBERTa-v3 LoRA |
| Part 4 | Bonus Rating Prediction | مقایسهٔ SVD، NCF و مدل ترکیبی NCF + TF-IDF |

## Features / امکانات

- Persian and English presentation modes with persistent language selection
- Real charts from `reports/` and saved notebook outputs, without duplicate visuals
- Selected notebook tables with sortable columns
- Interactive model architecture comparison for Parts 3 and 4
- Animated layer flows, scroll reveals, and presentation-friendly transitions
- Fullscreen presentation mode
- Click-to-expand charts and images
- Responsive layouts for desktop and mobile
- Reduced-motion support for accessibility

## Project Structure / ساختار

```text
amazon-review-sentiment-presentation/
├── app/
│   ├── presentations/       # Content and interactive sections for all four parts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
│   ├── presentation-styles/ # Presentation theme and responsive styles
│   └── project-assets/      # Report images and extracted notebook outputs
├── scripts/                 # Sites build and validation helpers
├── .openai/hosting.json
├── package.json
└── vite.config.ts
```

## Run Locally / اجرای محلی

Requirements:

- Node.js 22.13 or newer
- npm

Install dependencies:

```bash
npm ci
```

Linux or macOS:

```bash
npm run dev
```

Windows PowerShell:

```powershell
npx vite
```

Then open the local URL printed by Vite. Individual sections can also be opened directly:

```text
/?page=part1
/?page=part2
/?page=part3
/?page=part4
```

## Build / ساخت نسخه نهایی

Linux or macOS:

```bash
npm run build
```

Windows PowerShell:

```powershell
npx vite build
```

The presentation uses Vinext and Vite and produces a Cloudflare Worker-compatible build.

## Data and Result Sources / منابع داده و نتایج

The presentation content is derived from the repository notebooks and report artifacts. Source labels are displayed beside charts and tables so each result can be traced back to its notebook or exported report.

محتوای ارائه مستقیماً از notebookها و خروجی‌های پوشهٔ `reports` تهیه شده است. کنار نمودارها و جدول‌ها، نام منبع نمایش داده می‌شود تا هر نتیجه به بخش متناظر پروژه قابل ارجاع باشد.
