// 引入我们在本地预生成的静态图标数据库
import db from '../../../db.json';

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    
    // 1. 获取前端传来的参数：分类名(k) 和 页码(p)
    const category = url.searchParams.get('k'); 
    const page = parseInt(url.searchParams.get('p')) || 1; // 默认第 1 页
    const pageSize = 20; // 每页加载 20 个，与本地保持一致

    // 跨域头配置
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    // 校验分类是否存在
    if (!category || !db[category]) {
        return new Response(JSON.stringify({ code: 404, msg: '找不到分类', data: [] }), { headers: corsHeaders });
    }

    // 2. 从 JSON 中取出该分类下的【所有】图标数组
    const allFiles = db[category];

    // ==========================================
    // 🌟 同步新增的分页逻辑
    // ==========================================
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    // 切割数组，只取前端当前请求的那一页数据
    const paginatedFiles = allFiles.slice(startIndex, endIndex);

    // 3. 应用 "魔法垫片" 防砍策略
    const svgList = paginatedFiles.map(file => `xxx${file}`);

    // 4. 返回分页后的数据
    return new Response(JSON.stringify({
        code: 200,
        msg: 'success',
        data: svgList
    }), { headers: corsHeaders });
}