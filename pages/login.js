import Router from 'next/router'
import { Button, Container } from 'semantic-ui-react'

import CustomHead from '../components/CustomHead'

export default (props) => {
  return (
    <div>
      <CustomHead />
      <Container text>
        <h1>Sign in</h1>
        <Button
          primary
          onClick={() => { window.location = '/auth/google/' }}
          icon='google'
          content='Sign in with Google'
        />
      </Container>
    </div>
  );
}
