require('dotenv').config();
const fs=require('fs'); const path=require('path'); const db=require('../src/config/db');
(async()=>{try{const sql=fs.readFileSync(path.join(__dirname,'migrations/001_initial.sql'),'utf8');await db.query(sql);console.log('Database migration completed.');}catch(e){console.error('Migration failed:',e.message);process.exitCode=1;}finally{await db.pool.end();}})();
