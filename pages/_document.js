import Document, { Html, Head, Main, NextScript } from "next/document";
import { getSessionFromServer, getUserScript } from "../lib/auth";

class MyDocument extends Document {
	static async getInitialProps (ctx) {
		const user = getSessionFromServer(ctx.req);
		const initialProps = await Document.getInitialProps(ctx);
		console.log("_document, getinitialProps==user", user);
		return { ...user, ...initialProps };
	}

	render () {
		const { user = {} } = this.props;
		console.log("_document, render", user.username || user.name);

		return (
			<Html>
				<Head />
				<body>
					<Main />
					<script dangerouslySetInnerHTML={{ __html: getUserScript(user) }} />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
