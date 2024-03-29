import React, {useContext, useEffect, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {TbCloudUpload, TbDragDrop} from "react-icons/tb";
import {MemoContext} from "@/context/MemoContext.tsx";
import {useForm} from "react-hook-form";
import {useUpdateMemo} from "@/openapi/memo/api/memos/memos.ts";
import {toast} from "react-toastify";

const MemoRepresentative = () => {

    const {modalState, closeModal} = useContext(ModalContext)

    const {
        memoId,
        findMemo,
        findAllMemo,
    } = useContext(MemoContext);

    const representativeMemo = useForm({
        defaultValues: {
            title: "",
            summary: "",
        }
    });

    const [dragOver, setDragOver] = useState(false);
    const [thumbnail, setThumbnail] = useState<File | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    /* 대표 글 수정(제목) */
    const {mutate: UpdateRepresentativeMemo} = useUpdateMemo({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 대표 글이 설정되었습니다.")
                await findMemo.refetch();
                await findAllMemo.refetch();
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요");
            },
        }
    })

    const handleRepresentativeMemo = () => {
        UpdateRepresentativeMemo({
            memoId: memoId!,
            data: {
                title: representativeMemo.watch("title"),
                summary: representativeMemo.watch("summary"),
            },
        })

        closeModal({name: ModalTypes.MEMO_REPRESENTATIVE})
    }

    const handleCloseRepresentativeMemo = () => {
        setThumbnail(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        representativeMemo.reset({
            title: "",
            summary: "",
        });

        closeModal({name: ModalTypes.MEMO_REPRESENTATIVE})
    }

    // 드래그앤드롭으로 썸네일 등록
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);

        const files = e.dataTransfer.files;

        if (files.length) {
            handleUploadFiles(files);
        }
    };

    // 버튼으로 썸네일 등록
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files && files.length > 0) {
            handleUploadFiles(files);
        }
    };

    const handleUploadFiles = (files: FileList) => {
        const file = files[0];
        console.log("thumbnail", file)
        if (file && file.type.startsWith('image/')) { // 이미지 파일인지 확인
            setThumbnail(file);
        }
    };

    useEffect(() => {
        if (findMemo.data) {
            representativeMemo.reset({
                title: findMemo.data.title,
                summary: findMemo.data.summary,
            });
        }
    }, [findMemo.data]);

    return (
        <Dialog open={modalState[ModalTypes.MEMO_REPRESENTATIVE].isVisible}>
            <DialogContent
                className="flex flex-col h-[650px] mx-auto max-w-[400px] sm:max-w-[600px] md:max-w-[750px] lg:max-w-[1000px] rounded-lg z-50 dark:bg-neutral-700">
                <DialogHeader>
                    <DialogTitle>대표글 작성하기</DialogTitle>
                    <DialogDescription className="text-gray-500 dark:text-gray-300">
                        메모의 제목과 짧은 소개글을 작성해보세요! 블로그에 게시되면 다른 사람들도 볼 수 있습니다.
                    </DialogDescription>
                </DialogHeader>

                {/* 썸네일 */}
                <div className={`file-upload ${dragOver ? 'drag-over' : ''} flex bg-transparent px-6 py-1 h-[250px]`}
                     onDragOver={(e) => {
                         e.preventDefault();
                         setDragOver(true);
                     }}
                     onDragLeave={(e) => {
                         e.preventDefault();
                         setDragOver(false);
                     }}
                     onDrop={handleDrop}
                >
                    {thumbnail ? (
                        <div className="flex flex-col justify-between">
                            <img src={URL.createObjectURL(thumbnail)} alt="Thumbnail preview"
                                 className="w-[320px] h-[85%] object-cover"/>
                            <div className="flex h-fit justify-center bg-transparent">
                                <div
                                    className="text-sm tracking-tight text-gray-500 dark:text-gray-400">{thumbnail.name}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-between cursor-default">
                            <div
                                className="flex bg-gray-100 dark:bg-neutral-800 w-[320px] h-[85%] justify-center items-center">
                                미리보기
                            </div>
                            <div className="flex h-fit justify-center bg-transparent">
                                <div className="text-sm tracking-tight text-gray-500 dark:text-gray-400">선택된 파일 없음</div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col flex-1 pl-6">
                        <div className="flex flex-1 bg-transparent justify-center items-center">
                            <Button onClick={triggerFileInput}
                                    className="space-x-2 font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-500 focus-visible:ring-0">
                                <TbCloudUpload className="w-6 h-6"/>
                                <span>버튼으로 등록</span>
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileInputChange}
                            />
                        </div>

                        <div className="flex">
                            <div className="flex flex-1 h-0 mt-3 border border-gray-200"></div>
                            <div className="mx-5">또는</div>
                            <div className="flex flex-1 h-0 mt-3 border border-gray-200"></div>
                        </div>

                        <div
                            className="flex flex-1 bg-transparent justify-center items-center space-x-2 font-semibold text-sm cursor-default">
                            <TbDragDrop className="w-6 h-6"/><span>드래그로 등록</span>
                        </div>
                    </div>
                </div>

                {/* 제목 */}
                <div className="flex bg-transparent">
                    <textarea
                        {...representativeMemo.register("title")}
                        placeholder="제목"
                        className="flex flex-1 h-14 text-3xl px-6 py-2 bg-transparent placeholder-gray-300 focus:outline-none resize-none"
                    />
                </div>

                {/*  소개글 */}
                <div className="flex flex-1 bg-transparent">
                    <textarea
                        {...representativeMemo.register("summary")}
                        placeholder="짧은 소개글"
                        className="flex flex-1 text-2xl px-6 py-2 bg-transparent placeholder-gray-300 focus:outline-none resize-none"
                    />
                </div>

                <DialogFooter className="flex-row flex justify-center sm:justify-center space-x-3 sm:space-x-3">
                    <DialogClose asChild>
                        <Button
                            className="w-auto bg-primary hover:bg-primary-hover focus-visible:ring-0 focus-visible:ring-offset-0"
                            type="submit"
                            onClick={handleRepresentativeMemo}
                        >
                            등록
                        </Button>
                    </DialogClose>

                    <DialogClose asChild>
                        <Button
                            onClick={handleCloseRepresentativeMemo}
                            type="button"
                            variant="secondary"
                            className="hover:bg-secondary-hover"
                        >
                            닫기
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default MemoRepresentative