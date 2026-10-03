# Observation method and review rules

## Purpose

Citizen observations often arrive as isolated photographs or notes. StreamLens preserves what was seen, when and by whom, asks for missing context, and makes the next human review action inspectable. It addresses OneAquaHealth's citizen-science UX and data-to-insight tracks.

## Official references

| Source | What informed the implementation |
|---|---|
| [OneAquaHealth citizen-science project](https://www.oneaquahealth.eu/citizen-science-project/) | Objective observations of appearance, wildlife and surrounding conditions; accessible participation and a connection between ecosystem conditions and community action. |
| [EPA Volunteer Stream Monitoring: A Methods Manual](https://www.epa.gov/sites/default/files/2015-04/documents/volunteer_stream_monitoring_a_methods_manual.pdf) | Visual stream surveys, contextual interpretation of foam and sheens, recorded methods and safe monitoring procedures. |
| [EPA Participatory Science Quality Assurance Handbook and Toolkit](https://www.epa.gov/participatory-science/quality-assurance-handbook-and-toolkit-participatory-science-projects) | Fitness for purpose, documented methods, quality checks and records that another person can examine. |
| [EPA Water Quality Parameter Factsheets](https://www.epa.gov/awma/factsheets-water-quality-parameters) | Complementary observation of oxygen, temperature, pH, turbidity, habitat and biology. |
| [USGS Dissolved Oxygen and Water](https://www.usgs.gov/water-science-school/science/dissolved-oxygen-and-water) | Oxygen varies with temperature and time; measurement quality and calibration affect interpretation. |

Accessed 3 October 2026. The source links explain the monitoring principles. The application's numerical review triggers and checklist weights are implementation choices, not values adopted from those publications.

## Two independent questions

**What should a reviewer look at next?** Review priority ranges from routine to verify-context to priority-review. The highest relevant rule wins. Aquatic-life distress, active discharge and an oxygen reading below the workspace trigger receive priority. Foam, sheen, unusual odour, changed appearance and pH outside the workspace interval receive contextual review. Each rule has a readable reason and source link.

**What information is still missing?** Documentation completeness is a transparent checklist: site 15, time 15, observer alias 10, notes 15, appearance 10, odour 10, rain 10, evidence reference or photo 15. When measurements exist, undocumented instrument checks or identifiers subtract 15. A complete checklist is not a probability of correctness. Incomplete documentation never suppresses an urgent report.

## Numerical choices

Default review settings: oxygen below 5 mg/L; pH below 6.5 or above 9; same-visit comparison within 60 minutes. These merely decide which records to inspect first in the prototype. A monitoring coordinator must choose and document settings appropriate to a real programme. The app records the settings in exports and never changes raw measurements when settings change.

Input plausibility bounds reject unsupported numbers: temperature −5 to 60 °C, oxygen 0 to 25 mg/L, pH 0 to 14, turbidity 0 to 5,000 NTU. These are broad form bounds, not acceptable-water ranges. Measurements require a meter or test-kit method. Empty measurements remain null. NTU cannot be estimated from water colour.

## Repeated visits and human review

Same origin, site name and observer alias within the configured window are flagged for comparison. This conservative check finds likely repeated entries while preserving different observers as independent reports. It cannot detect differing aliases or misspelled sites. A person explicitly selects the matching ID, gives a reason and retains both raw records.

Review actions are follow-up, revisit, archive, duplicate and reopen. Every action requires an alias, note and timestamp. The latest state is stored alongside an append-only history. This is local workflow attribution; it is not identity verification or a tamper-proof audit log.

## Synthetic scenario coverage

All 16 initial entries use fictional sites and constructed readings. They include ordinary visits, changing oxygen readings, rain-associated colour changes, ambiguous sheen and foam, low oxygen with undocumented calibration, discharge and aquatic-life distress reports, a repeated entry and a view with missing context. The only pre-existing review is labelled Training reviewer. No field sampling, user study, ecological validation or measured public-health outcome was performed for this dataset.

## Interoperability

CSV includes explicit units and record origins. JSON contains raw records, methods, rule settings, derived explanations and complete review history. Photos stay local. A downstream user can recompute the rules from `engine.js` and compare the exported version and settings. FHIR is not emitted: an observation profile, terminology and units must be agreed and tested with OneAquaHealth before claiming conformance.
