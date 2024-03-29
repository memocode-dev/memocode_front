import {Button} from "@/components/ui/button.tsx";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {IoDocuments, IoFileTrayFull} from "react-icons/io5";
import {VscOpenPreview} from "react-icons/vsc";
import {IoIosMore, IoIosSave} from "react-icons/io";
import {useContext, useState} from "react";
import UserContext from "@/context/UserContext.tsx";
import {useUpdateMemo} from "@/openapi/memo/api/memos/memos.ts";
import {toast} from "react-toastify";
import {useCreateMemoVersion} from "@/openapi/memo/api/memo-version/memo-version.ts";
import {TbArticle, TbArticleOff} from "react-icons/tb";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {FaLock, FaRegStar, FaStar, FaUnlock} from "react-icons/fa";
import {MemoContext} from "@/context/MemoContext.tsx";
import {ErrorResponse} from "@/vite-env";
import MemoVersions from "@/components/memos/toolbar/menu/MemoVersions.tsx";
import MemoSecurity from "@/components/memos/toolbar/menu/MemoSecurity.tsx";
import {Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger} from "@/components/ui/menubar.tsx";
import {ChevronDown} from "lucide-react";

const MemoToolbar = () => {

    const {
        findAllMemo,
        memoId,
        onMemoUpdateSubmit,
        findMemo,
        memoForm,
        findAllMemoVersion,
        findAllBookmarkedMemos
    } = useContext(MemoContext);
    const {openModal} = useContext(ModalContext);
    const {logout} = useContext(UserContext);

    const [hoverVisibility, setHoverVisibility] = useState<boolean>(false);

    /* 메모버전 추가 전 메모 저장 */
    const {mutate: updateMemoBeforeCreateMemoVersion} = useUpdateMemo({
        mutation: {
            onSuccess: async () => {
                createMemoVersion({memoId: memoId!})
                await findAllMemo.refetch();
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요.")
            },
        }
    });

    /* 메모버전 추가 */
    const {mutate: createMemoVersion} = useCreateMemoVersion({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 메모버전이 추가되었습니다.")
                await findAllMemoVersion.refetch();
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요")
            }
        }
    })

    /* 메모 공개/비공개 수정 */
    const {mutate: updateMemoVisibility} = useUpdateMemo({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 변경되었습니다.")
                await findMemo.refetch();
            },
            onError: (error) => {
                console.log(error)
                const response = error?.response?.data as ErrorResponse;
                if (response.code === 400) {
                    toast.error("보안 설정된 메모는 블로그에 개시할 수 없습니다.");
                } else {
                    toast.error("관리자에게 문의하세요");
                }
            },
        }
    })

    /* 메모 즐겨찾기 수정 */
    const {mutate: updateMemoBookmarked} = useUpdateMemo({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 즐겨찾기가 변경되었습니다.")
                await findMemo.refetch();
                await findAllBookmarkedMemos.refetch();
                await findAllMemo.refetch();
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요");

            },
        }
    })

    const handleMemoVersionCreate = () => {
        updateMemoBeforeCreateMemoVersion({
            memoId: memoId!,
            data: memoForm.watch(),
        })
    }

    const handleVisibility = () => {
        updateMemoVisibility({
            memoId: memoId!,
            data: {
                visibility: !findMemo.data?.visibility,
            },
        })
    }

    const handleBookmarked = () => {
        updateMemoBookmarked({
            memoId: memoId!,
            data: {
                bookmarked: !findMemo.data?.bookmarked,
            },
        })
    }

    return (
        <>
            <div className="flex w-full h-12 fixed top-1 right-2 justify-end p-1.5">
                <div className="flex space-x-1">
                    {/* 메모 즐겨찾기 */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 p-1.5 rounded text-gray-800 dark:text-gray-300 w-fit h-fit mt-0.5"
                                    onClick={handleBookmarked}
                                >
                                    {findMemo.data?.bookmarked ?
                                        <FaStar className="fill-yellow-400 stroke-yellow-400 w-5 h-5"/>
                                        :
                                        <FaRegStar className="bg-transparent w-5 h-5"/>
                                    }

                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                className="bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                                <p>즐겨찾는 메모</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {/* 미리보기 버튼 */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 w-8 h-8 p-1 rounded text-gray-800 dark:text-gray-300 mt-0.5"
                                    onClick={() => openModal({
                                        name: ModalTypes.MEMO_PREVIEW,
                                    })}>
                                    <VscOpenPreview className="w-[22px] h-[22px] mt-0.5"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                className="bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                                <p>미리보기</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {/* 저장 */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 p-1 rounded text-gray-800 dark:text-gray-300 w-fit h-fit mt-0.5"
                                    onClick={onMemoUpdateSubmit}>
                                    <IoIosSave className="w-6 h-6"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                className="bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                                <p>저장</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>


                    {/* 보안 활성화된 메모 */}
                    {findMemo.data?.security &&
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        className="bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 p-1.5 rounded text-gray-800 dark:text-gray-300 w-fit h-fit mt-0.5">
                                        <FaLock className="w-5 h-5"/>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent
                                    className="bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                                    <p>보안 활성화</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>}

                    {/* 공개/비공개 버튼 */}
                    {!findMemo.data?.security && <div
                        onClick={handleVisibility}
                        className={`w-16 h-9 flex items-center rounded px-[3px] cursor-pointer bg-gray-200 dark:bg-black
                     ${findMemo.data?.visibility ? 'justify-end' : 'justify-start'}
                     `}
                    >
                        <div className="rounded flex justify-center items-center">
                            {findMemo.data?.visibility ? (
                                <>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div
                                                    className="flex justify-start items-center w-7 h-7 bg-transparent rounded"
                                                    onMouseOver={() => {
                                                        setHoverVisibility(true)
                                                    }}
                                                    onMouseLeave={() => {
                                                        setHoverVisibility(false)
                                                    }}
                                                    onClick={() => {
                                                        setHoverVisibility(false)
                                                    }}
                                                >
                                                    <TbArticleOff className="text-gray-800 dark:text-gray-200 w-5 h-5"/>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                className="bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                                                <p>블로그 비공개</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="relative">
                                                    <div
                                                        className={`flex justify-center items-center w-7 h-7 bg-white dark:bg-neutral-700 rounded transform transition duration-300 scale-left ${hoverVisibility ? 'scale-x-125' : 'scale-x-100'}`}
                                                    >
                                                    </div>
                                                    <TbArticle
                                                        className="absolute top-1 left-1 w-5 h-5 text-gray-800 dark:text-gray-200"/>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                className="bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                                                <p>블로그 공개</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </>
                            ) : (
                                <>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="relative">
                                                    <div
                                                        className={`flex justify-center items-center w-7 h-7 bg-white dark:bg-neutral-700 rounded transform transition duration-300 scale-right ${hoverVisibility ? 'scale-x-125 ' : 'scale-x-100'}`}
                                                    >
                                                    </div>
                                                    <TbArticleOff
                                                        className="absolute top-1 left-1 text-gray-800 dark:text-gray-200 w-5 h-5"/>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                className="bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                                                <p>블로그 비공개</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div
                                                    className="flex justify-end items-center w-7 h-7 bg-transparent rounded"
                                                    onMouseOver={() => {
                                                        setHoverVisibility(true)

                                                    }}
                                                    onMouseLeave={() => {
                                                        setHoverVisibility(false)
                                                    }}
                                                    onClick={() => {
                                                        setHoverVisibility(false)
                                                    }}
                                                >
                                                    <TbArticle className="w-5 h-5 text-gray-800 dark:text-gray-200"/>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                className="bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                                                <p>블로그 공개</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </>
                            )}
                        </div>
                    </div>}

                    {/* 메모 관리 / 설정 */}
                    <Menubar
                        className="border-0 h-fit mt-0.5 p-0 bg-transparent">

                        {/* 메모 관리 */}
                        <div className="rounded-md bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 p-0.5">
                            <MenubarMenu>
                                <MenubarTrigger
                                    className="group inline-flex p-1 h-fit w-max items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-neutral hover:text-accent-foreground focus:bg-neutral focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-neutral/50 data-[state=open]:bg-neutral/50">
                                    메모 관리
                                    <ChevronDown
                                        className={`flex relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180`}
                                        aria-hidden="true"
                                    />
                                </MenubarTrigger>

                                <MenubarContent className="min-w-[8rem] mr-3.5 dark:bg-neutral-700 border-none">
                                    {/* 메모 버전 관리 버튼 */}
                                    <MenubarItem className="p-0 dark:hover:bg-black">
                                        <Button
                                            className="flex justify-start bg-transparent hover:bg-gray-100 dark:hover:bg-black p-2 rounded text-gray-800 dark:text-gray-300 w-full h-fit"
                                            onClick={() => {
                                                openModal({
                                                    name: ModalTypes.MEMO_VERSIONS,
                                                })
                                            }}
                                        >
                                            <IoFileTrayFull className="w-[18px] h-[18px]"/>
                                            <div className="ml-1 text-sm">버전 관리</div>
                                        </Button>
                                    </MenubarItem>

                                    {/* 메모 버전 추가 버튼 */}
                                    <MenubarItem className="p-0 dark:hover:bg-black">
                                        <Button
                                            className="flex justify-start bg-transparent hover:bg-gray-100 dark:hover:bg-black p-2 rounded text-gray-800 dark:text-gray-300 w-full h-fit"
                                            onClick={handleMemoVersionCreate}>
                                            <IoDocuments className="w-[18px] h-[18px]"/>
                                            <div className="ml-1 text-sm">버전 추가</div>
                                        </Button>
                                    </MenubarItem>

                                    {/* 메모 보안 버튼 */}
                                    <MenubarItem disabled={!!findMemo.data?.security}
                                                 className="p-0 dark:hover:bg-black">
                                        <Button
                                            className="flex justify-start bg-transparent hover:bg-gray-100 dark:hover:bg-black p-2 rounded text-gray-800 dark:text-gray-300 w-full h-fit"
                                            onClick={() => {
                                                openModal({
                                                    name: ModalTypes.MEMO_SECURITY,
                                                })
                                            }}
                                        >
                                            <FaUnlock className="w-[17px] h-[17px]"/>
                                            <div className="ml-1 text-sm">보안 설정</div>
                                        </Button>
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                        </div>

                        {/* 설정 */}
                        <div className="rounded-md bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 p-0.5">
                            <MenubarMenu>
                                <MenubarTrigger
                                    className="group inline-flex p-1 h-fit w-max items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-neutral hover:text-accent-foreground focus:bg-neutral focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-neutral/50 data-[state=open]:bg-neutral/50">
                                    <IoIosMore className="w-5 h-5"/>
                                </MenubarTrigger>

                                <MenubarContent className="min-w-[7px] mr-3.5 dark:bg-neutral-700 border-none">
                                    {/* 로그아웃 */}
                                    <MenubarItem className="p-0 dark:hover:bg-black">
                                        <Button
                                            className="flex justify-start bg-transparent hover:bg-gray-100 dark:hover:bg-black p-1 rounded text-gray-800 dark:text-gray-300 w-full h-fit"
                                            onClick={logout}
                                        >
                                            <div className="ml-1 text-sm pr-1">로그아웃</div>
                                        </Button>
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                        </div>
                    </Menubar>
                </div>
            </div>

            <MemoVersions/>
            <MemoSecurity/>
        </>
    )
}

export default MemoToolbar