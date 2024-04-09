import {useEffect, useState} from "react";

interface Heading {
    hId: number;
    text: string;
    index: number;
}

const AnchorLinkBar = ({headings}: { headings: Heading[] }) => {

    const [selectedAnchor, setSelectedAnchor] = useState(0)

    const jumpToSection = (id: string) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({behavior: 'smooth'});
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            headings.forEach((heading) => {
                const element = document.getElementById(`heading${heading.hId}_${heading.index}`);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top <= 60) {
                        console.log(`현재 화면 상단에 있는 요소: ${element.id}`);
                        setSelectedAnchor(heading.index)
                    }
                }
            });
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [headings]);

    return (
        <div
            className="hidden xl:flex flex-col bg-background fixed top-32 right-0 2xl:right-[110px] w-[240px] cursor-default">
            {headings.map((heading, index) => {
                return (
                    <div key={index} className="flex">
                        {heading.hId === 1 &&
                            <div
                                className={`border-l-4 pl-[10px] py-1 cursor-pointer
                                ${selectedAnchor === heading.index ?
                                    `text-[15px] font-semibold text-gray-900 dark:text-gray-200 border-l-indigo-500 dark:border-l-indigo-600 transition-all duration-500 ease-in-out`
                                    :
                                    `text-[15px] font-medium text-gray-500 dark:text-gray-400 border-l-gray-300 dark:border-l-gray-600 transition-all duration-500 ease-in-out`}`}
                                onClick={() => {
                                    setSelectedAnchor(heading.index)
                                    jumpToSection(`heading${heading.hId}_${heading.index}`)
                                }}
                            >{heading.text}</div>
                        }

                        {heading.hId === 2 &&
                            <div
                                className={`border-l-4 pl-[25px] py-1 cursor-pointer
                                ${selectedAnchor === heading.index ?
                                    `text-[15px] font-semibold text-gray-900 dark:text-gray-200 border-l-indigo-500 dark:border-l-indigo-600 transition-all duration-500 ease-in-out`
                                    :
                                    `text-[15px] font-medium text-gray-500 dark:text-gray-400 border-l-gray-300 dark:border-l-gray-600 transition-all duration-500 ease-in-out`}`}
                                onClick={() => {
                                    setSelectedAnchor(heading.index)
                                    jumpToSection(`heading${heading.hId}_${heading.index}`)
                                }}
                            >{heading.text}</div>
                        }

                        {heading.hId === 3 &&
                            <div
                                className={`border-l-4 pl-[35px] py-1 cursor-pointer
                                ${selectedAnchor === heading.index ?
                                    `text-[15px] font-semibold text-gray-900 dark:text-gray-200 border-l-indigo-500 dark:border-l-indigo-600 transition-all duration-500 ease-in-out`
                                    :
                                    `text-[15px] font-medium text-gray-500 dark:text-gray-400 border-l-gray-300 dark:border-l-gray-600 transition-all duration-500 ease-in-out`}`}
                                onClick={() => {
                                    setSelectedAnchor(heading.index)
                                    jumpToSection(`heading${heading.hId}_${heading.index}`)
                                }}
                            >{heading.text}</div>
                        }

                    </div>
                )
            })}
        </div>
    )
}

export default AnchorLinkBar