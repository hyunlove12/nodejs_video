const express = require('express')
const router = express.Router()
const path = require('path')

const { Video } = require("../models/Video");
const { Subscriber } = require("../models/Subscriber");
const { auth } = require("../middleware/auth");
// 멀티파일 업로드
const multer = require("multer")
// const ffmpeg = require("fluent-ffmpeg")
//=================================
//             Video
//=================================

let storage = multer.diskStorage({
    destination : (req, res, cb) => {
        // uploads라는 폴더에 파일 저장
        cb(null, "uploads/")
    },
    filename : (req, file, cb) => {
        // 파일 이름
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter : (req, file, cb) => {
        const ext = path.extname(file.originalname)
        // mp4확장자만 업로드 가능
        if ( ext == '.mp4') {
            return cb(res.status(400).end("only mp4 is allowed"), false)
        }
        cb(null, true)
    }
})

// single -> 파일은 하나만 업로드 가능
const upload = multer({storage : storage}).single("file")

router.post('/uploadfiles', (req, res) => {
    // 비디오를 서버에 저장한다.
    upload(req, res, err => {
        if(err) {
            return res.json({success : false, err})
        }
        // res.req.file.path -> 파일 업로드 경로
        return res.json({success : true, url : res.req.file.path, fileName : res.req.file.filename})
    })
}) 

router.post('/uploadVideo', (req, res) => {
    // 비디오 정보를 저장
    const video = new Video(req.body)

    // 몽고디비에 저장
    video.save((err, doc) => {
        if(err) return res.json({
            success : false, 
            err
        })
        res.status(200).json({ success : true })
    })
}) 

// 썸네일 생성
router.post('/thumbnail', (req, res) => {
    // 썸네일 생성 하고 비디오 관련 정보(런닝 타임 등)
}) 

// 비디오 정보 가져옴
router.get('/getVideos', (req, res) => {
    // 비디오를 db에서 가져와서 클라이언트에 보낸다.
    // Schema.Types.ObjectId 이용해서 writer정보 가져오기
    Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if(err) return res.status(400).send(err)
            res.status(200).json({ success : true, videos })             
        })
})

router.post("/getVideoDetail", (req, res) => {
    // 비디오 디테일 정보 가져오기
    Video.findOne({ "_id" : req.body.videoId })
        .populate("writer")
        .exec((err, VideoDetail) => {
            if(err) return res.status(400).send(err)
            return res.status(200).json({
                success : true, VideoDetail
            })
        })
})

router.post("/getSubscriptionVideos", (req, res) => {
    // 구독 목록 가져오기
    // 자신의 아이디를 가지고 구독하는 사람들을 찾는다.
    Subscriber.find({ userFrom : req.body.userFrom })
        .exec((err, subscriberInfo) => {
            if(err) return res.status(400).send(err)

            let SubscriberUser = []
            subscriberInfo.map((subscriber, i) => {
                SubscriberUser.push(subscriber.userTo)
            })
            
            // 찾은 사람들의 비디오를 가지고 온다.
            // SubscribedUser안에 들어 있는 유저들을 모두 찾는다
            //.populate('writer') - 조인같은 느낌
            Video.find({ writer : { $in: SubscriberUser }})
                .populate('writer')
                .exec((err, videos) => {
                    if(err) return res.status(400).send(err)
                    res.status(200).json({success :true, videos})
                })
        })
})

module.exports = router;
