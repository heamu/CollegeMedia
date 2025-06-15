import FailedIcon from '../assets/Failed.svg';

export default function Failed({ message = "401 Unauthorized", subMessage = "Try reloading the page." }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] w-full text-red-400">
      <img src={FailedIcon} alt={message} className="w-28 h-28 mb-6 opacity-90" />
      <span className="text-3xl font-bold mb-2">{message}</span>
      <span className="text-lg text-red-200">{subMessage}</span>
    </div>
  );
}
