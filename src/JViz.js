import React, { Component } from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';

import NodeList from './NodeList';
import TopicList from './TopicList';
import Widget from './Widget';
import "../node_modules/react-grid-layout/css/styles.css"
import "../node_modules/react-resizable/css/styles.css"
import './App.css';

const ResponsiveReactGridLayout  = WidthProvider(Responsive);

class JViz extends Component {
    constructor(props) {
        super();

        this.state = {
            subscribers: [],
            widgets: [],
        }

        this.addWidget = this.addWidget.bind(this)
        this.createWidget = this.createWidget.bind(this)
        this.removeWidget = this.removeWidget.bind(this)
    }

    addWidget(id, element) {
        console.log("Adding widget: ", id, element)

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
              layout: layout}],
        }));
    }

    createWidget(widget) {
        return (
            <Widget key={widget.id} data-grid={widget.layout} name={widget.id} onRequestClose={() => this.removeWidget(widget)}>
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
            <NodeList ros={this.props.ros} addWidget={this.addWidget} hidden={false} />
            <TopicList ros={this.props.ros} addWidget={this.addWidget} hidden={false} />
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

export default JViz;