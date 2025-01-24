import React from 'react';

const About = () => {
  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">关于我们</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">项目介绍</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            AI助手是一个基于先进人工智能技术的对话助手平台。我们致力于为用户提供智能、高效、
            便捷的对话体验，帮助用户更好地完成工作和学习任务。
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">核心功能</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-3 bg-blue-500 rounded-full"></span>
              <div>
                <h3 className="font-semibold text-gray-700">智能对话</h3>
                <p className="text-gray-600">支持自然语言交互，理解用户意图，提供准确回答</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-3 bg-blue-500 rounded-full"></span>
              <div>
                <h3 className="font-semibold text-gray-700">知识管理</h3>
                <p className="text-gray-600">提供笔记功能，帮助用户整理和管理重要信息</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-3 bg-blue-500 rounded-full"></span>
              <div>
                <h3 className="font-semibold text-gray-700">安全可靠</h3>
                <p className="text-gray-600">采用先进的安全措施，保护用户数据和隐私</p>
              </div>
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">技术栈</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <span className="font-semibold text-gray-700">React</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <span className="font-semibold text-gray-700">Node.js</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <span className="font-semibold text-gray-700">Express</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <span className="font-semibold text-gray-700">SQLite</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <span className="font-semibold text-gray-700">TailwindCSS</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <span className="font-semibold text-gray-700">Docker</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">联系我们</h2>
          <p className="text-gray-600 leading-relaxed">
            如果您有任何问题或建议，欢迎联系我们：
            <a href="mailto:support@aiassistant.com" className="text-blue-600 hover:underline ml-1">
              support@aiassistant.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;