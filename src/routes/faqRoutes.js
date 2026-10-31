const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
router.get('/', async (req,res,next) => { try { const {rows}=await db.query('SELECT id,category,question,answer,updated_at FROM faqs WHERE is_active=TRUE ORDER BY category,question'); res.json({faqs:rows}); } catch(e){next(e);} });
router.post('/', auth('admin'), async(req,res,next)=>{ try { const {category='General',question,answer}=req.body; if(!question||!answer)return res.status(400).json({error:'Question and answer are required'}); const {rows}=await db.query('INSERT INTO faqs(category,question,answer,created_by) VALUES($1,$2,$3,$4) RETURNING *',[category,question,answer,req.user.id]); res.status(201).json({faq:rows[0]}); }catch(e){next(e);} });
router.put('/:id', auth('admin'), async(req,res,next)=>{ try { const {category,question,answer,is_active=true}=req.body; const {rows}=await db.query('UPDATE faqs SET category=COALESCE($1,category),question=COALESCE($2,question),answer=COALESCE($3,answer),is_active=$4,updated_at=NOW() WHERE id=$5 RETURNING *',[category,question,answer,is_active,req.params.id]); if(!rows[0])return res.status(404).json({error:'FAQ not found'}); res.json({faq:rows[0]}); }catch(e){next(e);} });
router.delete('/:id', auth('admin'), async(req,res,next)=>{ try { const result=await db.query('UPDATE faqs SET is_active=FALSE,updated_at=NOW() WHERE id=$1',[req.params.id]); if(!result.rowCount)return res.status(404).json({error:'FAQ not found'}); res.json({message:'FAQ archived'}); }catch(e){next(e);} });
module.exports=router;
