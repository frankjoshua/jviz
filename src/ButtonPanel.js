import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import ROSLIB from 'roslib';

import Publisher from './Publisher.js';
import Subscriber from './Subscriber.js';

function CreateSubscriberAction(props) {
  const id = "subscriber_" + props.node.path;
  return (
    <div>
      <ReactTooltip effect="solid" place="right" type="info"/>
      <div data-tip={"Subscribe to " + props.node.path} className="SmallButton ColorTwo" onClick={() => {
        props.addWidget(id, (
          <Subscriber key={id} ros={props.ros} topic={props.node.path} type={props.node.messageType}/>
        ), props.node.path + " subscriber")
      }}>
        Subscribe
      </div>
    </div>
  )
}

CreateSubscriberAction.propTypes = {
  node: PropTypes.object.isRequired,
  ros: PropTypes.instanceOf(ROSLIB.Ros).isRequired,
  addWidget: PropTypes.func.isRequired,
}

function CreatePublisherAction(props) {
  const id = "publisher_" + props.node.path;
  console.log("pub node", props.node)
  return (
    <div>
      <ReactTooltip effect="solid" place="right" type="info"/>
      <div data-tip={"Publish to " + props.node.path} className="SmallButton ColorThree" onClick={() => {
        props.addWidget(id, (
          <Publisher key={id} ros={props.ros} topic={props.node.path} type={props.node.messageType}/>
        ), props.node.path + " publisher")
      }}>
        Publish
      </div>
    </div>
  )
}

CreatePublisherAction.propTypes = {
  node: PropTypes.object.isRequired,
  ros: PropTypes.instanceOf(ROSLIB.Ros).isRequired,
  addWidget: PropTypes.func.isRequired,
}

function ButtonPanel(props) {

  if (props.node === undefined) {
    return (
      <div className="ButtonPanel">
        {props.children}
      </div>
    )
  }

  // TODO: This will be replaced by widget registration somehow
  var widgets = [];
  switch (props.type) {
    case "topic":
        widgets = ["publish", "subscribe"];
      break;
    case "node":

      break;
    case "service":

      break;
    case "action":

      break;
    default:
      // console.log("No actions for type: " + props.node.type);
      return false;
  }

  return (
    <div className="ButtonPanel">
      {props.children}
      {
        widgets.map((widget) => {
          switch (widget) {
            case "publish":
              return <CreatePublisherAction key={"publish_" + props.node.path} ros={props.ros} addWidget={props.addWidget} node={props.node} />
            case "subscribe":
              return <CreateSubscriberAction key={"subscribe_" + props.node.path} ros={props.ros} addWidget={props.addWidget} node={props.node} />
            default:
              console.log("Couldn't create action for type: " + widget);
              return false;
          }
        })
      }
    </div>)

}

ButtonPanel.propTypes = {
  node: PropTypes.object,
  ros: PropTypes.instanceOf(ROSLIB.Ros).isRequired,
  addWidget: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
}

export default ButtonPanel;
