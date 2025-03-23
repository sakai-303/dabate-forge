import Link from 'next/link';

export default function BadRequestPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md p-8 bg-white rounded-lg shadow-md text-center">
                <h1 className="text-6xl font-bold text-red-600 mb-4">400</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bad Request</h2>
                <p className="text-gray-600 mb-8">
                    400
                </p>
                <Link
                    href="/"
                    className="inline-block px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                    ホームに戻る
                </Link>
            </div>
        </div>
    );
}
