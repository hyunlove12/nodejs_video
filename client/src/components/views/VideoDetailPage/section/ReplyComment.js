import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment'

function ReplyComment(props) {

    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(false)

    // [] -> 공백이면 dom load시 한번만 실행
    // [] -> 안에 들어있는 변수값이 변경 될 때마다 다시 실행
    useEffect(() => {
        let commentNumber = 0
        props.commentLists.map((comment) => {            
            if(comment.responseTo === props.parentCommentId) {
                commentNumber++
            }
        })
        setChildCommentNumber(commentNumber)
    }, [props.commentLists])

    const renderReplyComment = (parentCommentId) => {
        console.log( props.commentLists)
        // map에서 () -> react함수이고 {} -> 스크립트 문법?? 인듯...
        // && -> 2번째 줄은 조건에 안탄다?
        //props.commentLists.map((comment, i) => {
        //    {comment.responseTo === parentCommentId &&
        //    }
        // })
                
        return (
            props.commentLists.map((comment, i) => (       
                <React.Fragment>
                    {comment.responseTo === parentCommentId &&
                        <div style={{ width : '80%', marginLeft : '40px'}}>
                            <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={props.postId}/>
                            <ReplyComment refreshFunction={props.refreshFunction} commentLists={props.commentLists} postId={props.postId} parentCommentId={comment._id} />
                        </div>
                    }
                </React.Fragment>
            ))
        )
    }

    const onHandleChange = () => {
        setOpenReplyComments(!OpenReplyComments)
    }

    return (
        <div>
            {ChildCommentNumber > 0 &&
                <p style={{ fontSize : '14px', margin : 0, color : 'gray' }} onClick={onHandleChange}>
                    View {ChildCommentNumber} more comment(s)
                </p>
            }   
            {OpenReplyComments &&
                renderReplyComment(props.parentCommentId)
            }            
        </div>
    )
}

export default ReplyComment
