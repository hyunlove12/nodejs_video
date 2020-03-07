import React, { useState } from 'react'
import Axios from 'axios'
// hook방식에서 redux값 가져올 때
import { useSelector } from 'react-redux'
import SingleComment from './SingleComment'
import ReplyComment from './ReplyComment'

function Comment(props) {

    // const videoId = props.match.params.videoId
    const videoId = props.postId
    const user = useSelector(state => state.user)
    const [commentValue, setCommentValue] = useState('')

    const handleClick = (e) => {
        setCommentValue(e.currentTarget.value)
    }

    const onSubmit = (e) => {
        // submit버튼의 기본은 리프레시 -> 실행 방지
        e.preventDefault()

        const variables = {
            content : commentValue,
            writer : user.userData._id,
            postId : videoId
        }

        Axios.post('/api/comment/saveComment', variables)
            .then(res => {
                if(res.data.success) {
                    // console.log(variables)
                    setCommentValue('')
                    props.refreshFunction(res.data.result)
                } else {               
                    alert('커멘트를 저장하지 못했습니다.')
                }
            })
    }
    return (
        <div>
            <br />
            <p> Replies</p>
            <hr />

            {/* Comment Lists */}
            {/* map안에서는 왜 소괄호를 사용하는지? */}
            {props.commentLists && props.commentLists.map((comment, i) => (
                (!comment.responseTo && 
                    <React.Fragment>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={props.postId}/>
                        <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} postId={props.postId} commentLists={props.commentLists} />
                    </React.Fragment>
                )
            ))}
            
            {/* Root Comment Form */}
            <form style={{ display:'flex' }} onSubmit={onSubmit} >
                <textarea   
                    style={{ width : '100%', borderRadius : '5px' }}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder='코멘트를 작성해 주세요'
                />
                <br />
                <button style={{ width : '20%', height : '52px' }} onClick={onSubmit} >Submit</button>
            </form>

        </div>
    )
}

export default Comment
