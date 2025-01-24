// 模拟用户数据
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123', // 实际项目中密码应该被加密
    name: '管理员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
  },
  {
    id: 2,
    username: 'test',
    password: 'test123',
    name: '测试用户',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test'
  }
];

// 模拟登录延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟登录服务
export const mockLogin = async (username, password) => {
  // 模拟网络延迟
  await delay(1000);

  const user = mockUsers.find(u => u.username === username);

  if (!user || user.password !== password) {
    throw new Error('用户名或密码错误');
  }

  // 创建模拟token
  const token = btoa(`${user.id}:${user.username}:${Date.now()}`);

  // 返回用户信息（不包含密码）和token
  const { password: _, ...userWithoutPassword } = user;
  
  return {
    token,
    user: userWithoutPassword
  };
};