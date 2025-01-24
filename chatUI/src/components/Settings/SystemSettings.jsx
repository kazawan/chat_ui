import React from 'react';

const SystemSettings = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-white w-full max-w-[1280px] mx-auto">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">系统设置</h2>
        
        {/* 界面设置 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">界面设置</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-800">深色模式</h4>
                <p className="text-sm text-gray-500">启用深色主题以减少眼睛疲劳</p>
              </div>
              <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-gray-200">
                <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-800">消息提醒</h4>
                <p className="text-sm text-gray-500">接收新消息时显示桌面通知</p>
              </div>
              <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-blue-600">
                <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-black">字体大小</label>
              <select className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black">
                <option>小</option>
                <option>中</option>
                <option>大</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI 对话设置 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">AI 对话设置</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black">对话模型</label>
              <select className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black">
                <option>GPT-3.5</option>
                <option>GPT-4</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black">上下文长度</label>
              <select className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black">
                <option>4条消息</option>
                <option>8条消息</option>
                <option>16条消息</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800">生成速度</label>
              <div className="mt-1">
                <input
                  type="range"
                  min="1"
                  max="5"
                  defaultValue="3"
                  className="w-full"
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>慢速 / 高质量</span>
                <span>快速 / 普通质量</span>
              </div>
            </div>
          </div>
        </div>

        {/* 数据与缓存 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">数据与缓存</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-black">缓存大小</h4>
              <p className="text-sm text-gray-500 mt-1">当前使用: 156MB</p>
              <button className="mt-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-black hover:bg-gray-50">
                清除缓存
              </button>
            </div>

            <div>
              <h4 className="text-sm font-medium text-black">导出数据</h4>
              <p className="text-sm text-gray-500 mt-1">导出所有聊天记录和设置</p>
              <button className="mt-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-black hover:bg-gray-50">
                导出数据
              </button>
            </div>
          </div>
        </div>

        {/* 保存按钮 */}
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;