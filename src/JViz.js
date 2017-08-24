import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Responsive, WidthProvider} from 'react-grid-layout';
import ROSLIB from 'roslib';
import _ from 'lodash';


import NodeList from './NodeList';
import TopicList from './TopicList';
import Widget from './Widget';
import RosGraph from './RosGraph';


import "../node_modules/react-grid-layout/css/styles.css";
import "../node_modules/react-resizable/css/styles.css";
import './App.css';

const ResponsiveReactGridLayout  = WidthProvider(Responsive);

class JViz extends Component {
    constructor(props) {
        super(props);

        this.state = {
            subscribers: [],
            widgets: [],
            rosGraph: [],
            autoExpand: true
        }

        this.addWidget = this.addWidget.bind(this)
        this.createWidget = this.createWidget.bind(this)
        this.removeWidget = this.removeWidget.bind(this)
        this.setNodeActive = this.setNodeActive.bind(this)

        RosGraph.getRosGraph(props.ros)
        .then(result => this.setState({
          rosGraph: result,
        }))
    }

    setNodeActive(node, oldNode) {
      if (node.fullname)
      {

        let newGraph = this.state.rosGraph.map((item) => {
          item.highlight = false
          if (this.state.autoExpand) item.toggled = false
          return item
        });

        if (node.in) {
          node.in.forEach((fullname) => {
            let index = _.findIndex(newGraph, {fullname: fullname});
            if (index !== -1) {
              newGraph[index].relation = "Input";
              if (this.state.autoExpand) newGraph[index].toggled = true;
            }
          })
        }

        if (node.out) {
          node.out.forEach((fullname) => {
            let index = _.findIndex(newGraph, {fullname: fullname});
            if (index !== -1) {
              newGraph[index].relation = "Output";
              if (this.state.autoExpand) newGraph[index].toggled = true;
            }
          })
        }
        // console.table(newGraph);

        this.setState({
          rosGraph: newGraph,
        })

        console.table(newGraph)

      }
    }

    addWidget(id, element, name) {
        console.log("Adding widget: ", id, element, name)

        // TODO: calculate layout
        const layout =
        {
            i: id,
            x: 4,
            y: Infinity,
            w: 2,
            h: 6
        }

        this.setState(prevState => ({
            widgets: [...prevState.widgets, {
              id: id,
              element: element,
              name: name,
              layout: layout}],
        }));
    }

    createWidget(widget) {
        return (
            <Widget key={widget.id} data-grid={widget.layout} name={widget.name || widget.id} onRequestClose={() => this.removeWidget(widget)}>
                {widget.element}
            </Widget>
        );
    }

    removeWidget(widget) {
        console.log("Removing", widget.id)

        const widgets = this.state.widgets.filter((item)=>{
            return item.id !== widget.id;
        });

        this.setState({
            widgets: widgets,
        })

    }


  render() {

    return (
      <div className="JViz">
        <div className="JViz-side">
            <NodeList ros={this.props.ros} addWidget={this.addWidget} hidden={false} rosGraph={this.state.rosGraph} setNodeActive={this.setNodeActive} />
            <TopicList ros={this.props.ros} addWidget={this.addWidget} hidden={false} rosGraph={this.state.rosGraph} setNodeActive={this.setNodeActive} />
        </div>

        <ResponsiveReactGridLayout
            className="JViz-main"
            breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
            cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
            rowHeight={30}
            draggableHandle=".HeaderName"
            onLayoutChange={(layout, layouts) => {
                this.setState({
                    layouts: layouts,
                })
            }}>
            {this.state.widgets.map(this.createWidget)}
        </ResponsiveReactGridLayout>

      </div>
    );
  }
}

JViz.propTypes = {
  ros: PropTypes.instanceOf(ROSLIB.Ros).isRequired,
}

export default JViz;
