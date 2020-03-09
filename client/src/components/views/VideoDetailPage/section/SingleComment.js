import React, { useState } from 'react'
import { Comment, Avatar, Button, Input } from 'antd'
import { useSelector } from 'react-redux'
import Axios from 'axios'
import LikeDislikes from './LikeDislikes'

const { TextArea } = Input

function SingleComment(props) {
    // avatar -> 프로필 이미지 같은 동그란 영역 */}

    const [OpenReply, setOpenReply] = useState(false)
    const [CommentValue, setCommentValue] = useState('')
    const user = useSelector(state => state.user)

    const handleClick = (e) => {
        setCommentValue(e.currentTarget.value)
    }

    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply)
    }

    const onSubmit = (e) => {
        // submit버튼의 기본 이벤트는 리프레시 -> 실행 방지
        e.preventDefault()

        const variables = {
            content : CommentValue,
            writer : user.userData._id,
            postId : props.postId,
            responseTo : props.comment._id
        }

        Axios.post('/api/comment/saveComment', variables)
            .then(res => {
                if(res.data.success) {
                    console.log(variables)
                    console.log(res.data.result)
                    setCommentValue('')
                    setOpenReply(false)
                    props.refreshFunction(res.data.result)
                } else {               
                    alert('커멘트를 저장하지 못했습니다.')
                }
            })
    }

    const actions = [
        <LikeDislikes video userId={localStorage.getItem('userId')} commentId={props.comment._id} />,
        <span onClick={onClickReplyOpen} key='comment-basic-reply-to'>Reply to</span>
    ]
    
    return (
        <div>

            <Comment 
                actions={actions}
                author={props.comment.writer.name}                
                avatar={<Avatar src={props.comment.writer.image} alt />}            
                content={ <p>{props.comment.content}</p>}
            />

            {OpenReply &&
                <form style={{ display:'flex' }} onSubmit={onSubmit} >
                    <textarea   
                        style={{ width : '100%', borderRadius : '5px' }}
                        onChange={handleClick}
                        value={CommentValue}
                        placeholder='코멘트를 작성해 주세요'
                    />
                    <br />
                    <button style={{ width : '20%', height : '52px' }} onClick={onSubmit} >Submit</button>
                </form>
            }
        </div>
    )
}

export default SingleComment
