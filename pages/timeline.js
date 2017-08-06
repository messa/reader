import Router from 'next/router'
import { Button, Container } from 'semantic-ui-react'

import CustomHead from '../components/CustomHead'

export default (props) => {
  return (
    <div>
      <CustomHead />
      <Container text>
        <h1>Timeline</h1>
      </Container>
    </div>
  );
}
