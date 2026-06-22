# RoastMyResume AI

Production-ready static SaaS demo for building, analyzing, roasting, improving, and exporting ATS-friendly resumes.

## Architecture

- `index.html`: landing page and product positioning.
- `builder.html`: resume builder with auto-save, templates, live preview, PDF/TXT export.
- `analyzer.html`: upload/paste resume analysis, ATS score, keyword gaps, rewrites, JD matcher, industry comparison.
- `roast.html`: constructive AI roast center with fallback local roast engine.
- `dashboard.html`: score KPIs, radar chart, trend chart, and latest recommendations.
- `settings.html`: local Gemini API key and model preferences.
- `css/`: shared SaaS design system plus page-specific styles.
- `js/`: storage, ATS analysis, Gemini integration, parsing, charts, page controllers.

## Storage Design

The application uses browser Local Storage:

- `rmr_resume_v1`: resume builder draft and selected template.
- `rmr_analysis_v1`: latest ATS analysis result.
- `rmr_settings_v1`: optional Gemini key, model, and feedback tone.
- `rmr_trend_v1`: latest score history for dashboard charts.

No backend is required for the current version.

## ATS Scoring Logic

The scoring engine evaluates:

- Formatting score from standard section coverage and resume length.
- Skills score from technical keyword coverage.
- Experience score from action verbs and measurable outcomes.
- Project score from project presence, technologies, and metrics.
- Keyword match score from job description overlap or general ATS keywords.
- Readability score from sentence length and vague phrases.

The final score is a weighted aggregate out of 100.

## Gemini Integration

Add a Gemini API key in `settings.html`. The app calls:

`https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`

If no key is configured, the product still works with local heuristic analysis and local roast generation.

## Resume Parsing Workflow

- PDF parsing uses PDF.js.
- DOCX parsing uses Mammoth.js.
- TXT files use the browser File API.
- Parsed text is editable before analysis.

## Export Workflow

- PDF export uses html2pdf.js from the builder preview.
- TXT export uses a generated Blob from structured resume content.

## UI Wireframes

```text
Landing
[Nav] [Hero copy + CTA] [Live analytics preview]
[Feature cards] [Rewrite demo] [Testimonials]

Builder
[Nav]
[Template + Section Tabs + Form Fields] [ATS Resume Preview]
[TXT Export] [PDF Export]

Analyzer
[Upload/Paste/JD Input] [Score Chart + Breakdown]
[Strengths] [Weaknesses] [Missing Keywords]
[Before/After Rewrites] [Industry Comparison]

Roast Center
[Roast Level + Resume Text] [Typed Roast Output + Fixes]

Dashboard
[KPI Cards]
[Trend Chart] [Radar Chart]
[Recommendations]
```

## Component Breakdown

- Navigation shell
- Resume editor fields
- Resume preview renderer
- Upload parser
- ATS score card
- Breakdown progress rows
- Insight cards
- Rewrite comparison cards
- Roast generator
- Dashboard KPI cards
- Chart.js visualizations
- Settings form

## Deployment Guide for Vercel

1. Push this folder to a Git repository.
2. Import the repository in Vercel.
3. Use framework preset `Other`.
4. Set output directory to the project root if prompted.
5. Deploy.

Because this is a static app, no build command is required.

## Notes for Production Hardening

- Move Gemini calls behind a serverless API route before using shared or paid keys.
- Add authentication if user histories should sync across devices.
- Add server-side file sanitization for production uploads.
- Replace CDN scripts with pinned bundled dependencies for stricter supply-chain control.
