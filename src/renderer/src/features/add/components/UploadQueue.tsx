import { useState, useEffect } from 'react';
import { ImageBatch, UploadResponse } from '../types';
import { workerBuilder } from '../workers/workerBuilder';
import { UploadQueueProgress } from './UploadQueueProgress';
import SimpleBar from 'simplebar-react';
import { API_URL } from '@renderer/config';
import { getAxiosAuthHeader } from '@renderer/libs/axios';

const uploadWorker = workerBuilder();

interface BatchUploadProgress {
  uploaded: Set<string>;
  total: number;
  collectionName: string;
}

export const UploadQueue = ({
  queue,
  popQueue,
}: {
  queue: ImageBatch[];
  popQueue: () => ImageBatch | undefined;
}) => {
  const [progress, setProgress] = useState<Record<string, BatchUploadProgress>>({});

  const uploadBatch = () => {
    if (queue.length == 0) {
      console.log('NOTHING TO UPLOAD');
      return;
    }
    const batch = popQueue();
    console.log(batch);
    if (batch === undefined) {
      console.log('NO BATCH');
      return;
    }
    uploadWorker.postMessage([API_URL, batch, getAxiosAuthHeader()]);
    setProgress((prev) => {
      return {
        ...prev,
        [batch.id]: {
          collectionName: batch.collectionName,
          uploaded: new Set<string>(),
          newImageIds: new Set<string>(),
          total: batch.images.length,
        },
      };
    });
    uploadWorker.onmessage = (e) => {
      const res: UploadResponse = e.data;
      if (res.success) {
        setProgress((prev) => {
          if (!prev[res.batchId]) {
            return prev;
          }

          prev[res.batchId].uploaded.add(res.queuedImageId);

          if (prev[res.batchId].uploaded.size == prev[res.batchId].total) {
            console.log('BATCH UPLOADED', prev[res.batchId]);
            delete prev[res.batchId];
          }
          return { ...prev };
        });
      }
    };
  };

  useEffect(() => {
    uploadBatch();
  }, [queue.length]);

  const renderUploadProgress = () => {
    return (
      <>
        {Object.keys(progress).map((id) => {
          return (
            <UploadQueueProgress key={id} {...progress[id]} uploaded={progress[id].uploaded.size} />
          );
        })}
      </>
    );
  };
  if (!progress || Object.keys(progress).length == 0) {
    return <></>;
  }

  return (
    <div className="flex flex-col p-2 gap-[1px]">
      <div className="text-xs font-black text-neutral-400">Uploads</div>
      <SimpleBar className="h-full max-h-40">
        <div className="flex flex-col gap-1">{renderUploadProgress()}</div>
      </SimpleBar>
    </div>
  );
};
