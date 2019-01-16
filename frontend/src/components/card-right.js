import React, {Component} from 'react';
import Title from './title';

class CardRight extends Component {

  render() {
    return (
      <div className="col-right">
        <div className="app-meta">
           <Title name={this.props.name} publisher={this.props.app.actor}/>
           <span className="app-lic">{this.props.app.type}</span>
        </div>
        <div className="app-intro" dangerouslySetInnerHTML={{__html: this.props.app.intro}} />
        <hr/>
      </div>
    );
  }

}


export default CardRight;
