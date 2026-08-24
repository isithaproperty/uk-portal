import {env} from "cloudflare:workers";
import {setupContractors} from "./store";

export async function GET(){await setupContractors();const result=await env.DB.prepare("SELECT c.*, COUNT(d.id) document_count, SUM(CASE WHEN d.expiry_date!='' AND date(d.expiry_date)<date('now') THEN 1 ELSE 0 END) expired_count FROM contractors c LEFT JOIN contractor_documents d ON d.contractor_id=c.id GROUP BY c.id ORDER BY c.name").all();return Response.json(result.results)}

export async function POST(request:Request){await setupContractors();const body=await request.json() as Record<string,string>,id=crypto.randomUUID();if(!body.name||!body.trade||!body.email)return Response.json({error:"Company, trade and email are required"},{status:400});await env.DB.prepare("INSERT INTO contractors (id,name,trade,email,phone,coverage,status,notes,created_at) VALUES (?,?,?,?,?,?,?,?,?)").bind(id,body.name,body.trade,body.email,body.phone||"",body.coverage||"",body.status||"Approved",body.notes||"",Date.now()).run();return Response.json({id},{status:201})}
