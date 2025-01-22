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

后端已经配置好了框架与依赖

先帮我配置数据库，需要用户表(user_id,username,password,生成时间,修改时间)， chat_sessions（使用uuid 作为主键 ，关联用户user_id,代表每个用户拥有哪些聊天），chat_messages（关联chat_sessions，关联用户）

配置chat_sessions 和 chat message的路由以及逻辑




@https://api-docs.deepseek.com/zh-cn/  现在配接ai聊天的api 在.env中配置环境变量 deepseekApi 和baseURL ,框架使用openai,使用stream方式,需要关联上下文






