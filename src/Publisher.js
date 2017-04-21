import React, { Component } from 'react';
import ROSLIB from 'roslib';
import Widget from './Widget.js'

// MessageType
import SyntaxHighlighter from 'react-syntax-highlighter';
import YAML from 'yamljs';

function MessageType(props) {
    return (
        <div style={{backgroundColor: "#444444", padding: 5, margin: 3}}>
            {
                props.message.map((messageDef)=>{
                return messageDef.fieldnames.map((field)=>{
                    return (<div>{field}</div>);
                });
            })}
        </div>
    )
}

class Publisher extends Component {

    constructor(props) {
        super(props);
        console.log('Constructing Publisher');

        this.state = {
            topic: "-1",
            count: 0,
            topics: {
                topics: [],
                types: [],
            },
            messageDetails: "",
            connected: false,
        }

        this.getTopics();

        this.publish = this.publish.bind(this);
        this.getTopics = this.getTopics.bind(this);
        this.changeTopic = this.changeTopic.bind(this);
    }

    publish() {
        console.log('Publishing ' + this.state.count);
        var message = new ROSLIB.Message({
            data: this.state.count.toString(),
        });

        this.publisher.publish(message);
        this.setState( {
            count: this.state.count + 1,
        });
    }

    getTopics() {
        this.props.ros.getTopics((topicList) => {
            const listItems = topicList.topics.map((item, i) =>
                <option key={item} value={topicList.types[i]}>{item}</option>
            );
            this.setState({
                topics: topicList,
            });
            console.log('NodeList updateNodeList');
        });
    }

    changeTopic(event) {
        console.log(event)
        const topic_index = event.target.value

        this.setState({
            topic: topic_index,
            connected: false,
        });

        if (topic_index != -1) {
            const topicName = this.state.topics.topics[topic_index];
            const topicType = this.state.topics.types[topic_index];
            this.publisher = new ROSLIB.Topic({
                ros : this.props.ros,
                name : topicName,
                messageType : topicType,
            });

            this.props.ros.getMessageDetails(topicType, (details)=>{
                this.setState({
                    messageDetails: details,
                    connected: true,
                })
                console.log("messageDetails", details)
            }, (message)=>{
                console.log(topicType)
                console.log("msg details FAILED", topicType, message)
            });



        } else {
            this.publisher.unadvertise();
        }
    }


    render() {
        console.log('Rendering Publisher');

        return (
        <Widget {...this.props} name="Publisher">
            <div className="Publisher">
                <select onChange={this.changeTopic}>
                    <option key={null} value={-1}>select topic...</option>
                {this.state.topics.topics.map((item, i) =>
                    <option key={item} value={i}>{item}</option>
                )}
                </select>
                { !this.state.connected ||
                <div>
                    <p>Topic: {this.state.topics.topics[this.state.topic]}</p>
                    <p>Type: {this.state.topics.types[this.state.topic]}</p>
                    <MessageType ros={this.props.ros} message={this.state.messageDetails} />
                    <button onClick={this.publish}>
                        publish {this.state.count}
                    </button>
                </div>
                }
                {this.props.children}
            </div>
        </Widget>
        );
    }
}

export default Publisher;
