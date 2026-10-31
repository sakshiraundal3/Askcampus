const router = require('express').Router();
const db = require('../config/db');
const { answerQuestion } = require('../services/ollama');
const auth = require('../middleware/auth');
router.post('/', async(req,res,next)=>{
  try {
    const question=String(req.body.question||'').trim();
    if(!question||question.length>1500)return res.status(400).json({error:'Enter a question (maximum 1500 characters)'});
    const result=await answerQuestion(question);
    let conversationId=null;
    if(req.headers.authorization){
      try { const header=req.headers.authorization; const jwt=require('jsonwebtoken'); const user=jwt.verify(header.replace(/^Bearer /,''),process.env.JWT_SECRET); const saved=await db.query('INSERT INTO conversations(user_id,question,answer) VALUES($1,$2,$3) RETURNING id',[user.id,question,result.answer]); conversationId=saved.rows[0].id; } catch {}
    }
    res.json({...result,conversationId});
  }catch(e){ if(e.message.startsWith('Ollama'))return res.status(503).json({error:'AI service is unavailable. Check that Ollama is running and the model is downloaded.'}); next(e); }
});
router.get('/history',auth(),async(req,res,next)=>{try{const {rows}=await db.query('SELECT id,question,answer,created_at FROM conversations WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50',[req.user.id]);res.json({conversations:rows});}catch(e){next(e);}});
module.exports=router;
