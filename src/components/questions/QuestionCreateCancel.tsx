import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useContext} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {useNavigate, useParams} from "react-router-dom";

const QuestionCreateCancel = () => {

    const {questionId} = useParams()
    const {modalState, closeModal} = useContext(ModalContext);
    const navigate = useNavigate()

    return (
        <Dialog open={modalState[ModalTypes.QUESTION_CREATE_CANCEL].isVisible}>
            <DialogContent
                className="flex flex-col min-w-[250px] lg:min-w-[350px] rounded-lg z-50 dark:bg-neutral-700 outline-0 px-3 py-5 sm:p-5">
                <DialogHeader className="flex justify-center items-center">
                    <DialogTitle>작성 취소</DialogTitle>
                    <div className="flex flex-col py-5 items-center">
                        <span>취소하시면 작성 중이던 글이 사라집니다.</span>
                        <span>정말 취소하시겠습니까?</span>
                    </div>
                </DialogHeader>
                <DialogFooter className="flex-row flex justify-center sm:justify-center space-x-3 sm:space-x-3">
                    <Button
                        className="w-auto text-primary-foreground bg-primary hover:bg-primary-hover focus-visible:ring-0 focus-visible:ring-offset-0"
                        onClick={() => {
                            closeModal({
                                name: ModalTypes.QUESTION_CREATE_CANCEL
                            });
                            navigate(`/questions/${questionId}`);
                        }}
                    >
                        확인
                    </Button>
                    <DialogClose asChild>
                        <Button
                            className="hover:bg-secondary-hover"
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                closeModal({
                                    name: ModalTypes.QUESTION_CREATE_CANCEL
                                });
                            }}
                        >
                            닫기
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default QuestionCreateCancel