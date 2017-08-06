import { Component } from 'react'
import Router from 'next/router'
import { Button, Container, Message } from 'semantic-ui-react'
import fetch from 'isomorphic-fetch'

import CustomHead from '../components/CustomHead'

const renderError = (error, title) => {
  if (!error) {
    return null;
  }
  return (
    <Message error>
      <Message.Header>{title}</Message.Header>
      <p><code>{error}</code></p>
    </Message>
  );
}

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      timelineDataError: null,
      accounts: null,
    };
  }

  componentDidMount() {
    console.info('in cdm');
    this.loadTimelineData();
  }

  async loadTimelineData() {
    console.info("in loadTimelineData");
    const res = await fetch('/api/timeline-data', {  credentials: "same-origin" })
    const data = await res.json();
    if (res.status != 200) {
      if (data.error == "user_not_authenticated") {
        window.location = '/login';
      } else {
        this.setState({ timelineDataError: data.error });
      }
    } else {
      console.info("data:", data);
      this.setState({
        user: data.user,
        accounts: data.accounts,
      });
    }
  }

  render() {
    const { timelineDataError, accounts } = this.state;
    const noAccountsMsg = (accounts === null || accounts.length > 0)
      ? null : (<p>You have no accounts configured.</p>);
    return (
      <div>
        <CustomHead />
        <Container text>
          <h1>Timeline</h1>
          {renderError(timelineDataError, "Failed to retrieve timeline data")}
          {noAccountsMsg}

          <Button
            primary
            onClick={() => { Router.push('/connected-accounts') }}
            icon='configure'
            content='Configure accounts'
          />

        </Container>
      </div>
    );
  }

}
