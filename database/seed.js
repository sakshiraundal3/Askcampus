require('dotenv').config();
const fs=require('fs');const path=require('path');const db=require('../src/config/db');
(async()=>{try{await db.query(fs.readFileSync(path.join(__dirname,'seeds/001_faqs.sql'),'utf8'));console.log('Sample FAQs inserted.');}catch(e){console.error('Seed failed:',e.message);process.exitCode=1;}finally{await db.pool.end();}})();
