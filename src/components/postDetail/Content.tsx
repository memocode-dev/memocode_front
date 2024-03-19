import {PostDetailDTO} from "@/openapi/memo/model";
import MarkdownView from "@/components/common/MarkdownView.ts";

const Content = ({post}: { post: PostDetailDTO }) => {
    return (
        <div className="bg-white dark:bg-[#1E1E1E] border-b border-b-gray-300 px-5 py-10">
            <div className="text-3xl font-medium leading-snug break-all">
                <div className="markdown-body" dangerouslySetInnerHTML={{__html: MarkdownView.render(post?.content || "")}}></div>
            </div>
        </div>
    )
}

export default Content
