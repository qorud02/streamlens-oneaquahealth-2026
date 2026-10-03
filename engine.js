export const VERSION = 'streamlens-1.0';
export const DEFAULT_POLICY = {doReviewBelow: 5, phReviewLow: 6.5, phReviewHigh: 9, duplicateMinutes: 60};
export function validatePolicy(input) {
  const p = Object.fromEntries(Object.keys(DEFAULT_POLICY).map(k=>[k,Number(input?.[k] ?? DEFAULT_POLICY[k])]));
  if (!Object.values(p).every(Number.isFinite) || p.doReviewBelow<0 || p.doReviewBelow>25 || p.phReviewLow<0 || p.phReviewHigh>14 || p.phReviewLow>=p.phReviewHigh || !Number.isInteger(p.duplicateMinutes) || p.duplicateMinutes<1 || p.duplicateMinutes>180) throw new Error('Use valid oxygen, pH and duplicate review triggers.');
  return p;
}
export const SOURCES = [
  {id:'OAH', title:'OneAquaHealth · Citizen science', url:'https://www.oneaquahealth.eu/citizen-science-project/', note:'Record visible conditions objectively; connect ecosystem observations with community action.'},
  {id:'EPA-V', title:'EPA · Volunteer Stream Monitoring', url:'https://www.epa.gov/sites/default/files/2015-04/documents/volunteer_stream_monitoring_a_methods_manual.pdf', note:'Visual appearances and odours need context. Foam and surface sheens can have natural causes.'},
  {id:'EPA-Q', title:'EPA · Participatory Science Quality Assurance', url:'https://www.epa.gov/participatory-science/quality-assurance-handbook-and-toolkit-participatory-science-projects', note:'Document methods and quality checks so data users can judge fitness for purpose.'},
  {id:'EPA-P', title:'EPA · Water Quality Parameter Factsheets', url:'https://www.epa.gov/awma/factsheets-water-quality-parameters', note:'Temperature, dissolved oxygen, pH, turbidity, habitat and biological indicators are complementary observations.'},
  {id:'USGS', title:'USGS · Dissolved Oxygen and Water', url:'https://www.usgs.gov/water-science-school/science/dissolved-oxygen-and-water', note:'Oxygen varies with temperature and time. Instrument calibration matters when interpreting readings.'}
];
export const numberOrNull = value => value === '' || value === null || value === undefined ? null : Number(value);
export function normalizeRecord(input) {
  return {...input, site: String(input.site ?? '').trim(), observer: String(input.observer ?? '').trim(),
    notes: String(input.notes ?? '').trim(), evidence: String(input.evidence ?? '').trim(),
    temperature: numberOrNull(input.temperature), dissolvedOxygen: numberOrNull(input.dissolvedOxygen),
    ph: numberOrNull(input.ph), turbidity: numberOrNull(input.turbidity),
    signs: Array.isArray(input.signs) ? [...new Set(input.signs)] : [],
    origin: input.origin === 'field' ? 'field' : 'synthetic', reviews: input.reviews ?? []};
}
export function validateRecord(input, now = Date.now()) {
  const r = normalizeRecord(input); const errors = {};
  if (r.site.length < 2 || r.site.length > 100) errors.site = 'Use a site name or code of 2–100 characters.';
  if (!r.observer || r.observer.length > 60) errors.observer = 'Add an observer alias (up to 60 characters).';
  const at = Date.parse(r.observedAt);
  if (!Number.isFinite(at)) errors.observedAt = 'Choose a valid observation date and time.';
  else if (at > now + 5*60*1000) errors.observedAt = 'Observation time cannot be in the future.';
  for (const [key,min,max] of [['temperature',-5,60],['dissolvedOxygen',0,25],['ph',0,14],['turbidity',0,5000]]) {
    if (r[key] !== null && (!Number.isFinite(r[key]) || r[key] < min || r[key] > max)) errors[key] = `Enter a number from ${min} to ${max}, or leave it blank.`;
  }
  if (!['clear','cloudy','brown','green','unknown'].includes(r.appearance)) errors.appearance = 'Choose a water appearance.';
  if (!['none','earthy','sewage','chemical','unknown'].includes(r.odor)) errors.odor = 'Choose an odour observation.';
  if (!['no','yes','unknown'].includes(r.rain)) errors.rain = 'Choose recent rain or unknown.';
  if (!['visual','strip','meter','none'].includes(r.method)) errors.method = 'Choose the method used.';
  const numeric = ['temperature','dissolvedOxygen','ph','turbidity'].some(k=>r[k]!==null);
  if (numeric && ['none','visual'].includes(r.method)) errors.method = 'Measurements need an instrument or test-strip method.';
  if (r.notes.length < 12 || r.notes.length > 1500) errors.notes = 'Add 12–1,500 characters describing what you saw.';
  if (r.evidence.length > 300) errors.evidence = 'Keep the evidence reference under 300 characters.';
  if (r.instrument !== undefined && (typeof r.instrument!=='string' || r.instrument.length>120)) errors.instrument='Keep the instrument reference under 120 characters.';
  if (!r.signs.every(s=>['foam','sheen','distress','discharge'].includes(s))) errors.signs='Choose supported observation signs.';
  if (!['unknown','yes','no'].includes(r.calibration)) errors.calibration='Choose a documented instrument-check status.';
  if (!['open','follow-up','revisit','resolved','duplicate'].includes(r.status)) errors.status='Use a supported review state.';
  if (!Array.isArray(r.reviews) || r.reviews.length>500 || r.reviews.some(v=>!v || !['follow-up','revisit','resolved','duplicate','reopened'].includes(v.action) || typeof v.reviewer!=='string' || !v.reviewer.trim() || v.reviewer.length>60 || typeof v.note!=='string' || v.note.trim().length<8 || v.note.length>1500 || !Number.isFinite(Date.parse(v.at)))) errors.reviews='Review history must contain valid attributed, dated decisions.';
  return {record:r, errors, valid:Object.keys(errors).length===0};
}
export function duplicateCandidates(r, records, policy = DEFAULT_POLICY) {
  const at = Date.parse(r.observedAt);
  if (!Number.isFinite(at)) return [];
  return records.filter(x=>x.id!==r.id && x.origin===r.origin && x.site.trim().toLowerCase()===r.site.trim().toLowerCase()
    && x.observer.trim().toLowerCase()===r.observer.trim().toLowerCase()
    && Math.abs(Date.parse(x.observedAt)-at)<=policy.duplicateMinutes*60000);
}
export function assessRecord(input, records = [], policy = DEFAULT_POLICY) {
  const r=normalizeRecord(input); const reasons=[], gaps=[]; let priority=0;
  const reason=(code,title,detail,level,source)=>{reasons.push({code,title,detail,level,source});priority=Math.max(priority,level);};
  if (r.signs.includes('distress')) reason('distress','Aquatic-life distress reported','A person should promptly check the report and decide the appropriate local response. Observe from a safe bank.',2,'EPA-V');
  if (r.signs.includes('discharge')) reason('discharge','Active discharge reported','Confirm the location, appearance and timing with a trained reviewer. The source and contents are unverified.',2,'OAH');
  if (r.signs.includes('sheen')) reason('sheen','Surface sheen needs context','Some surface sheens occur naturally. Document colour and extent; ask a reviewer to interpret the observation.',1,'EPA-V');
  if (r.signs.includes('foam')) reason('foam','Foam needs context','Record persistence, amount and nearby conditions. Appearance alone does not establish a cause.',1,'EPA-V');
  if (r.odor==='sewage'||r.odor==='chemical') reason('odor','Unusual odour reported','Review the visual report and plan a safe follow-up. Do not approach or deliberately smell an unknown discharge.',1,'EPA-V');
  if (r.appearance!=='clear' && r.appearance!=='unknown') reason('appearance',r.rain==='yes'?'Recent rain changes the interpretation':'Changed water appearance','Compare with earlier observations at the same site and record rain, flow and land-use context.',1,'OAH');
  const measured = ['temperature','dissolvedOxygen','ph','turbidity'].filter(k=>r[k]!==null);
  if (r.dissolvedOxygen!==null && r.dissolvedOxygen<policy.doReviewBelow) reason('do','Oxygen reading crosses the review trigger',`${r.dissolvedOxygen} mg/L is below this workspace’s ${policy.doReviewBelow} mg/L trigger. Verify method, calibration, temperature and sampling time.`,2,'USGS');
  if (r.ph!==null && (r.ph<policy.phReviewLow || r.ph>policy.phReviewHigh)) reason('ph','pH reading crosses the review trigger',`${r.ph} is outside this workspace’s ${policy.phReviewLow}–${policy.phReviewHigh} trigger interval. Repeat with a documented method.`,1,'EPA-P');
  if (!r.evidence && !r.photo) gaps.push('Add an evidence reference or photo.');
  if (r.appearance==='unknown') gaps.push('Water appearance is unknown.');
  if (r.odor==='unknown') gaps.push('Odour is unknown; do not approach to check it.');
  if (r.rain==='unknown') gaps.push('Recent rain context is unknown.');
  if (measured.length && r.calibration!=='yes') gaps.push('Instrument check or calibration is undocumented.');
  if (measured.length && !r.instrument?.trim()) gaps.push('Instrument or kit identifier is missing.');
  const duplicates = duplicateCandidates(r, records, policy).map(x=>x.id);
  if (duplicates.length) gaps.push('Possible repeated entry: a reviewer should compare records.');
  const points = [r.site?15:0, Number.isFinite(Date.parse(r.observedAt))?15:0,r.observer?10:0,
    r.notes.length>=12?15:0,r.appearance!=='unknown'?10:0,r.odor!=='unknown'?10:0,r.rain!=='unknown'?10:0,
    r.evidence||r.photo?15:0];
  let completeness=points.reduce((a,b)=>a+b,0);
  if (measured.length && (r.calibration!=='yes'||!r.instrument?.trim())) completeness=Math.max(0,completeness-15);
  if (!reasons.length) reasons.push({code:'routine',title:'Record ready for routine review',detail:'Retain the observation and compare with later visits. A quiet record does not establish water safety.',level:0,source:'EPA-Q'});
  return {priority, label:['Routine review','Verify context','Priority review'][priority], reasons,gaps,duplicates,completeness,policyVersion:VERSION};
}
export function applyReview(record, action, reviewer, note, at = new Date().toISOString(), duplicateOf='') {
  if (!['follow-up','revisit','resolved','duplicate','reopened'].includes(action)) throw new Error('Choose a valid review action.');
  if (!reviewer.trim() || reviewer.length>60 || note.trim().length<8 || note.length>1500 || !Number.isFinite(Date.parse(at))) throw new Error('Add a reviewer alias and a note of 8–1,500 characters.');
  if (action==='duplicate' && (!duplicateOf || duplicateOf===record.id)) throw new Error('Select the other record before marking a duplicate.');
  return {...record, status:action==='reopened'?'open':action, duplicateOf:action==='duplicate'?duplicateOf:(record.duplicateOf??''),
    reviews:[...(record.reviews??[]),{action,reviewer:reviewer.trim(),note:note.trim(),at,duplicateOf:action==='duplicate'?duplicateOf:''}]};
}
const csvCell = v => {let s=String(v??''); if (/^[=+\-@\t\r]/.test(s)) s="'"+s; return '"'+s.replaceAll('"','""')+'"';};
export function toCsv(records, policy=DEFAULT_POLICY) {
  const columns=['id','origin','site','observedAt','observer','appearance','odor','rain','signs','temperature_C','dissolvedOxygen_mg_L','pH','turbidity_NTU','method','instrument','calibration','notes','evidence','priority','documentationCompleteness','status','duplicateOf','latestReviewer','latestReviewNote'];
  const rows=records.map(r=>{const a=assessRecord(r,records,policy);const last=r.reviews?.at(-1);return [r.id,r.origin,r.site,r.observedAt,r.observer,r.appearance,r.odor,r.rain,r.signs.join(';'),r.temperature,r.dissolvedOxygen,r.ph,r.turbidity,r.method,r.instrument,r.calibration,r.notes,r.evidence,a.label,a.completeness,r.status,r.duplicateOf,last?.reviewer,last?.note].map(csvCell).join(',');});
  return '\uFEFF'+columns.map(csvCell).join(',')+'\r\n'+rows.join('\r\n');
}
export function exportBundle(records, policy=DEFAULT_POLICY, at=new Date().toISOString()) {
  return {schema:'https://streamlens.local/schema/observations-v1',schemaVersion:1,application:VERSION,exportedAt:at,
    dataset:records.every(x=>x.origin==='synthetic')?'synthetic training scenarios':records.every(x=>x.origin==='field')?'user-entered field observations':'mixed; inspect origin per record',
    policy:{...policy,description:'Workspace review triggers; not statutory thresholds or a validated ecological classification.'},sources:SOURCES,
    observations:records.map(original=>{const {photo,...r}=original;return {...r,photoIncluded:false,photoAvailable:Boolean(photo),assessment:assessRecord(original,records,policy)};})};
}
export function validateImport(bundle, now=Date.now()) {
  if (bundle?.schemaVersion!==1 || !Array.isArray(bundle.observations) || bundle.observations.length>500) throw new Error('Use a StreamLens v1 export with up to 500 observations.');
  const ids=new Set(); return bundle.observations.map(r=>{const {assessment,photoAvailable,photoIncluded,photo,...raw}=r;const x=validateRecord(raw,now);if (!x.valid || typeof raw.id!=='string' || !/^[A-Za-z0-9_-]{1,80}$/.test(raw.id) || ids.has(raw.id)) throw new Error('The import contains invalid observations or repeated IDs. No records were changed.');ids.add(raw.id);return x.record;});
}
