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
      await navigator.clipboard.writeText(content);
      showMessage('success', '复制成功！');
    } catch (err) {
      console.error('复制失败:', err);
      showMessage('error', '复制失败');
    }
  };

  const handleRegenerate = (message) => {
    if (isLoading) {
      showMessage('warning', '正在生成回复，请稍候...');
      return;
    }
    onRegenerate(message.id);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            const language = match ? match[1] : '';
                            
                            if (inline) {
                              return (
                                <code
                                  className="bg-gray-800 px-1 py-0.5 rounded font-mono text-sm"
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            }

                            return (
                              <div className="relative group">
                                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                                    }}
                                    className="p-1 hover:bg-gray-700 rounded"
                                    title="复制代码"
                                  >
                                    <svg
                                      className="w-4 h-4 text-gray-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                      />
                                    </svg>
                                  </button>
                                </div>
                                {language && (
                                  <div className="absolute left-2 top-2 text-xs text-gray-400">
                                    {language}
                                  </div>
                                )}
                                <SyntaxHighlighter
                                  language={language}
                                  style={oneDark}
                                  customStyle={{
                                    margin: 0,
                                    marginTop: '0.5rem',
                                    background: '#1a1a1a',
                                    padding: '2rem 1rem 1rem',
                                    borderRadius: '0.5rem',
                                  }}
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              </div>
                            );
                          }
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
                            disabled={isLoading}
                            className={`${
                              isLoading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-500 hover:bg-green-600'
                            } px-2 py-1 rounded transition-colors flex items-center space-x-1 text-white`}
                          >
                            <svg className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>{isLoading ? '生成中...' : '重新生成'}</span>
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