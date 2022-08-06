import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Feed from '../components/Feed';
import Sidebar from '../components/Sidebar';
import Widgets from '../components/Widgets';
import { Tweet } from '../typings';
import { fetchTweets } from '../utils/fetchTweets';
import { Toaster } from 'react-hot-toast';

interface Props {
	tweets: Tweet[];
}

const Home: NextPage<Props> = ({ tweets }) => {
	return (
		<div className='lg:max-w-6xl mx-auto max-h-screen overflow-hidden'>
			<Head>
				<title>Twitter 2.0</title>
			</Head>
			<Toaster />

			<main className='grid grid-cols-9'>
				<Sidebar />
				<Feed tweets={tweets} />
				<Widgets />
			</main>
		</div>
	);
};

export default Home;

export const getServerSideProps: GetServerSideProps = async context => {
	const tweets = await fetchTweets();
	return {
		props: { tweets },
	};
};
