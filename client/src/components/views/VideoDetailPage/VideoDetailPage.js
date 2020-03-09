import React, { useEffect, useState } from 'react'
import { Row, Col, List, Avatar } from 'antd'
import Axios from 'axios'
import SideVideo from './section/SideVideo'
import Subscribe from './section/Subscribe'
import Comment from './section/Comment'
import LikeDislikes from './section/LikeDislikes'

// 클래스 방식에서는 생성자로 props
function VideoDetailPage(props) {

    const videoId = props.match.params.videoId
    const [VideoDetail, setVideoDetail] = useState([])
    const [Comments, setComments] = useState([])

    const variables = {
        'videoId' : videoId
    }

    const refreshFunction = (newComment) => {
        setComments(Comments.concat(newComment))
    }

    useEffect(() => {
        Axios.post('/api/video/getVideoDetail', variables)
            .then(res => {
                if(res.data.success) {
                    setVideoDetail(res.data.VideoDetail)
                } else {
                    alert('비디오 정보를 가져오는데 실패했습니다.')
                }
            })

        // get방식으로는 변수 어떻게 넘기는지?
        Axios.post('/api/comment/getComments', variables)
            .then( res => {
                if(res.data.success) {
                    setComments(res.data.comments)
                } else {
                    alert('코멘트 정보를 가져오는데 실패했습니다.')
                }
            })

    }, [])

    if(VideoDetail.writer) {
        const sbuscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')} />
        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24} >
                    <div style={{ width : '100%', padding : '3rem 4rem'}} >
                        <video style={{ width : '100%'}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />
                        <List.Item
                            actions={[ <LikeDislikes video userId={localStorage.getItem('userId')} videoId={videoId} />, sbuscribeButton ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image} />}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            />
                        </List.Item>
                                                                   
                        <Comment refreshFunction={refreshFunction} commentLists={Comments} postId={videoId} />
                    </div>
                </Col>
                <Col lg={6} xs={24} >
                    <SideVideo />
                </Col>
            </Row>
        )
    } else {
        return (
            <div>Loading</div>
        )
    }

    
}

export default VideoDetailPage