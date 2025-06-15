import NavBar from '../components/NavBar';
import developerImg from '../assets/developer.jpg';

export default function AboutPage() {
  return (
    <>
      <NavBar />
      <div className="flex flex-col md:flex-row items-center justify-between min-h-[80vh] px-8 py-12 bg-black rounded-2xl shadow-2xl">
        {/* Left: About Content */}
        <div className="flex-1 flex flex-col gap-6 max-w-2xl">
          <h1 className="text-4xl font-bold text-blue-200 mb-2 drop-shadow">About College Media</h1>
          <p className="text-lg text-blue-100 leading-relaxed">
            <span className="font-semibold text-blue-400">College Media</span> was created to empower students who feel shy or hesitant to ask doubts or seek guidance from seniors. Many students miss out on valuable learning and personal growth opportunities due to hesitation or lack of a supportive platform. Our mission is to bridge this gap and foster meaningful interactions between juniors and seniors, making knowledge sharing accessible and comfortable for everyone.
          </p>
          <h2 className="text-2xl font-semibold text-blue-300 mt-4">Key Features</h2>
          <ul className="list-disc pl-6 text-blue-100 space-y-2">
            <li>
              <span className="font-semibold text-blue-300">Post Questions:</span> Ask questions openly or <span className="italic">anonymously</span> to get help from peers and seniors without fear of judgment. You earn points for asking questions, posting answers, and when your posts get upvoted by others.
            </li>
            <li>
              <span className="font-semibold text-blue-300">Anonymous Chat:</span> Start real-time chats with other users, including a robust anonymous mode. This allows you to seek help or guidance privately, encouraging honest and open conversations.
            </li>
            <li>
              <span className="font-semibold text-blue-300">Interest-Based Tags:</span> Select tags based on your interests. Your feed will only show questions and discussions relevant to the tags you choose, ensuring a personalized and meaningful experience.
            </li>
            <li>
              <span className="font-semibold text-blue-300">Materials Uploading:</span> Upload notes and study materials to your profile. Other users can view the materials you have uploaded by visiting your profile.
            </li>
            <li>
              <span className="font-semibold text-blue-300">Personalized Experience:</span> Bookmark posts and customize your profile to make the platform your own.
            </li>
          </ul>
          <h2 className="text-2xl font-semibold text-blue-300 mt-4">Points & Recognition</h2>
          <p className="text-lg text-blue-100 leading-relaxed">
            Earn points for asking questions, posting answers, and receiving upvotes from other users. Points help you build your reputation and encourage active participation in the community.
          </p>
          <h2 className="text-2xl font-semibold text-blue-300 mt-4">Why College Media?</h2>
          <p className="text-lg text-blue-100 leading-relaxed">
            By supporting anonymous interactions and interest-based tags, College Media helps break down social barriers and encourages every student to participate, learn, and grow. Whether you want to ask a question, help others, or share resources, this platform is designed to make your college journey more collaborative and successful.
          </p>
        </div>
        {/* Right: Developer Photo */}
        <div className="flex-1 flex flex-col justify-center items-center mt-10 md:mt-0 md:ml-12">
          <img
            src={developerImg}
            alt="Developer"
            className="rounded-2xl shadow-2xl w-[26rem] h-[26rem] object-cover bg-transparent select-none pointer-events-none fixed right-16 top-[57%] -translate-y-1/2 z-20"
          />
        </div>
      </div>
    </>
  );
}

