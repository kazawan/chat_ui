import React from 'react';

// 模拟笔记数据
const mockNotes = [
  {
    id: 1,
    title: '项目计划',
    content: '完成AI助手的基础功能开发...',
    date: '2025-01-24',
    tags: ['工作', '项目']
  },
  {
    id: 2,
    title: '学习笔记',
    content: 'React Router使用总结...',
    date: '2025-01-23',
    tags: ['学习', 'React']
  },
  {
    id: 3,
    title: '会议纪要',
    content: '讨论了新功能的实现方案...',
    date: '2025-01-22',
    tags: ['工作', '会议']
  }
];

const Notes = () => {
  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">我的笔记</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            新建笔记
          </button>
        </div>

        {/* 笔记列表 */}
        <div className="grid gap-4">
          {mockNotes.map(note => (
            <div key={note.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-semibold text-gray-700">{note.title}</h2>
                <span className="text-sm text-gray-500">{note.date}</span>
              </div>
              
              <p className="text-gray-600 mb-4">{note.content}</p>
              
              <div className="flex gap-2">
                {note.tags.map(tag => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notes;