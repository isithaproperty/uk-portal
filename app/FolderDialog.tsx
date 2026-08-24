"use client";
import type {ComplianceRecord} from "./complianceTiming";
import {reviewOptions,timeRemaining} from "./complianceTiming";
type Props={building:string;heading:string;folder:string;record?:ComplianceRecord;onUpload:(file?:File)=>void;onReviewDays:(days:number)=>void;onClose:()=>void};
export default function FolderDialog({building,heading,folder,record,onUpload,onReviewDays,onClose}:Props){
 const status=!record?"Awaiting document":record.dueAt<Date.now()?"Overdue":record.dueAt-Date.now()<Math.min(record.reviewDays*.2,30)*86400000?"Due soon":"Compliant";
 return <div className="folder-dialog-backdrop" onClick={onClose}><section className="folder-dialog" role="dialog" aria-modal="true" aria-labelledby="folder-dialog-title" onClick={e=>e.stopPropagation()}><header><div><p className="eyebrow">{building} · {heading}</p><h2 id="folder-dialog-title">{folder}</h2></div><button className="folder-dialog-close" onClick={onClose} aria-label="Close folder">×</button></header>
 <div className={`folder-dialog-status ${status==="Compliant"?"compliant":"attention"}`}><i/><div><span>Current folder status</span><strong>{status}</strong></div></div>
 <div className="folder-timing"><label>Review frequency<select value={record?.reviewDays||365} onChange={e=>onReviewDays(Number(e.target.value))}>{reviewOptions.map(o=><option value={o.days} key={o.days}>{o.label}</option>)}</select></label>{record?<div><span>Uploaded <b>{new Date(record.uploadedAt).toLocaleDateString("en-GB")}</b></span><span>Next due <b>{new Date(record.dueAt).toLocaleDateString("en-GB")}</b></span><strong>{timeRemaining(record.dueAt)}</strong></div>:<p>The countdown will begin automatically from the document upload date.</p>}</div>
 <div className="folder-dialog-documents"><h3>Documents</h3>{record?<div className="folder-document-row"><span>▤</span><div><strong>{record.filename}</strong><small>Uploaded {new Date(record.uploadedAt).toLocaleString("en-GB")}</small></div></div>:<div className="folder-dialog-empty"><span>▰</span><strong>No documents in this folder yet</strong><small>Upload the first controlled record to start its timer.</small></div>}</div>
 <footer><label className="primary">↑ Upload document<input hidden type="file" onChange={e=>onUpload(e.target.files?.[0])}/></label><button className="outline" onClick={onClose}>Close</button></footer></section></div>
}
