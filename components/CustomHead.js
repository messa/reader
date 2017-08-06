import Head from 'next/head'

const globalCSS = `
  h1 {
    margin-top: 3rem !important;
    margin-bottom: 2rem;
  }
`;

export default (props) => {
  return (
    <Head>
      <title>Reader</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.11/semantic.min.css" />
      <style>{globalCSS}</style>
    </Head>
  );
}
