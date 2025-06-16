import LoadingSpinner from '../assets/Loading.svg';

export default function LoadingProfile({ message = "Loading profile..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] w-full text-blue-300">
      <img src={LoadingSpinner} alt="Loading" className="w-16 h-16 mb-4 animate-spin" />
      <span className="text-xl font-semibold">{message}</span>
    </div>
  );
}
