import { Component } from 'react'
import Router from 'next/router'
import { Button, Container } from 'semantic-ui-react'

import CustomHead from '../components/CustomHead'

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      accounts: null,
    };
  }

  componentDidMount() {
    console.info('in cdm');
    this.loadUserData();
  }

  async loadUserData() {
    const res = await fetch('/api/user', {  credentials: "same-origin" })
    const data = await res.json();
    if (res.status != 200) {
      if (data.error == "user_not_authenticated") {
        window.location = '/login';
      } else {
        this.setState({ timelineDataError: data.error });
      }
    } else {
      console.info("user data:", data);
      this.setState({
        user: data.user,
        accounts: data.accounts,
      });
    }
  }

  render() {
    const { accounts } = this.state;
    return (
      <div>
        <CustomHead />
        <Container text>
          <h1>Connected accounts</h1>

          <pre>{JSON.stringify(accounts, null, 2)}</pre>

          <Button
            onClick={() => { window.location = '/auth/connect-twitter' }}
            onClick={() => { Router.push('/connected-accounts') }}
            icon='twitter'
            content='Add Twitter account'
          />

        </Container>
      </div>
    );
  }
}
