import {PiArrowFatLinesRightFill} from "react-icons/pi";
import {useState} from "react";

const AfterPostButton = () => {

    const [hover, setHover] = useState<boolean>(false)

    const handleClickAfterPost = () => {
        console.log("after")
    }

    return (
        <div className="flex flex-1 p-10 items-center justify-end overflow-x-hidden">
            <div
                className="flex items-center space-x-2 cursor-pointer hover:animate-headShake hover:text-indigo-600 dark:hover:text-violet-500"
                onMouseOver={() => setHover(true)}
                onMouseOut={() => setHover(false)}
                onClick={handleClickAfterPost}
            >
                <div
                    className={`flex flex-col items-center py-5 px-10 text-gray-800 dark:text-gray-300 text-sm font-semibold 
                    ${hover ? `rounded transform transition duration-700 shadow-lg bg-gray-50 dark:bg-neutral-700` : `transform transition duration-700`}
                    `}>
                    <div className="text-sm">다음 포스트</div>
                    <div className="text-lg">다음 포스트 제목</div>
                </div>
                <PiArrowFatLinesRightFill className="w-6 h-6"/>
            </div>
        </div>
    )
}

export default AfterPostButton