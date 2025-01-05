import { useRouter } from 'next/router';
import AudioPlayerDownloads from './components/AudioPlayerDownloads';

export default function Success() {
    const router = useRouter();
    const { session_id } = router.query;

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-5">
            <h1 className="text-4xl font-bold mb-6">Payment Successful!</h1>
            <p className="text-lg mb-4"> {session_id}</p>
            <AudioPlayerDownloads />
            {/* Добавьте любые другие сообщения или действия по желанию */}
        </div>
    );
}
