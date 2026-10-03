const make=(id,site,at,extra={})=>({id,origin:'synthetic',site,observedAt:`2026-10-${at}`,observer:'Observer A',appearance:'clear',odor:'none',rain:'no',signs:[],temperature:null,dissolvedOxygen:null,ph:null,turbidity:null,method:'visual',calibration:'unknown',instrument:'',notes:'Water clear from the footpath. Vegetated bank and steady movement.',evidence:`Training scenario ${id}; no field sampling performed.`,status:'open',reviews:[],...extra});
export const SITE_NAMES=['Cedar Steps','Mill Footbridge','Reed Bend','Old Weir','Willow Walk'];
export const TRAINING_RECORDS=[
  make('SL-001','Cedar Steps','01T08:10:00+09:00',{temperature:18.2,dissolvedOxygen:8.1,ph:7.4,method:'meter',calibration:'yes',instrument:'Training meter T-01'}),
  make('SL-002','Mill Footbridge','01T09:20:00+09:00',{appearance:'cloudy',rain:'yes',notes:'Brown cloudiness after overnight rain; muddy bank, no distinct odour.'}),
  make('SL-003','Reed Bend','01T10:00:00+09:00',{signs:['sheen'],notes:'Small iridescent patch beside leaves at the edge. Cause unknown.'}),
  make('SL-004','Old Weir','01T11:15:00+09:00',{signs:['discharge'],odor:'chemical',appearance:'cloudy',notes:'A side pipe releases cloudy water. Observed from the public walkway.'}),
  make('SL-005','Willow Walk','01T12:40:00+09:00',{observer:'Observer B'}),
  make('SL-006','Cedar Steps','02T08:05:00+09:00',{temperature:19.5,dissolvedOxygen:7.6,ph:7.3,method:'meter',calibration:'yes',instrument:'Training meter T-01'}),
  make('SL-007','Mill Footbridge','02T09:20:00+09:00',{rain:'unknown',appearance:'cloudy',evidence:'',notes:'Cloudiness remains visible. Rain information and evidence reference missing.'}),
  make('SL-008','Reed Bend','02T10:05:00+09:00',{signs:['foam'],notes:'Patch of foam beside the reeds; size and persistence need a repeat visit.'}),
  make('SL-009','Old Weir','02T11:10:00+09:00',{dissolvedOxygen:3.2,temperature:23.8,method:'meter',calibration:'unknown',instrument:'Training meter T-02',notes:'One low oxygen reading; calibration log unavailable. Repeat measurement needed.'}),
  make('SL-010','Willow Walk','02T12:30:00+09:00',{observer:'Observer B',status:'resolved',reviews:[{action:'resolved',reviewer:'Training reviewer',note:'Retain as a baseline observation; scenario reviewed for training.',at:'2026-10-02T14:00:00+09:00'}]}),
  make('SL-011','Cedar Steps','03T08:10:00+09:00',{temperature:20.1,dissolvedOxygen:7.2,ph:7.2,method:'meter',calibration:'yes',instrument:'Training meter T-01'}),
  make('SL-012','Mill Footbridge','03T09:20:00+09:00',{appearance:'brown',rain:'yes',notes:'Brown water after rain; the view is partly obscured by the bridge.'}),
  make('SL-013','Mill Footbridge','03T09:32:00+09:00',{appearance:'brown',rain:'yes',notes:'Second entry from the same visit. Compare before counting it twice.'}),
  make('SL-014','Reed Bend','03T10:10:00+09:00',{signs:['distress'],notes:'Fish appear to gather at the surface. Reviewer should check this report.'}),
  make('SL-015','Old Weir','03T11:25:00+09:00',{dissolvedOxygen:4.1,temperature:24.5,ph:9.3,method:'meter',calibration:'yes',instrument:'Training meter T-02',notes:'Follow-up training measurement recorded with method details.'}),
  make('SL-016','Willow Walk','03T12:15:00+09:00',{observer:'Observer B',appearance:'unknown',odor:'unknown',rain:'unknown',evidence:'',notes:'View blocked by a closed footpath. Return when the safe route reopens.'})
];
