import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components'
import { ServerStyleSheets } from '@material-ui/styles';
import lightTheme from 'styles/lightTheme';

class MyDocument extends Document {
  static async getInitialProps (ctx) {
    const styledComponentsSheet = new ServerStyleSheet()
    const materialSheets = new ServerStyleSheets()
    const originalRenderPage = ctx.renderPage;

    try {
        ctx.renderPage = () => originalRenderPage({
            enhanceApp: App => props => styledComponentsSheet.collectStyles(materialSheets.collect(<App {...props} />))
          })
        const initialProps = await Document.getInitialProps(ctx)
        return {
          ...initialProps,
          lang: ctx.query.lng,
          styles: (
            <React.Fragment>
              {initialProps.styles}
              {materialSheets.getStyleElement()}
              {styledComponentsSheet.getStyleElement()}
            </React.Fragment>
          )
        }
      } finally {
        styledComponentsSheet.seal()
      }
  }

  render() {
    return (
      <Html lang={this.props.lang} dir='ltr'>
        <Head>
          <meta charSet='utf-8' />
          {/* PWA primary color */}
          <meta
            name='theme-color'
            content={lightTheme.palette.primary.main}
          />
          <meta http-equiv='X-UA-Compatible' content='IE=edge' />
          <meta name='viewport' content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no' />
          <meta name='description' content='Description' />
          <meta name='keywords' content='Keywords' />
          <link rel="apple-touch-icon" sizes="57x57" href="/images/icons/apple-icon-57x57.png" />
          <link rel="apple-touch-icon" sizes="60x60" href="/images/icons/apple-icon-60x60.png" />
          <link rel="apple-touch-icon" sizes="72x72" href="/images/icons/apple-icon-72x72.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="/images/icons/apple-icon-76x76.png" />
          <link rel="apple-touch-icon" sizes="114x114" href="/images/icons/apple-icon-114x114.png" />
          <link rel="apple-touch-icon" sizes="120x120" href="/images/icons/apple-icon-120x120.png" />
          <link rel="apple-touch-icon" sizes="144x144" href="/images/icons/apple-icon-144x144.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/images/icons/apple-icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/images/icons/apple-icon-180x180.png" />
          <link rel="icon" type="image/png" sizes="192x192"  href="/images/icons/android-icon-192x192.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/images/icons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/images/icons/favicon-96x96.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/images/icons/favicon-16x16.png" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="msapplication-TileColor" content="#2e7031" />
          <meta name="msapplication-TileImage" content="/images/icons/ms-icon-144x144.png" />
          <meta name="theme-color" content="#43a047" />
          <link
            rel='stylesheet'
            href="https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap"
          />
          <script src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JAVASCRIPT_KEY}&autoload=false&libraries=services`}></script>
        </Head>
        <body>
          <style global jsx>{`
            html,
            body,
            body > div:first-child,
            div#__next,
            div#__next > div {
              minHeight: 100%;
            }
          `}</style>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;