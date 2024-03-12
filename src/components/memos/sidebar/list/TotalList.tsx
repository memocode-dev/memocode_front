import InternalError from "@/components/common/InternalError.tsx";
import {useCreateMemo, useFindAllMemo} from "@/openapi/memo/api/memos/memos.ts";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {MemoCreateForm} from "@/openapi/memo/model";

interface totalListProps {
    isTab: string;
}

const TotalList = ({isTab}: totalListProps) => {
    const navigate = useNavigate()

    const {isError, error, data: lists, refetch} =
        useFindAllMemo({
            page: 1,
            size: 5,
        }, {
            query: {
                queryKey: ["TotalList"]
            }
        })

    const onSubmit = (data: MemoCreateForm) => createMemo({data: data})

    const {mutate: createMemo} = useCreateMemo({
        mutation: {
            onSuccess: (memoId) => {
                navigate(`/w/${memoId}`)
                toast.success("성공적으로 메모가 생성되었습니다.")
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요")
            }
        }
    })

    if (isError) {
        console.log(error);
        return <InternalError onClick={() => refetch()}/>
    }

    console.log(lists)
    return (
        <div className={`flex-1 flex flex-col overflow-y-scroll ${isTab === "tab1" ? "" : `hidden`}`}>
            <div className="flex flex-col bg-white dark:bg-[#2B2B37] space-y-4 flex-1 p-1">
                <div
                    className={`flex flex-col`}
                    id="tab1">

                    {lists ?
                        lists?.memoDetailDTOS?.map((memo, index) => (
                            <div key={index}
                                 className="text-gray-900 dark:text-gray-300 bg-transparent hover:bg-gray-200 dark:hover:bg-black dark:hover:bg-opacity-30 rounded-sm py-1 px-2">
                                <div
                                    className="text-sm tracking-wider cursor-pointer"
                                    onClick={() => {
                                        // navigate(`/w/${memo.}`)
                                    }}
                                >
                                    {memo.title}</div>
                            </div>
                        ))
                        :
                        <button
                            onClick={() => onSubmit({
                                title: "제목없음",
                                content: "내용없음"
                            })}
                            className="mx-2 my-1 hover:bg-gray-100 pl-1 py-2"
                        >
                            새 메모 시작하기
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}

export default TotalList