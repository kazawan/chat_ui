import HideSidebarIcon from '../icons/Hide_sidebar_icon';

export default function UserProfile({ onClose }) {
  return (
    <div className="flex items-center justify-between p-4 bg-black rounded-none">
      <div className="flex flex-col space-y-1 relative w-full">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-500 flex items-center justify-center text-white font-semibold border-2 border-white">
            K
          </div>
          <div className="bg-black px-3 py-1 rounded-full text-white">
            kazawan
          </div>
        </div>
        <div className="w-full">
          <div className="text-green-500 text-sm">700/1000 tokens</div>
          <div className="w-full bg-gray-600 rounded-full h-1.5">
            <div className="bg-green-500 h-1.5 rounded-full" style={{width: '30%'}}></div>
          </div>
        </div>
        <button
          className="absolute right-0 top-0 text-white hover:text-gray-300 transition-colors border-2 border-white"
          onClick={onClose}
        >
          <HideSidebarIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
} 