export const IconInput = ({ icon, maxLength, type, ...props }) => {
    return (
        <div className="flex gap-2 sm:gap-3 border-2 sm:border-3 border-gray-300 rounded-lg p-2 sm:p-2 items-center font-medium w-full">
            <span className="icon text-gray-600 shrink-0">{icon}</span>
            <input className="input w-full text-sm sm:text-base text-gray-600 placeholder:text-gray-400 outline-none" maxLength={maxLength || "99"} type={type || "text"} {...props} />
        </div>
    );
};