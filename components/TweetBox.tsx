import React, {
	useRef,
	useState,
	MouseEvent,
	Dispatch,
	SetStateAction,
	FC,
} from 'react';
import {
	CalendarIcon,
	EmojiHappyIcon,
	LocationMarkerIcon,
	PhotographIcon,
	SearchCircleIcon,
} from '@heroicons/react/outline';
import { Tweet, TweetBody } from '../typings';
import { useSession } from 'next-auth/react';
import { fetchTweets } from '../utils/fetchTweets';
import toast from 'react-hot-toast';

interface ITweetBox {
	setTweets: Dispatch<SetStateAction<Tweet[]>>;
}

const TweetBox: FC<ITweetBox> = ({ setTweets }) => {
	const { data: session } = useSession();

	const [input, setInput] = useState<string>('');
	const [image, setImage] = useState<string>('');
	const [imageUrlBoxIsOpen, setImageUrlBoxIsOpen] = useState<boolean>(false);

	const imageInputRef = useRef<HTMLInputElement>(null);

	const addImageToTweet = (
		e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
	) => {
		e.preventDefault();
		if (!imageInputRef.current?.value) return;
		setImage(imageInputRef.current.value);
		imageInputRef.current.value = '';
		setImageUrlBoxIsOpen(false);
	};

	const postTweet = async () => {
		const refreshToast = toast.loading('Loading...');
		const tweetBody: TweetBody = {
			text: input,
			username: session?.user?.name || 'Unknown User',
			profileImg: session?.user?.image || 'https://links.papareact.com/gll',
			image: image,
		};

		const result = await fetch(`/api/addTweet`, {
			body: JSON.stringify(tweetBody),
			method: 'POST',
		});

		const json = await result.json();

		const newTweets = await fetchTweets();
		setTweets(newTweets);
		toast('Tweet Posted', {
			icon: '🚀',
			id: refreshToast,
		});
		return json;
	};

	const handleSubmit = (
		e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
	) => {
		e.preventDefault();
		postTweet();
		setImage('');
		setInput('');
		setImageUrlBoxIsOpen(false);
	};

	return (
		<div className='p-5'>
			<div className='flex space-x-2'>
				<img
					className='h-14 w-14 object-cover rounded-full mt-4'
					src={session?.user?.image || 'https://links.papareact.com/gll'}
					alt=''
				/>
				<div className='flex flex-1 items-center pl-2'>
					<form className='flex flex-1 flex-col'>
						<input
							value={input}
							onChange={e => setInput(e.target.value)}
							type='text'
							placeholder="What's Happening?"
							className='h-24 w-full text-xl outline-none placeholder:text-xl'
						/>
						<div className='flex items-center'>
							<div className='flex space-x-2 flex-1 text-twitter'>
								<PhotographIcon
									onClick={() => setImageUrlBoxIsOpen(!imageUrlBoxIsOpen)}
									className='w-5 h-5 cursor-pointer transition-transform duration-150 easy-out hover:scale-150'
								/>
								<SearchCircleIcon className='w-5 h-5  opacity-40' />
								<EmojiHappyIcon className='w-5 h-5  opacity-40' />
								<CalendarIcon className='w-5 h-5 opacity-40' />
								<LocationMarkerIcon className='w-5 h-5 opacity-40' />
							</div>
							<button
								onClick={handleSubmit}
								disabled={!input}
								className='bg-twitter px-5 py-2 font-bold text-white rounded-full disabled:opacity-40 hover:opacity-70 transition-all duration-200'
							>
								Tweet
							</button>
						</div>
					</form>
				</div>
			</div>
			{imageUrlBoxIsOpen && (
				<form className='rounded-lg mt-5 flex bg-twitter/80 py-2 px-4'>
					<input
						ref={imageInputRef}
						className='flex-1 bg-transparent p-2 text-white outline-none placeholder:text-white'
						type='text'
						placeholder='Enter Image URL...'
					/>
					<button
						onClick={e => addImageToTweet(e)}
						type='submit'
						className='font-bold text-white'
					>
						Add Image
					</button>
				</form>
			)}
			{image && (
				<img
					className='mt-10 h-40 w-full rounded-xl object-contain shadow-lg'
					src={image}
					alt=''
				/>
			)}
		</div>
	);
};

export default TweetBox;
