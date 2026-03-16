#!/bin/bash
# 修复"正在连接"问题 - 添加默认数据

echo "🔧 正在修复学生端连接问题..."

# 创建初始化脚本
cat > client/public/init-data.js << 'EOF'
// 初始化默认数据
if (!localStorage.getItem('studentId')) {
  localStorage.setItem('studentId', 'student-001');
  localStorage.setItem('studentName', '守护者');
  localStorage.setItem('spriteName', '小光');
  localStorage.setItem('spriteElement', 'light');
  console.log('✅ 已初始化默认数据');
}
EOF

echo "✅ 修复完成！刷新页面即可正常访问"
echo ""
echo "访问地址："
echo "  学生端：http://localhost:3000"
echo "  教师端：http://localhost:3001"
echo "  启动页：http://localhost:8080/demo-index.html"
