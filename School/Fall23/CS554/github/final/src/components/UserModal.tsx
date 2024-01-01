import { ReactNode } from "react";

export default function UserModal({ children, isOpen, onClose }: { children: ReactNode, isOpen: boolean, onClose: () => void }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
                {children}
                <button onClick={onClose} className="mt-4 py-2 px-4 bg-gray-600 rounded hover:bg-gray-300">Close</button>
            </div>
        </div>
    );

}