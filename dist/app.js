let exceptions=[
 {id:'EXC-2481',p:'P1',title:'Port congestion threatens delivery',route:'Rotterdam → Chicago',detail:'31h predicted delay · $42k at risk',time:'2m',owner:'You',uncertainty:'Likely · 82%'},
 {id:'EXC-2479',p:'P2',title:'Temperature excursion detected',route:'Singapore → Frankfurt',detail:'8.4°C for 22 min · Pharma',time:'11m',owner:'Mina',uncertainty:'Confirmed'},
 {id:'EXC-2476',p:'P2',title:'Customs documents incomplete',route:'Dhaka → Toronto',detail:'Commercial invoice mismatch',time:'26m',owner:'You',uncertainty:'Possible · 64%'},
 {id:'EXC-2471',p:'P3',title:'Tracking signal stale',route:'Shenzhen → Long Beach',detail:'No carrier event for 9h',time:'1h',owner:'Unassigned',uncertainty:'Unknown'},
 {id:'EXC-2468',p:'P3',title:'Warehouse handoff delayed',route:'Hamburg → Prague',detail:'Pickup missed by 46 min',time:'2h',owner:'Nadia',uncertainty:'Likely · 71%'},
 {id:'EXC-2464',p:'P3',title:'Delivery appointment at risk',route:'Antwerp → Lyon',detail:'Driver hours limit approaching',time:'3h',owner:'You',uncertainty:'Possible · 58%'}
];
try { const saved=JSON.parse(localStorage.getItem('tiger-exceptions-v1')); if(Array.isArray(saved)&&saved.length) exceptions=saved; } catch (_) {}
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

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const priorityLabel=p=>({P1:'Critical',P2:'High',P3:'Medium'}[p]||'Medium');
const transportMode=id=>({
 'EXC-2481':['ship','⚓','Ocean freight'],
 'EXC-2479':['plane','✈','Air freight'],
 'EXC-2476':['plane','✈','Air freight'],
 'EXC-2471':['ship','⚓','Ocean freight'],
 'EXC-2468':['truck','▣','Road freight'],
 'EXC-2464':['truck','▣','Road freight']
}[id]||['truck','▣','Road freight']);
function saveCases(){try{localStorage.setItem('tiger-exceptions-v1',JSON.stringify(exceptions));}catch(_){toast('Could not save locally; this change lasts until the page closes.')}}
function renderExceptions(){
 const visible=exceptions.filter(e=>currentFilter==='all'||(currentFilter==='critical'&&e.p==='P1')||(currentFilter==='mine'&&e.owner==='You')).sort((a,b)=>a.p.localeCompare(b.p));
 if(visible.length&&!visible.some(e=>e.id===selectedId)) selectedId=visible[0].id;
 $('#exception-list').innerHTML=visible.length?`<div class="exception-table" role="table" aria-label="Prioritized exceptions"><div class="exception-table-head" role="row"><span>ID</span><span>Priority</span><span>Exception</span><span>Route</span><span>Impact</span><span>Confidence</span><span>Owner</span><span>Actions</span></div>${visible.map(e=>{const places=e.route.split(' → '),mode=transportMode(e.id);return `<button class="exception-row ${e.id===selectedId?'active':''}" role="row" data-id="${escapeHtml(e.id)}"><span class="id-cell">${escapeHtml(e.id)}</span><span class="priority ${e.p.toLowerCase()}"><span class="priority-dot"></span>${e.p} · ${priorityLabel(e.p)}</span><span class="exception-name"><strong>${escapeHtml(e.title)}</strong></span><span class="route-journey"><span class="mode-icon ${mode[0]}" title="${mode[2]}">${mode[1]}</span><span class="route-stops"><span class="route-stop route-origin"><i class="stop-marker" aria-hidden="true"></i>${escapeHtml(places[0]||e.route)}</span><span class="route-stop route-destination"><i class="stop-marker" aria-hidden="true"></i>${escapeHtml(places[1]||'—')}</span></span></span><span class="impact-cell">${escapeHtml(e.detail)}</span><span class="uncertainty-cell">${escapeHtml(e.uncertainty)}</span><span class="owner-cell">${escapeHtml(e.owner)}</span><span class="row-action" aria-label="More actions"><i class="hgi-stroke hgi-more-horizontal" aria-hidden="true"></i></span></button>`}).join('')}</div>`:'<p class="empty-queue">No exceptions match this filter.</p>';
 $$('.exception-row').forEach(btn=>btn.onclick=()=>selectException(btn.dataset.id,true));
 const counts={all:exceptions.length,critical:exceptions.filter(e=>e.p==='P1').length,mine:exceptions.filter(e=>e.owner==='You').length};
 $$('.chip').forEach(b=>{b.textContent=({all:'All',critical:'Critical',mine:'Mine'}[b.dataset.filter])+' '+counts[b.dataset.filter]});
 $$('.filter-option').forEach(b=>{b.querySelector('b').textContent=counts[b.dataset.filter]});
 $('#open-count').textContent=counts.all; $('#critical-count').textContent=counts.critical; $('.nav-item[data-view="inbox"] .nav-count').textContent=counts.all;
 if(visible.length)selectException(selectedId,false);
}
function setFilter(filter){
 currentFilter=filter;
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
 $('#case-title').textContent=e.title; $('#case-meta').textContent=`${e.id} · ${e.route}`; $('#priority-badge').textContent=`${e.p} ${priorityLabel(e.p)}`; $('#priority-badge').className='badge '+({P1:'critical',P2:'uncertainty',P3:'owner'}[e.p]); $('#uncertainty-badge').textContent=e.uncertainty; $('#owner-badge').textContent=e.owner==='You'?'Assigned to you':`Owner: ${e.owner}`;
 $('.status-strip').classList.toggle('hidden',!sample); $('.actions-section').classList.toggle('hidden',!sample); $('.evidence-row').classList.toggle('hidden',!sample);
 $$('.case-tabs button:not([data-tab="decision"])').forEach(b=>b.classList.toggle('hidden',!sample)); switchTab('decision');
 $('#assessment-title').textContent=sample?'Delivery commitment is likely to be missed':'Assessment needs review'; $('#assessment-confidence').textContent=sample?'82% confidence':'Unverified';
 if(!sample){ $('#what-happened').textContent=e.detail; $('#likely-cause').textContent='Not yet assessed.'; $('#business-impact').textContent=`${e.route} · ${priorityLabel(e.p)} priority`; $('#missing-data').textContent='Supporting evidence and partner confirmation.'; }
 else{ $('#what-happened').textContent='Vessel discharge moved by 19 hours. The connecting rail slot is now unavailable.'; $('#likely-cause').textContent='Terminal congestion following an unplanned crane outage.'; $('#business-impact').textContent='31h delay · SLA breach likely · $42k order at risk.'; $('#missing-data').textContent='Confirmed terminal gate appointment.'; }
}
function renderEvidence(){ $('#evidence-list').innerHTML=evidence.map(x=>`<div class="evidence-item"><div class="source-icon">${x[0]}</div><div><strong>${x[1]}</strong><p>${x[2]}</p></div><span class="source-state">${x[3]}</span></div>`).join(''); }
function renderTimeline(){ $('#timeline-list').innerHTML=timeline.map(x=>`<div class="timeline-item"><time>${x[0]}</time><div class="timeline-line"></div><div><strong>${x[1]}</strong><p>${x[2]}</p></div></div>`).join(''); }
function renderAudit(){ $('#audit-list').innerHTML=audit.map(x=>`<div class="audit-item"><strong>${x[0]}</strong><p>${x[1]}</p><code>${x[2]}</code></div>`).join(''); }
function switchTab(name){ $$('.case-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===name)); ['decision','evidence','timeline','audit'].forEach(t=>$(`#${t}-tab`).classList.toggle('hidden',t!==name)); }
$$('.case-tabs button').forEach(b=>b.onclick=()=>switchTab(b.dataset.tab)); $$('[data-tab-open]').forEach(b=>b.onclick=()=>switchTab(b.dataset.tabOpen));

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
 $('#modal-content').innerHTML=`<p class="eyebrow">Execution in progress</p><h2>Coordinating approved action</h2><p>Creating the carrier task, reserving capacity and preparing stakeholder updates.</p><div class="progress-track"><i id="execution-progress"></i></div><div id="execution-status">Running prerequisite checks…</div>`;
 requestAnimationFrame(()=>$('#execution-progress').style.width='100%');
 setTimeout(()=>{audit.unshift([new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),'Demo action simulated','user/sourav']);renderAudit();$('#modal-content').innerHTML=`<p class="eyebrow">Demo action completed</p><h2>Resolution is in progress</h2><p>${escapeHtml(labels[selectedAction][0])} was simulated. No carrier request or customer notification was sent.</p><div class="modal-summary"><strong>Example next checkpoint</strong><p>Gate appointment confirmation due in 45 minutes. A real integration would re-evaluate the exception when a new event arrives.</p></div><div class="modal-actions"><button class="ghost" id="view-audit">View audit</button><button class="primary" id="finish-execution">Continue monitoring</button></div>`;$('#view-audit').onclick=()=>{closeModal();switchTab('audit')};$('#finish-execution').onclick=()=>{closeModal();toast('Demo action recorded')};},1500);
}
$('#request-info').onclick=()=>openModal(`<p class="eyebrow">Missing information</p><h2>Request terminal gate confirmation</h2><p>The AI can send a structured request to the terminal and carrier. The case will remain open and re-validate automatically when a reply arrives.</p><div class="modal-summary"><strong>Recipients</strong><p>Rotterdam Terminal Operations<br>Ocean carrier control desk</p></div><div class="modal-actions"><button class="ghost" onclick="document.querySelector('#modal-close').click()">Cancel</button><button class="primary" id="send-request">Send request</button></div>`);
document.addEventListener('click',e=>{if(e.target?.id==='send-request'){closeModal();toast('Demo request prepared; no message was sent')}});
function overrideAi(){openModal(`<p class="eyebrow">Human override</p><h2>Correct the assessment or action</h2><p>Your correction will be preserved in the audit history and reviewed as a learning candidate after closure.</p><label>Actual cause<textarea style="width:100%;min-height:70px;margin-top:6px;border:1px solid #dce3e7;border-radius:8px;padding:10px">Terminal labor shortage</textarea></label><label style="display:block;margin-top:12px">Preferred action<textarea style="width:100%;min-height:70px;margin-top:6px;border:1px solid #dce3e7;border-radius:8px;padding:10px">Escalate to regional operations before committing cost</textarea></label><div class="modal-actions"><button class="ghost" onclick="document.querySelector('#modal-close').click()">Cancel</button><button class="primary" id="apply-override">Update recommendation</button></div>`) }
$$('.override-ai').forEach(button=>button.onclick=e=>{e.stopPropagation();selectedAction=button.closest('.action-card').dataset.action;overrideAi()});
document.addEventListener('click',e=>{if(e.target?.id==='apply-override'){audit.unshift([new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),'Coordinator overrode AI assessment','user/sourav']);renderAudit();closeModal();toast('Override recorded · Recommendation refreshed')}});
$('#explain-ai').onclick=()=>openModal(`<p class="eyebrow">Reasoning trace</p><h2>Why the delay is likely</h2><p>The model correlated the revised discharge event with the released rail slot and compared the resulting ETA against the customer commitment.</p><div class="modal-summary"><strong>Strongest contributors</strong><p>1. Rail slot unavailable — 41%<br>2. Discharge estimate +19h — 34%<br>3. Historical terminal recovery — 15%<br>4. Remaining signals — 10%</p></div><p><small>Confidence reflects evidence agreement and model reliability for comparable routes. It is not a guarantee.</small></p>`);
$('#new-exception').onclick=()=>{
 openModal(`<p class="eyebrow">Manual entry</p><h2>Create an exception</h2><p>Add a shipment issue to the demo inbox. It will be saved in this browser for review.</p><form id="new-case-form" class="case-form"><label>Exception title<input name="title" required maxlength="90" placeholder="e.g. Customs documents missing"></label><div class="form-row"><label>Origin<input name="origin" required maxlength="40" placeholder="e.g. Dhaka"></label><label>Destination<input name="destination" required maxlength="40" placeholder="e.g. Toronto"></label></div><label>What happened?<textarea name="detail" required maxlength="240" placeholder="Describe the issue and what is known so far"></textarea></label><label>Priority<select name="priority"><option value="P1">P1 · Critical</option><option value="P2" selected>P2 · High</option><option value="P3">P3 · Medium</option></select></label><div class="modal-actions"><button class="ghost" type="button" id="cancel-new-case">Cancel</button><button class="primary" type="submit">Create exception</button></div></form>`);
 $('#cancel-new-case').onclick=closeModal;
 $('#new-case-form').onsubmit=e=>{e.preventDefault();const data=new FormData(e.currentTarget);const item={id:`EXC-${Date.now().toString().slice(-8)}`,p:data.get('priority'),title:String(data.get('title')).trim(),route:`${String(data.get('origin')).trim()} → ${String(data.get('destination')).trim()}`,detail:String(data.get('detail')).trim(),time:'Now',owner:'You',uncertainty:'Unknown · Unverified',events:['Exception created manually in this browser']};if(!item.title||!item.detail||!String(data.get('origin')).trim()||!String(data.get('destination')).trim()){toast('Complete all fields before creating the exception');return}exceptions.unshift(item);selectedId=item.id;currentFilter='all';$$('.chip,.filter-option').forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));saveCases();renderExceptions();closeModal();toast('Exception created in your browser');};
};
function closeCaseMenu(){$('#case-menu').classList.add('hidden');$('#more-menu').setAttribute('aria-expanded','false')}
$('#more-menu').onclick=e=>{e.stopPropagation();const open=$('#case-menu').classList.toggle('hidden')===false;$('#more-menu').setAttribute('aria-expanded',String(open))};
$('#case-menu').onclick=e=>e.stopPropagation();
$('#assign-case').onclick=()=>{const item=exceptions.find(x=>x.id===selectedId);item.owner='You';(item.events??=[]).unshift('Assigned to you');saveCases();closeCaseMenu();renderExceptions();toast('Exception assigned to you')};
$('#case-audit').onclick=()=>{const item=exceptions.find(x=>x.id===selectedId);closeCaseMenu();if(item.id==='EXC-2481'){switchTab('audit');return}const events=item.events?.length?item.events:['No recorded actions yet'];openModal(`<p class="eyebrow">Case history</p><h2>Audit history</h2><p>${escapeHtml(item.id)} · ${escapeHtml(item.title)}</p><div class="modal-summary">${events.map(event=>`<p>${escapeHtml(event)}</p>`).join('')}</div><p><small>Demo history is saved only in this browser.</small></p>`)};
$('#copy-case').onclick=async()=>{closeCaseMenu();try{await navigator.clipboard.writeText(selectedId);toast('Exception ID copied')}catch(_){openModal(`<p class="eyebrow">Exception ID</p><h2>${escapeHtml(selectedId)}</h2><p>Select and copy this ID.</p>`)}};
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
document.addEventListener('click',()=>{$('#filter-popover').classList.add('hidden');$('#filter-toggle').setAttribute('aria-expanded','false');closeCaseMenu()});
$$('.nav-item').forEach(n=>n.onclick=()=>{ $$('.nav-item').forEach(x=>x.classList.remove('active'));n.classList.add('active');if(n.dataset.view!=='inbox')toast(`${n.textContent.trim()} view is represented in the active case prototype`);});
$$('.top-tab').forEach(n=>n.onclick=()=>{ $$('.top-tab').forEach(x=>x.classList.remove('active'));n.classList.add('active');if(n.dataset.view!=='inbox')toast(`${n.textContent.trim()} view is represented in the active case prototype`);});
renderExceptions();renderEvidence();renderTimeline();renderAudit();
