export default function ChatMessages() {
  return (
    <div className="flex-1 p-4 bg-white overflow-y-auto max-w-full overflow-x-hidden">
      <div className="bg-gray p-4 rounded-lg mb-4">
        <div className="text-gradient text-sm text-center">
          欢迎使用deepseekChatUI
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex flex-col space-y-4">
          <UserMessage message="用户消息" />
          <BotMessage message="# python打印 hello world 函数 ``` python def hello_world(): print('hello world') ```" />
        </div>
      </div>
    </div>
  );
}

function UserMessage({ message }) {
  return (
    <div className="flex justify-end">
      <div className="bg-black p-2 rounded-lg max-w-[70%] text-white text-sm">{message}</div>
    </div>
  );
}

function BotMessage({ message }) {
  return (
    <div className="flex justify-start">
      <div className="bg-black text-white p-2 rounded-lg max-w-[70%] text-sm">
        {message.split('<br />').map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
} 