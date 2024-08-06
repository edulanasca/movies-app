import { useRouter } from "next/navigation";

export default function AuthModal({ onCancel }: { onCancel: () => void }) {
    const router = useRouter();

    function handleAuthAction(action: 'login' | 'register') {
        router.push(`/auth/${action}`);
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Authentication Required</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300">Please log in or register to add favorites.</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={() => handleAuthAction('login')}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => handleAuthAction('register')}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Register
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 hover:bg-gray-400 text-black dark:text-white font-bold py-2 px-4 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}