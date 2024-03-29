import {faker} from "@faker-js/faker";
import {useContext, useEffect, useState} from "react";
import UserContext from "@/context/UserContext.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import {useForm} from "react-hook-form";
import {FaEdit} from "react-icons/fa";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import mermaid from "mermaid";
import MarkdownView from "@/components/ui/MarkdownView.ts";
import CustomMonacoEditor from "@/components/common/CustomMonacoEditor.tsx";
import CustomGitContributionsCalendar from "@/components/blog/CustomGitContributionsCalendar.tsx";

const MyBlogAbout = () => {

    const {authority} = useContext(UserContext)
    const {theme} = useContext(ThemeContext);
    const {setValue, watch, reset} = useForm({
        defaultValues: {
            about: ""
        }
    })
    const [editBlogAbout, setEditBlogAbout] = useState(false)

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: theme,
        });
        mermaid.run({
            querySelector: '.marmaid',
        });
    }, [watch("about"), theme]);

    // 가짜 데이터 생성
    const fakerData = {
        username: faker.internet.userName(),
        shortIntroduction: faker.lorem.sentence(),
        // LongIntroduction: faker.lorem.paragraphs(3).split('\n\n').map(paragraph => `> ${paragraph}`).join('\n\n')
        LongIntroduction: ""
    };

    useEffect(() => {
        if (fakerData) {
            reset({
                about: fakerData.LongIntroduction
            });
        }
    }, []);

    return (
        <div className="flex flex-1 flex-col">
            <div className="border border-gray-200 dark:border-neutral-700 bg-transparent rounded-none">

                {/* 깃 커밋 기록 */}
                <CustomGitContributionsCalendar/>

                {authority === "NOT_LOGIN" || authority === "ANONYMOUS" ?
                    <>
                        {/* 로그아웃 && 소개가 있을 때 */}
                        {fakerData.LongIntroduction &&
                            <div className="flex p-5">
                                <div className="text-lg font-medium leading-snug break-all p-3">
                                    <div className="markdown-body"
                                         dangerouslySetInnerHTML={{__html: MarkdownView.render(watch("about") || "")}}></div>
                                </div>
                            </div>
                        }

                        {/* 로그아웃 && 소개가 없을 때 */}
                        {!fakerData.LongIntroduction &&
                            <div className="flex justify-center p-10">
                                <span className="text-gray-400 text-lg">소개가 작성되지 않았습니다.</span>
                            </div>
                        }
                    </>
                    :
                    <>
                        {/* 로그인 && 소개가 있을 때 */}
                        {fakerData.LongIntroduction && !editBlogAbout &&
                            <div className="flex flex-col p-5">
                                <div className="flex justify-end">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger
                                                asChild
                                                onClick={() => {
                                                    setEditBlogAbout(true)
                                                }}>
                                                <div>
                                                    <FaEdit
                                                        className="w-6 h-6 text-indigo-400 hover:text-indigo-500 dark:text-indigo-500 dark:hover:text-indigo-600 cursor-pointer"/>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                className="bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                                                <p>수정</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>

                                <div className="text-lg font-medium leading-snug break-all p-3">
                                    <div className="markdown-body"
                                         dangerouslySetInnerHTML={{__html: MarkdownView.render(watch("about") || "")}}></div>
                                </div>
                            </div>
                        }

                        {/* 로그인 && 소개가 없을 때 */}
                        {!fakerData.LongIntroduction && !editBlogAbout &&
                            <div className="flex flex-col items-center space-y-5 p-10">
                                <span className="text-gray-400 text-lg">{fakerData.username}님의 블로그를 소개해보세요.</span>
                                <Button
                                    className="bg-primary hover:bg-primary-hover rounded"
                                >
                                    <div
                                        className="text-[16px]"
                                        onClick={() => {
                                            setEditBlogAbout(true)
                                        }}>
                                        등록하기
                                    </div>
                                </Button>
                            </div>
                        }

                        {/* 소개 등록/수정 폼 */}
                        {editBlogAbout &&
                            <>
                                <div className="flex flex-col flex-1 mt-10">
                                    <div className="flex w-full h-[490px]">
                                        <CustomMonacoEditor
                                            width={`${100}%`}
                                            height={`${100}%`}
                                            language="markdown"
                                            theme={theme === "light" ? "vs" : "vs-dark"}
                                            onChange={(value) => setValue("about", value)}
                                            value={watch("about")}
                                            className="blog_about_css"
                                        />
                                    </div>
                                </div>
                            </>
                        }
                    </>
                }

            </div>

            {authority === "USER" && editBlogAbout &&
                <div className="flex justify-end space-x-1 my-5">
                    <Button
                        onClick={() => {
                            setEditBlogAbout(false)
                        }}
                        variant="secondary"
                        className="rounded hover:bg-secondary-hover">
                        취소
                    </Button>
                    <Button
                        className="bg-primary hover:bg-primary-hover rounded">
                        등록
                    </Button>
                </div>
            }

        </div>
    )
}

export default MyBlogAbout