import { RiMessage2Line, RiTimeLine, RiStarLine } from "react-icons/ri";

const conversations = [
  {
    id: 1,
    title: "关于React性能优化的讨论",
    timestamp: "2024-01-24 14:30",
    isStarred: true,
    preview: "讨论了React组件优化的几种方法..."
  },
  {
    id: 2,
    title: "数据库设计方案",
    timestamp: "2024-01-24 11:20",
    isStarred: false,
    preview: "探讨了几种不同的数据库架构..."
  },
  {
    id: 3,
    title: "API接口规范制定",
    timestamp: "2024-01-23 16:45",
    isStarred: true,
    preview: "制定了团队的API接口开发规范..."
  }
];

const ConversationList = ({ isOpen }) => {
  return (
    <div className="flex-1 overflow-y-auto conversation-list">
      <div className="space-y-2 p-4">
        {conversations.map((conv, index) => (
          <div
            key={conv.id}
            className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-all duration-300 transform"
            style={{
              opacity: isOpen ? 1 : 0,
              transform: `translateX(${isOpen ? '0' : '-20px'})`,
              transitionDelay: `${(index + 2) * 50}ms`
            }}
          >
            {/* 主要内容区 */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <RiMessage2Line className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 truncate pr-2">
                    {conv.title}
                  </h3>
                  <button 
                    className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                      conv.isStarred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                    }`}
                  >
                    <RiStarLine className="w-4 h-4" />
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                  {conv.preview}
                </p>
                <div className="mt-1 flex items-center text-xs text-gray-400">
                  <RiTimeLine className="w-3 h-3 mr-1" />
                  <span>{conv.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;