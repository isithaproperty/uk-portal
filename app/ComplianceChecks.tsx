"use client";
import { useEffect, useMemo, useState } from "react";
type Check = { id:string; name:string; frequency:string; days:number; contractor:boolean; note:string };
const checks:Check[]=[
 {id:"alarm-weekly",name:"Fire alarm test",frequency:"Weekly",days:7,contractor:false,note:"Use a different manual call point each week and record the result."},
 {id:"alarm-quarterly",name:"Fire alarm service",frequency:"Quarterly",days:91,contractor:true,note:"Enhanced quarterly contractor service schedule."},
 {id:"lighting-monthly",name:"Emergency lighting function test",frequency:"Monthly",days:30,contractor:false,note:"Short functional test of every emergency lighting unit."},
 {id:"riser-annual",name:"Dry / wet riser pressure test",frequency:"Annually",days:365,contractor:true,note:"Annual pressure and flow test by a competent specialist."}
];
function remaining(ms:number){const late=ms<0,total=Math.ceil(Math.abs(ms)/3600000),days=Math.floor(total/24),hours=total%24;return `${late?"Overdue by ":"Due in "}${days}d ${hours}h`}
export default function ComplianceChecks({building}:{building:string}){
 const storageKey=`legal-checks-${building}`,[now,setNow]=useState(()=>Date.now());
 const[due,setDue]=useState<Record<string,number>>(()=>Object.fromEntries(checks.map((c,i)=>[c.id,Date.now()+c.days*86400000-i*86400000])));
 useEffect(()=>{const saved=window.localStorage.getItem(storageKey);if(saved)setDue(JSON.parse(saved))},[storageKey]);
 useEffect(()=>{window.localStorage.setItem(storageKey,JSON.stringify(due))},[due,storageKey]);
 useEffect(()=>{const timer=window.setInterval(()=>setNow(Date.now()),60000);return()=>window.clearInterval(timer)},[]);
 const summary=useMemo(()=>checks.reduce((r,c)=>{const left=due[c.id]-now,threshold=Math.min(c.days*.2,14)*86400000;if(left<0)r.overdue++;else if(left<threshold)r.dueSoon++;else r.current++;return r},{current:0,dueSoon:0,overdue:0}),[due,now]);
 function complete(c:Check){setDue(x=>({...x,[c.id]:Date.now()+c.days*86400000}));setNow(Date.now())}
 return <section className="checks-workspace"><div className="section-tools"><div><h2>Legal checks & timers</h2><p>Recurring checks for {building}. Completing a check automatically starts its next countdown.</p></div><button className="outline">⇩ Export log</button></div>
 <div className="check-summary"><span className="green"><b>{summary.current}</b> Current</span><span className="orange"><b>{summary.dueSoon}</b> Due soon</span><span className="red"><b>{summary.overdue}</b> Overdue</span></div>
 <div className="check-grid">{checks.map(c=>{const left=due[c.id]-now,threshold=Math.min(c.days*.2,14)*86400000,status=left<0?"overdue":left<threshold?"due-soon":"current";return <article className={`check-card ${status}`} key={c.id}><header><div><span>{c.frequency}</span><h3>{c.name}</h3></div><em>{status==="current"?"Compliant":status==="due-soon"?"Due soon":"Overdue"}</em></header><div className="countdown"><small>NEXT CHECK</small><strong>{remaining(left)}</strong><span>{new Date(due[c.id]).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</span></div><p>{c.note}</p><small className="responsibility">{c.contractor?"Competent contractor required":"Routine responsible-person check"}</small><footer><label>↑ Upload evidence<input hidden type="file"/></label><button onClick={()=>complete(c)}>✓ Mark complete</button></footer></article>})}</div>
 <p className="check-guidance">Schedules should also follow the building fire-risk assessment, system specification, manufacturer instructions and advice from the appointed competent person.</p></section>
}
