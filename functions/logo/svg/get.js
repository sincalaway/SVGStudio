// Cloudflare Pages Functions 原生写法
export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    
    // 获取前端传来的分类和页码
    const category = url.searchParams.get('k');
    const page = parseInt(url.searchParams.get('p')) || 1;
    const pageSize = 20;

    try {
        // 🌟 核心魔法：向 Cloudflare 请求我们根目录的静态文件 db.json
        const dbUrl = new URL('/db.json', request.url);
        const response = await env.ASSETS.fetch(dbUrl);
        const db = await response.json();

        // 如果找不到分类
        if (!db[category]) {
            return new Response(JSON.stringify({ code: 404, msg: '找不到该分类', data: [] }), {
                headers: { 'Content-Type': 'application/json;charset=UTF-8' }
            });
        }

        // 分页逻辑
        const allFiles = db[category];
        const startIndex = (page - 1) * pageSize;
        const paginatedFiles = allFiles.slice(startIndex, startIndex + pageSize);

        // 加上魔法垫片 xxx 返回给前端
        const svgList = paginatedFiles.map(file => `xxx${file}`);

        return new Response(JSON.stringify({
            code: 200,
            msg: 'success',
            data: svgList
        }), {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        });
        
    } catch (err) {
        // 如果出错，返回错误信息方便排查
        return new Response(JSON.stringify({ code: 500, msg: '服务器读取JSON失败: ' + err.message, data: [] }), {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        });
    }
}