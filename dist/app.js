const exceptions=[
 {id:'EXC-2481',p:'P1',title:'Port congestion threatens delivery',route:'Rotterdam → Chicago',detail:'31h predicted delay · $42k at risk',time:'2m',owner:'You',uncertainty:'Likely · 82%'},
 {id:'EXC-2479',p:'P2',title:'Temperature excursion detected',route:'Singapore → Frankfurt',detail:'8.4°C for 22 min · Pharma',time:'11m',owner:'Mina',uncertainty:'Confirmed'},
 {id:'EXC-2476',p:'P2',title:'Customs documents incomplete',route:'Dhaka → Toronto',detail:'Commercial invoice mismatch',time:'26m',owner:'You',uncertainty:'Possible · 64%'},
 {id:'EXC-2471',p:'P3',title:'Tracking signal stale',route:'Shenzhen → Long Beach',detail:'No carrier event for 9h',time:'1h',owner:'Unassigned',uncertainty:'Unknown'},
 {id:'EXC-2468',p:'P3',title:'Warehouse handoff delayed',route:'Hamburg → Prague',detail:'Pickup missed by 46 min',time:'2h',owner:'Nadia',uncertainty:'Likely · 71%'},
 {id:'EXC-2464',p:'P3',title:'Delivery appointment at risk',route:'Antwerp → Lyon',detail:'Driver hours limit approaching',time:'3h',owner:'You',uncertainty:'Possible · 58%'}
];
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

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function renderExceptions(){
 const visible=exceptions.filter(e=>currentFilter==='all'||(currentFilter==='critical'&&e.p==='P1')||(currentFilter==='mine'&&e.owner==='You'));
 $('#exception-list').innerHTML=visible.map((e,i)=>`<button class="exception-item ${i===0?'active':''}" data-id="${e.id}"><div class="item-top"><span class="priority ${e.p.toLowerCase()}">${e.p}</span><time>${e.time}</time></div><strong>${e.title}</strong><p>${e.route}<br>${e.detail}</p><div class="item-bottom"><span>${e.uncertainty}</span><span class="mini-owner">${e.owner}</span></div></button>`).join('');
 $$('.exception-item').forEach(btn=>btn.onclick=()=>selectException(btn.dataset.id));
}
function setFilter(filter){
 currentFilter=filter;
 $$('.chip').forEach(button=>button.classList.toggle('active',button.dataset.filter===filter));
 $$('.filter-option').forEach(button=>button.classList.toggle('active',button.dataset.filter===filter));
 renderExceptions();
 const popover=$('#filter-popover');
 popover.classList.add('hidden');
 $('#filter-toggle').setAttribute('aria-expanded','false');
 const label={all:'Showing all 6 exceptions',critical:'Showing 1 critical exception',mine:'Showing 3 exceptions assigned to you'}[filter];
 toast(label);
}
function selectException(id){
 const e=exceptions.find(x=>x.id===id); $$('.exception-item').forEach(x=>x.classList.toggle('active',x.dataset.id===id));
 $('#case-title').textContent=e.title; $('#case-meta').textContent=`${e.id} · ${e.route}`; $('#priority-badge').textContent=`${e.p} ${e.p==='P1'?'Critical':'Priority'}`; $('#uncertainty-badge').textContent=e.uncertainty;
 if(id!=='EXC-2481'){ $('#what-happened').textContent=e.detail; $('#likely-cause').textContent='Evidence analysis is still in progress.'; $('#business-impact').textContent=`Route: ${e.route}. Priority review required.`; $('#missing-data').textContent='Latest partner confirmation.'; }
 else{ $('#what-happened').textContent='Vessel discharge moved by 19 hours. The connecting rail slot is now unavailable.'; $('#likely-cause').textContent='Terminal congestion following an unplanned crane outage.'; $('#business-impact').textContent='31h delay · SLA breach likely · $42k order at risk.'; $('#missing-data').textContent='Confirmed terminal gate appointment.'; }
}
function renderEvidence(){ $('#evidence-list').innerHTML=evidence.map(x=>`<div class="evidence-item"><div class="source-icon">${x[0]}</div><div><strong>${x[1]}</strong><p>${x[2]}</p></div><span class="source-state">${x[3]}</span></div>`).join(''); }
function renderTimeline(){ $('#timeline-list').innerHTML=timeline.map(x=>`<div class="timeline-item"><time>${x[0]}</time><div class="timeline-line"></div><div><strong>${x[1]}</strong><p>${x[2]}</p></div></div>`).join(''); }
function renderAudit(){ $('#audit-list').innerHTML=audit.map(x=>`<div class="audit-item"><strong>${x[0]}</strong><p>${x[1]}</p><code>${x[2]}</code></div>`).join(''); }
function switchTab(name){ $$('.case-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===name)); ['decision','evidence','timeline','audit'].forEach(t=>$(`#${t}-tab`).classList.toggle('hidden',t!==name)); }
$$('.case-tabs button').forEach(b=>b.onclick=()=>switchTab(b.dataset.tab)); $$('[data-tab-open]').forEach(b=>b.onclick=()=>switchTab(b.dataset.tabOpen));

const labels={expedite:['Expedite by dedicated truck','Additional confirmation required · Estimated cost $4,850'],rebook:['Rebook next rail departure','Low-risk approved action · Estimated cost $620'],hold:['Hold and continue monitoring','Low-risk approved action · No added cost']};
$$('.action-card').forEach(card=>card.onclick=()=>{selectedAction=card.dataset.action; $$('.action-card').forEach(x=>x.classList.toggle('selected',x===card)); $('#selected-label').textContent=labels[selectedAction][0]; $('#approval-note').textContent=labels[selectedAction][1]; $('#approve-action').textContent=card.dataset.risk==='high'?'Review and approve':'Approve action';});

function openModal(html){$('#modal-content').innerHTML=html;$('#modal-backdrop').classList.remove('hidden');}
function closeModal(){$('#modal-backdrop').classList.add('hidden');}
$('#modal-close').onclick=closeModal; $('#modal-backdrop').onclick=e=>{if(e.target.id==='modal-backdrop')closeModal()};
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.remove('hidden');setTimeout(()=>t.classList.add('hidden'),2800)}

$('#approve-action').onclick=()=>{
 const high=selectedAction==='expedite';
 openModal(`<p class="eyebrow">${high?'Higher-risk action':'Action approval'}</p><h2>${labels[selectedAction][0]}</h2><p>${high?'This action creates a new transport commitment and adds $4,850 in cost. Your explicit confirmation is required.':'This action is within your approval authority and can be executed immediately.'}</p><div class="modal-summary"><strong>Authority and prerequisites</strong><p>✓ Approval limit verified<br>✓ Carrier capacity available<br>✓ Duplicate execution check passed<br>✓ Customer notification drafted</p></div>${high?'<label class="confirm-check"><input type="checkbox" id="confirm-risk"> I understand the cost and downstream commitment.</label>':''}<div class="modal-actions"><button class="ghost" id="cancel-approval">Go back</button><button class="primary" id="confirm-action">Confirm and execute</button></div>`);
 $('#cancel-approval').onclick=closeModal; $('#confirm-action').onclick=()=>{if(high&&!$('#confirm-risk').checked){toast('Confirm the risk acknowledgement first');return} executeAction();};
};
function executeAction(){
 $('#modal-content').innerHTML=`<p class="eyebrow">Execution in progress</p><h2>Coordinating approved action</h2><p>Creating the carrier task, reserving capacity and preparing stakeholder updates.</p><div class="progress-track"><i id="execution-progress"></i></div><div id="execution-status">Running prerequisite checks…</div>`;
 requestAnimationFrame(()=>$('#execution-progress').style.width='100%');
 setTimeout(()=>{audit.unshift([new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),'Approved action executed','user/sourav']);renderAudit();$('#modal-content').innerHTML=`<p class="eyebrow">Execution succeeded</p><h2>Resolution is in progress</h2><p>The dedicated truck request was accepted. Customer and carrier notifications were delivered and monitoring is active.</p><div class="modal-summary"><strong>Next checkpoint</strong><p>Gate appointment confirmation due in 45 minutes. The exception will be re-evaluated when a new event arrives.</p></div><div class="modal-actions"><button class="ghost" id="view-audit">View audit</button><button class="primary" id="finish-execution">Continue monitoring</button></div>`;$('#view-audit').onclick=()=>{closeModal();switchTab('audit')};$('#finish-execution').onclick=()=>{closeModal();toast('Action executed · Monitoring new events')};},1500);
}
$('#request-info').onclick=()=>openModal(`<p class="eyebrow">Missing information</p><h2>Request terminal gate confirmation</h2><p>The AI can send a structured request to the terminal and carrier. The case will remain open and re-validate automatically when a reply arrives.</p><div class="modal-summary"><strong>Recipients</strong><p>Rotterdam Terminal Operations<br>Ocean carrier control desk</p></div><div class="modal-actions"><button class="ghost" onclick="document.querySelector('#modal-close').click()">Cancel</button><button class="primary" id="send-request">Send request</button></div>`);
document.addEventListener('click',e=>{if(e.target?.id==='send-request'){closeModal();toast('Information request sent · Response timer started')}});
$('#override-ai').onclick=()=>openModal(`<p class="eyebrow">Human override</p><h2>Correct the assessment or action</h2><p>Your correction will be preserved in the audit history and reviewed as a learning candidate after closure.</p><label>Actual cause<textarea style="width:100%;min-height:70px;margin-top:6px;border:1px solid #dce3e7;border-radius:8px;padding:10px">Terminal labor shortage</textarea></label><label style="display:block;margin-top:12px">Preferred action<textarea style="width:100%;min-height:70px;margin-top:6px;border:1px solid #dce3e7;border-radius:8px;padding:10px">Escalate to regional operations before committing cost</textarea></label><div class="modal-actions"><button class="ghost" onclick="document.querySelector('#modal-close').click()">Cancel</button><button class="primary" id="apply-override">Update recommendation</button></div>`);
document.addEventListener('click',e=>{if(e.target?.id==='apply-override'){audit.unshift([new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),'Coordinator overrode AI assessment','user/sourav']);renderAudit();closeModal();toast('Override recorded · Recommendation refreshed')}});
$('#explain-ai').onclick=()=>openModal(`<p class="eyebrow">Reasoning trace</p><h2>Why the delay is likely</h2><p>The model correlated the revised discharge event with the released rail slot and compared the resulting ETA against the customer commitment.</p><div class="modal-summary"><strong>Strongest contributors</strong><p>1. Rail slot unavailable — 41%<br>2. Discharge estimate +19h — 34%<br>3. Historical terminal recovery — 15%<br>4. Remaining signals — 10%</p></div><p><small>Confidence reflects evidence agreement and model reliability for comparable routes. It is not a guarantee.</small></p>`);
$('#new-exception').onclick=()=>toast('Manual exception creation opened in prototype mode');
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
document.addEventListener('click',()=>{$('#filter-popover').classList.add('hidden');$('#filter-toggle').setAttribute('aria-expanded','false')});
$$('.nav-item').forEach(n=>n.onclick=()=>{ $$('.nav-item').forEach(x=>x.classList.remove('active'));n.classList.add('active');if(n.dataset.view!=='inbox')toast(`${n.textContent.trim()} view is represented in the active case prototype`);});
renderExceptions();renderEvidence();renderTimeline();renderAudit();
