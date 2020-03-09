import React, { useEffect, useState } from 'react'
import { Tooltip, Icon } from 'antd'
import Axios from 'axios'

function LikeDislikes(props) {

    const [Likes, setLikes] = useState(0)
    const [Dislikes, setDislikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [DisLikeAction, setDisLikeAction] = useState(null)
    
    let variables = {}

    if(props.video) {
        variables = {
            videoId : props.vidoeId ,
            userId : props.userId
        }
    } else {
        variables = {
            commentId : props.commentId,
            userId : props.userId
        }
    }
        
    useEffect(() => {
        Axios.post('/api/like/getLikes', variables)
            .then((res) => {
                if(res.data.success) {
                    // 얼마나 많은 좋아요를 받았는지
                    setLikes(res.data.likes.length)

                    // 내가 이미 그 좋아요를 눌렀는지 
                    res.data.likes.map(like => {
                        if(like.userId === props.userId) {
                            setLikeAction('liked')
                        }
                    })
                } else {
                    alert('좋아요에 정보를 가져오지 못했습니다.')
                }
            })
        
        Axios.post('/api/like/getDislikes', variables)
        .then((res) => {
            if(res.data.success) {
                // 얼마나 많은 싫어요를 받았는지
                setDislikes(res.data.dislikes.length)

                // 내가 이미 그 싫어요를 눌렀는지 
                res.data.dislikes.map(dislike => {
                    if(dislike.userId === props.userId) {
                        setDisLikeAction('disliked')
                    }
                })
            } else {
                alert('싫어요에 정보를 가져오지 못했습니다.')
            }
        })
    }, [])

    const onLike = () => {
        if(LikeAction === null) {
            Axios.post('/api/like/upLike', variables)
                .then((res) => {
                    if(res.data.success) {
                        setLikes(Likes + 1)
                        setLikeAction('liked')

                        // dislike상태
                        if(DisLikeAction !== null) {
                            setDisLikeAction(null)
                            setDislikes(Dislikes -1)
                        }
                    } else {
                        alert('Like를 올리지 못했습니다.')
                    }
                })
        } else {
            Axios.post('/api/like/unLike', variables)
                .then((res) => {
                    if(res.data.success) {
                        setLikes(Likes - 1)
                        setLikeAction(null)
                    } else {
                        alert('Like를 내리지 못했습니다.')
                    }
                })
        }
    }
    
    const onDislike =() => {
        if(DisLikeAction !== null) {
            Axios.post('/api/like/unDislike', variables)
                .then(res=> {
                    if(res.data.success) {
                        setDislikes(Dislikes - 1)
                        setDisLikeAction(null)                        
                    } else {
                        alert('dislike을 지우지 못했습니다.')
                    }
                })
        } else {
            Axios.post('/api/like/upDislike', variables)
                .then(res=> {
                    if(res.data.success) {
                        setDislikes(Dislikes + 1)
                        setDisLikeAction('disliked')
                        
                        // like상태
                        if(LikeAction !== null) {
                            setLikeAction(null)
                            setLikes(Likes -1)
                        }
                    } else {
                        alert('dislike을 올리지 못했습니다.')
                    }
                })
        }
    }

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"
                        theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                        onClick={onLike}
                    />
                </Tooltip>
                <span style={{ paddingLeft : '8px', cursor : 'auto' }}>{Likes}</span>    
            </span>&nbsp;&nbsp;            

            <span key="comment-basic-like">
                <Tooltip title="Dislike">
                    <Icon type="dislike"
                        theme={DisLikeAction === 'disliked' ? 'filled' : 'outlined'}
                        onClick={onDislike}
                    />
                </Tooltip>
                <span style={{ paddingLeft : '8px', cursor : 'auto' }}>{Dislikes}</span>    
            </span>&nbsp;&nbsp;      
        </div>
    )
}

export default LikeDislikes
