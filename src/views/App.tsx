import * as React from 'react';
import { Route, Switch } from 'react-router';
import CreateGraphPage from './page/CreateGraphPage';
import IndexPage from './page/IndexPage';

class App extends React.Component {
  public render() {
    return (
      <div>
        <Switch>
          <Route exact={true} path="/" component={IndexPage}/>
          <Route path="/create" component={CreateGraphPage}/>
        </Switch>
      </div>
    );
  }
}

export default App;
