// 初始化默认数据
if (!localStorage.getItem('studentId')) {
  localStorage.setItem('studentId', 'student-001');
  localStorage.setItem('studentName', '守护者');
  localStorage.setItem('spriteName', '小光');
  localStorage.setItem('spriteElement', 'light');
  console.log('✅ 已初始化默认数据');
}
