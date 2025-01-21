import { useState } from 'react';
import LogoutIcon from '../icons/Logout_icon';
import HideSidebarIcon from '../icons/Hide_sidebar_icon';

const UserProfile = ({ user, onClose, onLogout }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-black rounded-none relative">
      <div className="flex flex-col space-y-1 w-full">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-500 flex items-center justify-center text-white font-semibold border-2 border-white">
            {user?.username ? user.username[0].toUpperCase() : '?'}
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-black px-3 py-1 rounded-full text-white">
              {user?.username || '未登录'}
            </div>
            {user && (
              <button
                onClick={onLogout}
                className="h-6 w-6 flex items-center text-white hover:text-red-500 transition-colors border-2 border-white rounded p-1"
                title="退出登录"
              >
                <LogoutIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        <button
          className="absolute right-4 bottom-4 text-white hover:text-gray-300 transition-colors border-2 border-white p-1 rounded"
          onClick={onClose}
          title="隐藏侧边栏"
        >
          <HideSidebarIcon className="h-6 w-6" />
        </button>
        <div className="w-full">
          <div className="text-green-500 text-sm">700/1000 tokens</div>
          <div className="w-full bg-gray-600 rounded-full h-1.5">
            <div className="bg-green-500 h-1.5 rounded-full" style={{width: '30%'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 