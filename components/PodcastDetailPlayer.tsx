'use client';
import { IUser } from '@/lib/models/User';
import { PodcastDetailPlayerProps } from '@/types';
import React, { useState } from 'react';
import LoaderSpinner from './LoaderSpinner';
import Image from 'next/image';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAudio } from '@/providers/AudioProvider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { deletePodcast } from '@/lib/actions/podcast.actions';

const PodcastDetailPlayer = ({
  podcast,
  isOwner,
}: PodcastDetailPlayerProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { setAudio } = useAudio();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const author = podcast.userId as IUser;

  if (!podcast?.imageUrl || !author?.picture) return <LoaderSpinner />;

  const handlePlay = () => {
    setAudio({
      title: podcast.title,
      audioUrl: podcast.audioUrl,
      imageUrl: podcast.imageUrl,
      authorClerkId: podcast.authorClerkId,
      podcastId: podcast._id?.toString(),
      author: author.name,
    });
  };
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deletePodcast(podcast._id?.toString(), '/');
      toast({
        title: 'Podcast deleted',
      });
      router.push('/');
    } catch (error) {
      console.error('Error deleting podcast', error);
      toast({
        title: 'Error deleting podcast',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <div className="mt-6 flex w-full justify-between max-md:justify-center">
      <div className="flex flex-col gap-8 max-md:items-center md:flex-row">
        <Image
          src={podcast.imageUrl}
          width={250}
          height={250}
          alt="Podcast image"
          className="aspect-square rounded-lg"
        />
        <div className="flex w-full flex-col gap-5 max-md:items-center md:gap-9">
          <article className="flex flex-col gap-2 max-md:items-center">
            <h1 className="text-32 font-extrabold tracking-[-0.32px] text-white-1">
              {podcast.title}
            </h1>
            <figure
              className="flex cursor-pointer items-center gap-2"
              onClick={() => {
                router.push(`/profile/${podcast.authorClerkId}`);
              }}
            >
              <Image
                src={author.picture as string}
                width={30}
                height={30}
                alt="Caster icon"
                className="size-[30px] rounded-full object-cover"
              />
              <h2 className="text-16 font-normal text-white-3">
                {author.name}
              </h2>
            </figure>
          </article>

          <Button
            onClick={handlePlay}
            className="text-16 w-full max-w-[250px] bg-orange-1 font-extrabold text-white-1"
          >
            <Image
              src="/icons/Play.svg"
              width={20}
              height={20}
              alt="random play"
            />{' '}
            &nbsp; Play podcast
          </Button>
        </div>
      </div>
      {isOwner && (
        <div className="relative mt-2">
          <Image
            src="/icons/three-dots.svg"
            width={26}
            height={30}
            alt="Three dots icon"
            className="cursor-pointer"
            onClick={() => setIsOpen((prev) => !prev)}
          />
          {isOpen && (
            <div className="absolute -left-32 -top-2 z-10">
              <AlertDialog>
                <AlertDialogTrigger className="flex w-32 cursor-pointer justify-center gap-2 rounded-md bg-black-6 py-1.5 hover:bg-black-2">
                  <Image
                    src="/icons/delete.svg"
                    width={16}
                    height={16}
                    alt="Delete icon"
                  />
                  <h2 className="text-16 font-normal text-white-1">Delete</h2>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-white-1/5 bg-black-2">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white-1">
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-white-1/70">
                      This action cannot be undone. This will permanently delete
                      your Podcast from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      disabled={isDeleting}
                      onClick={handleDelete}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PodcastDetailPlayer;
