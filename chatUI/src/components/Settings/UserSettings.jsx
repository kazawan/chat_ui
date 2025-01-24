import React from 'react';

const UserSettings = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-white w-full max-w-[1280px] mx-auto">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">个人设置</h2>
        
        {/* 个人信息设置 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">基本信息</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">头像</label>
              <div className="mt-2 flex items-center space-x-4">
                <img
                  src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=guest"}
                  alt="Avatar"
                  className="h-16 w-16 rounded-full object-cover"
                />
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-black hover:bg-gray-50">
                  更换头像
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">用户名</label>
              <input
                type="text"
                defaultValue={user.name}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">邮箱</label>
              <input
                type="email"
                defaultValue={user.email}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              />
            </div>
          </div>
        </div>

        {/* 账号安全设置 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">账号安全</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">当前密码</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">新密码</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">确认新密码</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              />
            </div>
          </div>
        </div>

        {/* 保存按钮 */}
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            保存修改
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;