import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import MessageContainer from '../MessageContainer';

SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('sql', sql);

const ChatMessages = ({ messages = [], currentChat, onRegenerate, isLoading }) => {
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  const [regeneratingId, setRegeneratingId] = useState(null);
  const [loadingDots, setLoadingDots] = useState('');
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const showMessage = (type, message) => {
    messageContainerRef.current?.addMessage(message, type);
  };

  const handleCopy = async (content) => {
    try {
      // 尝试使用现代Clipboard API
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(content);
      } else {
        // 回退方案：使用document.execCommand
        const textArea = document.createElement('textarea');
        textArea.value = content;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      showMessage('success', '复制成功！');
    } catch (err) {
      console.error('复制失败:', err);
      showMessage('error', '复制失败');
    }
  };

  const handleRegenerate = async (message) => {
    if (regeneratingId) {
      showMessage('warning', '正在生成回复，请稍候...');
      return;
    }
    console.log('开始重新生成，设置regeneratingId:', message.id);
    setRegeneratingId(message.id);
    try {
      await onRegenerate(message.id);
    } catch (error) {
      console.error('重新生成失败:', error);
    } finally {
      console.log('重新生成完成，清除regeneratingId');
      setRegeneratingId(null);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let timer;
    if (regeneratingId) {
      let count = 0;
      timer = setInterval(() => {
        count = (count + 1) % 4;
        setLoadingDots('.'.repeat(count));
      }, 500);
    }
    return () => {
      if (timer) clearInterval(timer);
      setLoadingDots('');
    };
  }, [regeneratingId]);

  if (!currentChat) {
  return (
    <div className="flex-1 p-4 bg-white overflow-y-auto max-w-full overflow-x-hidden">
      <div className="bg-gray p-4 rounded-lg mb-4">
        <div className="text-gradient text-sm text-center">
            {localStorage.getItem('token') 
              ? '欢迎使用 Deepseek Chat，请选择或创建一个对话'
              : '欢迎使用 Deepseek Chat，请先登录'
            }
        </div>
      </div>
    </div>
  );
}

  return (
    <>
      <MessageContainer ref={messageContainerRef} />
      <div className="flex-1 p-4 bg-white overflow-y-auto max-w-full overflow-x-hidden">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              <div
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-2 rounded-lg max-w-[70%] text-sm ${
                    message.role === 'user'
                      ? 'bg-black text-white'
                      : 'bg-black text-white'
                  }`}
                >
                  {message.role === 'user' ? (
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  ) : (
                    <>
                      <ReactMarkdown
                        className="markdown-body"
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                          p: ({ node, children }) => {
                            // Don't wrap code blocks in p tags
                            if (node.children && node.children.some(n => n.tagName === 'code')) {
                              return <>{children}</>;
                            }
                            return <p>{children}</p>;
                          },
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            const language = match ? match[1] : '';
                            
                            if (inline) {
                              return (
                                <code
                                  className="bg-[#1e1e1e] px-1.5 py-0.5 rounded text-gray-300 font-mono text-sm"
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            }

                            return (
                              <div className="relative group my-4">
                                <div className="flex items-center justify-between absolute w-full top-0 left-0 px-4 py-2 bg-gray-100 text-black text-xs rounded-none border-b border-gray-300">
                                  <div className="font-mono">
                                    {language}
                                  </div>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                                    }}
                                    className="hover:text-gray-700 transition-colors flex items-center gap-1"
                                    title="复制代码"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"
                                      />
                                    </svg>
                                    <span>复制代码</span>
                                  </button>
                                </div>
                                <div className="rounded-lg overflow-hidden">
                                  <SyntaxHighlighter
                                    language={language}
                                    style={oneDark}
                                    customStyle={{
                                      margin: 0,
                                      background: '#ffffff',
                                      padding: '3rem 1rem 1rem',
                                      borderRadius: '0.5rem',
                                      fontSize: '0.875rem',
                                      lineHeight: '1.5',
                                      color: '#000000',
                                    }}
                                    {...props}
                                  >
                                    {String(children).replace(/\n$/, '')}
                                  </SyntaxHighlighter>
                                </div>
                              </div>
                            );
                          },
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                      <div className="mt-2 p-2 bg-gray-100 border border-gray-300 rounded text-xs text-black flex items-center justify-between">
                        <span className="text-gray-500">
                          {formatTime(message.createdAt || Date.now())}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleRegenerate(message)}
                            disabled={regeneratingId === message.id}
                            className={`${
                              regeneratingId === message.id 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-500 hover:bg-green-600'
                            } px-2 py-1 rounded transition-colors flex items-center space-x-1 text-white min-w-[90px] justify-center`}
                          >
                            {regeneratingId === message.id ? (
                              <>
                                <svg
                                  className="w-3 h-3 animate-spin -ml-1 mr-1 text-white"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  style={{ animationDuration: '1s' }}
                                >
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span className="inline-flex items-center">
                                  生成中{loadingDots}
                                </span>
                              </>
                            ) : (
                              <>
                                <svg 
                                  className="w-3 h-3" 
                                  viewBox="0 0 24 24" 
                                  fill="none" 
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                                <span>重新生成</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleCopy(message.content)}
                            className="bg-green-500 hover:bg-green-600 px-2 py-1 rounded transition-colors flex items-center space-x-1 text-white"
                          >
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            <span>复制内容</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </>
  );
};

export default ChatMessages; 