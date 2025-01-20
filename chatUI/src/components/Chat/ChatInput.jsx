import DocIcon from '../icons/Doc_icon';
import LoadingIcon from '../icons/loading_icon_ani';

export default function ChatInput({ isLoading, onSend, currentChat }) {
  return (
    <div className="p-4 bg-gray-200 sticky bottom-0">
      <div className="text-sm text-gray-500 mb-2">
        {currentChat ? `当前聊天：${currentChat}` : '请选择一个聊天'}
        <span className="ml-4">⚠️ctrl + i 聚焦到输入框.....</span>
      </div>
      <div className="flex space-x-2">
        <button
          className="px-4 py-2 bg-black text-white rounded-lg flex items-center justify-center active:scale-95 transition-transform"
          title="添加文档"
        >
          <DocIcon className="h-5 w-5" />
        </button>
        <input
          type="text"
          placeholder="输入消息..."
          className="flex-1 p-2 rounded-lg border"
        />
        <button
          className="px-4 py-2 bg-black text-white rounded-lg flex items-center justify-center"
          onClick={onSend}
        >
          {isLoading ? (
            <LoadingIcon className="h-5 w-5 animate-spin" />
          ) : (
            '发送'
          )}
        </button>
      </div>
    </div>
  );
} 