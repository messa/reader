import { MuiThemeProvider } from 'material-ui/styles';
import Button from 'material-ui/Button';

import CustomHead from '../components/CustomHead';

const IndexPage = (props) => {
  return (
    <MuiThemeProvider>

      <div>
        <CustomHead />
        <div className="container">

          <div className="homepageBox">
            <div className="row">
              <div className="offset-md-1 col-md-6">
                <h1 className="siteTitle">Reader</h1>
              </div>
            </div>
            <div className="row">
              <div className="offset-md-1 col-md-5">

                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>

              </div>

              <div className="offset-md-1 col-md-4">

                <p>
                  <span className="buttonWrapper">
                    <Button raised color="primary" href="/login/via-facebook">Sign in with Facebook</Button>
                  </span>
                </p>

              </div>

            </div>
          </div>

        </div>

      </div>
    </MuiThemeProvider>
  );
}

export default IndexPage;
