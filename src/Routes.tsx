/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import routes from '../constants/routes.json';
import NavBar from './NavBar';
import Home from './components/Home';
import SubComponent from './components/sub-component';
import SubComponent2 from './components/sub-component2';

interface State {
  open: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {};

class Routes extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

		this.handleToggle = this.handleToggle.bind(this) as ((
			open: boolean,
		) => boolean);
		this.state = {
			open: false,
		};

  }

	/** If drawer is open, close it. If closed, open it. */
	public handleToggle(open = !this.state.open): boolean {
		this.setState({
			open,
		});
		return open;
	}

  render() {
    return (
      <Router basename='/app'>
      <NavBar show={this.state.open} drawToggleClickHandler={this.handleToggle}
      />
        <Switch>
          <Route exact path={routes.HOME} component={Home} />
          <Route path={routes.sub} render={ () => <SubComponent/> } />
          <Route path={routes.sub2} render={ () => <SubComponent2/> } />
        </Switch>
      </Router>
    );
  };
};

export default Routes;
