import {env} from "cloudflare:workers";

type Evidence={id:string;building:string;check_id:string;check_name:string;evidence_type:string;file_name:string;storage_key:string;completed_by:string;uploaded_at:number};

async function setup(){
 await env.DB.batch([
  env.DB.prepare("CREATE TABLE IF NOT EXISTS compliance_evidence (id TEXT PRIMARY KEY, building TEXT NOT NULL, check_id TEXT NOT NULL, check_name TEXT NOT NULL, evidence_type TEXT NOT NULL, file_name TEXT NOT NULL, storage_key TEXT NOT NULL, check_data TEXT, completed_by TEXT NOT NULL, uploaded_at INTEGER NOT NULL)"),
  env.DB.prepare("CREATE INDEX IF NOT EXISTS compliance_evidence_building_check_idx ON compliance_evidence(building, check_id, uploaded_at DESC)")
 ]);
}

export async function GET(request:Request){
 await setup();
 const url=new URL(request.url),fileId=url.searchParams.get("file");
 if(fileId){
  const record=await env.DB.prepare("SELECT storage_key FROM compliance_evidence WHERE id=?").bind(fileId).first() as {storage_key:string}|null;
  if(!record)return new Response("Not found",{status:404});
  const object=await env.BUCKET.get(record.storage_key);
  if(!object)return new Response("Not found",{status:404});
  return new Response(object.body,{headers:{"content-type":object.httpMetadata?.contentType||"application/octet-stream","cache-control":"private, max-age=300"}});
 }
 const building=url.searchParams.get("building")||"";
 if(!building)return Response.json([]);
 const result=await env.DB.prepare("SELECT * FROM compliance_evidence WHERE building=? ORDER BY uploaded_at DESC").bind(building).all() as {results:Evidence[]};
 return Response.json(result.results);
}

export async function POST(request:Request){
 await setup();
 const form=await request.formData(),file=form.get("file"),building=String(form.get("building")||""),checkId=String(form.get("checkId")||""),checkName=String(form.get("checkName")||""),evidenceType=String(form.get("evidenceType")||"photo"),completedBy=String(form.get("completedBy")||"Site staff"),checkData=String(form.get("checkData")||"{}");
 if(!(file instanceof File)||!building||!checkId||!checkName)return Response.json({error:"Building, check and evidence file are required"},{status:400});
 if(evidenceType==="photo"&&!file.type.startsWith("image/"))return Response.json({error:"Please select or take a photo"},{status:400});
 if(file.size>15*1024*1024)return Response.json({error:"Files must be smaller than 15 MB"},{status:400});
 const id=crypto.randomUUID(),uploadedAt=Date.now(),safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,"-")||"evidence",storageKey=`compliance/${building.replace(/[^a-zA-Z0-9_-]/g,"-")}/${checkId}/${uploadedAt}-${safeName}`;
 await env.BUCKET.put(storageKey,await file.arrayBuffer(),{httpMetadata:{contentType:file.type||"application/octet-stream"}});
 await env.DB.prepare("INSERT INTO compliance_evidence (id,building,check_id,check_name,evidence_type,file_name,storage_key,check_data,completed_by,uploaded_at) VALUES (?,?,?,?,?,?,?,?,?,?)").bind(id,building,checkId,checkName,evidenceType,file.name,storageKey,checkData,completedBy,uploadedAt).run();
 return Response.json({id,building,check_id:checkId,check_name:checkName,evidence_type:evidenceType,file_name:file.name,completed_by:completedBy,uploaded_at:uploadedAt},{status:201});
}
