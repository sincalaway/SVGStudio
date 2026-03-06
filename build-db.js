const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'graphic-pro', 'min');
const db = {};

// 扫描所有分类文件夹
const categories = fs.readdirSync(targetDir);

categories.forEach(category => {
    const catPath = path.join(targetDir, category);
    if (fs.statSync(catPath).isDirectory()) {
        // 把每个分类下的 svg 文件名存入数组
        db[category] = fs.readdirSync(catPath).filter(f => f.endsWith('.svg'));
    }
});

// 生成一个静态的 json 数据库
fs.writeFileSync('db.json', JSON.stringify(db));
console.log('✅ 图标数据库 db.json 已成功生成！');