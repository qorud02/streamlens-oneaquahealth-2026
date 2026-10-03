# StreamLens

An offline-first citizen stream observation desk, built for the OneAquaHealth IEEE Hackathon: **Citizen Science UX** and **Data to Insight**.

StreamLens turns a visit into a traceable observation, separates documentation gaps from review urgency, and gives a person the final review decision. It runs entirely in the browser without an account, API key, paid service or external map.

## Live prototype and demonstration

- [Use StreamLens](https://qorud02.github.io/streamlens-oneaquahealth-2026/)
- [Watch the 4-minute 49-second demonstration](https://share.descript.com/view/KJh8WX2qWAw)

The video combines captured interface screens with execution of the actual review, export and import functions. It uses synthetic example observations.

## Run

Node.js 20 or later is sufficient. There are no package dependencies.

```sh
npm start
# Open http://127.0.0.1:8765

npm test
```

Any static web server can serve this directory. HTTPS or localhost enables service-worker caching. Opening index.html as a file is unsuitable for ES modules. Static hosting needs no build command; publish this directory. After one successful online visit, the cached app shell can reopen without a network connection.

## Try the complete workflow

1. Explore the 16 synthetic example observations. The five site names and every seed reading are fictional.
2. Open SL-014 to inspect an aquatic-life distress report. Its review priority remains visible even when documentation is incomplete.
3. Compare SL-012 and SL-013: the same observer at the same site within an hour is a potential repeated entry. A different observer remains independent evidence.
4. Add an observation, leave unmeasured numeric fields blank, and inspect the explanation before selecting a review action.
5. Record a reviewer alias and a reason. Reopen an observation to see the preserved decision history.
6. Choose **Data & method**, export JSON or CSV, then inspect the origins, units and source references. Importing adds new IDs and retains existing records.

## Implemented

- Guided capture with objective visual observations, rain context, instrument method, calibration reference and optional resized local photo.
- Input validation, local draft autosave and persistent browser workspace.
- Explainable rule-based review priorities; documentation completeness is a separate checklist.
- Candidate duplicate detection that never deletes or merges automatically.
- Attributed human decisions and chronological review history.
- Review queue, original schematic reach diagram and repeated-visit oxygen chart.
- Configurable review triggers with input bounds and visible provenance.
- JSON export with full review history and method references; spreadsheet-safe UTF-8 CSV with explicit measurement units.
- Transactional JSON validation, a 500-record workspace limit, defensive text rendering and no external runtime dependencies.
- Responsive layouts, semantic controls, visible keyboard focus, skip link, live feedback and reduced-motion support.

## Data and interpretation

The initial dataset is constructed as example observations for demonstration. Every record carries `origin: synthetic`. A user can explicitly create `origin: field` observations; the app does not create real field measurements automatically. Neither the reach diagram nor the fictional station coordinates represent actual geography.

The engine organises human follow-up work. Its priority engine applies deterministic JavaScript rules. Its default oxygen and pH triggers are prototype workspace settings rather than regulatory thresholds or a validated ecological assessment. See [METHODS.md](METHODS.md) for the source mapping, design rationale and limitations.

No individual health, drinking-water, bathing-water or discharge-compliance decision is calculated. Biological context, instrument quality and programme-specific sampling protocols need trained interpretation.

## Privacy and portability

Observations and drafts stay in localStorage on the current browser profile. Optional photos are resized to a local JPEG copy and remain outside JSON/CSV exports; the JSON records whether a photo was attached. A resized photo has no original EXIF metadata. Do not enter contact details or sensitive locations into the notes. The app provides no cloud backup, account permissions or multi-user synchronisation. Export before changing browser profiles or clearing browser storage. If storage is unavailable or full, the app reports that changes only remain in the session.

Exports may contain observer aliases and site names. Review them before sharing. CSV neutralises cells beginning with spreadsheet formula characters. JSON imports validate schema, record IDs, measurements, timestamps and attributed review history before any change.

## Architecture and tests

- [architecture.svg](architecture.svg): application components and evidence lifecycle.
- [ARCHITECTURE.md](ARCHITECTURE.md): data contract, persistence and module responsibilities.
- `engine.js`: pure validation, triage, duplicate review, human review and export functions.
- `app.js`: browser UI and local workflow.
- `data.js`: synthetic demonstration scenarios.
- `sw.js`: local application-shell cache.
- `tests/engine.test.js`: 15 tests covering validation, duplicates, independent evidence, priority versus documentation, attribution, export injection, provenance and import integrity.

## Next steps

Pilot the observation form with a community monitoring group; measure completion time and inter-reviewer consistency. Agree local review triggers with that group's coordinator, attach versioned programme guidance, and validate any OneAquaHealth interoperability profile before an integration. Add explicit photo-backup and synchronisation choices after that pilot.

Created for the 2026 hackathon by Kyunghan Bae. Released under the MIT License.
