'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from 'lucide-react';
import { Input } from './ui/input';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { GenerateThumbnailProps } from '@/types';

const GeneratePodcastThumbnail = ({ setImage }: GenerateThumbnailProps) => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsImageLoading(true);
    setPreviewUrl(null);

    try {
      const files = e.target.files;
      if (!files || files.length === 0) {
        throw new Error('No file selected');
      }

      const file = files[0];

      // Validate file type
      const validTypes = [
        'image/svg+xml',
        'image/png',
        'image/jpeg',
        'image/gif',
      ];
      if (!validTypes.includes(file.type)) {
        throw new Error(
          'Invalid file type. Please upload SVG, PNG, JPG, or GIF.'
        );
      }

      // Validate file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size too large. Max 5MB allowed.');
      }

      setImage(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      toast({
        title: 'Success!',
        description: 'Image selected successfully',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Upload Failed',
        description:
          error instanceof Error ? error.message : 'Failed to select image',
        variant: 'destructive',
      });
      // Clear the input on error
      if (imageRef.current) {
        imageRef.current.value = '';
      }
    } finally {
      setIsImageLoading(false);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="space-y-4">
      <div
        className="image_div flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors hover:border-orange-500"
        onClick={() => imageRef?.current?.click()}
      >
        <Input
          type="file"
          className="hidden"
          ref={imageRef}
          onChange={uploadImage}
          accept="image/svg+xml, image/png, image/jpeg, image/gif"
        />
        {!isImageLoading ? (
          <Image
            src="/icons/upload-image.svg"
            width={40}
            height={40}
            alt="upload"
          />
        ) : (
          <div className="text-16 flex-center font-medium text-white-1">
            Processing
            <Loader size={20} className="ml-2 animate-spin" />
          </div>
        )}
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-12 font-bold text-orange-1">Click to upload</h2>
          <p className="text-12 font-normal text-gray-1">
            SVG, PNG, JPG, or GIF (max. 5MB)
          </p>
        </div>
      </div>

      {previewUrl && (
        <div className="flex-center w-full">
          <Image
            src={previewUrl}
            width={200}
            height={200}
            className="mt-5 rounded-lg"
            alt="thumbnail preview"
            onLoadingComplete={() => {
              // Revoke the data uri to avoid memory leaks
              if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default GeneratePodcastThumbnail;
