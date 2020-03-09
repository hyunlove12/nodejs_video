import React, { useEffect, useState } from 'react'
import Axios from 'axios'

function Subscribe(props) {
    
    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    useEffect(() => {

        let variable = { userTo : props.userTo }

        // 구독자 수
        Axios.post('/api/subscribe/subscriberNumber', variable)
            .then( res => {
                if(res.data.success) {
                    setSubscribeNumber(res.data.subscriberNumber)
                } else {
                    alert('구독자 수 정보를 받아오지 못했습니다.')
                }
            })

        let subscribeVariable = { 
              userTo : props.userTo
            , userFrom : localStorage.getItem('userId')
        }
        
        // 내가 구독을 했는지 안했는지 
        Axios.post('/api/subscribe/subscribed', subscribeVariable)
            .then(res => {
                if(res.data.success){
                    setSubscribed(res.data.subscribed)
                } else {
                    alert('정보를 가져오지 못했습니다.')
                }
            })
            
    }, [])

    const onSubscribe = (e) => {        

        let subscribedVariable = {
            userTo : props.userTo,
            userFrom : props.userFrom
        }

        if(Subscribed) { // 구독중인 상태

            Axios.post('/api/subscribe/unSubscribe', subscribedVariable)
                .then(res => {
                    if(res.data.success) {
                        setSubscribeNumber(SubscribeNumber - 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('구독 취소 하는데 실패했습니다.')
                    }
                })

        } else { // 비구독 상태

            Axios.post('/api/subscribe/subscribe', subscribedVariable)
                .then(res => {
                    if(res.data.success) {
                        setSubscribeNumber(SubscribeNumber + 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('구독 하는데 실패했습니다.')
                    }
                })

        }
    }

    return (
        <div>
            <button style={{ backgroundColor : `${Subscribed ? '#AAAAAA' : '#CC0000'}`,
                             borderRadius : '4px',   color : 'white', padding : '10px 16px',
                             fontWeight : '500', fontSize : '1rem', textTransform : 'uppercase'
                    }}
                    onClick={onSubscribe}
            >
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe
