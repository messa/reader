import Head from 'next/head'

export default (props) => {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <title>Reader</title>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossOrigin="anonymous"/>
      <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css?family=Racing+Sans+One:400" rel="stylesheet" />
      <style>{`

        body {
          font-family: Roboto, sans-serif;
          font-size: 14px;
        }

        .siteTitle {
          font-family: 'Racing Sans One';
          font-size: 24px;
          font-weight: 400;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .homepageBox {
          margin: 3rem 0;
        }

        .homepageBox .siteTitle {
          color: #036;
          font-size: 68px;
          margin-bottom: 2rem;
        }

        .buttonWrapper a:hover {
          color: #eee;
        }

      `}</style>
    </Head>
  );
}
