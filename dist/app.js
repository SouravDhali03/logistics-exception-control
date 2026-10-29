let exceptions=[
 {id:'EXC-2481',p:'P1',title:'Port congestion threatens delivery',route:'Rotterdam → Chicago',detail:'31h predicted delay · $42k at risk',time:'2m',owner:'You',uncertainty:'Likely · 82%'},
 {id:'EXC-2479',p:'P2',title:'Temperature excursion detected',route:'Singapore → Frankfurt',detail:'8.4°C for 22 min · Pharma',time:'11m',owner:'Mina',uncertainty:'Confirmed'},
 {id:'EXC-2476',p:'P2',title:'Customs documents incomplete',route:'Dhaka → Toronto',detail:'Commercial invoice mismatch',time:'26m',owner:'You',uncertainty:'Possible · 64%'},
 {id:'EXC-2471',p:'P3',title:'Tracking signal stale',route:'Shenzhen → Long Beach',detail:'No carrier event for 9h',time:'1h',owner:'Unassigned',uncertainty:'Unknown'},
 {id:'EXC-2468',p:'P3',title:'Warehouse handoff delayed',route:'Hamburg → Prague',detail:'Pickup missed by 46 min',time:'2h',owner:'Nadia',uncertainty:'Likely · 71%'},
 {id:'EXC-2464',p:'P3',title:'Delivery appointment at risk',route:'Antwerp → Lyon',detail:'Driver hours limit approaching',time:'3h',owner:'You',uncertainty:'Possible · 58%'},
 {id:'EXC-2461',p:'P2',title:'Container release delayed',route:'Busan → Seattle',detail:'Customs release pending for 6h',time:'4h',owner:'Mina',uncertainty:'Possible · 61%'},
 {id:'EXC-2459',p:'P3',title:'Proof of delivery missing',route:'Paris → Madrid',detail:'Signed receipt not uploaded',time:'5h',owner:'Unassigned',uncertainty:'Unknown'},
 {id:'EXC-2458',p:'P2',title:'Carrier capacity reduced',route:'Los Angeles → Dallas',detail:'Two booked trailers cancelled',time:'6h',owner:'You',uncertainty:'Likely · 74%'},
 {id:'EXC-2456',p:'P3',title:'Temperature logger offline',route:'Osaka → Vancouver',detail:'No telemetry received for 3h',time:'7h',owner:'Nadia',uncertainty:'Possible · 55%'}
];
try { const saved=JSON.parse(localStorage.getItem('tiger-exceptions-v1')); if(Array.isArray(saved)&&saved.length) exceptions=[...saved,...exceptions.filter(item=>!saved.some(savedItem=>savedItem.id===item.id))]; } catch (_) {}
const evidence=[
 ['CR','Carrier event feed','Discharge estimate changed 14:20 → 09:15 (+19h)','Verified · 2m'],
 ['TM','Terminal milestone','Crane outage recorded at berth 4','Verified · 18m'],
 ['RL','Rail schedule','Original slot released; next open slot in 39h','Verified · 4m'],
 ['ET','ETA model','Predicted delivery variance: +31h (±6h)','AI estimate · 2m'],
 ['SL','SLA record','Delivery due Tue 16:00 local','Verified · 1d'],
 ['CS','Customer profile','Priority account · late-delivery penalty applies','Verified · 7d'],
 ['GT','Gate appointment','Confirmation pending from terminal','Missing']
];
const timeline=[
 ['14:22','Assessment updated','New carrier discharge estimate increased predicted delay to 31 hours.'],
 ['14:20','Carrier event received','Estimated discharge changed after terminal congestion update.'],
 ['14:14','Assigned to Sourav','P1 response timer started; acknowledgement recorded.'],
 ['14:12','Exception created','Three correlated signals merged into EXC-2481.'],
 ['14:11','Potential exception detected','ETA model crossed the customer SLA threshold.']
];
let audit=[
 ['14:22','AI assessment refreshed','model/eta-v4.2'],
 ['14:14','Coordinator acknowledged exception','user/sourav'],
 ['14:12','Exception record created','system/correlation'],
 ['14:11','Signal validation completed','policy/validation-v3']
];
let selectedAction='expedite';
let currentFilter='all';
let selectedId='EXC-2481';
let currentPage=1;
const pageSize=6;
let resolutionState={stage:'awaiting',action:null,verified:false};

const $=s=>document.querySelector(s)||{onclick:null,setAttribute(){},classList:{add(){},remove(){},toggle(){return false}}}, $$=s=>[...document.querySelectorAll(s)];
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const priorityLabel=p=>({P1:'Critical',P2:'High',P3:'Medium'}[p]||'Medium');
const transportMode=id=>({
 'EXC-2481':['ship','<i class="hgi-stroke hgi-ship" aria-hidden="true"></i>','Ocean freight'],
 'EXC-2479':['plane','<i class="hgi-stroke hgi-airplane-01" aria-hidden="true"></i>','Air freight'],
 'EXC-2476':['plane','<i class="hgi-stroke hgi-airplane-01" aria-hidden="true"></i>','Air freight'],
 'EXC-2471':['ship','<i class="hgi-stroke hgi-ship" aria-hidden="true"></i>','Ocean freight'],
 'EXC-2468':['truck','<i class="hgi-stroke hgi-truck" aria-hidden="true"></i>','Road freight'],
 'EXC-2464':['truck','<i class="hgi-stroke hgi-truck" aria-hidden="true"></i>','Road freight'],
 'EXC-2461':['ship','<i class="hgi-stroke hgi-ship" aria-hidden="true"></i>','Ocean freight'],
 'EXC-2459':['truck','<i class="hgi-stroke hgi-truck" aria-hidden="true"></i>','Road freight'],
 'EXC-2458':['truck','<i class="hgi-stroke hgi-truck" aria-hidden="true"></i>','Road freight'],
 'EXC-2456':['plane','<i class="hgi-stroke hgi-airplane-01" aria-hidden="true"></i>','Air freight']
}[id]||['truck','<i class="hgi-stroke hgi-truck" aria-hidden="true"></i>','Road freight']);
const sourceIconClass=code=>({CR:'hgi-activity-01',TM:'hgi-clock-01',RL:'hgi-arrow-right-01',ET:'hgi-ai-beautify',SL:'hgi-file-01',CS:'hgi-user-group',GT:'hgi-location-01',EV:'hgi-activity-01',AI:'hgi-ai-beautify'}[code]||'hgi-information-circle');
function saveCases(){try{localStorage.setItem('tiger-exceptions-v1',JSON.stringify(exceptions));}catch(_){toast('Could not save locally; this change lasts until the page closes.')}}
function applyPagination(){
 const rows=$$('#exception-list .exception-row');
 const totalPages=Math.max(1,Math.ceil(rows.length/pageSize));
 currentPage=Math.min(currentPage,totalPages);
 const start=(currentPage-1)*pageSize;
 rows.forEach((row,index)=>{row.hidden=index<start||index>=start+pageSize});
 const from=rows.length?start+1:0;
 const to=Math.min(start+pageSize,rows.length);
 $('#queue-pagination').innerHTML=rows.length?`<span class="queue-pagination-summary">${from}–${to} of ${rows.length} exceptions</span><span class="queue-pagination-controls"><button class="pagination-btn" data-page="${currentPage-1}" aria-label="Previous page" ${currentPage===1?'disabled':''}><i class="hgi-stroke hgi-arrow-left-01" aria-hidden="true"></i></button>${Array.from({length:totalPages},(_,i)=>`<button class="pagination-btn ${i+1===currentPage?'active':''}" data-page="${i+1}" aria-label="Page ${i+1}">${i+1}</button>`).join('')}<button class="pagination-btn" data-page="${currentPage+1}" aria-label="Next page" ${currentPage===totalPages?'disabled':''}><i class="hgi-stroke hgi-arrow-right-01" aria-hidden="true"></i></button></span>`:'';
}
function renderExceptions(){
 const visible=exceptions.filter(e=>currentFilter==='all'||(currentFilter==='critical'&&e.p==='P1')||(currentFilter==='mine'&&e.owner==='You')).sort((a,b)=>a.p.localeCompare(b.p));
 if(visible.length&&!visible.some(e=>e.id===selectedId)) selectedId=visible[0].id;
 $('#exception-list').innerHTML=visible.length?`<div class="exception-table" role="table" aria-label="Prioritized exceptions"><div class="exception-table-head" role="row"><span>ID</span><span>Priority</span><span>Exception</span><span>Route</span><span>Impact</span><span>Confidence</span><span>Owner</span><span>Actions</span></div>${visible.map(e=>{const places=e.route.split(' → '),mode=transportMode(e.id);return `<button class="exception-row ${e.id===selectedId?'active':''}" role="row" data-id="${escapeHtml(e.id)}"><span class="id-cell">${escapeHtml(e.id)}</span><span class="priority ${e.p.toLowerCase()}"><span class="priority-dot"></span>${e.p} · ${priorityLabel(e.p)}</span><span class="exception-name"><strong>${escapeHtml(e.title)}</strong></span><span class="route-journey"><span class="mode-icon ${mode[0]}" title="${mode[2]}">${mode[1]}</span><span class="route-stops"><span class="route-stop route-origin"><i class="stop-marker" aria-hidden="true"></i>${escapeHtml(places[0]||e.route)}</span><span class="route-stop route-destination"><i class="stop-marker" aria-hidden="true"></i>${escapeHtml(places[1]||'—')}</span></span></span><span class="impact-cell">${escapeHtml(e.detail)}</span><span class="uncertainty-cell">${escapeHtml(e.uncertainty)}</span><span class="owner-cell">${escapeHtml(e.owner)}</span><span class="row-action" aria-label="More actions"><i class="hgi-stroke hgi-more-horizontal" aria-hidden="true"></i></span></button>`}).join('')}</div>`:'<p class="empty-queue">No exceptions match this filter.</p>';
 $$('.exception-row').forEach(btn=>btn.onclick=()=>selectException(btn.dataset.id,true));
 const counts={all:exceptions.length,critical:exceptions.filter(e=>e.p==='P1').length,mine:exceptions.filter(e=>e.owner==='You').length};
 $$('.chip').forEach(b=>{b.textContent=({all:'All',critical:'Critical',mine:'Mine'}[b.dataset.filter])+' '+counts[b.dataset.filter]});
 $$('.filter-option').forEach(b=>{b.querySelector('b').textContent=counts[b.dataset.filter]});
 $('#open-count').textContent=counts.all; $('#critical-count').textContent=counts.critical; $('.nav-item[data-view="inbox"] .nav-count').textContent=counts.all;
 applyPagination();
 if(visible.length)selectException(selectedId,false);
}
function setFilter(filter){
 currentFilter=filter;
 currentPage=1;
 $$('.chip').forEach(button=>button.classList.toggle('active',button.dataset.filter===filter));
 $$('.filter-option').forEach(button=>button.classList.toggle('active',button.dataset.filter===filter));
 renderExceptions();
 const popover=$('#filter-popover');
 popover.classList.add('hidden');
 $('#filter-toggle').setAttribute('aria-expanded','false');
 toast(`Showing ${$('#exception-list').querySelectorAll('.exception-item').length} exceptions`);
}
function selectException(id,openDrawer=true){
 const e=exceptions.find(x=>x.id===id); if(!e)return; selectedId=id; $$('.exception-item').forEach(x=>x.classList.toggle('active',x.dataset.id===id));
 $$('.exception-row').forEach(x=>x.classList.toggle('active',x.dataset.id===id));
 if(openDrawer){
  document.body.classList.add('drawer-open');
  document.documentElement.classList.add('drawer-open');
 }
 const sample=id==='EXC-2481';
 $('#case-title').textContent=e.title; $('#case-meta').innerHTML=`${escapeHtml(e.id)} · ${escapeHtml(e.route)} <button class="meta-copy" id="copy-meta" aria-label="Copy exception details" title="Copy exception details"><i class="hgi-stroke hgi-copy-01" aria-hidden="true"></i></button>`; $('#priority-badge').textContent=`${e.p} ${priorityLabel(e.p)}`; $('#priority-badge').className='badge '+({P1:'critical',P2:'uncertainty',P3:'owner'}[e.p]); $('#uncertainty-badge').textContent=e.uncertainty; $('#owner-badge').innerHTML=`${e.owner==='You'?'Assigned to you':`Owner: ${escapeHtml(e.owner)}`} <i class="hgi-stroke hgi-arrow-down-01" aria-hidden="true"></i>`;
 $('.status-strip').classList.toggle('hidden',!sample); $('.actions-section').classList.toggle('hidden',!sample); $('.resolution-section').classList.toggle('hidden',!sample); $('.evidence-row').classList.toggle('hidden',!sample);
 $$('.case-tabs button:not([data-tab="decision"])').forEach(b=>b.classList.toggle('hidden',!sample)); switchTab('decision');
 $('#assessment-title').textContent=sample?'Delivery commitment is likely to be missed':'Assessment needs review'; $('#assessment-confidence').textContent=sample?'82% confidence':'Unverified';
 if(!sample){ $('#what-happened').textContent=e.detail; $('#likely-cause').textContent='Not yet assessed.'; $('#business-impact').textContent=`${e.route} · ${priorityLabel(e.p)} priority`; $('#missing-data').textContent='Supporting evidence and partner confirmation.'; }
 else{ $('#what-happened').textContent='Vessel discharge moved by 19 hours. The connecting rail slot is now unavailable.'; $('#likely-cause').textContent='Terminal congestion following an unplanned crane outage.'; $('#business-impact').textContent='31h delay · SLA breach likely · $42k order at risk.'; $('#missing-data').textContent='Confirmed terminal gate appointment.'; renderResolution(); }
}
function renderEvidence(){ $('#evidence-list').innerHTML=evidence.map(x=>`<div class="evidence-item"><div class="source-icon"><i class="hgi-stroke ${sourceIconClass(x[0])}" aria-hidden="true"></i></div><div><strong>${x[1]}</strong><p>${x[2]}</p></div><span class="source-state">${x[3]}</span></div>`).join(''); }
function renderTimeline(){ $('#timeline-list').innerHTML=timeline.map(x=>`<div class="timeline-item"><time>${x[0]}</time><div class="timeline-line"></div><div><strong>${x[1]}</strong><p>${x[2]}</p></div></div>`).join(''); }
function renderAudit(){ $('#audit-list').innerHTML=audit.map(x=>`<div class="audit-item"><strong>${x[0]}</strong><p>${x[1]}</p><code>${x[2]}</code></div>`).join(''); }
function clock(){return new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});}
function addAudit(event,actor='user/sourav'){audit.unshift([clock(),event,actor]);renderAudit();}
function renderResolution(){
 const section=$('.resolution-section'),status=$('#resolution-status'),action=$('#action-status'),actionDetail=$('#action-status-detail'),checkpoint=$('#next-checkpoint'),checkpointDetail=$('#next-checkpoint-detail'),evidenceState=$('#resolution-evidence'),closure=$('#review-closure'),reopen=$('#reopen-case'),simulate=$('#simulate-update');
 if(!status)return;
 const actionName=resolutionState.action?labels[resolutionState.action][0]:'No action approved';
 renderActionDecision();
 section.classList.remove('hidden','is-compact'); status.className='resolution-status'; evidenceState.className='resolution-evidence'; reopen.classList.add('hidden'); simulate.classList.remove('hidden'); closure.disabled=true;
 if(resolutionState.stage==='awaiting'){
  section.classList.add('hidden'); status.textContent='Awaiting decision'; action.textContent=actionName; actionDetail.textContent='Choose a response to create a tracked resolution step.'; checkpoint.textContent='Gate appointment confirmation'; checkpointDetail.textContent='No external request has been sent in this prototype.'; evidenceState.innerHTML='<i class="hgi-stroke hgi-information-circle" aria-hidden="true"></i><span>Evidence state: waiting for an approved action or new verified event.</span>';
 } else if(resolutionState.stage==='in-progress'){
  section.classList.add('is-compact'); status.textContent='Resolution in progress'; status.classList.add('in-progress'); action.textContent=actionName; actionDetail.textContent='Approved in this prototype; external execution remains simulated.'; checkpoint.textContent='Awaiting verified update'; checkpointDetail.textContent='Use the simulation control to represent a carrier or terminal confirmation.'; evidenceState.innerHTML='<i class="hgi-stroke hgi-time-02" aria-hidden="true"></i><span>Evidence state: action is tracked, but resolution cannot be closed until a verified update arrives.</span>';
 } else if(resolutionState.stage==='ready'){
  status.textContent='Ready for closure review'; status.classList.add('ready'); action.textContent=actionName; actionDetail.textContent='Approved action is progressing with a verified checkpoint.'; checkpoint.textContent='Gate appointment confirmed'; checkpointDetail.textContent='Verified terminal update received just now.'; evidenceState.classList.add('verified'); evidenceState.innerHTML='<i class="hgi-stroke hgi-checkmark-circle-02" aria-hidden="true"></i><span>Verified update: gate appointment is confirmed. Review the remaining closure criteria with the coordinator.</span>'; closure.disabled=false;
 } else {
  section.classList.add('is-compact'); status.textContent='Closed · monitoring retained'; status.classList.add('closed'); action.textContent=actionName; actionDetail.textContent='Resolution was confirmed by the coordinator.'; checkpoint.textContent='Continuous monitoring'; checkpointDetail.textContent='Contradictory events will reopen this exception.'; evidenceState.classList.add('closed'); evidenceState.innerHTML='<i class="hgi-stroke hgi-checkmark-circle-02" aria-hidden="true"></i><span>Resolution criteria were confirmed. The full decision history remains available in Audit.</span>'; reopen.classList.remove('hidden'); simulate.classList.add('hidden');
 }
}
function renderActionDecision(){
 const section=$('.actions-section'),summary=$('#approved-decision'); if(!section||!summary)return;
 const active=resolutionState.stage!=='awaiting'&&resolutionState.action;
 section.classList.toggle('is-approved',Boolean(active)); summary.classList.toggle('hidden',!active);
 if(!active)return;
 const details={expedite:{copy:'A dedicated truck transfer is being tracked as the selected recovery path.',metrics:['22h recovered','$4,850 added cost','76% SLA saved']},rebook:{copy:'The next confirmed rail departure is being tracked as the selected recovery path.',metrics:['8h recovered','$620 added cost','42% SLA saved']},hold:{copy:'Monitoring is the selected response while the next terminal confirmation is awaited.',metrics:['0h recovered','$0 added cost','18% SLA saved']}}[resolutionState.action];
 $('#approved-decision-title').textContent=labels[resolutionState.action][0]; $('#approved-decision-description').textContent=details.copy; $('#approved-decision-metrics').innerHTML=details.metrics.map(metric=>`<span>${metric}</span>`).join('');
}
function switchTab(name){ $$('.case-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===name)); ['decision','evidence','timeline','audit'].forEach(t=>$(`#${t}-tab`).classList.toggle('hidden',t!==name)); }
$$('.case-tabs button').forEach(b=>b.onclick=()=>switchTab(b.dataset.tab)); $$('[data-tab-open]').forEach(b=>{b.onclick=()=>switchTab(b.dataset.tabOpen);b.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();switchTab(b.dataset.tabOpen);}}});

const labels={expedite:['Expedite by dedicated truck','Additional confirmation required · Estimated cost $4,850'],rebook:['Rebook next rail departure','Low-risk approved action · Estimated cost $620'],hold:['Hold and continue monitoring','Low-risk approved action · No added cost']};
$$('.action-card').forEach(card=>card.onclick=e=>{if(e.target.closest('button'))return; selectedAction=card.dataset.action; $$('.action-card').forEach(x=>x.classList.toggle('selected',x===card)); $$('.approve-action').forEach(b=>b.textContent=card.dataset.risk==='high'?'Review and approve':'Approve action');});

function openModal(html){$('#modal-content').innerHTML=html;$('#modal-backdrop').classList.remove('hidden');}
function closeModal(){$('#modal-backdrop').classList.add('hidden');}
$('#modal-close').onclick=e=>{e.preventDefault();e.stopPropagation();closeModal()}; $('#modal-backdrop').onclick=e=>{if(e.target.id==='modal-backdrop')closeModal()}; window.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
$('#close-drawer').onclick=()=>{
 document.body.classList.remove('drawer-open');
 document.documentElement.classList.remove('drawer-open');
 closeCaseMenu();
};
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.remove('hidden');setTimeout(()=>t.classList.add('hidden'),2800)}

function approveAction(){
 const high=selectedAction==='expedite';
 openModal(`<p class="eyebrow">${high?'Higher-risk action':'Action approval'}</p><h2>${labels[selectedAction][0]}</h2><p>${high?'This action creates a new transport commitment and adds $4,850 in cost. Your explicit confirmation is required.':'This action is within your approval authority and can be executed immediately.'}</p><div class="modal-summary"><strong>Authority and prerequisites</strong><div class="check-list"><span><i class="hgi-stroke hgi-checkmark-circle-02" aria-hidden="true"></i>Approval limit verified</span><span><i class="hgi-stroke hgi-checkmark-circle-02" aria-hidden="true"></i>Carrier capacity available</span><span><i class="hgi-stroke hgi-checkmark-circle-02" aria-hidden="true"></i>Duplicate execution check passed</span><span><i class="hgi-stroke hgi-checkmark-circle-02" aria-hidden="true"></i>Customer notification drafted</span></div></div>${high?'<label class="confirm-check"><input type="checkbox" id="confirm-risk"> I understand the cost and downstream commitment.</label>':''}<div class="modal-actions"><button class="ghost" id="cancel-approval">Go back</button><button class="primary" id="confirm-action">Confirm and execute</button></div>`);
 $('#cancel-approval').onclick=closeModal; $('#confirm-action').onclick=()=>{if(high&&!$('#confirm-risk').checked){toast('Confirm the risk acknowledgement first');return} executeAction();};
}
$$(".approve-action").forEach(button=>button.onclick=e=>{e.stopPropagation();selectedAction=button.closest(".action-card").dataset.action;approveAction()});
function executeAction(){
 resolutionState={stage:'in-progress',action:selectedAction,verified:false};
 addAudit(`Action approved: ${labels[selectedAction][0]}`);
 renderResolution();
 $('#modal-content').innerHTML=`<p class="eyebrow">Execution in progress</p><h2>Coordinating approved action</h2><p>Creating the carrier task, reserving capacity and preparing stakeholder updates.</p><div class="progress-track"><i id="execution-progress"></i></div><div id="execution-status">Running prerequisite checks…</div>`;
 requestAnimationFrame(()=>$('#execution-progress').style.width='100%');
 setTimeout(()=>{$('#modal-content').innerHTML=`<p class="eyebrow">Prototype action tracked</p><h2>Resolution is in progress</h2><p>${escapeHtml(labels[selectedAction][0])} is now tracked as a simulated action. No carrier request or customer notification was sent.</p><div class="modal-summary"><strong>Next checkpoint</strong><p>Await a verified gate appointment confirmation before reviewing closure criteria.</p></div><div class="modal-actions"><button class="ghost" id="view-audit">View audit</button><button class="primary" id="finish-execution">Continue monitoring</button></div>`;$('#view-audit').onclick=()=>{closeModal();switchTab('audit')};$('#finish-execution').onclick=()=>{closeModal();toast('Action is tracked in Resolution progress')};},1500);
}
$('#request-info').onclick=()=>openModal(`<p class="eyebrow">Missing information</p><h2>Request terminal gate confirmation</h2><p>The AI can send a structured request to the terminal and carrier. The case will remain open and re-validate automatically when a reply arrives.</p><div class="modal-summary"><strong>Recipients</strong><p>Rotterdam Terminal Operations<br>Ocean carrier control desk</p></div><div class="modal-actions"><button class="ghost" onclick="document.querySelector('#modal-close').click()">Cancel</button><button class="primary" id="send-request">Send request</button></div>`);
document.addEventListener('click',e=>{if(e.target?.id==='send-request'){resolutionState={stage:'in-progress',action:'hold',verified:false};addAudit('Information request prepared: terminal gate confirmation');renderResolution();closeModal();toast('Demo request prepared; no message was sent')}});
$('#simulate-update').onclick=()=>{
 if(resolutionState.stage==='awaiting'){toast('Approve an action or prepare an information request first');return}
 if(resolutionState.stage==='closed'){toast('The exception is closed. Reopen it if new evidence arrives.');return}
 resolutionState.stage='ready';resolutionState.verified=true;addAudit('Verified terminal update received: gate appointment confirmed','system/event-correlation');timeline.unshift([clock(),'Verified update received','Terminal gate appointment confirmed; closure criteria can now be reviewed.']);renderTimeline();renderResolution();toast('Verified update added · closure review is now available');
};
$('#review-closure').onclick=()=>{
 if(resolutionState.stage!=='ready')return;
 openModal(`<p class="eyebrow">Closure review</p><h2>Confirm objective resolution criteria</h2><p>Close this exception only after the coordinator verifies every condition.</p><div class="modal-summary"><label class="confirm-check"><input type="checkbox" id="criteria-milestone"> Verified gate appointment is recorded</label><label class="confirm-check"><input type="checkbox" id="criteria-action"> Approved action is progressing as expected</label><label class="confirm-check"><input type="checkbox" id="criteria-risk"> Customer commitment risk is acceptable</label><label class="confirm-check"><input type="checkbox" id="criteria-alerts"> No active related alerts remain</label></div><div class="modal-actions"><button class="ghost" id="cancel-closure">Keep monitoring</button><button class="primary" id="confirm-closure">Confirm and close</button></div>`);
 $('#cancel-closure').onclick=closeModal; $('#confirm-closure').onclick=()=>{const complete=['criteria-milestone','criteria-action','criteria-risk','criteria-alerts'].every(id=>$('#'+id).checked);if(!complete){toast('Confirm every resolution criterion before closing');return}resolutionState.stage='closed';addAudit('Coordinator confirmed resolution and closed exception');timeline.unshift([clock(),'Exception closed','Resolution criteria confirmed; outcome monitoring retained.']);renderTimeline();renderResolution();closeModal();toast('Exception closed · monitoring remains active');};
};
$('#reopen-case').onclick=()=>{resolutionState.stage='in-progress';resolutionState.verified=false;addAudit('Exception reopened after new information','system/event-correlation');timeline.unshift([clock(),'Exception reopened','New or contradictory information requires renewed monitoring.']);renderTimeline();renderResolution();toast('Exception reopened and returned to monitoring');};
$('#view-decision-audit').onclick=()=>switchTab('audit');
function overrideAi(){openModal(`<p class="eyebrow">Human override</p><h2>Correct the assessment or action</h2><p>Your correction will be preserved in the audit history and reviewed as a learning candidate after closure.</p><label>Actual cause<textarea style="width:100%;min-height:70px;margin-top:6px;border:1px solid #dce3e7;border-radius:8px;padding:10px">Terminal labor shortage</textarea></label><label style="display:block;margin-top:12px">Preferred action<textarea style="width:100%;min-height:70px;margin-top:6px;border:1px solid #dce3e7;border-radius:8px;padding:10px">Escalate to regional operations before committing cost</textarea></label><div class="modal-actions"><button class="ghost" onclick="document.querySelector('#modal-close').click()">Cancel</button><button class="primary" id="apply-override">Update recommendation</button></div>`) }
$$('.override-ai').forEach(button=>button.onclick=e=>{e.stopPropagation();selectedAction=button.closest('.action-card').dataset.action;overrideAi()});
document.addEventListener('click',e=>{if(e.target?.id==='apply-override'){audit.unshift([new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),'Coordinator overrode AI assessment','user/sourav']);renderAudit();closeModal();toast('Override recorded · Recommendation refreshed')}});
$('#explain-ai').onclick=()=>openModal(`<p class="eyebrow">Reasoning trace</p><h2>Why the delay is likely</h2><p>The model correlated the revised discharge event with the released rail slot and compared the resulting ETA against the customer commitment.</p><div class="modal-summary"><strong>Strongest contributors</strong><p>1. Rail slot unavailable — 41%<br>2. Discharge estimate +19h — 34%<br>3. Historical terminal recovery — 15%<br>4. Remaining signals — 10%</p></div><p><small>Confidence reflects evidence agreement and model reliability for comparable routes. It is not a guarantee.</small></p>`);
$('#new-exception').onclick=()=>{
 openModal(`<p class="eyebrow">Manual entry</p><h2>Create an exception</h2><p>Add a shipment issue to the demo inbox. It will be saved in this browser for review.</p><form id="new-case-form" class="case-form"><label>Exception title<input name="title" required maxlength="90" placeholder="e.g. Customs documents missing"></label><div class="form-row"><label>Origin<input name="origin" required maxlength="40" placeholder="e.g. Dhaka"></label><label>Destination<input name="destination" required maxlength="40" placeholder="e.g. Toronto"></label></div><label>What happened?<textarea name="detail" required maxlength="240" placeholder="Describe the issue and what is known so far"></textarea></label><label>Priority<select name="priority"><option value="P1">P1 · Critical</option><option value="P2" selected>P2 · High</option><option value="P3">P3 · Medium</option></select></label><div class="modal-actions"><button class="ghost" type="button" id="cancel-new-case">Cancel</button><button class="primary" type="submit">Create exception</button></div></form>`);
 $('#cancel-new-case').onclick=closeModal;
 $('#new-case-form').onsubmit=e=>{e.preventDefault();const data=new FormData(e.currentTarget);const item={id:`EXC-${Date.now().toString().slice(-8)}`,p:data.get('priority'),title:String(data.get('title')).trim(),route:`${String(data.get('origin')).trim()} → ${String(data.get('destination')).trim()}`,detail:String(data.get('detail')).trim(),time:'Now',owner:'You',uncertainty:'Unknown · Unverified',events:['Exception created manually in this browser']};if(!item.title||!item.detail||!String(data.get('origin')).trim()||!String(data.get('destination')).trim()){toast('Complete all fields before creating the exception');return}exceptions.unshift(item);selectedId=item.id;currentFilter='all';$$('.chip,.filter-option').forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));saveCases();renderExceptions();closeModal();toast('Exception created in your browser');};
};
function closeCaseMenu(){}
$('#assign-case').onclick=()=>{const item=exceptions.find(x=>x.id===selectedId);item.owner='You';(item.events??=[]).unshift('Assigned to you');saveCases();closeCaseMenu();renderExceptions();toast('Exception assigned to you')};
$('#case-audit').onclick=()=>{const item=exceptions.find(x=>x.id===selectedId);closeCaseMenu();if(item.id==='EXC-2481'){switchTab('audit');return}const events=item.events?.length?item.events:['No recorded actions yet'];openModal(`<p class="eyebrow">Case history</p><h2>Audit history</h2><p>${escapeHtml(item.id)} · ${escapeHtml(item.title)}</p><div class="modal-summary">${events.map(event=>`<p>${escapeHtml(event)}</p>`).join('')}</div><p><small>Demo history is saved only in this browser.</small></p>`)};
$('#copy-case').onclick=async()=>{closeCaseMenu();try{await navigator.clipboard.writeText(selectedId);toast('Exception ID copied')}catch(_){openModal(`<p class="eyebrow">Exception ID</p><h2>${escapeHtml(selectedId)}</h2><p>Select and copy this ID.</p>`)}};
function closeOwnerMenu(){ $('#owner-menu').classList.add('hidden'); $('#owner-badge').setAttribute('aria-expanded','false'); }
$('#owner-badge').onclick=e=>{e.stopPropagation();const open=$('#owner-menu').classList.toggle('hidden')===false;$('#owner-badge').setAttribute('aria-expanded',String(open));};
$('#owner-menu').onclick=e=>{e.stopPropagation();const option=e.target.closest('[data-owner]');if(!option)return;const item=exceptions.find(x=>x.id===selectedId);if(!item)return;item.owner=option.dataset.owner;(item.events??=[]).unshift(`Assigned to ${item.owner}`);saveCases();closeOwnerMenu();renderExceptions();toast(`Assigned to ${item.owner}`);};
document.addEventListener('click',()=>closeOwnerMenu());
document.addEventListener('click',e=>{if(e.target.closest('#copy-meta')){const item=exceptions.find(x=>x.id===selectedId);if(!item)return;const text=`${item.id} · ${item.route}`;navigator.clipboard?.writeText(text).then(()=>toast('Exception details copied')).catch(()=>toast(text));}});
$('#notifications').onclick=()=>toast('3 notifications · 1 requires approval');
$('#filter-toggle').onclick=e=>{
 e.stopPropagation();
 const popover=$('#filter-popover');
 const open=popover.classList.toggle('hidden')===false;
 $('#filter-toggle').setAttribute('aria-expanded',String(open));
};
$('#filter-popover').onclick=e=>e.stopPropagation();
$$('.chip').forEach(button=>button.onclick=()=>setFilter(button.dataset.filter));
$$('.filter-option').forEach(button=>button.onclick=()=>setFilter(button.dataset.filter));
document.addEventListener('click',e=>{const button=e.target.closest('.pagination-btn');if(!button||button.disabled)return;const page=Number(button.dataset.page);if(!page)return;currentPage=page;renderExceptions();});
document.addEventListener('click',()=>{$('#filter-popover').classList.add('hidden');$('#filter-toggle').setAttribute('aria-expanded','false');closeCaseMenu()});
$$('.nav-item').forEach(n=>n.onclick=()=>{ $$('.nav-item').forEach(x=>x.classList.remove('active'));n.classList.add('active');if(n.dataset.view!=='inbox')toast(`${n.textContent.trim()} view is represented in the active case prototype`);});
$$('.top-tab').forEach(n=>n.onclick=()=>{ $$('.top-tab').forEach(x=>x.classList.remove('active'));n.classList.add('active');if(n.dataset.view!=='inbox')toast(`${n.textContent.trim()} view is represented in the active case prototype`);});
renderExceptions();renderEvidence();renderTimeline();renderAudit();renderResolution();

/* -------------------------------------------------------------------------
   Scenario-aware prototype layer. This keeps the static demo local while
   modelling the decision lifecycle across several logistics exception types.
--------------------------------------------------------------------------- */
(()=>{
 const LIMIT=2500;
 const scenarios={
  'EXC-2481':{kind:'Port disruption',what:'Vessel discharge moved by 19 hours. The connecting rail slot is no longer available.',cause:'Terminal congestion followed an unplanned crane outage.',impact:'31h predicted delay · SLA breach likely · $42k order at risk.',gap:'Confirmed terminal gate appointment.',confidence:'82%',sources:'7',actions:[
   {id:'expedite',name:'Expedite by dedicated truck',desc:'Move the container to Duisburg by road and connect to an earlier rail service.',recovery:'22h',cost:4850,sla:'76%',risk:'Higher risk',deps:[['gap','Gate appointment'],['verified','Truck quote QX-1187']],note:'A free truck cancellation is possible until Fri 11:00.'},
   {id:'rebook',name:'Rebook next rail departure',desc:'Accept the next confirmed rail slot and proactively update the customer.',recovery:'8h',cost:620,sla:'42%',risk:'Low risk',deps:[['verified','Priority rail slot']],note:'Arrives after the deadline in the slower recovery scenario.'},
   {id:'hold',name:'Hold and continue monitoring',desc:'Wait for the terminal gate appointment and reassess in 45 minutes.',recovery:'0h',cost:0,sla:'18%',risk:'Low risk',deps:[['gap','Gate appointment']],note:'Lowest cost, but exposure remains while the terminal confirms.'}
  ]},
  'EXC-2479':{kind:'Regulated temperature',what:'The logger recorded 8.4°C for 22 minutes during the Singapore transfer.',cause:'Likely cold-chain interruption during apron handling.',impact:'Pharma consignment at risk · quality disposition required.',gap:'Customer QA disposition and product-release decision.',confidence:'78%',sources:'6',actions:[
   {id:'quarantine',name:'Quarantine at Frankfurt',desc:'Hold the shipment in qualified cold storage until customer QA releases it.',recovery:'12h',cost:380,sla:'64%',risk:'Low risk',deps:[['verified','Cold-store slot'],['gap','QA disposition']],note:'Protects product integrity while QA reviews the excursion.'},
   {id:'release',name:'Continue with documented excursion',desc:'Attach the logger record and deliver under the existing release procedure.',recovery:'0h',cost:0,sla:'100%',risk:'Higher risk',deps:[['inference','Excursion within tolerance'],['gap','QA release']],note:'Cannot proceed as a verified recommendation until QA accepts.'}
  ]},
  'EXC-2476':{kind:'Customs documentation',what:'The commercial invoice and packing list report different declared values.',cause:'A revised invoice was not transmitted to the broker.',impact:'Customs filing is blocked · retail launch may be delayed.',gap:'Signed corrected commercial invoice.',confidence:'64%',sources:'4',actions:[
   {id:'correct',name:'Obtain corrected invoice',desc:'Ask the shipper to issue and sign a corrected invoice before filing.',recovery:'18h',cost:0,sla:'68%',risk:'Low risk',deps:[['gap','Signed corrected invoice']],note:'Best compliance path; depends on the shipper responding today.'},
   {id:'file',name:'File with current declaration',desc:'Submit the available documents and accept possible customs review.',recovery:'8h',cost:1500,sla:'43%',risk:'Higher risk',deps:[['inference','Review not selected']],note:'Faster initially, with an elevated chance of a one-to-two day review.'}
  ]},
  'EXC-2458':{kind:'Capacity cancellation',what:'The contracted carrier cancelled two trailers booked for Friday pickup.',cause:'Carrier capacity shortfall; a Saturday pickup is the earliest contract option.',impact:'Store reset at risk · $4k late-delivery penalty likely.',gap:'Replacement carrier insurance certificate.',confidence:'74%',sources:'5',actions:[
   {id:'spot',name:'Book a Friday spot carrier',desc:'Tender two replacement trailers to a vetted spot carrier.',recovery:'26h',cost:1380,sla:'81%',risk:'Moderate risk',deps:[['verified','Carrier on-time history'],['gap','Insurance certificate']],note:'Cost remains below the likely penalty if the contracted pickup moves to Saturday.'},
   {id:'saturday',name:'Accept Saturday pickup',desc:'Retain the contracted carrier at its next offered collection time.',recovery:'0h',cost:0,sla:'22%',risk:'Higher risk',deps:[['verified','Saturday capacity']],note:'Can arrive from four hours early to eight hours late.'}
  ]},
  'EXC-2464':{kind:'Driver-hours compliance',what:'Remaining route distance exceeds the driver’s legal daily driving time.',cause:'Earlier congestion consumed the available driving margin.',impact:'Today’s delivery appointment is at risk · $600 redelivery cost.',gap:'Relay-driver handover confirmation.',confidence:'86%',sources:'6',actions:[
   {id:'relay',name:'Assign a relay driver',desc:'Meet the truck at Mâcon services and complete the final route legally.',recovery:'7h',cost:340,sla:'89%',risk:'Low risk',deps:[['verified','Relay driver roster'],['gap','Handover confirmation']],note:'Preserves the delivery appointment while maintaining compliance.'},
   {id:'rest',name:'Stop and deliver tomorrow',desc:'Schedule the earliest available appointment after mandatory rest.',recovery:'0h',cost:0,sla:'0%',risk:'Low risk',deps:[['verified','Morning slot']],note:'Certain cost of a missed appointment, but no additional execution risk.'}
  ]},
  'EXC-2461':{kind:'Customs hold',what:'Customs selected the container for examination and blocked its release.',cause:'Mandatory customs examination at the Seattle terminal.',impact:'Release delay threatens the downstream delivery commitment.',gap:'Expedited-exam slot confirmation.',confidence:'71%',sources:'5',actions:[
   {id:'exam',name:'Request expedited examination',desc:'Move the container into the expedited customs examination queue.',recovery:'19h',cost:650,sla:'71%',risk:'Low risk',deps:[['gap','Expedited exam slot']],note:'The inspection outcome is unchanged; only queue time is reduced.'},
   {id:'standard',name:'Remain in standard queue',desc:'Wait for the standard examination sequence at no added cost.',recovery:'0h',cost:0,sla:'29%',risk:'Moderate risk',deps:[['verified','Standard queue position']],note:'Worst case arrives 15 hours after the delivery deadline.'}
  ]}
 };
 const state=Object.fromEntries(Object.keys(scenarios).map(id=>[id,{stage:'decide',action:null,requested:null,history:[]}]));
 const statusText={decide:'Needs decision','awaiting-info':'Awaiting information',signoff:'Awaiting sign-off',monitoring:'Monitoring',ready:'Ready to close',closed:'Closed'};
 let activeId='EXC-2481', activeAction='expedite', activeView='inbox';
 const root=document.querySelector('.workspace'), view=document.querySelector('#product-view');
 const find=id=>exceptions.find(x=>x.id===id);
 const esc=escapeHtml;
 const scenario=id=>scenarios[id]||scenarios['EXC-2481'];
 const caseState=id=>state[id]||{stage:'decide',action:null,history:[]};
 const money=n=>n===0?'$0':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
 const stamp=()=>new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
 const record=(id,event,actor='user/sourav')=>{caseState(id).history.unshift({at:stamp(),event,actor});};
 function statePill(s){return `<span class="case-status ${s.stage}">${statusText[s.stage]}</span>`}
 function renderQueue(){
  const visible=exceptions.filter(e=>currentFilter==='all'||(currentFilter==='critical'&&e.p==='P1')||(currentFilter==='mine'&&e.owner==='You'));
  const host=document.querySelector('#exception-list'); if(!host)return;
  host.innerHTML=`<div class="exception-table" role="table" aria-label="Prioritized exceptions"><div class="exception-table-head" role="row"><span>ID</span><span>Priority</span><span>Exception</span><span>Route</span><span>Impact</span><span>Confidence</span><span>Owner</span><span>Actions</span></div>${visible.map(e=>{const [from,to]=e.route.split(' → ');const s=caseState(e.id);const mode=transportMode(e.id);return `<button class="exception-row ${e.id===activeId?'active':''}" role="row" data-scenario="${e.id}"><span class="id-cell">${e.id}</span><span class="priority ${e.p.toLowerCase()}"><span class="priority-dot"></span>${e.p} · ${priorityLabel(e.p)}</span><span class="exception-name"><strong>${esc(e.title)}</strong>${scenarios[e.id]?statePill(s):''}</span><span class="route-journey"><span class="mode-icon ${mode[0]}" title="${mode[2]}">${mode[1]}</span><span class="route-stops"><span class="route-stop route-origin"><i class="stop-marker"></i>${esc(from)}</span><span class="route-stop route-destination"><i class="stop-marker"></i>${esc(to||'—')}</span></span></span><span class="impact-cell">${esc(e.detail)}</span><span class="uncertainty-cell">${esc(e.uncertainty)}</span><span class="owner-cell">${esc(e.owner)}</span><span class="row-action"><i class="hgi-stroke hgi-more-horizontal"></i></span></button>`}).join('')}</div>`;
  host.querySelectorAll('[data-scenario]').forEach(b=>b.onclick=()=>openCase(b.dataset.scenario));
  document.querySelector('#open-count').textContent=exceptions.length;
  document.querySelector('.nav-item[data-view="inbox"] .nav-count').textContent=exceptions.length;
  document.querySelectorAll('.top-tab[data-view="inbox"] span').forEach(x=>x.textContent=exceptions.length);
  const pages=Math.max(1,Math.ceil(visible.length/pageSize));
  document.querySelector('#queue-pagination').innerHTML=`<span class="queue-pagination-summary">1–${Math.min(pageSize,visible.length)} of ${visible.length} exceptions</span><span class="queue-pagination-controls"><button class="pagination-btn active">1</button>${pages>1?`<button class="pagination-btn">2</button>`:''}</span>`;
 }
 function renderActions(){
  const d=scenario(activeId), s=caseState(activeId), el=document.querySelector('#action-options'); if(!el)return;
  if(s.stage!=='decide'){el.innerHTML='';return;}
  const selected=d.actions.find(a=>a.id===activeAction)||d.actions[0];
  const gaps=selected.deps.filter(([kind])=>kind==='gap');
  const verified=selected.deps.filter(([kind])=>kind==='verified');
  el.innerHTML=`<section class="decision-review" aria-label="Recovery response review">
    <div class="response-list" role="radiogroup" aria-label="Recovery response options">${d.actions.map((a,i)=>{const open=a.id===selected.id;const aGaps=a.deps.filter(([kind])=>kind==='gap');const aVerified=a.deps.filter(([kind])=>kind==='verified');return `<article class="response-item ${open?'is-open':''}"><button class="response-row ${open?'selected':''}" type="button" role="radio" aria-expanded="${open}" aria-checked="${open}" data-choice="${a.id}"><span class="response-choice"><span class="response-chevron" aria-hidden="true"><i class="hgi-stroke ${open?'hgi-arrow-down-01':'hgi-arrow-right-01'}"></i></span><span><b>${esc(a.name)}</b><small>${i===0?'<span class="ai-badge"><i class="hgi-stroke hgi-ai-beautify" aria-hidden="true"></i>AI recommended</span>':`Alternative ${String.fromCharCode(64+i)}`}</small></span></span><span class="response-summary"><span><b>${a.recovery}</b> recovery</span><span><b>${money(a.cost)}</b> cost</span><span class="risk ${a.risk.toLowerCase().includes('low')?'low':'high'}">${a.risk}</span></span></button>${open?`<div class="response-details ${i===0?'ai-response':''}"><div class="selected-response-head"><div><span class="eyebrow">Selected response</span><h4>${esc(a.name)}</h4><p>${esc(a.desc)}</p></div><div class="selected-response-outcome"><b>${a.sla}</b><span>commitment protection</span></div></div><div class="decision-gate ${aGaps.length?'has-gap':''}"><span>${aGaps.length?`${aGaps.length} confirmation needed before execution`:'All required checks are available'}</span><b>${aGaps.map(([,text])=>esc(text)).join(' · ')||aVerified.map(([,text])=>esc(text)).join(' · ')}</b></div><details class="decision-assumptions"><summary><i class="hgi-stroke hgi-arrow-right-01" aria-hidden="true"></i><span>View assumptions and trade-offs</span></summary><div class="action-dependencies">${a.deps.map(([kind,text])=>`<span class="dependency ${kind}"><b>${kind==='gap'?'Needs':kind==='inference'?'Assumes':'Verified'}</b> ${esc(text)}</span>`).join('')}</div><p class="case-state-note ${aGaps.length?'info':''}">${esc(a.note)}</p></details><div class="response-actions"><button class="reasoning-help" type="button" data-reasoning aria-label="Why this option?" title="Why this option?"><i class="hgi-stroke hgi-information-circle" aria-hidden="true"></i></button><span class="authority-state"><span class="eyebrow">Decision authority</span><b>${a.cost>LIMIT?'Manager sign-off required':'Within coordinator authority'}</b></span><button class="ghost scenario-override" type="button">Override AI</button><button class="primary scenario-approve" type="button">${a.cost>LIMIT?'Request sign-off':'Review and approve'}</button></div></div>`:''}</article>`}).join('')}</div>
  </section>`;
  el.querySelectorAll('[data-choice]').forEach(x=>x.onclick=()=>{activeAction=x.dataset.choice;renderActions();});
  el.querySelectorAll('.scenario-approve').forEach(x=>x.onclick=()=>approve(selected.id));
  el.querySelectorAll('.scenario-override').forEach(x=>x.onclick=()=>override(selected.id));
  el.querySelectorAll('[data-reasoning]').forEach(x=>x.onclick=()=>document.querySelector('#explain-ai').click());
 }
 function renderCase(){
  const e=find(activeId), d=scenario(activeId), s=caseState(activeId); if(!e)return;
  document.querySelector('#case-title').textContent=e.title;
  document.querySelector('#case-meta').childNodes[0].nodeValue=`${e.id} · ${e.route} `;
  document.querySelector('#priority-badge').textContent=`${e.p} ${priorityLabel(e.p)}`;
  document.querySelector('#uncertainty-badge').textContent=`${d.confidence} confidence`;
  document.querySelector('#owner-badge').innerHTML=`${e.owner==='You'?'Assigned to you':`Owner: ${esc(e.owner)}`} <i class="hgi-stroke hgi-arrow-down-01"></i>`;
  document.querySelector('#assessment-title').textContent=d.kind==='Regulated temperature'?'Product disposition must be confirmed':d.kind==='Driver-hours compliance'?'Delivery may exceed the legal driving limit':'Delivery commitment is likely to be missed';
  document.querySelector('#assessment-confidence').textContent=`${d.confidence} confidence`;
  document.querySelector('#what-happened').textContent=d.what; document.querySelector('#likely-cause').textContent=d.cause; document.querySelector('#business-impact').textContent=d.impact; document.querySelector('#missing-data').textContent=d.gap;
  document.querySelector('.evidence-score-value').textContent=d.confidence; document.querySelector('.evidence-meter i').style.width=d.confidence; document.querySelector('.evidence-summary-meta').innerHTML=`<span><b>${d.sources}</b> verified sources</span><span>Freshness <b>2m</b></span>`;
  document.querySelector('#evidence-list').innerHTML=[['EV','Operational event',d.what,'Verified'],['AI','AI assessment',d.cause,'AI inference'],['SL','Customer commitment',d.impact,'Verified'],['GT','Open information',d.gap,'Missing']].map(x=>`<div class="evidence-item"><div class="source-icon"><i class="hgi-stroke ${sourceIconClass(x[0])}" aria-hidden="true"></i></div><div><strong>${x[1]}</strong><p>${x[2]}</p></div><span class="source-state">${x[3]}</span></div>`).join('');
  document.querySelector('.status-strip strong').textContent=`AI assessment updated ${e.time||'just now'} ago`;
  document.querySelector('.status-strip p').textContent=d.what;
  renderActions();renderLifecycle();renderQueue();
 }
 function renderLifecycle(){
  const d=scenario(activeId), s=caseState(activeId), action=d.actions.find(a=>a.id===s.action), section=document.querySelector('.resolution-section');
  const status=document.querySelector('#resolution-status'), actionName=document.querySelector('#action-status'), detail=document.querySelector('#action-status-detail'), checkpoint=document.querySelector('#next-checkpoint'), checkpointDetail=document.querySelector('#next-checkpoint-detail'), note=document.querySelector('#resolution-evidence'), simulate=document.querySelector('#simulate-update'), close=document.querySelector('#review-closure'), reopen=document.querySelector('#reopen-case'), approved=document.querySelector('#approved-decision');
  section.classList.remove('hidden'); section.classList.toggle('is-pending',s.stage==='decide'); status.className=`resolution-status ${s.stage==='monitoring'?'in-progress':s.stage==='ready'?'ready':s.stage==='closed'?'closed':''}`;
  approved.classList.toggle('hidden',!action); document.querySelector('.actions-section').classList.toggle('is-approved',Boolean(action));
  if(action){document.querySelector('#approved-decision-title').textContent=action.name;document.querySelector('#approved-decision-description').textContent=`${action.name} is the selected recovery path. Alternatives remain in the decision audit.`;document.querySelector('#approved-decision-metrics').innerHTML=`<span>${action.recovery} recovered</span><span>${money(action.cost)} added cost</span><span>${action.sla} SLA saved</span>`;}
  status.textContent=statusText[s.stage]; actionName.textContent=action?action.name:'No action approved'; close.disabled=true;reopen.classList.add('hidden');simulate.classList.remove('hidden');
  if(s.stage==='decide'){detail.textContent='Choose a response to start monitoring.';checkpoint.textContent='Decision required';checkpointDetail.textContent='AI recommendation includes verified inputs and open dependencies.';note.className='resolution-evidence';note.innerHTML='<i class="hgi-stroke hgi-information-circle"></i><span>Evidence state: a coordinator must select the recovery path.</span>';simulate.textContent='Simulate new event';}
  if(s.stage==='awaiting-info'){detail.textContent='The case is paused pending an external confirmation.';checkpoint.textContent='Awaiting information';checkpointDetail.textContent=s.requested||d.gap;note.className='resolution-evidence info';note.innerHTML='<i class="hgi-stroke hgi-time-02"></i><span>Information request recorded locally. The recommendation will be reassessed when the simulated reply arrives.</span>';simulate.textContent='Simulate reply';}
  if(s.stage==='signoff'){detail.textContent='Coordinator choice is recorded; execution has not started.';checkpoint.textContent='Manager sign-off required';checkpointDetail.textContent=`${money(action.cost)} exceeds the ${money(LIMIT)} coordinator threshold.`;note.className='resolution-evidence';note.innerHTML='<i class="hgi-stroke hgi-alert-circle"></i><span>Nothing is booked or sent in this prototype until simulated sign-off is given.</span>';simulate.textContent='Simulate manager sign-off';}
  if(s.stage==='monitoring'){detail.textContent='Approved in this prototype; external execution remains simulated.';checkpoint.textContent='Awaiting verified outcome';checkpointDetail.textContent=action?.deps.find(x=>x[0]==='gap')?.[1]||'Carrier or terminal milestone';note.className='resolution-evidence';note.innerHTML='<i class="hgi-stroke hgi-time-02"></i><span>Evidence state: action is tracked, but resolution cannot close until objective evidence arrives.</span>';simulate.textContent='Simulate verified update';}
  if(s.stage==='ready'){detail.textContent='A verified checkpoint supports the selected recovery path.';checkpoint.textContent='Ready for closure review';checkpointDetail.textContent='Coordinator must confirm remaining outcome criteria.';note.className='resolution-evidence verified';note.innerHTML='<i class="hgi-stroke hgi-checkmark-circle-02"></i><span>Verified update received. Review closure criteria or wait for another signal.</span>';close.disabled=false;simulate.textContent='Simulate contradictory event';}
  if(s.stage==='closed'){detail.textContent='Resolution was confirmed; ongoing monitoring can reopen the case.';checkpoint.textContent='Continuous monitoring';checkpointDetail.textContent='Contradictory events reopen this exception.';note.className='resolution-evidence closed';note.innerHTML='<i class="hgi-stroke hgi-checkmark-circle-02"></i><span>Resolution criteria were confirmed. Decision and evidence history are retained.</span>';reopen.classList.remove('hidden');simulate.classList.add('hidden');}
 }
 function openCase(id){activeId=scenarios[id]?id:'EXC-2481';activeAction=scenario(activeId).actions[0].id;activeView='inbox';showView('inbox');document.body.classList.add('drawer-open');document.documentElement.classList.add('drawer-open');renderCase();}
 function approve(id){const d=scenario(activeId), a=d.actions.find(x=>x.id===id), needs=a.cost>LIMIT;openModal(`<p class="eyebrow">${needs?'Approval threshold':'Action approval'}</p><h2>${esc(a.name)}</h2><p>${needs?`This action adds ${money(a.cost)}, above the ${money(LIMIT)} coordinator threshold.`:'This action is within the coordinator approval threshold.'}</p><div class="modal-summary"><strong>Dependencies and authority</strong><div class="check-list">${a.deps.map(([kind,text])=>`<span><i class="hgi-stroke ${kind==='gap'?'hgi-alert-circle':'hgi-checkmark-circle-02'}"></i>${kind==='gap'?'Open dependency: ':'Verified: '}${esc(text)}</span>`).join('')}<span><i class="hgi-stroke hgi-checkmark-circle-02"></i>Duplicate action check passed</span></div></div><label class="confirm-check"><input id="decision-ack" type="checkbox"> I understand the cost, dependencies and operational exposure.</label><div class="modal-actions"><button class="ghost" id="decision-cancel">Go back</button><button class="primary" id="decision-confirm">${needs?'Send for sign-off':'Confirm and monitor'}</button></div>`);document.querySelector('#decision-cancel').onclick=closeModal;document.querySelector('#decision-confirm').onclick=()=>{if(!document.querySelector('#decision-ack').checked){toast('Acknowledge the decision details first');return;}const s=caseState(activeId);s.action=id;s.stage=needs?'signoff':'monitoring';record(activeId,needs?`Submitted ${a.name} for manager sign-off`:`Approved ${a.name} within coordinator authority`);closeModal();renderCase();toast(needs?'Sent for simulated manager sign-off':'Action approved and now monitored');};}
 function override(id){const a=scenario(activeId).actions.find(x=>x.id===id);openModal(`<p class="eyebrow">Human override</p><h2>Correct the recommendation</h2><p>Record what the coordinator knows that the AI does not. This becomes a learning-review candidate; it does not change live systems.</p><label>Reason<textarea id="override-note" style="width:100%;min-height:82px;margin-top:6px;border:1px solid #dce3e7;border-radius:8px;padding:10px">Customer relationship or operational context changes the preferred response.</textarea></label><div class="modal-actions"><button class="ghost" id="override-cancel">Cancel</button><button class="primary" id="override-save">Record override</button></div>`);document.querySelector('#override-cancel').onclick=closeModal;document.querySelector('#override-save').onclick=()=>{const s=caseState(activeId);s.action=id;s.stage='decide';record(activeId,`Human override recorded for ${a.name}`);closeModal();renderCase();toast('Override recorded for Learning review');};}
 function requestInfo(){const d=scenario(activeId);openModal(`<p class="eyebrow">Missing information</p><h2>Request ${esc(d.gap)}</h2><p>This is a simulated request. The exception remains open and no action is approved while evidence is missing.</p><div class="modal-summary"><strong>Expected response</strong><p>Carrier, terminal, broker, or customer confirmation that can change the recommended recovery path.</p></div><div class="modal-actions"><button class="ghost" id="request-cancel">Cancel</button><button class="primary" id="request-send">Record request</button></div>`);document.querySelector('#request-cancel').onclick=closeModal;document.querySelector('#request-send').onclick=()=>{const s=caseState(activeId);s.stage='awaiting-info';s.requested=d.gap;record(activeId,`Information request recorded: ${d.gap}`);closeModal();renderCase();toast('Request recorded; case is awaiting information');};}
 function simulate(){const s=caseState(activeId),d=scenario(activeId);if(s.stage==='decide'){toast('Choose an action or request missing information first');return;}if(s.stage==='awaiting-info'){s.stage='decide';record(activeId,`Verified reply received: ${d.gap}`,'system/event-correlation');toast('Reply received; recommendation reopened for review');}else if(s.stage==='signoff'){s.stage='monitoring';record(activeId,'Manager sign-off simulated; action entered monitoring','user/mina');toast('Sign-off recorded; action is now monitored');}else if(s.stage==='monitoring'){s.stage='ready';record(activeId,'Verified operational update received','system/event-correlation');toast('Verified update received; closure review is ready');}else if(s.stage==='ready'){s.stage='decide';s.action=null;record(activeId,'Contradictory event received; decision reopened','system/event-correlation');toast('Plan invalidated; choose a new response');}renderCase();}
 function closeCase(){const s=caseState(activeId);if(s.stage!=='ready')return;openModal(`<p class="eyebrow">Closure review</p><h2>Confirm objective resolution criteria</h2><p>Closing retains monitoring and can be reversed by contradicting evidence.</p><div class="modal-summary"><label class="confirm-check"><input type="checkbox" id="c1"> Verified milestone is recorded</label><label class="confirm-check"><input type="checkbox" id="c2"> Approved action is progressing as expected</label><label class="confirm-check"><input type="checkbox" id="c3"> Customer commitment risk is acceptable</label><label class="confirm-check"><input type="checkbox" id="c4"> No active related alerts remain</label></div><div class="modal-actions"><button class="ghost" id="close-cancel">Keep monitoring</button><button class="primary" id="close-confirm">Confirm and close</button></div>`);document.querySelector('#close-cancel').onclick=closeModal;document.querySelector('#close-confirm').onclick=()=>{if(!['c1','c2','c3','c4'].every(id=>document.querySelector('#'+id).checked)){toast('Confirm every criterion before closing');return;}s.stage='closed';record(activeId,'Coordinator confirmed resolution and closed exception');closeModal();renderCase();toast('Exception closed; monitoring remains available');};}
 function renderProductView(name){
  const cases=Object.keys(scenarios).map(id=>({id,e:find(id),s:caseState(id),d:scenario(id)}));
  const head=(title,copy)=>`<div class="product-view-head"><div><p class="eyebrow">Operations control tower · Demo</p><h2>${title}</h2><p>${copy}</p></div><button class="ghost" data-back>Back to inbox</button></div>`;
  if(name==='monitoring'){const work=cases.filter(x=>['awaiting-info','signoff','monitoring','ready'].includes(x.s.stage));view.innerHTML=head('Live monitoring','Exceptions that need evidence, authority, or outcome follow-through.')+`<div class="ops-grid">${(work.length?work:cases.slice(0,3)).map(x=>`<article class="ops-card"><div>${statePill(x.s)}</div><h3>${esc(x.e.title)}</h3><p>${x.s.action?`${esc(x.d.actions.find(a=>a.id===x.s.action)?.name||'Selected response')} is active.`:'No approved action yet.'}</p><div class="ops-meta"><span>${esc(x.e.id)}</span><button class="ghost" data-open="${x.id}">Open case</button></div></article>`).join('')}</div>`;}
  if(name==='decisions'){const events=cases.flatMap(x=>x.s.history.map(h=>({...h,id:x.id,title:x.e.title,stage:x.s.stage})));view.innerHTML=head('Decision history','A transparent record of AI recommendations, human decisions, and operational outcomes.')+`<div class="history-table"><div class="history-row head"><span>When</span><span>Exception</span><span>Decision</span><span>Actor</span></div>${(events.length?events:[{at:'—',id:'No decisions yet',title:'Approve a response to begin the history.',event:'Awaiting coordinator decision',actor:'—'}]).map(h=>`<div class="history-row"><span>${h.at}</span><span><b>${h.id}</b><small>${esc(h.title)}</small></span><span>${esc(h.event)}</span><span>${esc(h.actor)}</span></div>`).join('')}</div>`;}
  if(name==='learning'){const overrides=cases.flatMap(x=>x.s.history.filter(h=>h.event.includes('override')).map(h=>({...h,x})));view.innerHTML=head('Learning review','Human corrections are retained as reviewable evidence—not automatically turned into AI policy.')+`${overrides.length?overrides.map(o=>`<article class="learning-card"><span class="badge uncertainty">Assessment correction</span><h3>${esc(o.x.e.title)}</h3><p>The coordinator preferred a different response. Review whether the context should inform future recommendations.</p><div class="learning-compare"><div><span>AI recommendation</span>${esc(o.x.d.actions[0].name)}</div><div><span>Coordinator decision</span>${esc(o.x.d.actions.find(a=>a.id===o.x.s.action)?.name||'Recorded override')}</div></div></article>`).join(''):`<article class="learning-card"><span class="badge owner">No review items yet</span><h3>Human corrections will appear here</h3><p>When a coordinator overrides a recommendation, the reason is preserved for later review. It does not automatically retrain or change policy.</p></article>`}`;}
  if(name==='audit'){const events=cases.flatMap(x=>x.s.history.map(h=>({...h,id:x.id})));view.innerHTML=head('Audit log','Human, AI, and system events retained for accountability in this local prototype.')+`<div class="history-table"><div class="history-row head"><span>When</span><span>Exception</span><span>Event</span><span>Actor</span></div>${events.map(h=>`<div class="history-row"><span>${h.at}</span><span>${h.id}</span><span>${esc(h.event)}</span><span>${esc(h.actor)}</span></div>`).join('')||'<div class="history-row"><span>—</span><span>—</span><span>Activity will appear when a decision is made.</span><span>—</span></div>'}</div>`;}
  view.querySelector('[data-back]').onclick=()=>showView('inbox');view.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openCase(b.dataset.open));
 }
 function showView(name){activeView=name;root.classList.toggle('hidden',name!=='inbox');view.classList.toggle('hidden',name==='inbox');document.querySelector('#page-title').textContent=name==='inbox'?'Exception inbox':({monitoring:'Live monitoring',decisions:'Decision history',learning:'Learning review',audit:'Audit log'})[name];document.querySelectorAll('.nav-item,.top-tab').forEach(b=>b.classList.toggle('active',b.dataset.view===name));if(name!=='inbox')renderProductView(name);}
 document.querySelectorAll('.nav-item,.top-tab').forEach(b=>b.onclick=()=>showView(b.dataset.view));
 document.querySelector('#request-info').onclick=requestInfo;document.querySelector('#simulate-update').onclick=simulate;document.querySelector('#review-closure').onclick=closeCase;document.querySelector('#reopen-case').onclick=()=>{const s=caseState(activeId);s.stage='monitoring';record(activeId,'Exception reopened after new information','system/event-correlation');renderCase();toast('Exception reopened and returned to monitoring');};
 document.querySelector('#explain-ai').onclick=()=>{const d=scenario(activeId);openModal(`<p class="eyebrow">Reasoning trace</p><h2>Why this exception is prioritized</h2><p>The assessment joins operational events, service commitments, and historical context. It separates verified events from AI inference and open data.</p><div class="modal-summary"><strong>Current support</strong><p>${d.sources} verified sources support this assessment. Confidence is ${d.confidence}; it is not a guarantee.</p><p><b>Open information:</b> ${esc(d.gap)}</p></div><div class="modal-actions"><button class="primary" id="explain-done">Done</button></div>`);document.querySelector('#explain-done').onclick=closeModal;};
 document.querySelector('#view-decision-audit').onclick=()=>showView('decisions');
 renderQueue();renderCase();
})();

/* Add depth only while content is moving behind the sticky drawer header. */
(() => {
 const drawer=document.querySelector('#case-panel');
 if(!drawer)return;
 const updateHeaderDepth=()=>drawer.classList.toggle('is-scrolled',drawer.scrollTop>6);
 drawer.addEventListener('scroll',updateHeaderDepth,{passive:true});
 new MutationObserver(()=>{
  if(!document.body.classList.contains('drawer-open')){
   drawer.scrollTop=0;
   updateHeaderDepth();
  }
 }).observe(document.body,{attributes:true,attributeFilter:['class']});
 updateHeaderDepth();
})();

