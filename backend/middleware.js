import jwt from 'jsonwebtoken';
export function requireAuth(req,res,next){try{const token=(req.headers.authorization||'').replace(/^Bearer\s+/i,'');if(!token)throw Error();req.user=jwt.verify(token,process.env.JWT_SECRET);next()}catch{return res.status(401).json({message:'Authentication required.'})}}
export function requireAdmin(req,res,next){if(req.user?.role!=='admin')return res.status(403).json({message:'Admin access required.'});next()}
export function validateSlug(req,res,next){if(req.body.slug)req.body.slug=String(req.body.slug).toLowerCase().trim().replace(/[^a-z0-9-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');next()}
export function asyncRoute(fn){return(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next)}
