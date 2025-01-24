import React from 'react';

const Home = () => {
  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">欢迎使用AI助手</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* 特性卡片 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">智能对话</h2>
            <p className="text-gray-600">与AI进行自然流畅的对话，获取即时的帮助和建议。</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">知识管理</h2>
            <p className="text-gray-600">轻松记录和整理您的笔记，建立个人知识库。</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">协作分享</h2>
            <p className="text-gray-600">与团队成员共享信息，提高协作效率。</p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">开始使用</h2>
          <p className="text-gray-600 mb-4">
            立即开始您的AI助手之旅，探索更多可能性。
          </p>
          <button 
            onClick={() => window.location.href = '/chat'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            开始对话
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;