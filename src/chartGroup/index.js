import React from 'react'
import ReactDOM from 'react-dom'
import TitleBar from '../components/title-bar'
import Chart from '../components/chart'
import { Socket, Event } from 'react-socket'
import _ from 'lodash'
import $ from 'jquery'
import './index.scss'

import jalon from '../components/person/jalon.jpg'

import KWY from '../components/person/kawayi.png'

import girl1 from '../components/person/girl1.png'
import girl2 from '../components/person/girl2.png'
import girl3 from '../components/person/girl3.png'

let girMap = {
    girl1: girl1,
    girl2: girl2,
    girl3: girl3
}

export default class BusinessComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text: '',
            name: 'Guest_' + Math.floor(Math.random() * 10000),
            messages: []
        }
    }

    onMessage(root, name, info, message) {
        let newMessages = _.cloneDeep(this.state.messages)
        let random = Math.random() + 0.00001

        newMessages.push({
            name: name,
            message: message,
            url: girMap['girl' + Math.ceil(random * 3)]
        })

        this.setState({
            messages: newMessages
        }, ()=> {
            let $dom = $('#main-chat-content')
            $dom.scrollTop($dom[0].scrollHeight)
        })
    }

    handleInputChange(e) {
        this.setState({
            text: e.target.value
        })
    }

    handleSubmit(e) {
        if (e.keyCode !== 13)return
        if (this.state.text === '')return

        Socket.socket().emit('room', 'bbt', this.state.text)
        this.setState({
            text: ''
        })
    }

    componentDidMount() {
        Socket.socket().emit('me', this.state.name, {info: null})
        Socket.socket().emit('join', 'bbt')

        let $dom = $('#main-chat-content')
        $('#main-chat-content').height($(document).height() - 82)
    }

    render() {
        let Messages = this.state.messages.map((item, index)=> {
            if (item.name === this.state.name) {
                return <Chart key={index}
                              left
                              url={jalon}
                              content={item.message}/>
            } else {
                return <Chart key={index}
                              right
                              url={item.url}
                              content={item.message}/>
            }
        })

        return (
            <div className="_namespace">
                <TitleBar title="群聊" return_url="#/business"></TitleBar>

                <div className="main-chat"
                     id="main-chat-content">{Messages}</div>

                <input className="input"
                       value={this.state.text}
                       onChange={this.handleInputChange.bind(this)}
                       onKeyDown={this.handleSubmit.bind(this)}/>

                <Socket url="http://fedev.baidu.com:8003"/>
                <Event name="chat"
                       callback={ this.onMessage.bind(this) }/>
            </div>
        )
    }
}
