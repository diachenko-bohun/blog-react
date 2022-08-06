import React, { FC, useEffect, useState } from 'react';
import { Comment, CommentBody, Tweet } from '../typings';
import TimeAgo from 'react-timeago';
import {
	ChatAlt2Icon,
	HeartIcon,
	SwitchHorizontalIcon,
	UploadIcon,
} from '@heroicons/react/outline';
import { fetchComments } from '../utils/fetchComments';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

interface ITweet {
	tweet: Tweet;
}

const Tweet: FC<ITweet> = ({ tweet }) => {
	const { data: session } = useSession();

	const [commentBoxVisible, setCommentBoxVisible] = useState<boolean>(false);
	const [comments, setComments] = useState<Comment[]>([]);
	const [input, setInput] = useState<string>('');

	const refreshComments = async () => {
		const comments: Comment[] = await fetchComments(tweet._id);
		setComments(comments);
	};

	useEffect(() => {
		refreshComments();
	}, []);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const commentToast = toast.loading('Posting Comment...');

		// Comment logic
		const comment: CommentBody = {
			comment: input,
			tweetId: tweet._id,
			username: session?.user?.name || 'Unknown User',
			profileImg: session?.user?.image || 'https://links.papareact.com/gll',
		};

		const result = await fetch(`/api/addComment`, {
			body: JSON.stringify(comment),
			method: 'POST',
		});

		console.log('WOOHOO we made it', result);
		toast.success('Comment Posted!', {
			id: commentToast,
		});

		setInput('');
		setCommentBoxVisible(false);
		refreshComments();
	};

	return (
		<div className='flex flex-col space-x-3 border-y border-gray-100 p-5'>
			<div className='flex space-x-3'>
				<img
					className='h-10 w-10 rounded-full object-cover'
					src={tweet?.profileImg}
					alt='Profile img'
				/>
				<div>
					<div className='flex items-center space-x-1'>
						<p className='mr-1 font-bold'>{tweet?.username}</p>
						<p className='hidden text-sm text-gray-500 sm:inline'>
							@{tweet?.username.replace(/\s+/g, '').toLowerCase()} .
						</p>
						<TimeAgo
							className='text-sm text-gray-500'
							date={tweet?._createdAt}
						/>
					</div>
					<p className='pt-1'>{tweet?.text}</p>
					{tweet?.image && (
						<img
							className='m-5 ml-0 mb-1 max-h-60 rounded-lg object-cover shadow-sm'
							src={tweet.image}
							alt='image'
						/>
					)}
				</div>
			</div>
			<div className='mt-5 flex justify-between'>
				<div
					onClick={e => session && setCommentBoxVisible(!commentBoxVisible)}
					className='flex cursor-pointer items-center space-x-3 text-gray-400'
				>
					<ChatAlt2Icon className='transition-all duration-500 hover:scale-125 ease-out h-5 w-5' />
					<p>{comments.length}</p>
				</div>
				<div className='flex cursor-pointer items-center space-x-3 text-gray-400'>
					<SwitchHorizontalIcon className='transition-all duration-500 hover:scale-125 ease-out h-5 w-5' />
				</div>
				<div className='flex cursor-pointer items-center space-x-3 text-gray-400'>
					<HeartIcon className='transition-all duration-500 hover:scale-125 ease-out h-5 w-5' />
				</div>
				<div className='flex cursor-pointer items-center space-x-3 text-gray-400'>
					<UploadIcon className='transition-all duration-500 hover:scale-125 ease-out h-5 w-5' />
				</div>
			</div>
			{commentBoxVisible && (
				<form className='mt-3 flex space-x-3' onSubmit={handleSubmit}>
					<input
						value={input}
						onChange={e => setInput(e.target.value)}
						className='flex-1 rounded-lg bg-gray-100 p-2 outline-none'
						type='text'
						placeholder='Write a comment...'
					/>
					<button
						disabled={!input}
						className='text-twitter disabled:text-gray-200'
						type='submit'
					>
						Post
					</button>
				</form>
			)}

			{comments?.length > 0 && (
				<div className='my-2 mt-5 max-h-44 space-y-5 overflow-y-scroll border-t border-gray-100 p-5 pb-0'>
					{comments.map((comment, i) => (
						<div key={comment._id} className='flex relative'>
							{!(comments?.length === i + 1) && (
								<hr className='absolute left-3.5 top-8 h-8 border-x border-twitter/30' />
							)}

							<img
								className='mt-2 mr-2 h-7 w-7 object-cover rounded-full'
								src={comment.profileImg}
								alt=''
							/>
							<div>
								<div className='flex items-center space-x-1'>
									<p className='mr-1 font-bold'>{comment.username}</p>
									<p className='hidden text-sm text-gray-500 lg:inline'>
										@{comment.username.replace(/\s+/g, '').toLowerCase()} .
									</p>
									<TimeAgo
										className='text-sm text-gray-500'
										date={comment._createdAt}
									/>
								</div>
								<p>{comment.comment}</p>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Tweet;
