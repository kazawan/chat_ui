已经配置好react 和tailwindcss 了 ，帮我生成一个ai聊天app ui界面
# 侧边栏 
 - 顶部为NAVIBAR黑底白字 显示logo 和用户头像 名称
 - 下面为灰底 黑字 显示聊天列表 并带有新增聊天按钮
# 聊天界面
 - 顶部为白底黑字 显示当前聊天对象 居中显示
 - 底部为灰底黑字 显示输入框 和发送按钮
 - 中间为白底黑字 显示聊天记录



 后端
 - 框架 express cors nodemon sqlite3   bcrypt  jwtwebtoken openai

 ### users 表：
    - user_id
    - username
    - password
    - created_at
    - updated_at

SQL Schema
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT, -- 自动递增的ID
    username TEXT NOT NULL,                   -- 用户名
    password TEXT NOT NULL,                     -- 密码
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- 创建时间
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP -- 更新时间
);

 为了在 SQLite 数据库中持久化 AI 聊天用户的聊天对话 ID、上下文信息和 system prompt，我们需要设计一个结构合理的数据表。以下是一个可能的表结构：



### chat_sessions 表：

session_id: 自动递增的主键，用于唯一标识每个会话。
user_id: 用户的唯一标识符。
start_time: 会话的开始时间，默认为当前时间。
end_time: 会话的结束时间，可以在会话结束时更新。
system_prompt: system prompt 的内容。


SQL Schema
CREATE TABLE chat_sessions (
    session_id INTEGER PRIMARY KEY AUTOINCREMENT, -- 自动递增的会话ID
    user_id TEXT NOT NULL,                        -- 用户ID
    start_time DATETIME DEFAULT CURRENT_TIMESTAMP, -- 会话开始时间
    end_time DATETIME,                            -- 会话结束时间
    system_prompt TEXT                            -- system prompt 内容
);



### chat_messages 表：

message_id: 自动递增的主键，用于唯一标识每条消息。
session_id: 关联的会话ID，外键引用 chat_sessions 表中的 session_id。
sender: 发送者，值可以是 user 或 system。
message: 消息的内容。
timestamp: 消息的发送时间，默认为当前时间。


SQL Schema
CREATE TABLE chat_messages (
    message_id INTEGER PRIMARY KEY AUTOINCREMENT, -- 自动递增的消息ID
    session_id INTEGER,                           -- 关联的会话ID
    sender TEXT,                                  -- 发送者（user 或 system）
    message TEXT,                                 -- 消息内容
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, -- 消息发送时间
    FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id) -- 外键关联chat_sessions表
);



## api 接口

- user
    - 注册
    - 登录
    - 登出
    - 获取用户信息
- chat_sessions
    - 创建会话
    - 获取会话列表
    - 获取会话详情
    - 更新会话
    - 删除会话
- chat_messages
    - 发送消息
    - 获取消息列表
    - 获取消息详情
    - 更新消息
    - 删除消息
- ai_talk
    - 发送请求流式返回

## api 接口格式

- user 
    - /api/user/
- chat_session
    - /api/chat_session/
- chat_message
    - /api/chat_message/
- ai_talk
    - /api/ai_talk_stream/







