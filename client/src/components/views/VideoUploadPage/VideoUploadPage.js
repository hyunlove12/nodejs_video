import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd'
import Dropzone from 'react-dropzone'
import Axios from 'axios'
import { useSelector } from 'react-redux'
const { TextArea } = Input
const { Title } = Typography

const PrivateOptions = [
    {value : 0, label : "Private"},
    {value : 1, label : "Public"}
]

const CategoryOptions = [
    {value : 0, label : "Film & Animation"},
    {value : 1, label : "Autos & Vehicles"},
    {value : 2, label : "Music"},
    {value : 3, label : "Pets & Animals"},
]
// rfce -> react 플러그인
function VideoUploadPage(props) {
    // redux를 이용해 state값 가져온다.
    const user = useSelector(state => state.user)
    const [VideoTitle, setVideoitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState("Film & Animation")
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")
    
    const onTitleChange = (e) => {        
        setVideoitle(e.currentTarget.value)
    }

    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value)
    }

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value)
    }

    const onDrop = (files) => {
        let formData = new FormData
        const config = {
            header : {"content-type" : "multipart/form-data"}
        }
        formData.append("file", files[0])
        // console.log(files)
        // ajax와 비슷한 기능
        Axios.post("/api/video/uploadfiles", formData, config)
            .then(res => {
                if(res.data.success) {
                    alert("비디오 업로드를 성공했습니다!")
                    let variable = {
                        url : res.data.url,
                        fileName : res.data.fileName
                    }                    
                    setFilePath(res.data.url)
         //           Axios.post('/api/video/thumbnail', variable)
          //              .then(res => {
          //                  if(res.data.success){

          //                  } else {
           //                     alert("썸네일 생성에 실패했습니다!")
           //                 }
                //        })
                } else {
                    alert("비디오 업로드를 실패했습니다!")
                    // console.log(res.data.err)
                }
            })
    }

    const onSubmit = (e) => {
        // 기존 이벤트는 실행 안된다.
        e.preventDefault();
        const variables = {
            writer : user.userData._id,
            title : VideoTitle,
            description : Description,
            privacy : Private,
            filePath : FilePath,
            category : Category,
            duration : Duration,
            thumbnail : ThumbnailPath 
        }
        Axios.post("/api/video/uploadVideo", variables)
            .then(res => {
                if(res.data.success) {
                    message.success('성공적으로 업로드를 했습니다.')
                    setTimeout(() => {

                    }, 3000)
                    props.history.push('/')
                } else {
                    alert("비디오 업로드에 실패했습니다!")
                }
            })
    }
    return (
        <div style={{ maxWidth:'700px', margin:'2rem auto'}}>
            <div style={{ textAlign:'center', marginBottom:'2rem'}}>
                <Title level={2}>Upload Video</Title>
            </div>    
            <Form onSubmit={onSubmit}>
                <div stype={{ dsiplay:'flex', justifyContent:'space-between'}}>
                    {/* Drop zone */}
                    {/* multiple 다중 업로드 */}
                    <Dropzone
                    onDrop={onDrop}
                    multiple={false}
                    maxSize={10000000000}>
                        {({ getRootProps, getInputProps }) => (
                            <div style={{width:'300px', height:'240px', border:'1px solid lightgray', display:'flex', alignItems:'center', justifyContent:'center'}}{...getRootProps()}>
                                <input {...getInputProps()} />
                                <Icon type='plus' style={{ fontsize : '3red' }} />
                            </div>
                        )}    
                    </Dropzone>
                    {/* Thumbnail */}
                    <div>
                        <img src alt/>
                    </div>
                </div>

                <br />
                <br />

                <label>Title</label>
                <Input onChange={onTitleChange} value={VideoTitle}/>

                <br />
                <br />

                <label>Description</label>
                <TextArea onChange={onDescriptionChange} value={Description}/>

                <br />
                <br />

                <select onChange={onPrivateChange}>
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>                   
                    ))}                    
                </select>

                <br />
                <br />

                <select onChange={onCategoryChange}>
                    {CategoryOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}                    
                </select>

                <br />
                <br />
                
                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default VideoUploadPage